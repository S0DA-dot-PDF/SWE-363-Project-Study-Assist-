import { mockLibraries } from "./mockLibraries";
import { mockMaterials, mockQuizzes, mockFlashcardSets } from "./mockContent";


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

  const library = {
    id: Math.max(0, ...mockLibraries.map((l) => l.id)) + 1,
    name: name.trim(),
    courseCode: cleanCourse,
    description: description.trim(),
    ownerId,
    memberIds: [],
    joinCode: makeJoinCode(cleanCourse),
    acceptingMembers: true,
  };

  mockLibraries.push(library);
  return { ...library, isOwner: true };
}

// Removes every item matching `test` from an array, in place.
const removeWhere = (arr, test) => {
  for (let i = arr.length - 1; i >= 0; i--) if (test(arr[i])) arr.splice(i, 1);
};

// Generates a joining code like "SWE363-K7QX" that no other library uses.
const makeJoinCode = (courseCode) => {
  let code;
  do {
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    code = `${courseCode.replace(/\s+/g, "").toUpperCase()}-${suffix}`;
  } while (mockLibraries.some((l) => l.joinCode === code));
  return code;
};

/**
 * LIB-04
 * Returns one library with `isOwner`, or null if it doesn't exist
 * or the user is neither the owner nor a member.
 */
export async function getLibrary(id, userId) {
  await delay();
  const lib = mockLibraries.find((l) => l.id === Number(id));
  if (!lib) return null;
  const isOwner = lib.ownerId === userId;
  if (!isOwner && !lib.memberIds.includes(userId)) return null;
  return { ...lib, isOwner };
}

export async function getMaterials(libraryId) {
  await delay(200);
  return mockMaterials.filter((m) => m.libraryId === libraryId).map((m) => ({ ...m }));
}

export async function getQuizzes(libraryId) {
  await delay(200);
  return mockQuizzes.filter((q) => q.libraryId === libraryId).map((q) => ({ ...q }));
}

export async function getFlashcardSets(libraryId) {
  await delay(200);
  return mockFlashcardSets.filter((f) => f.libraryId === libraryId).map((f) => ({ ...f }));
}

/** Educator view: the members of a library. Names are placeholders for now. */
export async function getMembers(libraryId) {
  await delay(200);
  const lib = mockLibraries.find((l) => l.id === libraryId);
  if (!lib) return [];
  return lib.memberIds.map((memberId) => ({ id: memberId, name: `Student ${memberId}` }));
}

export async function renameMaterial(materialId, name) {
  await delay(200);
  const m = mockMaterials.find((x) => x.id === materialId);
  if (!m) throw new Error("NOT_FOUND");
  m.name = name.trim();
}

/** Mock replace: only the file name changes, there is no real file. */
export async function replaceMaterial(materialId, fileName) {
  await delay(200);
  const m = mockMaterials.find((x) => x.id === materialId);
  if (!m) throw new Error("NOT_FOUND");
  m.fileName = fileName;
  m.uploadedAt = new Date().toISOString().slice(0, 10);
}

export async function deleteMaterial(materialId) {
  await delay(200);
  removeWhere(mockMaterials, (m) => m.id === materialId);
}

/** Edits name / course code / description. Throws "DUPLICATE_NAME" if the user already has that name. */
export async function updateLibrary(id, userId, { name, courseCode, description }) {
  await delay();
  const lib = mockLibraries.find((l) => l.id === id);
  if (!lib) throw new Error("NOT_FOUND");
  const clean = name.trim();
  const duplicate = mockLibraries.some(
    (l) =>
      l.id !== id &&
      (l.ownerId === userId || l.memberIds.includes(userId)) &&
      l.name.trim().toLowerCase() === clean.toLowerCase()
  );
  if (duplicate) throw new Error("DUPLICATE_NAME");
  lib.name = clean;
  lib.courseCode = courseCode.trim().toUpperCase();
  lib.description = description.trim();
  return { name: lib.name, courseCode: lib.courseCode, description: lib.description };
}

/** Deletes the library and everything inside it. */
export async function deleteLibrary(id) {
  await delay();
  removeWhere(mockLibraries, (l) => l.id === id);
  removeWhere(mockMaterials, (m) => m.libraryId === id);
  removeWhere(mockQuizzes, (q) => q.libraryId === id);
  removeWhere(mockFlashcardSets, (f) => f.libraryId === id);
}

/** Replaces the joining code. The old code stops working. Returns the new code. */
export async function regenerateJoinCode(id) {
  await delay();
  const lib = mockLibraries.find((l) => l.id === id);
  if (!lib) throw new Error("NOT_FOUND");
  lib.joinCode = makeJoinCode(lib.courseCode);
  return lib.joinCode;
}