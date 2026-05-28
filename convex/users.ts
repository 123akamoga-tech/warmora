import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    console.log("viewer query - userId:", userId);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const getAssignedChats = query({
  args: {},
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
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      throw new Error("Not authenticated");
    }
    await ctx.db.patch(userId, {
      onboardingFeePaid: false, // Stays false until admin approves
      paymentStatus: "pending_approval",
      status: "pending_assignment",
      payoutMethod: args.payoutMethod,
    });
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    payoutMethod: v.optional(v.string()),
    payoutDetails: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");
    
    await ctx.db.patch(userId, {
      ...(args.name && { name: args.name }),
      ...(args.phone && { phone: args.phone }),
      ...(args.payoutMethod && { payoutMethod: args.payoutMethod }),
      ...(args.payoutDetails && { payoutDetails: args.payoutDetails }),
    });
  },
});

export const requestWithdrawal = mutation({
  args: {
    amount: v.number(),
    method: v.string(),
    details: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const balance = user.availableBalance ?? 0;
    if (args.amount > balance) throw new Error("Insufficient balance");
    if (args.amount < 10) throw new Error("Minimum withdrawal is $10");

    // Deduct from balance
    await ctx.db.patch(userId, {
      availableBalance: balance - args.amount,
    });

    // Create withdrawal record
    await ctx.db.insert("withdrawals", {
      userId,
      amount: args.amount,
      status: "pending",
      requestedAt: Date.now(),
      method: args.method,
      details: args.details,
    });
  },
});

export const getWithdrawals = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) return [];

    return await ctx.db
      .query("withdrawals")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

