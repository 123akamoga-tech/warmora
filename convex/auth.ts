import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password({
      validatePasswordRequirements(password) {
        if (password.length < 4) {
          throw new Error("Password must be at least 4 characters long");
        }
      },
      profile(params) {
        return {
          email: params.email as string,
          name: (params.name as string) ?? null,
          paymentStatus: "pending",
          onboardingFeePaid: false,
          assignedChatCount: 0,
          totalEarnings: 0,
          availableBalance: 0,
          status: "pending_payment",
        };
      },
    }),
  ],
});
