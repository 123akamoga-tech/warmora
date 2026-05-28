import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

export const verifyAdmin = query({
  args: { username: v.string(), password: v.string() },
  returns: v.boolean(),
  handler: async (_ctx, args) => {
    return args.username === "admin" && args.password === "warmora-admin-2024";
  },
});

export const verifyCredentials = verifyAdmin;

export const listAll = query({
  args: {},
  returns: v.array(v.object({
    _id: v.union(v.id("applicants"), v.id("users")),
    _creationTime: v.number(),
    fullName: v.string(),
    email: v.string(),
    payoutMethod: v.string(),
    paymentStatus: v.string(),
    onboardingFeePaid: v.boolean(),
    isNewAuth: v.boolean(),
    phone: v.optional(v.union(v.string(), v.null())),
    transactionRef: v.optional(v.string()),
  })),
  handler: async (ctx) => {
    // Return both legacy applicants and new auth users
    const applicants = await ctx.db.query("applicants").order("desc").collect();
    const users = await ctx.db.query("users").order("desc").collect();
    
    // Map users to applicant-like structure for the admin UI
    const mappedUsers = users.filter(u => u.email).map(u => ({
      _id: u._id,
      _creationTime: u._creationTime,
      fullName: u.name || "Unknown",
      email: u.email!,
      payoutMethod: u.payoutMethod || "None",
      paymentStatus: u.paymentStatus || "pending",
      onboardingFeePaid: !!(u as any).onboardingFeePaid,
      isNewAuth: true,
      phone: u.phone || undefined,
      transactionRef: undefined
    }));

    return [...mappedUsers, ...applicants.map(a => ({ ...a, isNewAuth: false }))];
  },
});

export const togglePaid = mutation({
  args: { id: v.union(v.id("applicants"), v.id("users")) },
  returns: v.null(),
  handler: async (ctx, args) => {
    const isUser = (args.id as string).startsWith("users");
    
    if (isUser) {
      const user = await ctx.db.get(args.id as Id<"users">);
      if (!user) return null;
      const newPaidStatus = !(user as any).onboardingFeePaid;
      await ctx.db.patch(args.id as Id<"users">, {
        onboardingFeePaid: newPaidStatus,
        paymentStatus: newPaidStatus ? "completed" : "pending",
        status: newPaidStatus ? "active" : "pending_payment"
      } as any);
    } else {
      const applicant = await ctx.db.get(args.id as Id<"applicants">);
      if (!applicant) return null;
      const newPaidStatus = !applicant.onboardingFeePaid;
      await ctx.db.patch(args.id as Id<"applicants">, {
        onboardingFeePaid: newPaidStatus,
        paymentStatus: newPaidStatus ? "completed" : "pending",
        status: newPaidStatus ? "active" : "pending_payment"
      } as any);
    }
    return null;
  },
});

export const listWithdrawals = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id("withdrawals"),
    _creationTime: v.number(),
    userId: v.id("users"),
    amount: v.number(),
    status: v.string(),
    requestedAt: v.number(),
    method: v.string(),
    details: v.string(),
    userName: v.string(),
    userEmail: v.string(),
  })),
  handler: async (ctx) => {
    const withdrawals = await ctx.db.query("withdrawals").order("desc").collect();
    
    // Join with user names
    const withUsers = [];
    for (const w of withdrawals) {
      const user = await ctx.db.get(w.userId);
      withUsers.push({
        ...w,
        userName: user?.name || "Unknown User",
        userEmail: user?.email || "No Email",
      });
    }
    return withUsers;
  },
});

export const updateWithdrawalStatus = mutation({
  args: { 
    id: v.id("withdrawals"), 
    status: v.union(v.literal("completed"), v.literal("rejected")) 
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const withdrawal = await ctx.db.get(args.id);
    if (!withdrawal) throw new Error("Withdrawal not found");
    
    if (args.status === "rejected") {
      // Refund balance
      const user = await ctx.db.get(withdrawal.userId);
      if (user) {
        await ctx.db.patch(withdrawal.userId, {
          availableBalance: (user.availableBalance || 0) + withdrawal.amount,
        });
      }
    }
    
    await ctx.db.patch(args.id, { status: args.status });
    return null;
  },
});

export const assignDemoChat = mutation({
  args: { userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const names = ["Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona"];
    const name = names[Math.floor(Math.random() * names.length)];
    const earnings = parseFloat((Math.random() * 5 + 2).toFixed(2));
    
    await ctx.db.insert("assignedChats", {
      userId: args.userId,
      clientName: name,
      startTime: Date.now(),
      durationMinutes: Math.floor(Math.random() * 30 + 10),
      earnings,
    });
    
    // Update user stats
    const user = await ctx.db.get(args.userId);
    if (user) {
      await ctx.db.patch(args.userId, {
        assignedChatCount: (user.assignedChatCount || 0) + 1,
        totalEarnings: (user.totalEarnings || 0) + earnings,
        availableBalance: (user.availableBalance || 0) + earnings,
        status: "active",
      });
    }
    return null;
  },
});

export const seedUser = mutation({
  args: { email: v.string(), password: v.string(), name: v.string() },
  returns: v.id("users"),
  handler: async (ctx, args) => {
     const userId = await ctx.db.insert("users", {
       email: args.email,
       name: args.name,
       paymentStatus: "completed",
       onboardingFeePaid: true,
       status: "active",
       availableBalance: 100,
       totalEarnings: 100,
       assignedChatCount: 5
     });
     return userId;
  }
});
