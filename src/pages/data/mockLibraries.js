// Temporary mock data. Replace when the real backend exists.
// ownerId  -> user who created the library  (=> tagged "mine")
// memberIds -> users who joined it           (=> tagged "joined")
export const mockLibraries = [
  {
    id: 101,
    name: "Data Structures",
    courseCode: "ICS 202",
    description: "Lecture notes and practice quizzes for trees, graphs and hashing.",
    ownerId: 2,
    memberIds: [1],
  },
  {
    id: 102,
    name: "Software Requirements Engineering",
    courseCode: "SWE 316",
    description: "Requirements, design patterns and testing material.",
    ownerId: 2,
    memberIds: [1],
  },
  {
    id: 103,
    name: "Web Development and Engineering",
    courseCode: "SWE 363",
    description: "Lecture notes, quizzes and flashcards for web development.",
    ownerId: 1,
    memberIds: [],
  },
  {
    id: 104,
    name: "Database Systems",
    courseCode: "ICS 321",
    description: "Lecture notes and practice quizzes for relational databases, SQL and NoSQL.",
    ownerId: 1,
    memberIds: [],
  },
];
