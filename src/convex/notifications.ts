import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get active notifications, ordered by creation date (newest first).
 */
export const getActiveNotifications = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_created")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(20);
  },
});

/**
 * Get a notification by ID.
 */
export const getNotification = query({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.notificationId);
  },
});

/**
 * Create a new notification (admin only).
 */
export const createNotification = mutation({
  args: {
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
    targetAll: v.optional(v.boolean()),
    targetLicenseIds: v.optional(v.array(v.id("licenses"))),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    return await ctx.db.insert("notifications", {
      title: args.title,
      message: args.message,
      link: args.link,
      type: args.type,
      isActive: true,
      targetAll: args.targetAll ?? true,
      targetLicenseIds: args.targetLicenseIds,
      createdAt: now,
      updatedAt: now,
    });
  },
});

/**
 * Deactivate a notification.
 */
export const deactivateNotification = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    await ctx.db.patch(args.notificationId, {
      isActive: false,
      updatedAt: now,
    });
    return { success: true };
  },
});

/**
 * Delete a notification.
 */
export const deleteNotification = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.notificationId);
    return { success: true };
  },
});
