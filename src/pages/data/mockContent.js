// Mock content for LIB-04. 
export const mockMaterials = [
  { id: 1, libraryId: 101, name: "Lecture 1: Arrays", fileName: "lecture1.pdf", uploadedAt: "2026-09-01" },
  { id: 2, libraryId: 101, name: "Lecture 2: Linked Lists", fileName: "lecture2.pdf", uploadedAt: "2026-09-08" },
  { id: 3, libraryId: 103, name: "HTML & CSS Basics", fileName: "html-css.pdf", uploadedAt: "2026-09-03" },
  { id: 4, libraryId: 103, name: "React Intro", fileName: "react-intro.pptx", uploadedAt: "2026-09-10" },
];


export const mockQuizzes = [
  {
    id: 1,
    libraryId: 101,
    title: "Arrays Quiz",
    questionCount: 10,
    status: "published",
  },
  {
    id: 2,
    libraryId: 103,
    title: "React Basics Quiz",
    questionCount: 8,
    status: "published",
  },
];


export const mockFlashcardCards = [
  { id: "c1", front: "Array", back: "A fixed-size list of items stored next to each other, reached by index." },
  { id: "c2", front: "Linked list", back: "Items (nodes) where each one points to the next." },
  { id: "c3", front: "Stack", back: "Last in, first out: the last item added is the first one removed." },
  { id: "c4", front: "Queue", back: "First in, first out: items leave in the order they arrived." },
  { id: "c5", front: "Hash table", back: "Stores key–value pairs and finds a key quickly using a hash function." },
  { id: "c6", front: "Binary tree", back: "A tree where every node has at most two children." },
  { id: "c7", front: "Binary search tree", back: "A binary tree where left children are smaller and right children are larger." },
  { id: "c8", front: "Heap", back: "A tree where every parent is larger (or smaller) than its children." },
  { id: "c9", front: "Graph", back: "A set of nodes (vertices) joined by edges." },
  { id: "c10", front: "Big-O notation", back: "Describes how an algorithm's running time grows as the input grows." },
  { id: "c11", front: "Recursion", back: "A function that solves a problem by calling itself on a smaller version of it." },
  { id: "c12", front: "Binary search", back: "Finds an item in a sorted list by halving the search range each step." },
  { id: "c13", front: "Breadth-first search", back: "Visits a graph level by level, using a queue." },
  { id: "c14", front: "Depth-first search", back: "Follows one path as far as it goes before backtracking, using a stack." },
  { id: "c15", front: "Merge sort", back: "Splits the list in half, sorts each half, then merges them. O(n log n)." },
  { id: "c16", front: "Quick sort", back: "Picks a pivot and puts smaller items before it and larger after, then repeats." },
  { id: "c17", front: "Collision", back: "When two keys hash to the same slot in a hash table." },
  { id: "c18", front: "AVL tree", back: "A binary search tree that rebalances itself so neither side gets too deep." },
  { id: "c19", front: "Adjacency list", back: "Stores a graph as a list of neighbours for each node." },
  { id: "c20", front: "Dynamic programming", back: "Solves a problem by saving and reusing the answers to its smaller parts." },
  { id: "c21", front: "Priority queue", back: "A queue where the item with the highest priority leaves first." },
  { id: "c22", front: "Trie", back: "A tree that stores words letter by letter, used for fast prefix search." },
  { id: "c23", front: "Topological sort", back: "Orders a graph's nodes so every edge points forward." },
  { id: "c24", front: "Spanning tree", back: "A tree that connects all nodes of a graph using some of its edges." },
  { id: "c25", front: "Amortised time", back: "The average cost per operation over a long run of operations." },
];

export const mockFlashcardSets = [
  { id: 1, libraryId: 101, title: "Data Structures Terms", cardCount: 25 },
];
// Libraries 2 and 4 have no content to test the empty states.