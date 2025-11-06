import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  boards: defineTable({
    title: v.string(),
    ownerId: v.optional(v.string()),
    isPublic: v.boolean(),
    backgroundColor: v.string(),
    thumbnail: v.optional(v.string()),
    lastModified: v.number(),
  }),

  strokes: defineTable({
    boardId: v.id("boards"),
    userId: v.optional(v.string()),
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
  }).index("by_board", ["boardId"]),

  presence: defineTable({
    boardId: v.id("boards"),
    userId: v.string(),
    userName: v.string(),
    userColor: v.string(),
    cursorX: v.number(),
    cursorY: v.number(),
    lastSeen: v.number(),
  })
    .index("by_board", ["boardId"])
    .index("by_user", ["userId"]),

  users: defineTable({
    name: v.string(),
    email: v.string(),
    avatar: v.optional(v.string()),
    color: v.string(),
  }),
});
