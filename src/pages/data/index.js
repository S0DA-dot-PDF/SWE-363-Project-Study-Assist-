import { mockLibraries } from "./mockLibraries";

// Simulates network delay so Loading / Error states can be tested.
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * LIB-01 / SHR-01
 * Returns every library the user owns or has joined.
 * Each item gets an `isOwner` flag so pages don't repeat the ownership rule.
 */
export async function getLibrariesForUser(userId) {
  await delay();
  return mockLibraries
    .filter((lib) => lib.ownerId === userId || lib.memberIds.includes(userId))
    .map((lib) => ({ ...lib, isOwner: lib.ownerId === userId }));
}
