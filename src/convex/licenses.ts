import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Generate a simple device hash from fingerprint components
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

// Generate a session ID
function generateSessionId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Validate a license key and bind to a device.
 * Returns session data if valid, error if not.
 */
export const validateLicense = mutation({
  args: {
    licenseKey: v.string(),
    deviceId: v.string(),
    maxDevices: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const maxDevices = args.maxDevices || 2;

    // Look up the license by key
    const license = await ctx.db
      .query("licenses")
      .withIndex("by_key", (q) => q.eq("key", args.licenseKey))
      .unique();

    if (!license) {
      return {
        valid: false,
        message: "License key not found.",
        reason: "not_found",
      };
    }

    // Check license status
    if (license.status === "revoked") {
      return {
        valid: false,
        message: "This license has been revoked.",
        reason: "revoked",
      };
    }

    if (license.status === "suspended") {
      return {
        valid: false,
        message: "This license has been suspended. Contact support.",
        reason: "suspended",
      };
    }

    // Check expiry
    if (license.expiresAt) {
      const expiresMs = new Date(license.expiresAt).getTime();
      if (expiresMs < Date.now()) {
        // For internal licenses, auto-extend
        if (license.licenseType === "internal") {
          const newExpires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
          await ctx.db.patch(license._id, {
            expiresAt: newExpires,
            updatedAt: now,
          });
          license.expiresAt = newExpires;
        } else {
          await ctx.db.patch(license._id, {
            status: "expired",
            updatedAt: now,
          });
          return {
            valid: false,
            message: "License has expired.",
            reason: "expired",
          };
        }
      }
    }

    // Internal licenses: always valid, skip device check
    if (license.licenseType === "internal") {
      const sessionId = generateSessionId();
      await ctx.db.patch(license._id, {
        sessionId,
        deviceId: args.deviceId,
        updatedAt: now,
      });

      // Ensure device record exists
      const existingDevice = await ctx.db
        .query("devices")
        .withIndex("by_license_device", (q) =>
          q.eq("licenseId", license._id).eq("deviceId", args.deviceId)
        )
        .unique();

      if (!existingDevice) {
        await ctx.db.insert("devices", {
          licenseId: license._id,
          deviceId: args.deviceId,
          lastSeenAt: now,
          createdAt: now,
        });
      } else {
        await ctx.db.patch(existingDevice._id, { lastSeenAt: now });
      }

      // Audit log
      await ctx.db.insert("auditLog", {
        licenseId: license._id,
        action: "license_validated",
        details: JSON.stringify({ type: "internal", deviceId: args.deviceId }),
        createdAt: now,
      });

      return {
        valid: true,
        session_id: sessionId,
        user_name: license.userName,
        status: "active",
        message: "Activation successful!",
        activated_at: now,
        expires_at: license.expiresAt,
      };
    }

    // Standard/Team licenses: check device limit
    const devices = await ctx.db
      .query("devices")
      .withIndex("by_license", (q) => q.eq("licenseId", license._id))
      .collect();

    const activeDevices = devices.filter((d) => !d.blocked);

    // Check if this device is already registered
    const thisDevice = activeDevices.find((d) => d.deviceId === args.deviceId);

    if (!thisDevice && activeDevices.length >= maxDevices) {
      return {
        valid: false,
        message: `Device limit reached (${maxDevices}/${maxDevices}). Deactivate another device first.`,
        reason: "device_conflict",
        online_count: activeDevices.length,
      };
    }

    // Register or update device
    if (!thisDevice) {
      await ctx.db.insert("devices", {
        licenseId: license._id,
        deviceId: args.deviceId,
        lastSeenAt: now,
        createdAt: now,
      });
    } else {
      await ctx.db.patch(thisDevice._id, { lastSeenAt: now });
    }

    // Generate session
    const sessionId = generateSessionId();
    await ctx.db.patch(license._id, {
      sessionId,
      deviceId: args.deviceId,
      status: "active",
      updatedAt: now,
    });

    // Audit log
    await ctx.db.insert("auditLog", {
      licenseId: license._id,
      action: "license_validated",
      details: JSON.stringify({ type: license.licenseType, deviceId: args.deviceId }),
      createdAt: now,
    });

    return {
      valid: true,
      session_id: sessionId,
      user_name: license.userName,
      status: license.status,
      message: "Activation successful!",
      activated_at: license.activatedAt || now,
      expires_at: license.expiresAt,
      online_count: activeDevices.length + 1,
    };
  },
});

