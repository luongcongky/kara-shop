import { Session } from 'next-auth';
import { Role } from '@prisma/client';

/**
 * Type-safe helper to check if user has ADMIN role
 * This avoids repetitive type assertions and centralizes role checking logic
 */
export function isAdmin(session: Session | null | undefined): boolean {
  if (!session?.user) return false;
  // Type assertion is centralized here, avoiding repetition across the codebase
  return (session.user as { role?: Role }).role === 'ADMIN';
}

/**
 * Type-safe helper to get user role
 */
export function getUserRole(session: Session | null | undefined): Role | undefined {
  if (!session?.user) return undefined;
  return (session.user as { role?: Role }).role;
}
