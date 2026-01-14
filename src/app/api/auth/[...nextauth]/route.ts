import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * NextAuth API route handler.
 * Manages authentication flow (login, logout, session).
 * Uses configuration from @/lib/auth.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
