import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to get all strokes for a board
export const list = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("strokes")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .order("asc")
      .collect();
  },
});

// Mutation to add a new stroke
export const add = mutation({
  args: {
    boardId: v.id("boards"),
    type: v.union(
      v.literal("path"),
      v.literal("rectangle"),
      v.literal("circle"),
      v.literal("line"),
      v.literal("text")
    ),
    points: v.optional(v.array(v.number())),
    x: v.number(),
    y: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    radius: v.optional(v.number()),
    text: v.optional(v.string()),
    strokeColor: v.string(),
    fillColor: v.optional(v.string()),
    strokeWidth: v.number(),
    opacity: v.number(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const strokeId = await ctx.db.insert("strokes", args);

    // Update board's lastModified
    await ctx.db.patch(args.boardId, {
      lastModified: Date.now(),
    });

    return strokeId;
  },
});

// Mutation to delete a stroke
export const remove = mutation({
  args: { strokeId: v.id("strokes") },
  handler: async (ctx, args) => {
    const stroke = await ctx.db.get(args.strokeId);
    if (stroke) {
      await ctx.db.delete(args.strokeId);
      // Update board's lastModified
      await ctx.db.patch(stroke.boardId, {
        lastModified: Date.now(),
      });
    }
  },
});

// Mutation to clear all strokes from a board
export const clear = mutation({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    const strokes = await ctx.db
      .query("strokes")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .collect();

    for (const stroke of strokes) {
      await ctx.db.delete(stroke._id);
    }

    // Update board's lastModified
    await ctx.db.patch(args.boardId, {
      lastModified: Date.now(),
    });
  },
});
