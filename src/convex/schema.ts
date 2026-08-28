import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // License keys and their validation state
  licenses: defineTable({
    key: v.string(),                    // The license key string
    userName: v.string(),               // Display name for this license
    status: v.union(
      v.literal("active"),
      v.literal("trial"),
      v.literal("expired"),
      v.literal("revoked"),
      v.literal("suspended")
    ),
    licenseType: v.union(
      v.literal("internal"),
      v.literal("standard"),
      v.literal("trial"),
      v.literal("team")
    ),
    sessionId: v.optional(v.string()),  // Current active session ID
    deviceId: v.optional(v.string()),   // Bound device fingerprint
    maxDevices: v.optional(v.number()), // Max allowed devices (default 2)
    activatedAt: v.optional(v.string()),// ISO timestamp
    expiresAt: v.optional(v.string()),  // ISO timestamp
    validityMinutes: v.optional(v.number()), // Trial validity in minutes
    createdAt: v.string(),              // ISO timestamp
    updatedAt: v.string(),              // ISO timestamp
  })
    .index("by_key", ["key"])
    .index("by_session", ["sessionId"]),

  // Device tracking for multi-device license enforcement
  devices: defineTable({
    licenseId: v.id("licenses"),
    deviceId: v.string(),               // Hardware fingerprint
    deviceName: v.optional(v.string()), // Optional device label
    lastSeenAt: v.string(),             // ISO timestamp
    createdAt: v.string(),              // ISO timestamp
    blocked: v.optional(v.boolean()),   // Admin-blocked device
  })
    .index("by_license", ["licenseId"])
    .index("by_device", ["deviceId"])
    .index("by_license_device", ["licenseId", "deviceId"]),

  // In-app notifications
  notifications: defineTable({
    title: v.string(),
    message: v.string(),
    link: v.optional(v.string()),
    type: v.union(
      v.literal("info"),
      v.literal("warning"),
      v.literal("success"),
      v.literal("error"),
      v.literal("update")
    ),
    isActive: v.boolean(),
    targetAll: v.optional(v.boolean()), // Send to all users
    targetLicenseIds: v.optional(v.array(v.id("licenses"))), // Target specific users
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_active", ["isActive"])
    .index("by_created", ["createdAt"]),

  // Lovable project metadata
  projects: defineTable({
    licenseId: v.id("licenses"),
    lovableProjectId: v.string(),       // Lovable's project UUID
    projectName: v.string(),
    cloudEnabled: v.optional(v.boolean()),
    published: v.optional(v.boolean()),
    publishedUrl: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_license", ["licenseId"])
    .index("by_lovable_id", ["lovableProjectId"]),

  // Audit log for important actions
  auditLog: defineTable({
    licenseId: v.optional(v.id("licenses")),
    action: v.string(),                 // e.g., "license_validated", "device_added"
    details: v.optional(v.string()),    // JSON string with extra info
    ipAddress: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_license", ["licenseId"])
    .index("by_action", ["action"])
    .index("by_created", ["createdAt"]),
});
