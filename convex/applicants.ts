import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const verifyAdmin = query({
  args: { username: v.string(), password: v.string() },
  handler: async (_ctx, args) => {
    return args.username === "admin" && args.password === "warmora-admin-2024";
  },
});

export const listAll = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("applicants"),
    _creationTime: v.number(),
    fullName: v.string(),
    email: v.string(),
    whatsapp: v.optional(v.string()),
    phone: v.optional(v.string()),
    payoutMethod: v.string(),
    paymentStatus: v.string(),
    onboardingFeePaid: v.boolean(),
  })),
  handler: async (ctx) => {
    return await ctx.db.query("applicants").order("desc").collect();
  },
});

export const togglePaid = mutation({
  args: { id: v.id("applicants") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const app = await ctx.db.get(args.id);
    if (!app) return null;
    await ctx.db.patch(args.id, {
      onboardingFeePaid: !app.onboardingFeePaid,
      paymentStatus: !app.onboardingFeePaid ? "completed" : "pending",
    });
    return null;
  },
});

export const viewer = query({
  args: {},
  returns: v.union(v.null(), v.object({
    _id: v.id("users"),
    _creationTime: v.number(),
    name: v.optional(v.union(v.string(), v.null())),
    image: v.optional(v.union(v.string(), v.null())),
    email: v.optional(v.union(v.string(), v.null())),
    emailVerificationTime: v.optional(v.union(v.number(), v.null())),
    phone: v.optional(v.union(v.string(), v.null())),
    phoneVerificationTime: v.optional(v.union(v.number(), v.null())),
    isAnonymous: v.optional(v.union(v.boolean(), v.null())),
    payoutMethod: v.optional(v.union(v.string(), v.null())),
    paymentStatus: v.optional(v.union(v.string(), v.null())),
    onboardingFeePaid: v.optional(v.union(v.boolean(), v.null())),
    assignedChatCount: v.optional(v.union(v.number(), v.null())),
    totalEarnings: v.optional(v.union(v.number(), v.null())),
    availableBalance: v.optional(v.union(v.number(), v.null())),
    payoutDetails: v.optional(v.union(v.string(), v.null())),
    status: v.optional(v.union(v.string(), v.null())),
  })),
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const getAssignedChats = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("assignedChats"),
    _creationTime: v.number(),
    userId: v.id("users"),
    clientName: v.string(),
    startTime: v.number(),
    durationMinutes: v.number(),
    earnings: v.number(),
  })),
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      return [];
    }
    return await ctx.db
      .query("assignedChats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const markFeePaid = mutation({
  args: { 
    payoutMethod: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    await ctx.db.patch(userId, {
      onboardingFeePaid: true,
      paymentStatus: "completed",
      status: "pending_assignment",
      payoutMethod: args.payoutMethod,
    });
    return null;
  },
});

export const create = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    whatsapp: v.optional(v.string()),
    phone: v.optional(v.string()),
    payoutMethod: v.string(),
    transactionRef: v.optional(v.string()),
    paid: v.optional(v.boolean()),
  },
  returns: v.id("applicants"),
  handler: async (ctx, args) => {
    const { transactionRef, paid, ...data } = args;
    return await ctx.db.insert("applicants", {
      ...data,
      paymentStatus: paid ? "completed" : "pending",
      onboardingFeePaid: paid || false,
    });
  },
});

export const seedHomeData = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Log in first to seed data");

    const testChats = [
      { clientName: "Aditi Sharma", durationMinutes: 45, earnings: 11.25, startTime: Date.now() - 1000 * 60 * 60 },
      { clientName: "Marcus Thorne", durationMinutes: 20, earnings: 5.00, startTime: Date.now() - 1000 * 60 * 30 },
      { clientName: "Elena Rodriguez", durationMinutes: 12, earnings: 3.00, startTime: Date.now() - 1000 * 60 * 10 },
    ];

    for (const chat of testChats) {
      await ctx.db.insert("assignedChats", {
        userId,
        ...chat,
      });
    }

    await ctx.db.patch(userId, {
      assignedChatCount: 3,
      totalEarnings: 19.25,
      status: "active",
    });
  },
});
