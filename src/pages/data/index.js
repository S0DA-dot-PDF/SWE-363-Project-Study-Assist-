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

/**
 * LIB-02
 * Finds a library by its joining code (case-insensitive).
 * Returns null if no library matches.
 * Adds `isMember` (owner or joined) so the page doesn't repeat the rule.
 */
export async function getLibraryByCode(code, userId) {
  await delay();
  const normalized = code.trim().toLowerCase();
  const lib = mockLibraries.find((l) => l.joinCode.toLowerCase() === normalized);
  if (!lib) return null;
  return {
    ...lib,
    isMember: lib.ownerId === userId || lib.memberIds.includes(userId),
  };
}

/**
 * LIB-02
 * Adds the user to a library. Throws if it doesn't exist or is closed.
 * Mock only: the change lives in memory and resets on page refresh.
 */
export async function joinLibrary(libraryId, userId) {
  await delay();
  const lib = mockLibraries.find((l) => l.id === libraryId);
  if (!lib || !lib.acceptingMembers) throw new Error("Library unavailable");
  if (!lib.memberIds.includes(userId)) lib.memberIds.push(userId);
}
/**
 * LIB-03
 * Creates a library owned by `ownerId` and generates its joining code.
 * Mock only: the new library lives in memory and resets on page refresh.
 */
export async function createLibrary(ownerId, { name, courseCode, description }) {
  await delay();

  const cleanCourse = courseCode.trim().toUpperCase();

  // Generate a code like "SWE363-K7QX" that no other library uses
  let joinCode;
  do {
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    joinCode = `${cleanCourse.replace(/\s+/g, "")}-${suffix}`;
  } while (mockLibraries.some((l) => l.joinCode === joinCode));

  const library = {
    id: Math.max(0, ...mockLibraries.map((l) => l.id)) + 1,
    name: name.trim(),
    courseCode: cleanCourse,
    description: description.trim(),
    ownerId,
    memberIds: [],
    joinCode,
    acceptingMembers: true,
  };

  mockLibraries.push(library);
  return { ...library, isOwner: true };
}