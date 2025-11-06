import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to get all active users on a board (excluding stale presence)
export const list = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000; // 5 minutes threshold

    const presenceRecords = await ctx.db
      .query("presence")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .filter((q) => q.gt(q.field("lastSeen"), fiveMinutesAgo))
      .collect();

    return presenceRecords;
  },
});

// Mutation to update or create presence for a user
export const update = mutation({
  args: {
    boardId: v.id("boards"),
    userId: v.string(),
    userName: v.string(),
    userColor: v.string(),
    cursorX: v.number(),
    cursorY: v.number(),
  },
  handler: async (ctx, args) => {
    const { boardId, userId, userName, userColor, cursorX, cursorY } = args;

    // Check if presence record already exists for this user on this board
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_board", (q) => q.eq("boardId", boardId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (existing) {
      // Update existing presence
      await ctx.db.patch(existing._id, {
        userName,
        userColor,
        cursorX,
        cursorY,
        lastSeen: Date.now(),
      });
      return existing._id;
    } else {
      // Create new presence record
      return await ctx.db.insert("presence", {
        boardId,
        userId,
        userName,
        userColor,
        cursorX,
        cursorY,
        lastSeen: Date.now(),
      });
    }
  },
});

// Mutation to remove presence when user leaves
export const remove = mutation({
  args: {
    boardId: v.id("boards"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { boardId, userId } = args;

    const existing = await ctx.db
      .query("presence")
      .withIndex("by_board", (q) => q.eq("boardId", boardId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

// Mutation to clean up stale presence records (can be called periodically)
export const cleanup = mutation({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

    const staleRecords = await ctx.db
      .query("presence")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .filter((q) => q.lt(q.field("lastSeen"), fiveMinutesAgo))
      .collect();

    for (const record of staleRecords) {
      await ctx.db.delete(record._id);
    }

    return staleRecords.length;
  },
});
