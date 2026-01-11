export const subjectData = [
  {
    id: "24CSH-206", name: "Design & Analysis of Algorithms (DAA)", credits: 4, type: "PLACEMENT CORE",
    units: [
      { title: "Unit 1: Foundations", topics: ["Asymptotic Notations (Big O, Omega, Theta)", "Recurrence Relations (Substitution, Recursion-Tree, Master Method)", "Data Structures Review (AVL Trees, Red-Black Trees, Heaps)", "Sorting in Linear Time (Counting, Radix, Bucket Sort)"] },
      { title: "Unit 2: Strategies", topics: ["Divide & Conquer (Merge Sort, Quick Sort, Strassen's Matrix)", "Greedy (Fractional Knapsack, Prim's, Kruskal's, Huffman Coding)", "Dynamic Programming (0/1 Knapsack, Matrix Chain Mult, LCS, TSP)", "Backtracking (N-Queen, Hamiltonian Cycles)", "Branch & Bound (0/1 Knapsack, TSP)"] },
      { title: "Unit 3: Advanced", topics: ["Graph Algos (BFS, DFS, Topological Sort)", "Shortest Path (Dijkstra, Bellman-Ford, Floyd-Warshall)", "String Matching (Rabin-Karp, KMP, Boyer-Moore)", "NP-Completeness (P vs NP, NP-Hard Proofs)", "Convex Hull"] }
    ]
  },
  {
    id: "24CSP-210", name: "Full Stack Development-I", credits: 2, type: "PROJECT CORE",
    units: [
      { title: "Unit 1: Frontend", topics: ["HTML5 Semantic Tags & Forms", "CSS3 Flexbox & Grid", "JS ES6+ (DOM Manipulation, Events)", "React Intro (Components, Props, State)", "Bootstrap/Tailwind Integration"] },
      { title: "Unit 2: Backend", topics: ["Node.js Environment", "Express.js Server & Routing", "RESTful API Development", "MongoDB Connection", "Mongoose ORM (CRUD Operations)"] },
      { title: "Unit 3: Integration", topics: ["Authentication (JWT, Sessions)", "State Management (Redux)", "Real-time Chat (Socket.io)", "Deployment (Vercel/Render)", "Git/GitHub Version Control"] }
    ]
  },
  {
    id: "24CSH-207", name: "Object Oriented Programming (Java)", credits: 3, type: "CORE",
    units: [
      { title: "Unit 1: Java Internals", topics: ["JVM/JDK/JRE Architecture", "Byte Code Interpretation", "Constructors & Static Members", "Overloading vs Overriding", "String Handling"] },
      { title: "Unit 2: Advanced OOP", topics: ["Inheritance Types", "Packages (Built-in vs User-defined)", "Exception Handling (Try-Catch-Finally, Throw/Throws)", "Multithreading (Synchronization, Inter-thread Comm)"] },
      { title: "Unit 3: GUI & DB", topics: ["Event Handling (Delegation Model)", "AWT Components (Frame, Panel, Layouts)", "Applet Life Cycle", "JDBC Architecture", "Database Connectivity (Insert, Update, Delete)"] }
    ]
  },
  {
    id: "24CST-205", name: "Operating Systems", credits: 3, type: "THEORY",
    units: [
      { title: "Unit 1: Process Mgmt", topics: ["System Calls", "Process Control Block (PCB)", "CPU Scheduling (FCFS, SJF, RR, Priority)", "Threads", "Process Synchronization"] },
      { title: "Unit 2: Memory & Deadlock", topics: ["Deadlock (Prevention, Avoidance - Banker's Algo)", "Paging & Segmentation", "Virtual Memory", "Demand Paging", "Page Replacement Algos (LRU, Optimal)"] },
      { title: "Unit 3: Storage", topics: ["Disk Scheduling (SSTF, SCAN, C-LOOK)", "RAID Levels", "File System Structure", "System Protection (Access Matrix)"] }
    ]
  },
  {
    id: "24CST-211", name: "Intro to Machine Learning (SWAYAM)", credits: 3, type: "AI/ML",
    units: [
      { title: "Unit 1: Fundamentals", topics: ["Supervised vs Unsupervised Learning", "Regression vs Classification", "Overfitting & Underfitting", "Data Pre-processing (Cleaning, Normalization)"] },
      { title: "Unit 2: Models", topics: ["Linear Regression (OLS, Gradient Descent)", "Logistic Regression", "Linear Discriminant Analysis (LDA)", "Bias-Variance Trade-off"] },
      { title: "Unit 3: Advanced", topics: ["Support Vector Machines (SVM)", "Neural Networks (ANN, Backpropagation)", "Decision Trees (ID3)", "Random Forests"] }
    ]
  },
  {
    id: "24CST-208", name: "Software Engineering", credits: 3, type: "PROCESS",
    units: [
      { title: "Unit 1: SDLC", topics: ["Software Life Cycle Models (Waterfall, Spiral, Agile)", "SRS Documentation", "UML Diagrams (Use Case, Class, Activity)", "Data Flow Diagrams"] },
      { title: "Unit 2: Mgmt & Design", topics: ["Project Estimation (COCOMO)", "Risk Management", "User Interface Design", "Project Scheduling"] },
      { title: "Unit 3: Testing", topics: ["Black Box vs White Box Testing", "Unit & Integration Testing", "Software Maintenance", "Quality Assurance (SQA)"] }
    ]
  },
  {
    id: "24CSP-209", name: "Competitive Coding-I", credits: 1, type: "GRIND",
    units: [
      { title: "Unit 1: DS Basics", topics: ["Array Manipulation", "Linked Lists (Singly/Doubly)", "Stacks & Queues Implementation", "Trees (BST Operations)"] },
      { title: "Unit 2: Algo Logic", topics: ["Sorting & Searching", "Greedy Techniques", "Dynamic Programming Basics", "Backtracking Puzzles"] }
    ]
  }
];

export const timelineData = [
  { date: "2026-01-11", event: "AVION.EXE Phase 1 Complete - Calendar Core Live", type: "info" },
  { date: "2026-01-12", event: "Evoke Summit", type: "event" },
  { date: "2026-02-09", event: "MST-1 (Hourly Tests) START", type: "exam" },
  { date: "2026-02-12", event: "MST-1 END", type: "exam" },
  { date: "2026-03-06", event: "PROJECT EXPO (CareSync Deadline)", type: "dead" },
  { date: "2026-03-09", event: "Practical MSTs", type: "exam" },
  { date: "2026-03-17", event: "MST-2 Exams START", type: "exam" },
  { date: "2026-03-27", event: "CU Fest", type: "party" },
  { date: "2026-04-25", event: "End Sem Practicals", type: "exam" },
  { date: "2026-05-01", event: "End Sem Theory Exams", type: "exam" }
];