import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.union(v.string(), v.null())),
    image: v.optional(v.union(v.string(), v.null())),
    email: v.optional(v.union(v.string(), v.null())),
    emailVerificationTime: v.optional(v.union(v.number(), v.null())),
    phone: v.optional(v.union(v.string(), v.null())),
    phoneVerificationTime: v.optional(v.union(v.number(), v.null())),
    isAnonymous: v.optional(v.union(v.boolean(), v.null())),

    // Warmora specific user fields
    payoutMethod: v.optional(v.union(v.string(), v.null())),
    paymentStatus: v.optional(v.union(v.string(), v.null())), // "pending", "completed"
    onboardingFeePaid: v.optional(v.union(v.boolean(), v.null())),
    assignedChatCount: v.optional(v.union(v.number(), v.null())),
    totalEarnings: v.optional(v.union(v.number(), v.null())),
    availableBalance: v.optional(v.union(v.number(), v.null())),
    payoutDetails: v.optional(v.union(v.string(), v.null())), // e.g. Phone number for Mobile Money
    status: v.optional(v.union(v.string(), v.null())), // "pending_payment", "pending_assignment", "active"
  }).index("by_email", ["email"]),

  assignedChats: defineTable({
    userId: v.id("users"),
    clientName: v.string(),
    startTime: v.number(),
    durationMinutes: v.number(),
    earnings: v.number(),
  }).index("by_user", ["userId"]),

  withdrawals: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    status: v.string(), // "pending", "completed", "rejected"
    requestedAt: v.number(),
    method: v.string(), // "Mobile Money", "PayPal", etc.
    details: v.string(), // e.g., phone number or email
  }).index("by_user", ["userId"]),

  // Legacy table for admin compatibility
  applicants: defineTable({
    fullName: v.string(),
    email: v.string(),
    whatsapp: v.optional(v.string()),
    phone: v.optional(v.string()),
    payoutMethod: v.string(),
    paymentStatus: v.string(),
    onboardingFeePaid: v.boolean(),
    transactionRef: v.optional(v.string()),
  }),
});
