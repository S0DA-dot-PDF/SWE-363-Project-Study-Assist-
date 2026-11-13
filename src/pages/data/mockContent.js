// Mock content for LIB-04. 
export const mockMaterials = [
  { id: 1, libraryId: 101, name: "Lecture 1: Arrays", fileName: "lecture1.pdf", uploadedAt: "2026-09-01" },
  { id: 2, libraryId: 101, name: "Lecture 2: Linked Lists", fileName: "lecture2.pdf", uploadedAt: "2026-09-08" },
  { id: 3, libraryId: 103, name: "HTML & CSS Basics", fileName: "html-css.pdf", uploadedAt: "2026-09-03" },
  { id: 4, libraryId: 103, name: "React Intro", fileName: "react-intro.pptx", uploadedAt: "2026-09-10" },
];

export const mockQuizzes = [
  { id: 1, libraryId: 101, title: "Arrays Quiz", questionCount: 10 },
  { id: 2, libraryId: 103, title: "React Basics Quiz", questionCount: 8 },
];

export const mockFlashcardSets = [
  { id: 1, libraryId: 101, title: "Data Structures Terms", cardCount: 25 },
];
// Libraries 2 and 4 have no content to test the empty states.