/**
 * Heartbeat: keeps the session alive and checks if license is still valid.
 */
export const heartbeat = mutation({
  args: {
    licenseKey: v.string(),
    sessionId: v.string(),
    deviceId: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    const license = await ctx.db
      .query("licenses")
      .withIndex("by_key", (q) => q.eq("key", args.licenseKey))
      .unique();

    if (!license) {
      return { valid: false, message: "License not found." };
    }

    if (license.sessionId !== args.sessionId) {
      return { valid: false, message: "Session expired.", reason: "session_mismatch" };
    }

    if (license.status === "revoked" || license.status === "suspended") {
      return { valid: false, message: `License ${license.status}.` };
    }

    // Check expiry for non-internal licenses
    if (license.licenseType !== "internal" && license.expiresAt) {
      const expiresMs = new Date(license.expiresAt).getTime();
      if (expiresMs < Date.now()) {
        return {
          valid: false,
          message: "License expired.",
          reason: "expired",
          expires_at: license.expiresAt,
        };
      }
    }

    // Update last seen
    const device = await ctx.db
      .query("devices")
      .withIndex("by_license_device", (q) =>
        q.eq("licenseId", license._id).eq("deviceId", args.deviceId)
      )
      .unique();

    if (device) {
      await ctx.db.patch(device._id, { lastSeenAt: now });
    }

    // Update license updatedAt
    await ctx.db.patch(license._id, { updatedAt: now });

    return {
      valid: true,
      user_name: license.userName,
      status: license.status,
      expires_at: license.expiresAt,
    };
  },
});

/**
 * Deactivate a device (user-initiated).
 */
export const deactivateDevice = mutation({
  args: {
    licenseKey: v.string(),
    deviceId: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    const license = await ctx.db
      .query("licenses")
      .withIndex("by_key", (q) => q.eq("key", args.licenseKey))
      .unique();

    if (!license) {
      return { success: false, message: "License not found." };
    }

    const device = await ctx.db
      .query("devices")
      .withIndex("by_license_device", (q) =>
        q.eq("licenseId", license._id).eq("deviceId", args.deviceId)
      )
      .unique();

    if (device) {
      await ctx.db.patch(device._id, { blocked: true });
      await ctx.db.insert("auditLog", {
        licenseId: license._id,
        action: "device_deactivated",
        details: JSON.stringify({ deviceId: args.deviceId }),
        createdAt: now,
      });
    }

    return { success: true, message: "Device deactivated." };
  },
});

/**
 * Get license info by key (query).
 */
export const getLicense = query({
  args: { licenseKey: v.string() },
  handler: async (ctx, args) => {
    const license = await ctx.db
      .query("licenses")
      .withIndex("by_key", (q) => q.eq("key", args.licenseKey))
      .unique();

    if (!license) return null;

    return {
      id: license._id,
      key: license.key,
      userName: license.userName,
      status: license.status,
      licenseType: license.licenseType,
      activatedAt: license.activatedAt,
      expiresAt: license.expiresAt,
      createdAt: license.createdAt,
    };
  },
});

/**
 * Get all devices for a license.
 */
export const getDevices = query({
  args: { licenseId: v.id("licenses") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("devices")
      .withIndex("by_license", (q) => q.eq("licenseId", args.licenseId))
      .collect();
  },
});

/**
 * Update license expiry.
 */
export const extendExpiry = mutation({
  args: {
    licenseId: v.id("licenses"),
    expiresAt: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    await ctx.db.patch(args.licenseId, {
      expiresAt: args.expiresAt,
      status: "active",
      updatedAt: now,
    });
    return { success: true, expiresAt: args.expiresAt };
  },
});
