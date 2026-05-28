import { query } from "./_generated/server";
import { v } from "convex/values";

export const check = query({
  args: {},
  returns: v.string(),
  handler: async () => {
    return "ok";
  },
});
