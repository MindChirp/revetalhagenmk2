import { createTRPCContext } from "@/server/api/trpc";
import { newsletterSubscription } from "@/server/db/schema";
import { eq } from "drizzle-orm";

// Handle the unsubscribe request
export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email?.includes("@")) {
    return new Response("Invalid email address", { status: 400 });
  }

  const ctx = await createTRPCContext({ headers: req.headers });

  try {
    const result = await ctx.db
      .delete(newsletterSubscription)
      .where(eq(newsletterSubscription.email, email))
      .returning();

    if (result.length === 0) {
      return new Response("Email not found in subscription list", {
        status: 404,
      });
    }
    return new Response("Successfully unsubscribed", { status: 200 });
  } catch (error) {
    console.error("Error unsubscribing email:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
