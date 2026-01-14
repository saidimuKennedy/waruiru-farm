"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Client-side wrapper for the NextAuth SessionProvider.
 * Allows access to the authentication session in client components.
 *
 * @param {React.ReactNode} children - Child components requiring session access.
 */
export function ClientSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
