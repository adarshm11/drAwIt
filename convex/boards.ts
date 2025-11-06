import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Query to get all boards
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("boards").order("desc").collect();
  },
});

// Query to get a single board by ID
export const get = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.boardId);
  },
});

// Mutation to create a new board
export const create = mutation({
  args: {
    title: v.string(),
    backgroundColor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const boardId = await ctx.db.insert("boards", {
      title: args.title,
      isPublic: true,
      backgroundColor: args.backgroundColor || "#ffffff",
      lastModified: Date.now(),
    });
    return boardId;
  },
});

// Mutation to delete a board and all its strokes
export const remove = mutation({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    // Delete all strokes associated with the board
    const strokes = await ctx.db
      .query("strokes")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .collect();

    for (const stroke of strokes) {
      await ctx.db.delete(stroke._id);
    }

    // Delete the board
    await ctx.db.delete(args.boardId);
  },
});

// Mutation to update board metadata
export const update = mutation({
  args: {
    boardId: v.id("boards"),
    title: v.optional(v.string()),
    backgroundColor: v.optional(v.string()),
    thumbnail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { boardId, ...updates } = args;
    await ctx.db.patch(boardId, {
      ...updates,
      lastModified: Date.now(),
    });
  },
});
