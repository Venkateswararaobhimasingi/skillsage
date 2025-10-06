// src/pages/dsa/DSAIntroView.tsx
// --- DSAIntroView.tsx (Data Structures & Algorithms Course Module View) ---

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import {
    CheckCircle,
    Play,
    ArrowLeft,
    Share2,
    Edit,
    Target,
    Menu,
    X,
    Clock,
    HelpCircle,
    Server,
} from "lucide-react";
// NOTE: Assuming these imports are handled in the consumer file:
// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';

/* -------------------- MOCK UI COMPONENTS -------------------- */

// Mock Button component (using standard HTML button and Tailwind classes)
const Button: React.FC<any> = ({ onClick, children, className, variant = "default", size = "default", disabled = false }) => {
    let baseStyle = "px-4 py-2 font-semibold rounded-lg transition-colors shadow-md flex items-center justify-center";
    if (variant === "default") baseStyle += " bg-blue-600 hover:bg-blue-700 text-white";
    if (variant === "outline") baseStyle += " bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700";
    if (variant === "ghost") baseStyle += " bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-white shadow-none";
    if (size === "icon") baseStyle = "p-2 rounded-full " + baseStyle;

    if (disabled) baseStyle = baseStyle.replace(/hover:bg-\w+-\d+/, 'bg-gray-400 cursor-not-allowed');

    return (
        <button onClick={onClick} className={`${baseStyle} ${className || ''}`} disabled={disabled}>
            {children}
        </button>
    );
};

// Mock Progress component
const Progress: React.FC<any> = ({ value, className = '' }) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    return (
        <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}>
            <div
                className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${clampedValue}%` }}
            ></div>
        </div>
    );
};

/* -------------------- INTERFACES -------------------- */
interface QuizQuestion { id: string; question: string; options: string[]; answer: number; }
interface DetailedSubmodule { id: string; title: string; content: React.ReactNode; estimatedReadingTime: string; moduleId: string; }
interface ModuleProgress { readProgress: number; isCompleted: boolean; isQuizCompleted: boolean; }
interface CourseViewProps { onBack: () => void; planTitle: string; }

/* -------------------- MOCK ModuleQuiz Component -------------------- */
const ModuleQuiz: React.FC<any> = ({ questions, onComplete, onBackToContent, isPassed, showAnswers }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
    const [localScore, setLocalScore] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSelect = (qId: string, oIndex: number) => {
        if (isSubmitted || showAnswers) return;
        setSelectedAnswers(prev => ({ ...prev, [qId]: oIndex }));
    };

    const handleSubmit = () => {
        // Simple mock score calculation: 75% chance to pass
        const passed = Math.random() > 0.25;
        const mockScore = passed ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 20) + 50;

        setLocalScore(mockScore);
        setIsSubmitted(true);
        setTimeout(() => { onComplete(passed); }, 300);
    };

    if (showAnswers || isSubmitted) {
        return (
            <div className="p-6 border rounded-lg space-y-4 bg-green-50 dark:bg-green-900/10">
                <h3 className="text-2xl font-bold text-green-600">
                    Quiz Review
                    {isPassed
                        ? " (Passed)"
                        : (localScore !== null ? ` (Failed: ${localScore}%)` : " (Review)")}
                </h3>
                <p className="text-sm text-muted-foreground">
                    Review the correct answers in **green** below.
                </p>
                {questions.map((q: any, qIndex: number) => (
                    <div key={q.id} className="p-3 border rounded-md">
                        <p className="font-semibold mb-2">Q{qIndex + 1}: {q.question}</p>
                        <ul className="space-y-1">
                            {q.options.map((option: string, oIndex: number) => {
                                const isCorrect = oIndex === q.answer;
                                return (
                                    <li
                                        key={oIndex}
                                        className={isCorrect ? "text-green-600 font-medium flex items-center" : "text-card-foreground"}
                                    >
                                        {isCorrect && <CheckCircle className="h-3 w-3 mr-2 flex-shrink-0" />}
                                        {option}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
                <Button onClick={onBackToContent} variant="outline" className="mt-4">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Content
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 border rounded-lg space-y-4">
            <h3 className="text-2xl font-bold">{questions.length > 0 ? questions[0].id.substring(0, 5).toUpperCase() : 'Module'} Quiz</h3>
            <p className="text-muted-foreground">Select one option for each of the {questions.length} questions.</p>
            <div className="space-y-6">
                {questions.map((q: any, qIndex: number) => (
                    <div key={q.id} className="p-3 border rounded-lg">
                        <p className="font-semibold mb-2">Q{qIndex + 1}: {q.question}</p>
                        <ul className="space-y-2">
                            {q.options.map((option: string, oIndex: number) => {
                                const isSelected = selectedAnswers[q.id] === oIndex;
                                return (
                                    <li
                                        key={oIndex}
                                        onClick={() => handleSelect(q.id, oIndex)}
                                        className={`p-2 rounded cursor-pointer transition-colors ${isSelected ? 'bg-blue-600/20 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    >
                                        {option}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </div>
            <Button onClick={handleSubmit} className="w-full">
                Submit Answers
            </Button>
            <Button onClick={onBackToContent} variant="outline" className="w-full">
                Cancel
            </Button>
        </div>
    );
};
/* -------------------- END MOCK ModuleQuiz Component -------------------- */


/* -------------------- STATIC QUIZ DATA (M-101 to M-1601) -------------------- */
const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
    "m-101-final": [
        { id: "m101-q1", question: "What does the 'O' in Big O Notation represent?", options: ["Optimal Time", "Order of Magnitude", "Operation Count", "Output Time"], answer: 1, },
        { id: "m101-q2", question: "Which algorithm analysis describes the fastest possible execution time?", options: ["Worst Case", "Best Case", "Average Case", "Asymptotic Analysis"], answer: 1, },
        { id: "m101-q3", question: "What is the Big O complexity of accessing an element in an array by its index?", options: ["O(log n)", "O(n)", "O(n^2)", "O(1)"], answer: 3, },
        { id: "m101-q4", question: "The Master Theorem is primarily used to solve what?", options: ["Sorting algorithms", "Recurrence relations", "Space complexity", "Graph traversals"], answer: 1, },
    ],
    "m-201-final": [
        { id: "m201-q1", question: "The Two-Pointer Technique is most effective for problems involving what structure?", options: ["Binary Trees", "Graphs", "Sorted Arrays or Lists", "Heaps"], answer: 2, },
        { id: "m201-q2", question: "What is the primary use case for the Sliding Window technique?", options: ["Calculating Fibonacci numbers", "Finding a maximum or minimum value in a contiguous subarray/substring", "Merging two sorted arrays", "Inverting a Binary Tree"], answer: 1, },
        { id: "m201-q3", question: "Kadane's Algorithm is used to solve which problem?", options: ["Longest Palindromic Substring", "Maximum Subarray Sum", "Longest Increasing Subsequence", "Shortest Path in a Graph"], answer: 1, },
        { id: "m201-q4", question: "What is the goal of a Prefix Sum array?", options: ["Store elements in sorted order", "Generate random numbers", "Quickly calculate the sum of any subarray/range", "Find the largest element"], answer: 2, },
    ],
    "m-301-final": [
        { id: "m301-q1", question: "In a recursive function, what prevents infinite loops?", options: ["The recursive step", "The base case", "The memory allocation", "The time complexity"], answer: 1, },
        { id: "m301-q2", question: "Which technique systematically tries all possible paths, then undoes (backtracks) when a path fails?", options: ["Memoization", "Tabulation", "Backtracking", "Divide and Conquer"], answer: 2, },
        { id: "m301-q3", question: "What classic problem is often used to illustrate backtracking?", options: ["Dijkstra's Algorithm", "The N-Queens Problem", "Quick Sort", "Longest Common Subsequence"], answer: 1, },
        { id: "m301-q4", question: "What visualization method helps analyze recursive calls and complexity?", options: ["Flow Chart", "Recurrence Tree", "Call Stack Diagram", "State Machine"], answer: 1, },
    ],
    "m-401-final": [
        { id: "m401-q1", question: "Binary Search requires the input list to be in what state?", options: ["Unsorted", "A Linked List", "Sorted", "A Binary Tree"], answer: 2, },
        { id: "m401-q2", question: "What is the worst-case time complexity of Quick Sort?", options: ["O(n log n)", "O(n^2)", "O(n)", "O(log n)"], answer: 1, },
        { id: "m401-q3", question: "Which sorting algorithm is often implemented using a Divide and Conquer approach?", options: ["Insertion Sort", "Merge Sort", "Selection Sort", "Radix Sort"], answer: 1, },
        { id: "m401-q4", question: "What defines a sorting algorithm as 'stable'?", options: ["Its time complexity is O(n log n)", "It maintains the relative order of equal elements", "It uses O(1) extra space", "It is based on comparison"], answer: 1, },
    ],
    "m-501-final": [
        { id: "m501-q1", question: "Which component is added to a Singly Linked List to make it Doubly Linked?", options: ["A head pointer", "A tail pointer", "A 'previous' pointer", "An index"], answer: 2, },
        { id: "m501-q2", question: "The Slow & Fast Pointer technique is most famously used for what Linked List operation?", options: ["Reversing the list", "Detecting cycles", "Merging lists", "Finding the middle element"], answer: 1, },
        { id: "m501-q3", question: "What data structure combination forms the basis of an LRU Cache?", options: ["Array and Queue", "Linked List and HashMap", "Stack and Heap", "Tree and Array"], answer: 1, },
        { id: "m501-q4", question: "Floyd's Cycle Detection Algorithm is also known as what?", options: ["Tortoise and Hare Algorithm", "Fast Runner Algorithm", "LinkedList Search", "Cycle Breaker"], answer: 0, },
    ],
    "m-601-final": [
        { id: "m601-q1", question: "What principle defines how a standard Stack operates?", options: ["FIFO (First In, First Out)", "LIFO (Last In, First Out)", "FILO (First In, Last Out)", "Random Access"], answer: 1, },
        { id: "m601-q2", question: "What is the primary use of a Monotonic Stack?", options: ["Sorting data", "Finding the smallest element in constant time", "Efficiently calculating the next greater or previous smaller element for all items", "Implementing a Queue"], answer: 2, },
        { id: "m601-q3", question: "The Min Stack problem requires the `min()` operation to run in what complexity?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], answer: 3, },
        { id: "m601-q4", question: "The 'Valid Parentheses' problem is a classic application of which data structure?", options: ["Queue", "Linked List", "Stack", "Tree"], answer: 2, },
    ],
    "m-701-final": [
        { id: "m701-q1", question: "What is the most efficient way to access an element in a Binary Search Tree (BST)?", options: ["O(n^2)", "O(n)", "O(log n)", "O(1)"], answer: 2, },
        { id: "m701-q2", question: "Which tree traversal visits the left subtree, then the root, then the right subtree?", options: ["Preorder", "Inorder", "Postorder", "Level Order"], answer: 1, },
        { id: "m701-q3", question: "Level Order Traversal is an example of which general search algorithm?", options: ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Topological Sort", "Binary Search"], answer: 1, },
        { id: "m701-q4", question: "The Lowest Common Ancestor (LCA) problem is simplified in a BST because of what property?", options: ["It is always balanced", "The root is the largest element", "The search path allows divergence logic", "All nodes have two children"], answer: 2, },
    ],
    "m-801-final": [
        { id: "m801-q1", question: "A Min-Heap guarantees that the smallest element is always found where?", options: ["At the root", "At a leaf node", "In the center", "At the last index"], answer: 0, },
        { id: "m801-q2", question: "What is the time complexity of the `heapify` operation on a single node?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], answer: 1, },
        { id: "m801-q3", question: "Which problem pattern often uses two heaps (Min and Max) to maintain its state?", options: ["Kth Largest Element", "Merge K Sorted Lists", "Median from Data Stream", "Top K Frequent Elements"], answer: 2, },
        { id: "m801-q4", question: "Finding the Kth Largest element in a large dataset is efficiently done using which type of heap?", options: ["A Min-Heap of size K", "A Max-Heap of size N", "A Simple Array", "A Binary Search Tree"], answer: 0, },
    ],
    "m-901-final": [
        { id: "m901-q1", question: "What is a major strategy for handling hash collisions?", options: ["Heapify", "Chaining or Open Addressing", "Linked Lists", "Sorting"], answer: 1, },
        { id: "m901-q2", question: "Which problem can be solved by storing the difference between the target and the current number in a HashMap?", options: ["Two Sum", "Merge Intervals", "Quick Sort", "N-Queens"], answer: 0, },
        { id: "m901-q3", question: "What is the primary difference between a HashMap and a HashSet?", options: ["HashSet is faster", "HashMap stores key-value pairs; HashSet only stores keys (values are usually boolean/dummy)", "HashMap uses arrays; HashSet uses linked lists", "There is no difference"], answer: 1, },
        { id: "m901-q4", question: "In the Longest Consecutive Sequence problem, why is a HashSet efficient?", options: ["It provides sorted access", "It allows O(1) average time lookups to check neighbors", "It stores duplicates", "It uses less memory than an array"], answer: 1, },
    ],
    "m-1001-final": [
        { id: "m1001-q1", question: "The primary purpose of **Topological Sorting** is to order nodes in which type of graph?", options: ["Undirected Graph with cycles", "Weighted Graph", "Directed Acyclic Graph (DAG)", "Bipartite Graph"], answer: 2, },
        { id: "m1001-q2", question: "Dijkstra's Algorithm is used to find the shortest path in a graph with what constraint?", options: ["Negative edge weights", "No negative edge weights", "Only unweighted edges", "A dense graph"], answer: 1, },
        { id: "m1001-q3", question: "The Union-Find data structure is optimized for what specific graph operation?", options: ["Finding the shortest path", "Checking for cycles and connectivity", "Graph traversal", "Topological sorting"], answer: 1, },
        { id: "m1001-q4", question: "Which algorithm finds the Minimum Spanning Tree (MST) by iteratively adding the minimum weight edge that doesn't form a cycle?", options: ["Prim's Algorithm", "Floyd–Warshall Algorithm", "Kruskal's Algorithm", "Bellman-Ford Algorithm"], answer: 2, },
    ],
    "m-1101-final": [
        { id: "m1101-q1", question: "What is the primary goal of **Memoization** in Dynamic Programming?", options: ["Reversing the array", "Storing the results of expensive function calls to avoid re-computation", "Using a lookup table instead of recursion", "Calculating the base case"], answer: 1, },
        { id: "m1101-q2", question: "The **Tabulation** (Bottom-Up) approach typically avoids what recursive overhead issue?", options: ["Array indexing errors", "Stack Overflow", "Heap exhaustion", "Time complexity"], answer: 1, },
        { id: "m1101-q3", question: "What classic problem is the foundation for solving problems like Longest Common Subsequence (LCS)?", options: ["Knapsack Problem", "Subset Sum Problem", "Edit Distance Problem", "All of the above"], answer: 3, },
        { id: "m1101-q4", question: "Which DP technique primarily involves using a 1D or 2D array to store results and build up to the final solution?", options: ["Recursion", "Memoization", "Tabulation", "Greedy"], answer: 2, },
    ],
    "m-1201-final": [
        { id: "m1201-q1", question: "The core idea of a **Greedy Algorithm** is to make what kind of choice at each step?", options: ["A globally optimal choice", "The locally optimal choice", "A choice based on future prediction", "A random choice"], answer: 1, },
        { id: "m1201-q2", question: "The Activity Selection Problem is a classic example of which algorithm type?", options: ["Dynamic Programming", "Backtracking", "Greedy Algorithm", "Graph Traversal"], answer: 2, },
        { id: "m1201-q3", question: "The Fractional Knapsack Problem can be solved with a simple Greedy strategy, unlike the 0/1 Knapsack problem. Why?", options: ["Because weights must be integers", "Because the items can be broken into fractions", "Because it is faster than DP", "Because there is only one item type"], answer: 1, },
        { id: "m1201-q4", question: "The Minimum Spanning Tree can be found using both Prim's (Greedy) and Kruskal's (Greedy) algorithms. What characteristic allows this?", options: ["The Optimal Substructure property", "The Principle of Optimality", "The Greedy Choice Property", "The use of Heaps"], answer: 2, },
    ],
    "m-1301-final": [
        { id: "m1301-q1", question: "The operation used to flip a specific bit (0 to 1, or 1 to 0) is typically which bitwise operator?", options: ["AND (`&`)", "OR (`|`)", "XOR (`^`)", "Left Shift (`<<`)"], answer: 2, },
        { id: "m1301-q2", question: "What is the primary use of the `(n & (n-1))` trick?", options: ["Calculating n * 2", "Counting the number of set bits (1s)", "Checking if n is odd", "Finding the next power of two"], answer: 1, },
        { id: "m1301-q3", question: "The **Single Number** problem (finding the non-duplicate element) is efficiently solved using which property of XOR?", options: ["XOR with 0 is the number itself", "XOR is commutative and associative, and $A \oplus A = 0$", "XOR is faster than AND", "XOR works best with odd numbers"], answer: 1, },
        { id: "m1301-q4", question: "What does Bitmasking allow you to represent and iterate over?", options: ["Graph nodes and edges", "A subset of a given set of elements", "Only positive integers", "Recursive calls"], answer: 1, },
    ],
    "m-1401-final": [
        { id: "m1401-q1", question: "What Data Structure is used to efficiently search and store strings based on their prefixes?", options: ["Min-Heap", "Trie (Prefix Tree)", "Segment Tree", "Linked List"], answer: 1, },
        { id: "m1401-q2", question: "Segment Trees and Fenwick Trees (BIT) are most often used for which type of query?", options: ["Find all paths", "Range Sum Queries (RSQ) and updates", "Sorting numbers", "Finding the LCA"], answer: 1, },
        { id: "m1401-q3", question: "What is the key difference between an LRU Cache and an LFU Cache?", options: ["LRU removes the least *recently* used item; LFU removes the least *frequently* used item.", "LRU is faster than LFU.", "LFU uses a Hash Map, LRU uses a Linked List.", "LRU is for strings, LFU is for numbers."], answer: 0, },
        { id: "m1401-q4", question: "What is the core strategy of the Divide and Conquer technique?", options: ["Iteratively solving small subproblems and combining results", "Solving the entire problem at once", "Only using recursion", "Finding the base case"], answer: 0, },
    ],
    "m-1501-final": [
        { id: "m1501-q1", question: "Which pattern uses two pointers moving at different speeds to solve problems like cycle detection?", options: ["Two Pointers", "Sliding Window", "Fast & Slow Pointers", "BFS/DFS"], answer: 2, },
        { id: "m1501-q2", question: "When applying Dynamic Programming, what two properties must the problem possess?", options: ["Must use recursion and arrays", "Optimal Substructure and Overlapping Subproblems", "Constant Time and Constant Space", "Greedy Choice and Recursive Case"], answer: 1, },
        { id: "m1501-q3", question: "Which pattern is best suited for finding the shortest path in an unweighted graph?", options: ["Backtracking", "Dynamic Programming", "Breadth-First Search (BFS)", "Depth-First Search (DFS)"], answer: 2, },
        { id: "m1501-q4", question: "What is the primary role of the Backtracking pattern?", options: ["To traverse a graph", "To find all possible valid solutions to a problem", "To sort an array", "To compute range sums"], answer: 1, },
    ],
    "m-1601-final": [
        { id: "m1601-q1", question: "In a technical interview, what is the recommended first step when presented with a problem?", options: ["Start writing code immediately", "Jump to the optimal solution", "Ask clarifying questions and define constraints", "Analyze the time complexity"], answer: 2, },
        { id: "m1601-q2", question: "What is an 'Edge Case' in software testing?", options: ["A case involving graph edges", "An input that is near the minimum or maximum allowed values or boundaries", "A simple, standard test case", "The most common input received"], answer: 1, },
        { id: "m1601-q3", question: "When analyzing the space complexity of a recursive solution, what major overhead must be included?", options: ["The input array size", "The size of the output", "The recursion stack space", "The cache memory"], answer: 2, },
        { id: "m1601-q4", question: "What is the key to demonstrating competence during the coding phase of an interview?", options: ["Using the most obscure syntax", "Writing verbose comments for every line", "Clearly explaining your thought process and assumptions as you code", "Finishing in under 5 minutes"], answer: 2, },
    ],
};

/* -------------------- STATIC MODULE CONTENT (M-101 to M-1601) -------------------- */

const MODULE_M101_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-101", id: "m101-alg-def", title: "1.1 What is an Algorithm?", estimatedReadingTime: "5 min", content: (
            <>
                <p className="mb-4">
                    An **Algorithm** is simply a well-defined procedure or set of rules used to solve a specific problem or perform a computation. Think of it as a <span className="font-semibold text-blue-600 dark:text-blue-300">recipe for a computer</span>.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Key Characteristics:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Input:** Must take zero or more well-specified inputs.</li>
                    <li>**Output:** Must produce one or more outputs.</li>
                    <li>**Definiteness:** Each step must be precisely defined.</li>
                    <li>**Finiteness:** Must terminate after a finite number of steps.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-101", id: "m101-complexity", title: "1.2 Time and Space Complexity", estimatedReadingTime: "7 min", content: (
            <>
                <p className="mb-4">
                    Complexity analysis helps us estimate the performance of an algorithm based on the input size ($n$), not the hardware speed.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Time Complexity:** The amount of time an algorithm takes to run, typically counted by the number of basic operations (comparisons, assignments).</li>
                    <li>**Space Complexity:** The amount of memory an algorithm uses, excluding the space taken by the input itself. We focus on auxiliary space.</li>
                </ul>
                <div className="p-3 mt-4 rounded-md bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                        **Goal:** We seek solutions that scale well; often, that means aiming for time complexity of $O(n \log n)$ or better.
                    </p>
                </div>
            </>
        ),
    },
    {
        moduleId: "m-101", id: "m101-big-o", title: "1.3 Big O Notation", estimatedReadingTime: "8 min", content: (
            <>
                <p className="mb-4">
                    **Big O Notation** describes the worst-case scenario and provides an asymptotic upper bound on the time required by an algorithm. It focuses on how the runtime grows as the input size ($n$) approaches infinity.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Common Complexities:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**$O(1)$ (Constant):** The operation takes the same amount of time regardless of $n$. (e.g., Array Index Access)</li>
                    <li>**$O(\log n)$ (Logarithmic):** The time is reduced by half in each step. (e.g., Binary Search)</li>
                    <li>**$O(n)$ (Linear):** The time is proportional to $n$. (e.g., Linear Search)</li>
                    <li>**$O(n \log n)$ (Linearithmic):** Common for efficient sorting algorithms. (e.g., Merge Sort)</li>
                    <li>**$O(n^2)$ (Quadratic):** The time is proportional to the square of $n$. (e.g., Nested loops, Bubble Sort)</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-101", id: "m101-case-analysis", title: "1.4 Best, Average, Worst Case Analysis", estimatedReadingTime: "6 min", content: (
            <>
                <p className="mb-4">
                    Algorithms can perform differently depending on the input data:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Best Case ($\Omega$ - Omega):** The minimum time required for an algorithm to run.</li>
                    <li>**Worst Case ($O$ - Big O):** The maximum time required for an algorithm to run. This is what we typically focus on.</li>
                    <li>**Average Case ($\Theta$ - Theta):** The expected running time given a typical input distribution.</li>
                </ul>
                <div className="p-3 mt-4 rounded-md bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800">
                    <p className="font-medium text-blue-800 dark:text-blue-200">
                        **Example: Linear Search**
                        <br />
                        - **Best Case:** $O(1)$ (Element found at the first position).
                        <br />
                        - **Worst Case:** $O(n)$ (Element found at the last position or not found at all).
                    </p>
                </div>
            </>
        ),
    },
    {
        moduleId: "m-101", id: "m101-recurrence", title: "1.5 Recurrence Relations & Master Theorem", estimatedReadingTime: "9 min", content: (
            <>
                <p className="mb-4">
                    A **Recurrence Relation** is an equation that expresses the runtime $T(n)$ of a recursive algorithm in terms of the runtime on smaller inputs.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Master Theorem:</h4>
                <p>
                    The **Master Theorem** is a powerful tool to quickly solve recurrence relations of the form:
                    <br />
                    $T(n) = a T(n/b) + f(n)$
                </p>
               <ul className="list-disc ml-6 space-y-2">
    <li>$a &ge; 1$: Number of recursive subproblems.</li>
    <li>$b &gt; 1$: Factor by which subproblem size is reduced.</li>
    <li>$f(n)$: Cost of dividing and combining the subproblems.</li>
</ul>

                <div className="p-3 mt-4 rounded-md bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800">
                    <p className="font-medium text-green-800 dark:text-green-200">
                        **Example: Merge Sort**
                        <br />
                        $T(n) = 2T(n/2) + O(n)$. The Master Theorem quickly proves this complexity is $O(n \log n)$.
                    </p>
                </div>
            </>
        ),
    },
    {
        moduleId: "m-101", id: "m101-tips", title: "1.6 Tips for Writing Efficient Code", estimatedReadingTime: "6 min", content: (
            <>
                <p className="mb-4">
                    Efficiency starts with design:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Choose the Right Data Structure:** A Hash Map offers $O(1)$ lookups, whereas a Linked List requires $O(n)$. Choosing correctly is half the battle.</li>
                    <li>**Avoid Nested Loops:** A sure fire way to move from $O(n \log n)$ to $O(n^2)$ or worse.</li>
                    <li>**Pre-Compute:** Use memoization (DP/caching) to store results of expensive calculations.</li>
                    <li>**Use Pointers/Indices:** Manipulating pointers or indices directly (as in the Two-Pointer technique) is typically faster than array slicing or creating new data structures.</li>
                </ul>
            </>
        ),
    },
];

const MODULE_M201_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-201", id: "m201-array-basics", title: "2.1 Basics of Arrays", estimatedReadingTime: "5 min", content: (
            <>
                <p className="mb-4">
                    An **Array** is a collection of items stored at contiguous memory locations. The benefit of this contiguous storage is that every element can be accessed in constant time, $O(1)$, using its index.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Fixed vs. Dynamic:** Some languages use fixed-size arrays; others (like Python lists or Java ArrayLists) use dynamic arrays that resize when full, incurring an amortized $O(1)$ append cost.</li>
                    <li>**Common Operations:** Access ($O(1)$), Search ($O(n)$), Insertion/Deletion at end (amortized $O(1)$), Insertion/Deletion in middle ($O(n)$).</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-201", id: "m201-two-pointer", title: "2.2 Two-Pointer Technique", estimatedReadingTime: "8 min", content: (
            <>
                <p className="mb-4">
                    The **Two-Pointer Technique** involves using two pointers (indices) to iterate through an array or list. It's often used to achieve $O(n)$ time complexity in problems that might otherwise require $O(n^2)$.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Pointer Configurations:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Opposite Ends:** Pointers start at the beginning (left) and the end (right) and move inward. (e.g., Finding Two Sum in a sorted array).</li>
                    <li>**Same End (Fast/Slow or Runner/Walker):** Both pointers start at the same location but move at different speeds or intervals. (e.g., Removing duplicates from a sorted array).</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-201", id: "m201-sliding-window", title: "2.3 Sliding Window Technique", estimatedReadingTime: "10 min", content: (
            <>
                <p className="mb-4">
                    The **Sliding Window** technique is used on arrays or strings to find a maximum, minimum, or target value in a contiguous subarray or substring of a fixed or variable size.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">How it Works:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>Two pointers (`left` and `right`) define the current window.</li>
                    <li>The `right` pointer expands the window one step at a time.</li>
                    <li>When the window condition is violated (e.g., sum exceeds max), the `left` pointer contracts the window until the condition is met again.</li>
                </ul>
                <div className="p-3 mt-4 rounded-md bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200">
                        **Benefit:** This approach converts an $O(n^2)$ brute-force check of all substrings into a linear $O(n)$ traversal.
                    </p>
                </div>
            </>
        ),
    },
    {
        moduleId: "m-201", id: "m201-prefix-sum", title: "2.4 Prefix Sum and Difference Array", estimatedReadingTime: "7 min", content: (
            <>
                <p className="mb-4">
                    A **Prefix Sum** array (or cumulative sum) is used for efficient query of the sum of a range of elements.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Construction:** `P[i]` stores the sum of all elements from index 0 up to $i$. ($O(n)$ time).</li>
                    <li>**Query:** The sum of a subarray from index $i$ to $j$ is calculated as $P[j] - P[i-1]$ ($O(1)$ time).</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Difference Array:</h4>
                <p>
                    The **Difference Array** is an inverse of the prefix sum, used to perform fast multiple range update operations in $O(1)$ per update, followed by a final $O(n)$ reconstruction.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-201", id: "m201-problems", title: "2.5 Common Interview Problems", estimatedReadingTime: "12 min", content: (
            <>
                <h4 className="text-xl font-semibold mb-3">Key Problem Types:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Maximum Subarray (Kadane’s):** Dynamic Programming approach to find the maximum sum of a contiguous subarray in $O(n)$.</li>
                    <li>**Merge Intervals:** Requires sorting the intervals first, then iterating once to merge overlapping ranges.</li>
                    <li>**Rotate Array:** Often solved in-place using the reverse technique to achieve $O(1)$ space complexity.</li>
                    <li>**Longest Substring Without Repeating Characters:** Classic application of the **Sliding Window** technique with a Hash Map to track character frequency.</li>
                </ul>
            </>
        ),
    },
];

const MODULE_M301_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-301", id: "m301-recursion-intro", title: "3.1 What is Recursion?", estimatedReadingTime: "5 min", content: (
            <>
                <p className="mb-4">
                    **Recursion** is the process where a function calls itself, either directly or indirectly. It's often used to solve problems that can be broken down into smaller, similar subproblems.
                </p>
                <div className="p-3 mt-4 rounded-md bg-green-100 dark:bg-green-900/50 border border-green-200 dark:border-green-800">
                    <p className="font-medium text-green-800 dark:text-green-200">
                        **Analogy:** If you want to know the sum of a stack of papers, you ask the person below you for the sum of the remaining stack, and then add your paper's value.
                    </p>
                </div>
            </>
        ),
    },
    {
        moduleId: "m-301", id: "m301-base-case", title: "3.2 Base Case and Recursive Case", estimatedReadingTime: "7 min", content: (
            <>
                <p className="mb-4">
                    Every recursive solution must have two parts:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Base Case:** The termination condition that does not involve a recursive call. This is essential to prevent infinite recursion and a **Stack Overflow**.</li>
                    <li>**Recursive Case:** The step where the function calls itself on a smaller input, moving the problem closer to the base case.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">The Call Stack:</h4>
                <p>
                    Each recursive call pushes a new frame onto the **Call Stack**. If the base case is not reached, the stack will eventually run out of memory.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-301", id: "m301-recurrence-tree", title: "3.3 Recurrence Tree Method", estimatedReadingTime: "8 min", content: (
            <>
                <p className="mb-4">
                    The **Recurrence Tree** method is a visual technique for solving recurrence relations.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>You draw a tree where each node represents the cost ($f(n)$) of a single subproblem.</li>
                    <li>The total cost of the algorithm is the sum of the costs of all nodes (all levels) in the tree.</li>
                    <li>This method helps you identify the pattern of work done at each level and the height of the recursion.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-301", id: "m301-backtracking-intro", title: "3.4 Backtracking Introduction", estimatedReadingTime: "6 min", content: (
            <>
                <p className="mb-4">
                    **Backtracking** is an algorithmic technique for solving problems recursively by trying to build a solution incrementally, one piece at a time.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>If a partial solution can be completed, great! Continue building.</li>
                    <li>If a partial solution cannot be completed, "backtrack" (undo the last step) and try a different path.</li>
                    <li>It's essentially a depth-first search (DFS) over a state space tree.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-301", id: "m301-backtracking-problems", title: "3.5 Common Backtracking Problems", estimatedReadingTime: "12 min", content: (
            <>
                <h4 className="text-xl font-semibold mb-3">Key Backtracking Applications:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**N-Queens Problem:** Place $N$ queens on an $N \times N$ chessboard such that no two queens attack each other.</li>
                    <li>**Subset Generation:** Finding all possible subsets (Power Set) of a given set.</li>
                    <li>**Permutations & Combinations:** Finding all unique orderings (permutations) or selections (combinations) of a set of elements.</li>
                    <li>**Sudoku Solver:** Tries placing numbers $1-9$ in empty cells and backtracks when a placement violates Sudoku rules.</li>
                </ul>
            </>
        ),
    },
];

const MODULE_M401_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-401", id: "m401-search", title: "4.1 Linear & Binary Search", estimatedReadingTime: "6 min", content: (
            <>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Linear Search:** Checks every element sequentially. Simple, works on unsorted data, $O(n)$ complexity.</li>
                    <li>**Binary Search:** Requires the data to be **sorted**. Checks the middle element and eliminates half of the remaining search space in each step. Highly efficient, $O(\log n)$ complexity.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Key Principle:</h4>
                <p>
                    Binary Search is the first tool you should reach for when working with any sorted data structure.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-401", id: "m401-rotated-search", title: "4.2 Search in Rotated Sorted Array", estimatedReadingTime: "8 min", content: (
            <>
                <p className="mb-4">
                    This is a classic interview problem that modifies Binary Search. The array is sorted but has been rotated (e.g., $[4, 5, 6, 7, 0, 1, 2]$).
                </p>
                <p>
                    The key is to use the midpoint to determine which half is still fully sorted. You can then decide whether the target lies in the sorted half or the rotated half, continuing the Binary Search in $O(\log n)$ time.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-401", id: "m401-merge-sort", title: "4.3 Merge Sort", estimatedReadingTime: "7 min", content: (
            <>
                <p className="mb-4">
                    **Merge Sort** is a Divide and Conquer algorithm. It continuously splits the array into halves until it gets individual elements, and then merges those halves in a sorted manner.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Time Complexity:** $O(n \log n)$ (in all cases: best, average, worst).</li>
                    <li>**Stability:** It is a **stable** sort.</li>
                    <li>**Space Complexity:** $O(n)$ auxiliary space is required for the merging process.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-401", id: "m401-quick-sort", title: "4.4 Quick Sort", estimatedReadingTime: "8 min", content: (
            <>
                <p className="mb-4">
                    **Quick Sort** is another Divide and Conquer algorithm that uses a **pivot** element to partition the array. All elements less than the pivot come before it, and all elements greater come after it.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Time Complexity:** Average Case $O(n \log n)$. **Worst Case** $O(n^2)$ (occurs if the pivot selection is consistently poor, e.g., always picking the smallest element).</li>
                    <li>**In-Place:** It is typically implemented in-place, meaning it has low auxiliary space complexity ($O(\log n)$ for the recursion stack).</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-401", id: "m401-non-comparison", title: "4.5 Counting Sort, Radix Sort", estimatedReadingTime: "6 min", content: (
            <>
                <p className="mb-4">
                    These are **Non-Comparison** based sorting algorithms that can achieve $O(n)$ time complexity under specific constraints.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Counting Sort:** Efficient for small, non-negative integer inputs. It counts the frequency of each element and uses that count to place them in the correct output order.</li>
                    <li>**Radix Sort:** Sorts integers by processing individual digits. It relies on a stable sorting algorithm (like Counting Sort) for each digit pass.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-401", id: "m401-heap-sort", title: "4.6 Heap Sort", estimatedReadingTime: "5 min", content: (
            <>
                <p className="mb-4">
                    **Heap Sort** is a comparison-based sorting technique that uses the **Binary Heap** data structure (covered in M-801).
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Mechanism:** It first builds a Max-Heap from the input array, then repeatedly extracts the maximum element (root) and places it at the end of the array.</li>
                    <li>**Complexity:** $O(n \log n)$ time complexity and $O(1)$ auxiliary space, making it a powerful choice when memory is constrained.</li>
                </ul>
            </>
        ),
    },
];

const MODULE_M501_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-501", id: "m501-singly-doubly", title: "5.1 Singly vs Doubly Linked List", estimatedReadingTime: "6 min", content: (
            <>
                <p className="mb-4">
                    A **Linked List** is a linear data structure where elements are not stored at contiguous memory locations.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Singly Linked List:** Each node contains data and a pointer to the **next** node. Traversal is only forward.</li>
                    <li>**Doubly Linked List:** Each node contains data, a pointer to the **next** node, and a pointer to the **previous** node. Allows bi-directional traversal, but uses more memory per node.</li>
                </ul>
                <p className="mt-4">
                    Common operations like insertion/deletion at the head are $O(1)$, but access and search remain $O(n)$.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-501", id: "m501-fast-slow", title: "5.2 Slow & Fast Pointer Technique", estimatedReadingTime: "7 min", content: (
            <>
                <p className="mb-4">
                    Also known as the **Tortoise and Hare** algorithm, this technique uses two pointers that traverse the list at different speeds (e.g., slow moves one step, fast moves two steps).
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Key Uses:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Finding the Middle Element:** When the fast pointer reaches the end, the slow pointer is at the middle.</li>
                    <li>**Cycle Detection:** If there is a cycle, the fast pointer will eventually meet the slow pointer.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-501", id: "m501-cycles", title: "5.3 Detect and Remove Cycles (Floyd’s Algorithm)", estimatedReadingTime: "9 min", content: (
            <>
                <p className="mb-4">
                    **Floyd's Cycle Detection Algorithm** uses the Slow & Fast Pointer technique to determine if a cycle exists.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Removing the Cycle:</h4>
                <p>
                    If a meeting point is found:
                    <br />
                    1. Reset one pointer (e.g., the slow pointer) to the head of the list.
                    <br />
                    2. Move both the reset pointer and the meeting point pointer one step at a time.
                    <br />
                    3. The point where they meet is the start of the cycle. Break the cycle by setting the *previous* node's next pointer to `NULL`.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-501", id: "m501-reverse", title: "5.4 Reverse a Linked List", estimatedReadingTime: "6 min", content: (
            <>
                <p className="mb-4">
                    Reversing a Linked List is a fundamental operation, achieved iteratively using three pointers: `previous`, `current`, and `next_temp`.
                </p>
                <p className="mt-4">
                    In a single pass ($O(n)$), you update the `current` node's `next` pointer to point to the `previous` node, effectively flipping the direction of the links. The `next_temp` is necessary to temporarily save the rest of the list before breaking the original link.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-501", id: "m501-lru", title: "5.7 LRU Cache (Linked List + HashMap)", estimatedReadingTime: "10 min", content: (
            <>
                <p className="mb-4">
                    An **LRU (Least Recently Used) Cache** evicts the item that has been used the longest time ago. It must achieve $O(1)$ time complexity for both `get` and `put` operations.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Data Structure Combo:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Hash Map:** Stores the key-value pairs and maps the key to the corresponding node in the Linked List ($O(1)$ lookup).</li>
                    <li>**Doubly Linked List:** Maintains the usage order. The most recently used node is always at the head, and the least recently used node is at the tail (easy $O(1)$ removal).</li>
                </ul>
            </>
        ),
    },
];

const MODULE_M601_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-601", id: "m601-stack-impl", title: "6.1 Stack Implementation", estimatedReadingTime: "5 min", content: (
            <>
                <p className="mb-4">
                    A **Stack** is a LIFO (Last In, First Out) data structure. Think of a stack of plates—you can only add or remove from the top.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Operations:** `push` (add to top), `pop` (remove from top), `peek` (view top element).</li>
                    <li>**Implementation:** Stacks can be efficiently implemented using an array or a linked list, both allowing $O(1)$ complexity for core operations.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-601", id: "m601-queue-impl", title: "6.2 Queue Implementation", estimatedReadingTime: "5 min", content: (
            <>
                <p className="mb-4">
                    A **Queue** is a FIFO (First In, First Out) data structure. Think of a line at a store—the first person in is the first person served.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Operations:** `enqueue` (add to back/rear), `dequeue` (remove from front).</li>
                    <li>**Implementation:** Often implemented using a circular array (to reuse space) or a linked list, achieving $O(1)$ complexity for core operations.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-601", id: "m601-monotonic-stack", title: "6.3 Monotonic Stack Pattern", estimatedReadingTime: "10 min", content: (
            <>
                <p className="mb-4">
                    A **Monotonic Stack** is a stack where the elements are kept in a strictly increasing or strictly decreasing order.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Key Application:</h4>
                <p>
                    This pattern is used to solve problems that involve finding the nearest element (left or right) that is greater than or less than the current element in $O(n)$ time. The $O(n)$ efficiency is achieved because each element is pushed and popped exactly once.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-601", id: "m601-min-stack", title: "6.4 Min Stack and Max Stack", estimatedReadingTime: "8 min", content: (
            <>
                <p className="mb-4">
                    The **Min Stack** problem requires you to implement a stack that supports `push`, `pop`, `top`, and a `getMin` operation, all in $O(1)$ time.
                </p>
                <p className="mt-4">
                    This is typically solved by using **two stacks**: one for the data and a second auxiliary stack to track the minimum element seen so far at each level of the main stack.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-601", id: "m601-sliding-window-max", title: "6.6 Sliding Window Maximum", estimatedReadingTime: "12 min", content: (
            <>
                <p className="mb-4">
                    The **Sliding Window Maximum** problem asks you to find the maximum element in every contiguous subarray (window) of size $k$.
                </p>
                <p className="mt-4">
                    The optimal solution uses a **Deque (Double-Ended Queue)**, often called a Monotonic Deque, to store indices of elements in the current window in descending order. This allows you to find the maximum in $O(1)$ time for each window, leading to an overall $O(n)$ solution.
                </p>
            </>
        ),
    },
];

const MODULE_M701_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-701", id: "m701-terminologies", title: "7.1 Tree Terminologies", estimatedReadingTime: "6 min", content: (
            <>
                <p className="mb-4">
                    A **Tree** is a non-linear hierarchical data structure.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Root:** The top-most node (only node with no parent).</li>
                    <li>**Parent/Child:** Direct connections.</li>
                    <li>**Leaf:** A node with no children.</li>
                    <li>**Depth/Height:** Depth is distance from root; height is distance from the deepest leaf.</li>
                    <li>**Binary Tree:** A tree where each node has at most two children.</li>
                    <li>**Binary Search Tree (BST):** A Binary Tree where for every node, all values in the left subtree are smaller, and all values in the right subtree are larger.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-701", id: "m701-traversals", title: "7.2 Binary Tree Traversals (DFS, BFS)", estimatedReadingTime: "8 min", content: (
            <>
                <p className="mb-4">
                    Tree traversal methods determine the order in which nodes are visited.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**DFS (Depth-First Search):** Explores as far as possible along each branch before backtracking. Implemented recursively or iteratively using a **Stack**.</li>
                    <li>**BFS (Breadth-First Search) / Level Order Traversal:** Explores all neighbors at the present depth level before moving to the next level. Implemented iteratively using a **Queue**.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-701", id: "m701-dfs-order", title: "7.3 Preorder, Inorder, Postorder", estimatedReadingTime: "7 min", content: (
            <>
                <p className="mb-4">
                    These are the three fundamental DFS orders:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Preorder:** Root $\rightarrow$ Left $\rightarrow$ Right (Used to create a copy of the tree).</li>
                    <li>**Inorder:** Left $\rightarrow$ Root $\rightarrow$ Right (Yields the **sorted** list of elements in a BST).</li>
                    <li>**Postorder:** Left $\rightarrow$ Right $\rightarrow$ Root (Used to delete the tree or express polish notation).</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-701", id: "m701-bst-ops", title: "7.6 Binary Search Tree Operations", estimatedReadingTime: "8 min", content: (
            <>
                <p className="mb-4">
                    Due to the ordering property, key operations in a balanced BST are highly efficient:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Search:** Follow the path based on comparison with the current node. $O(\log n)$ average time.</li>
                    <li>**Insertion:** Search for the correct insertion point (a leaf node) and link the new node. $O(\log n)$ average time.</li>
                    <li>**Deletion:** The most complex, involving replacing the node with its in-order successor or predecessor to maintain the BST property. $O(\log n)$ average time.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-701", id: "m701-lca", title: "7.7 Lowest Common Ancestor (LCA)", estimatedReadingTime: "9 min", content: (
            <>
                <p className="mb-4">
                    The **LCA** of two nodes $p$ and $q$ is the deepest node that is an ancestor of both $p$ and $q$.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">LCA in a BST:</h4>
                <p>
                    If the tree is a BST, the LCA is the first node found during a top-down traversal that satisfies one of three conditions:
                    <br />
                    1. The node equals $p$ or $q$.
                    <br />
                    2. $p$ is in the left subtree and $q$ is in the right subtree.
                    <br />
                    3. $q$ is in the left subtree and $p$ is in the right subtree.
                </p>
            </>
        ),
    },
];

const MODULE_M801_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-801", id: "m801-intro", title: "8.1 Introduction to Heaps", estimatedReadingTime: "6 min", content: (
            <>
                <p className="mb-4">
                    A **Heap** is a complete binary tree that satisfies the **Heap Property**. It is typically implemented using an array for space efficiency.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Max-Heap:** For every node $i$, the value of $i$ is greater than or equal to the values of its children. (Root is the maximum element)</li>
                    <li>**Min-Heap:** For every node $i$, the value of $i$ is less than or equal to the values of its children. (Root is the minimum element)</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-801", id: "m801-heapify", title: "8.3 Heapify and Build Heap", estimatedReadingTime: "7 min", content: (
            <>
                <p className="mb-4">
                    **Heapify** is the process of restoring the heap property starting from a given node. It runs in $O(\log n)$ time.
                </p>
                <p className="mt-4">
                    **Build Heap** is the process of converting an arbitrary array into a heap. It does this by running the `heapify` operation on all non-leaf nodes, starting from the bottom. Although it seems like an $O(n \log n)$ operation, the time complexity can be proven to be $O(n)$.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-801", id: "m801-kth", title: "8.4 Kth Largest/Smallest Element", estimatedReadingTime: "9 min", content: (
            <>
                <p className="mb-4">
                    Finding the $k^{}$ largest or smallest element in an array is a classic problem. Heaps provide an efficient $O(n \log k)$ solution.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Strategy:</h4>
                <p>
                    To find the $k^{}$ largest element, use a **Min-Heap of size $K$**.
                    <br />
                    1. Iterate through the elements.
                    <br />
                    2. Insert the element into the Min-Heap.
                    <br />
                    3. If the heap size exceeds $K$, remove the minimum element (the root).
                    <br />
                    The root of the final heap is the $k^{}$ largest element.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-801", id: "m801-merge-k", title: "8.5 Merge K Sorted Lists", estimatedReadingTime: "8 min", content: (
            <>
                <p className="mb-4">
                    This problem requires merging $K$ sorted linked lists or arrays into a single sorted list.
                </p>
                <p className="mt-4">
                    The optimal solution uses a **Min-Heap**.
                    <br />
                    1. Insert the first element from all $K$ lists into the Min-Heap.
                    <br />
                    2. Repeatedly extract the minimum element (root) from the heap and append it to the result list.
                    <br />
                    3. After extraction, insert the *next* element from the list the extracted element belonged to.
                    <br />
                    This results in a time complexity of $O(N \log K)$, where $N$ is the total number of elements.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-801", id: "m801-median", title: "8.7 Median from Data Stream", estimatedReadingTime: "10 min", content: (
            <>
                <p className="mb-4">
                    This advanced problem requires tracking the median of a sequence of numbers as they arrive.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Two-Heap Approach:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Max-Heap (Lower Half):** Stores the smaller half of the numbers.</li>
                    <li>**Min-Heap (Upper Half):** Stores the larger half of the numbers.</li>
                    <li>**Balancing:** Ensure the sizes of the two heaps are either equal or differ by at most one.</li>
                    <li>The median is always the root of the larger heap (or the average of the two roots). This allows $O(\log n)$ insertion and $O(1)$ median retrieval.</li>
                </ul>
            </>
        ),
    },
];

const MODULE_M901_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-901", id: "m901-hash", title: "9.1 Hash Functions and Collisions", estimatedReadingTime: "7 min", content: (
            <>
                <p className="mb-4">
                    **Hashing** is the process of mapping data of arbitrary size (key) to a fixed-size value (hash value) using a **Hash Function**.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Ideal Hash Function:** Deterministic, fast to compute, and distributes keys uniformly.</li>
                    <li>**Collision:** Occurs when two different keys map to the same hash value/index.</li>
                    <li>**Collision Resolution:** Methods like **Chaining** (using a Linked List at the bucket) or **Open Addressing** (probing for the next open slot) are used.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-901", id: "m901-hashmap-set", title: "9.2 HashMap vs HashSet", estimatedReadingTime: "6 min", content: (
            <>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**HashMap (Dictionary):** Stores elements as Key-Value pairs. Used when you need fast lookup and retrieval of a corresponding value (e.g., retrieving a user object by ID).</li>
                    <li>**HashSet:** Stores only unique elements (Keys). Used when you only need to check for the presence or absence of an element (e.g., tracking visited nodes in a graph).</li>
                </ul>
                <p className="mt-4">
                    Both achieve average-case $O(1)$ complexity for insertion, deletion, and lookup.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-901", id: "m901-two-sum", title: "9.4 Two Sum and Subarray Sum Problems", estimatedReadingTime: "9 min", content: (
            <>
                <p className="mb-4">
                    The **Two Sum** problem (finding two numbers that add up to a target) is the canonical use case for a Hash Map.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Optimal $O(n)$ Solution:</h4>
                <p>
                    1. Iterate through the array. For each number, calculate the `complement` needed (target - current number).
                    <br />
                    2. Check if the `complement` exists in the Hash Map.
                    <br />
                    3. If yes, you found the pair. If no, add the current number to the Hash Map.
                </p>
                <p className="mt-4">
                    Hash Maps also solve the **Subarray Sum Equals K** problem by storing the running prefix sums and checking for the required difference.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-901", id: "m901-longest-consecutive", title: "9.5 Longest Consecutive Sequence", estimatedReadingTime: "8 min", content: (
            <>
                <p className="mb-4">
                    This problem requires finding the length of the longest sequence of consecutive elements in an unsorted array (e.g., $[100, 4, 200, 1, 3, 2]$ $\rightarrow$ length 4, which is $1, 2, 3, 4$).
                </p>
                <p className="mt-4">
                    The optimal $O(n)$ solution involves using a **Hash Set** to store all numbers. Then, iterate through the numbers and only start counting a sequence if the current number is the *start* of a sequence (i.e., its predecessor, `num - 1`, is *not* in the Hash Set). This prevents redundant counting.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-901", id: "m901-anagrams", title: "9.6 Group Anagrams", estimatedReadingTime: "6 min", content: (
            <>
                <p className="mb-4">
                    **Group Anagrams** requires grouping words that are anagrams of each other (contain the same characters with the same frequency, e.g., 'eat', 'tea', 'ate').
                </p>
                <p className="mt-4">
                    The solution uses a **Hash Map** where the key is the **canonical form** of the word (e.g., the word sorted alphabetically: 'aet'). The value is a list of all original words that map to that canonical key.
                </p>
            </>
        ),
    },
];

const MODULE_M1001_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-1001", id: "m1001-graph-rep", title: "10.1 Graph Representation (Adjacency List/Matrix)", estimatedReadingTime: "7 min", content: (
            <>
                <p className="mb-4">
                    A **Graph** consists of a set of vertices (nodes) and a set of edges (connections).
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Adjacency List:** An array or map where each index/key represents a node, and the value is a list of its neighboring nodes. Best for **sparse graphs** (fewer edges), offering $O(V+E)$ space.</li>
                    <li>**Adjacency Matrix:** A $V \times V$ 2D array where `M[i][j]` is 1 (or the weight) if an edge exists between node $i$ and node $j$. Best for **dense graphs** (many edges), offering $O(V^2)$ space.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1001", id: "m1001-bfs-dfs", title: "10.2 Breadth-First Search (BFS) & 10.3 Depth-First Search (DFS)", estimatedReadingTime: "10 min", content: (
            <>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**BFS:** Searches level by level. Used to find the **shortest path in unweighted graphs** and for Level Order Tree Traversal. Implemented using a **Queue**.</li>
                    <li>**DFS:** Searches deep into the graph along one path first. Used for cycle detection, topological sorting, and finding connected components. Implemented using **Recursion** or a **Stack**.</li>
                </ul>
                <p className="mt-4">
                    Both typically run in $O(V+E)$ time complexity.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-1001", id: "m1001-topological", title: "10.5 Topological Sorting", estimatedReadingTime: "8 min", content: (
            <>
                <p className="mb-4">
                    **Topological Sort** is a linear ordering of vertices in a **Directed Acyclic Graph (DAG)** such that for every directed edge from vertex $u$ to vertex $v$, vertex $u$ comes before $v$ in the ordering.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Applications:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>Scheduling dependencies (e.g., class prerequisites, build process execution).</li>
                    <li>Can be solved using DFS or **Kahn's Algorithm** (based on in-degrees) in $O(V+E)$ time.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1001", id: "m1001-dijkstra", title: "10.6 Shortest Path Algorithms (Dijkstra’s)", estimatedReadingTime: "12 min", content: (
            <>
                <p className="mb-4">
                    **Dijkstra's Algorithm** finds the shortest paths from a single source node to all other nodes in a graph with **non-negative** edge weights.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Mechanism:** Uses a **Min-Heap** to repeatedly extract the unvisited node with the smallest known distance from the source.</li>
                    <li>**Time Complexity:** $O(E + V \log V)$ when implemented with a Min-Heap.</li>
                    <li>**Bellman-Ford:** Used for graphs that *can* contain **negative** edge weights, but runs slower at $O(V \cdot E)$.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1001", id: "m1001-mst", title: "10.7 Minimum Spanning Tree (Prim’s & Kruskal’s)", estimatedReadingTime: "9 min", content: (
            <>
                <p className="mb-4">
                    A **Minimum Spanning Tree (MST)** is a subset of the edges of a connected, edge-weighted undirected graph that connects all the vertices together, without any cycles and with the minimum possible total edge weight.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Prim's Algorithm:** Builds the tree by adding the cheapest edge to the part of the tree already built. Uses a **Min-Heap**.</li>
                    <li>**Kruskal's Algorithm:** Builds the tree by iterating through all edges in sorted order and adding the edge if it does not form a cycle. Uses the **Union-Find** data structure.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1001", id: "m1001-union-find", title: "10.8 Union-Find (Disjoint Set Union)", estimatedReadingTime: "8 min", content: (
            <>
                <p className="mb-4">
                    The **Union-Find** (or Disjoint Set Union) data structure efficiently manages a collection of disjoint sets.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Core Operations:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Find:** Determines which set an element belongs to (by finding the representative/root of that set).</li>
                    <li>**Union:** Merges two sets into a single set.</li>
                </ul>
                <p className="mt-4">
                    With optimizations like **Path Compression** (for Find) and **Union by Rank/Size**, these operations achieve a near-constant time complexity, $O(\alpha(n))$ (inverse Ackermann function). Key in Kruskal's algorithm and network connectivity problems.
                </p>
            </>
        ),
    },
];

const MODULE_M1101_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-1101", id: "m1101-dp-intro", title: "11.1 Introduction to DP", estimatedReadingTime: "8 min", content: (
            <>
                <p className="mb-4">
                    **Dynamic Programming (DP)** is an optimization technique for solving complex problems by breaking them down into simpler subproblems and storing the results of those subproblems.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Two Key Properties:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Optimal Substructure:** An optimal solution can be constructed from optimal solutions to its subproblems.</li>
                    <li>**Overlapping Subproblems:** The same subproblems are encountered repeatedly. DP saves time by solving each subproblem only once.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1101", id: "m1101-approaches", title: "11.2 Recursion to Memoization to Tabulation", estimatedReadingTime: "10 min", content: (
            <>
                <p className="mb-4">
                    DP problems are usually solved using one of two primary approaches:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Top-Down (Memoization):** Starts with the full problem and uses recursion. Stores results of subproblems in a data structure (e.g., Hash Map or array) as they are calculated to avoid re-computation.</li>
                    <li>**Bottom-Up (Tabulation):** Iteratively solves the smallest subproblems first, storing results in a table (DP array), and then uses those results to solve larger subproblems until the final solution is reached. Avoids recursion overhead.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1101", id: "m1101-knapsack", title: "11.3 Common DP Patterns (Knapsack, Subsequence)", estimatedReadingTime: "12 min", content: (
            <>
                <h4 className="text-xl font-semibold mb-3">Core DP Problems:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**0/1 Knapsack:** Given weights and values, maximize value within a capacity constraint. Uses a 2D DP table.</li>
                    <li>**Subset Sum/Partition Equal Subset Sum:** Determining if a subset of numbers sums to a target. Uses a boolean DP table.</li>
                    <li>**Longest Common Subsequence (LCS) / Edit Distance:** Involves comparing two strings, using a 2D DP table where $DP[i][j]$ stores the result for prefixes of length $i$ and $j$.</li>
                    <li>**Coin Change:** Finding the minimum number of coins to reach a target sum. Often involves 1D DP table.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1101", id: "m1101-optimization", title: "11.4 State Transition & Space Optimization", estimatedReadingTime: "7 min", content: (
            <>
                <p className="mb-4">
                    The **State Transition Equation** is the heart of a DP solution—it mathematically defines how the solution for a larger problem is derived from smaller problems.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Space Optimization:</h4>
                <p>
                    For many 2D DP problems (like LCS or Knapsack), the current state $DP[i]$ often only depends on the previous state $DP[i-1]$. In such cases, the 2D DP table can be reduced to a 1D array, reducing space complexity from $O(n \cdot m)$ to $O(m)$ or $O(n)$.
                </p>
            </>
        ),
    },
];

const MODULE_M1201_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-1201", id: "m1201-intro", title: "12.1 Introduction to Greedy Strategy", estimatedReadingTime: "7 min", content: (
            <>
                <p className="mb-4">
                    A **Greedy Algorithm** builds a solution piece by piece, always choosing the option that looks best at the moment (the **locally optimal choice**). It hopes that this sequence of locally optimal choices leads to a **globally optimal solution**.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">When to Use:</h4>
                <p>
                    Greedy algorithms are generally much faster than DP ($O(n)$ or $O(n \log n)$ vs $O(n^2)$), but they only work for problems that possess the **Greedy Choice Property** (a global optimum can be reached by making local optimums).
                </p>
            </>
        ),
    },
    {
        moduleId: "m-1201", id: "m1201-activity", title: "12.2 Activity Selection Problem", estimatedReadingTime: "8 min", content: (
            <>
                <p className="mb-4">
                    Given a set of activities, each with a start time and finish time, find the maximum number of non-overlapping activities that can be performed.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Greedy Solution:</h4>
                <p>
                    1. **Sort** all activities by their **finish time**.
                    <br />
                    2. Select the first activity (it finishes earliest).
                    <br />
                    3. Iterate through the rest, selecting the next activity whose start time is greater than or equal to the selected activity's finish time.
                </p>
                <p className="mt-4">
                    Sorting takes $O(n \log n)$, and the traversal takes $O(n)$, making the total time complexity $O(n \log n)$.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-1201", id: "m1201-knapsack", title: "12.4 Fractional Knapsack", estimatedReadingTime: "7 min", content: (
            <>
                <p className="mb-4">
                    In the **Fractional Knapsack** problem, you can take fractions of items.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Greedy Solution:</h4>
                <p>
                    1. Calculate the **value-per-weight ratio** for every item.
                    <br />
                    2. Sort the items in **descending** order of this ratio.
                    <br />
                    3. Iterate through the sorted list, taking the whole item if possible, or taking a fraction until the knapsack capacity is full.
                </p>
                <p className="mt-4">
                    Because we can take fractions, the best local choice (highest value-per-weight) always leads to the best global solution.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-1201", id: "m1201-mst", title: "12.6 Minimum Spanning Tree (as Greedy)", estimatedReadingTime: "6 min", content: (
            <>
                <p className="mb-4">
                    The two most common MST algorithms, Prim's and Kruskal's, are both based on the Greedy paradigm.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Kruskal's:** The greedy choice is to pick the cheapest edge in the entire graph that does not form a cycle.</li>
                    <li>**Prim's:** The greedy choice is to pick the cheapest edge connected to the set of nodes already in the MST.</li>
                </ul>
                <p className="mt-4">
                    Both work because adding a locally cheapest edge in a weighted graph can never prevent the formation of a globally minimum spanning tree.
                </p>
            </>
        ),
    },
];

const MODULE_M1301_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-1301", id: "m1301-binary", title: "13.1 Binary Representation Basics", estimatedReadingTime: "5 min", content: (
            <>
                <p className="mb-4">
                    All data in a computer is ultimately stored in **binary** (0s and 1s). Bit manipulation involves operating directly on these bits, leading to extremely fast, low-level operations.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Example:** The number 5 is represented as $101_2$ (where the subscript 2 indicates base 2).</li>
                    <li>**Bitwise Operations** are typically $O(1)$ complexity, as they are single CPU instructions.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1301", id: "m1301-ops", title: "13.2 Common Bit Operations (AND, OR, XOR)", estimatedReadingTime: "8 min", content: (
            <>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**AND (`&`):** Used to **clear** bits or to **check** if a specific bit is set (e.g., `num & 1` checks if a number is odd).</li>
                    <li>**OR (`|`):** Used to **set** (force to 1) a specific bit.</li>
                    {/* FIX APPLIED: Replaced A ⊕ A = 0 with plain text to avoid the previous error, using ^ for XOR */}
                    <li>**XOR (`^`):** Used to **flip** (toggle) a specific bit. The most important property: A ^ A = 0 and A ^ 0 = A.</li>
                    {/* FIX APPLIED: Escaped < and > inside {} for JSX safety */}
                    <li>**Shift Operators:** Left shift {`(\u003c\u003c)`} multiplies by 2; Right shift {`(\u003e\u003e)`} divides by 2.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1301", id: "m1301-count-set", title: "13.3 Counting Set Bits", estimatedReadingTime: "6 min", content: (
            <>
                <p className="mb-4">
                    Counting the number of '1's (set bits) in the binary representation of an integer.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Brian Kernighan's Algorithm:</h4>
                <p>
                    This is the fastest trick:
                    <br />
                    The expression `n & (n-1)` clears the least significant set bit (the rightmost 1) of $n$.
                    <br />
                  <p>
  By repeatedly performing this operation and counting how many times it runs until n becomes 0,
  you efficiently count the set bits in O(number of set bits).
</p>

                </p>
            </>
        ),
    },
    // The previous error was here (13.5), caused by unescaped $ and math notation:
    {
        moduleId: "m-1301", id: "m1301-single-num", title: "13.5 Single Number Problem", estimatedReadingTime: "7 min", content: (
            <>
                <p className="mb-4">
                    Given an array where every element appears twice except for one, find that single element.
                </p>
                <p className="mt-4">
                    **Solution:** Use the **XOR** operator.
                    <br />
                    Since A XOR A = 0 and A XOR 0 = A, XORing all elements in the array will result in the unique single number, as all duplicate pairs will cancel each other out to zero.
                </p>
            </>
        ),
    },
    // The second error was here (13.6), caused by unescaped $ and math notation:
    {
        moduleId: "m-1301", id: "m1301-bitmasking", title: "13.6 Bitmasking in Subset Problems", estimatedReadingTime: "8 min", content: (
            <>
                <p className="mb-4">
                    **Bitmasking** is a technique used to represent a subset of a set using an integer's binary digits.
                </p>
                <p className="mt-4">
                    For a set of size N, there are 2ᴺ possible subsets. These can be represented by integers from 0 to 2ᴺ - 1.
                    <br />
                    Example: If N=3, the integer 5 (which is 101 in binary) represents the subset containing the first and third elements (index 0 and 2). This is often used in DP or combinatorial problems.
                </p>
            </>
        ),
    },
];

const MODULE_M1401_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-1401", id: "m1401-divide-conquer", title: "14.1 Divide and Conquer Strategy", estimatedReadingTime: "6 min", content: (
            <>
                <p className="mb-4">
                    **Divide and Conquer** is an algorithmic paradigm that involves three steps:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Divide:** Break the problem into smaller subproblems of the same type.</li>
                    <li>**Conquer:** Recursively solve these subproblems. If the subproblem size is small enough, solve it directly (base case).</li>
                    <li>**Combine:** Combine the solutions of the subproblems to get the solution for the original problem.</li>
                </ul>
                <p className="mt-4">
                    Examples include Merge Sort, Quick Sort, and Binary Search.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-1401", id: "m1401-union-find-opt", title: "14.3 Union-Find Optimization", estimatedReadingTime: "7 min", content: (
            <>
                <p className="mb-4">
                    The raw Union-Find implementation is slow in the worst case. Optimizations are crucial for its near $O(1)$ performance:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Path Compression (Find):** When finding the root of an element, link every visited node directly to the root. This flattens the tree.</li>
                    <li>**Union by Rank/Size (Union):** Always attach the smaller tree/set to the root of the larger tree/set. This prevents the tree from becoming too deep.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1401", id: "m1401-trees-dsa", title: "14.4 Segment Trees & Fenwick Trees (BIT)", estimatedReadingTime: "12 min", content: (
            <>
                <p className="mb-4">
                    These are advanced data structures designed to handle **Range Sum Queries (RSQ)** and updates on an array in $O(\log n)$ time.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Segment Tree:** A binary tree where each node represents an interval or segment of the array. Very flexible for various range queries (sum, min, max, XOR).</li>
                    <li>**Fenwick Tree (Binary Indexed Tree):** A more concise, simpler implementation than Segment Trees, using an array to represent partial sums. Excellent for RSQ and single-point updates.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1401", id: "m1401-trie", title: "14.5 Trie Data Structure", estimatedReadingTime: "8 min", content: (
            <>
                <p className="mb-4">
                    A **Trie** (Prefix Tree) is a tree-like data structure used to store a dynamic set of strings where the nodes are shared by common prefixes.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Key Features:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Prefix Search:** Checking for a word's existence or finding all words with a given prefix is extremely fast, dependent only on the length of the word $L$, not the number of words $N$. Complexity: $O(L)$.</li>
                    <li>**Applications:** Auto-complete systems, spell checkers, and IP routing.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1401", id: "m1401-lfu-cache", title: "14.6 LRU and LFU Cache Design", estimatedReadingTime: "9 min", content: (
            <>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**LRU (Least Recently Used):** Evicts the item whose timestamp of last access is oldest. Implemented using a Hash Map + Doubly Linked List.</li>
                    <li>**LFU (Least Frequently Used):** Evicts the item with the smallest usage count. More complex, often implemented using a Hash Map + Frequency Map (or another Linked List structure at each frequency level).</li>
                </ul>
                <p className="mt-4">
                    Both are critical in system design for memory management.
                </p>
            </>
        ),
    },
];

const MODULE_M1501_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-1501", id: "m1501-two-pointers", title: "15.1 Pattern: Two Pointers", estimatedReadingTime: "6 min", content: (
            <>
                <p className="mb-4">
                    **Goal:** Reduce time complexity from quadratic $O(n^2)$ to linear $O(n)$ by eliminating redundant nested loops or searches.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Key Use Cases:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>Finding pairs (e.g., Two Sum, if array is sorted).</li>
                    <li>Reversing or manipulating lists/strings in-place.</li>
                    <li>Removing duplicates from a sorted array.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1501", id: "m1501-sliding-window", title: "15.2 Pattern: Sliding Window", estimatedReadingTime: "7 min", content: (
            <>
                <p className="mb-4">
                    **Goal:** Calculate a contiguous result (sum, max, unique characters) over a subarray or substring in $O(n)$ time.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Mechanism:</h4>
                <p>
                    Use two pointers (`start` and `end`) to define the window. The window typically expands by moving `end` and contracts by moving `start` when a constraint is violated. A Hash Map is often used within the window to track frequencies or state.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-1501", id: "m1501-fast-slow", title: "15.3 Pattern: Fast & Slow Pointers", estimatedReadingTime: "6 min", content: (
            <>
                <p className="mb-4">
                    **Goal:** Iterate through a sequence (like a Linked List) to solve cycle detection or finding the middle element without knowing the length.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Core Application:</h4>
                <p>
                    **Cycle Detection (Floyd's):** The fast pointer moves two steps for every one step of the slow pointer. If a cycle exists, they must eventually meet.
                </p>
            </>
        ),
    },
    {
        moduleId: "m-1501", id: "m1501-backtracking", title: "15.5 Pattern: Backtracking", estimatedReadingTime: "8 min", content: (
            <>
                <p className="mb-4">
                    **Goal:** Find all solutions or paths by traversing a tree of choices (the state space tree).
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Key Characteristics:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>It's essentially a recursive DFS search.</li>
                    <li>The key steps are: **Choose** (make a move), **Explore** (recursive call), and **Unchoose** (undo the move/backtrack).</li>
                    <li>Used for Permutations, Combinations, Sudoku Solver, and finding paths in mazes/grids.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1501", id: "m1501-dp", title: "15.7 Pattern: Dynamic Programming", estimatedReadingTime: "9 min", content: (
            <>
                <p className="mb-4">
                    **Goal:** Solve complex optimization problems by intelligently reusing the solutions to overlapping subproblems.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">How to Spot DP:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>The problem asks for the "maximum," "minimum," "longest," or "count" of something.</li>
                    <li>The solution involves making a sequence of decisions, and the optimal choice for the current decision depends on the optimal result of prior decisions.</li>
                </ul>
            </>
        ),
    },
];

const MODULE_M1601_SUBMODULES: DetailedSubmodule[] = [
    {
        moduleId: "m-1601", id: "m1601-approach", title: "16.1 How to Approach a Problem", estimatedReadingTime: "7 min", content: (
            <>
                <p className="mb-4">
                    Follow the **UCOR** framework:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**U**nderstand: Ask clarifying questions about input/output, data types, and scale.</li>
                    <li>**C**onstraints: Define Time/Space complexity targets. Suggest a brute-force approach first.</li>
                    <li>**O**ptimize: Identify the bottleneck in the brute-force, apply DSA patterns (Hash Map, Sorting, DP) to find the optimal solution.</li>
                    <li>**R**esolve: Write the code clearly, talk through the logic, and test with edge cases.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1601", id: "m1601-breakdown", title: "16.2 Breaking Down the Problem Statement", estimatedReadingTime: "5 min", content: (
            <>
                <p className="mb-4">
                    Interviewers often give ambiguous prompts. Your job is to make them specific:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>Is the input sorted? Can it contain duplicates?</li>
                    <li>What is the maximum size of the input $N$? (This determines if $O(n^2)$ is acceptable).</li>
                    <li>Are there negative numbers? What should happen on null or empty input?</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1601", id: "m1601-communication", title: "16.4 Communication & Clarity During Interviews", estimatedReadingTime: "8 min", content: (
            <>
                <p className="mb-4">
                    Coding interviews are not just about correctness; they are about collaboration.
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Think Out Loud:** Explain your strategy before you start coding (e.g., "I'm going to use a Hash Map to reduce the search time to $O(1)$").</li>
                    <li>**Explain Trade-offs:** If you choose $O(n)$ space for $O(1)$ time, explain *why* that trade-off is acceptable.</li>
                    <li>**Clean Code:** Use meaningful variable names and modularize logic into helper functions.</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1601", id: "m1601-edge-cases", title: "16.5 Edge Cases and Test Design", estimatedReadingTime: "7 min", content: (
            <>
                <p className="mb-4">
                    Always reserve the last few minutes for running your code against a small set of tests, especially **edge cases**.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Key Edge Cases to Check:</h4>
                <ul className="list-disc ml-6 space-y-2">
                    <li>**Null or Empty Input.**</li>
                    <li>**Single Element Input.**</li>
                    <li>**Maximum/Minimum Values** (e.g., largest possible integer).</li>
                    <li>**Duplicates** (if not explicitly disallowed).</li>
                    <li>**Data that triggers the worst-case time complexity** (e.g., an already sorted array for Quick Sort).</li>
                </ul>
            </>
        ),
    },
    {
        moduleId: "m-1601", id: "m1601-faang", title: "16.7 Tips from FAANG Interviews", estimatedReadingTime: "6 min", content: (
            <>
                <p className="mb-4">
                    What highly successful candidates do:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>Don't jump to the most complex solution (DP, advanced graph). Start simple (Brute Force or simple $O(n^2)$) and optimize it systematically.</li>
                    <li>Use the interviewer as a partner. If you get stuck, say, "I'm stuck here, but I'm considering option A or B. Which direction seems more fruitful?"</li>
                    <li>Handle the "follow-up questions" by thinking about how to scale the solution (e.g., "What if the input size was too large to fit in memory?").</li>
                </ul>
            </>
        ),
    },
];

/* -------------------- DYNAMIC MODULE CONFIGURATION -------------------- */

const ALL_COURSE_MODULES = [
    { id: "m-101", title: "M-101: Foundations & Big O", submodules: MODULE_M101_SUBMODULES, quizId: "m-101-final", nextModuleId: "m-201" },
    { id: "m-201", title: "M-201: Arrays & Pointers", submodules: MODULE_M201_SUBMODULES, quizId: "m-201-final", nextModuleId: "m-301" },
    { id: "m-301", title: "M-301: Recursion & Backtracking", submodules: MODULE_M301_SUBMODULES, quizId: "m-301-final", nextModuleId: "m-401" },
    { id: "m-401", title: "M-401: Searching & Sorting", submodules: MODULE_M401_SUBMODULES, quizId: "m-401-final", nextModuleId: "m-501" },
    { id: "m-501", title: "M-501: Linked Lists & Caches", submodules: MODULE_M501_SUBMODULES, quizId: "m-501-final", nextModuleId: "m-601" },
    { id: "m-601", title: "M-601: Stacks, Queues, & Deques", submodules: MODULE_M601_SUBMODULES, quizId: "m-601-final", nextModuleId: "m-701" },
    { id: "m-701", title: "M-701: Trees & Binary Search Trees", submodules: MODULE_M701_SUBMODULES, quizId: "m-701-final", nextModuleId: "m-801" },
    { id: "m-801", title: "M-801: Heaps & Priority Queues", submodules: MODULE_M801_SUBMODULES, quizId: "m-801-final", nextModuleId: "m-901" },
    { id: "m-901", title: "M-901: Hashing (Maps & Sets)", submodules: MODULE_M901_SUBMODULES, quizId: "m-901-final", nextModuleId: "m-1001" },
    { id: "m-1001", title: "M-1001: Graphs I (Traversals & Paths)", submodules: MODULE_M1001_SUBMODULES, quizId: "m-1001-final", nextModuleId: "m-1101" },
    { id: "m-1101", title: "M-1101: Dynamic Programming (DP)", submodules: MODULE_M1101_SUBMODULES, quizId: "m-1101-final", nextModuleId: "m-1201" },
    { id: "m-1201", title: "M-1201: Greedy Algorithms", submodules: MODULE_M1201_SUBMODULES, quizId: "m-1201-final", nextModuleId: "m-1301" },
    { id: "m-1301", title: "M-1301: Bit Manipulation", submodules: MODULE_M1301_SUBMODULES, quizId: "m-1301-final", nextModuleId: "m-1401" },
    { id: "m-1401", title: "M-1401: Advanced DS (Trie, Segment Tree)", submodules: MODULE_M1401_SUBMODULES, quizId: "m-1401-final", nextModuleId: "m-1501" },
    { id: "m-1501", title: "M-1501: Pattern Review I", submodules: MODULE_M1501_SUBMODULES, quizId: "m-1501-final", nextModuleId: "m-1601" },
    { id: "m-1601", title: "M-1601: Interview Strategy & Analysis", submodules: MODULE_M1601_SUBMODULES, quizId: "m-1601-final", nextModuleId: null },
];

/* -------------------- LOCAL STORAGE HELPERS (Reused Logic) -------------------- */
const LOCAL_STORAGE_KEY = "dsaProgress";

const getInitialModuleProgress = (moduleId: string): ModuleProgress => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const allProgress = stored ? JSON.parse(stored) : {};
        
        // Initialize progress for current module
        return allProgress[moduleId] || { readProgress: 0, isCompleted: false, isQuizCompleted: false };
    } catch {
        return { readProgress: 0, isCompleted: false, isQuizCompleted: false };
    }
};

const saveModuleProgress = (moduleId: string, newProgress: ModuleProgress) => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const allProgress = stored ? JSON.parse(stored) : {};
        allProgress[moduleId] = newProgress;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allProgress));
    } catch {}
};


/* -------------------- MAIN COMPONENT -------------------- */
export const DSAIntroView: React.FC<CourseViewProps> = ({
    onBack,
    planTitle,
}) => {
    const [currentModuleId, setCurrentModuleId] = useState<string>(ALL_COURSE_MODULES[0].id);
    const [activeSection, setActiveSection] = useState<string>(MODULE_M101_SUBMODULES[0].id);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isQuizActive, setIsQuizActive] = useState(false);
    const [quizAttemptFailed, setQuizAttemptFailed] = useState(false); 
    
    // Initialize state with progress for all modules
    const [allModuleProgress, setAllModuleProgress] = useState<Record<string, ModuleProgress>>(() => {
        const progressMap: Record<string, ModuleProgress> = {};
        ALL_COURSE_MODULES.forEach(mod => {
            progressMap[mod.id] = getInitialModuleProgress(mod.id);
        });
        return progressMap;
    });
    
    const contentRef = useRef<HTMLDivElement>(null);

    // Dynamic Module/Content lookups
    const currentModule = ALL_COURSE_MODULES.find(m => m.id === currentModuleId)!;
    const currentSubmodules = currentModule.submodules;
    const LAST_SUBMODULE_ID = currentSubmodules.length > 0 ? currentSubmodules[currentSubmodules.length - 1].id : "";
    const moduleProgress = allModuleProgress[currentModuleId] || { readProgress: 0, isCompleted: false, isQuizCompleted: false };


    // --- QUIZ COMPLETION HANDLER ---
    const handleQuizComplete = useCallback((success: boolean) => {
        if (success) {
            setQuizAttemptFailed(false);
            setAllModuleProgress(prev => {
                const newProgress: ModuleProgress = { ...prev[currentModuleId], isQuizCompleted: true };
                saveModuleProgress(currentModuleId, newProgress);
                return { ...prev, [currentModuleId]: newProgress };
            });
            setIsQuizActive(false);
            setTimeout(() => alert(`Quiz passed! ${currentModule.nextModuleId ? ALL_COURSE_MODULES.find(m => m.id === currentModule.nextModuleId)?.title + ' is unlocked.' : 'Congratulations! You finished the course.'}`), 200);
        } else {
            setQuizAttemptFailed(true);
            alert("Quiz attempt failed. Please review the answers below before attempting again.");
        }
    }, [currentModuleId, currentModule.nextModuleId]);

    // --- SCROLL/READING TRACKING LOGIC ---
    const updateScrollProgress = useCallback(() => {
        if (isQuizActive || currentSubmodules.length === 0) return;
        const contentDiv = contentRef.current;
        if (!contentDiv) return;
        const { scrollTop, scrollHeight, clientHeight } = contentDiv;
        
        const scrollableHeight = scrollHeight - clientHeight;
        const currentModuleProgress = allModuleProgress[currentModuleId];

        if (scrollableHeight <= 0) {
             const isReadCompleted = activeSection === LAST_SUBMODULE_ID;
             if (isReadCompleted && currentModuleProgress.readProgress !== 100) {
                 setAllModuleProgress(prev => {
                     const newProgress: ModuleProgress = { ...currentModuleProgress, readProgress: 100, isCompleted: true };
                     saveModuleProgress(currentModuleId, newProgress);
                     return { ...prev, [currentModuleId]: newProgress };
                 });
             }
             return;
        }

        const currentProgress = Math.min(100, Math.round((scrollTop / scrollableHeight) * 100));

        if (currentProgress !== currentModuleProgress.readProgress) {
            const isReadCompleted = currentProgress >= 95 && activeSection === LAST_SUBMODULE_ID;
            
            setAllModuleProgress(prev => {
                const newProgress: ModuleProgress = {
                    ...currentModuleProgress,
                    readProgress: currentProgress,
                    isCompleted: currentModuleProgress.isCompleted || isReadCompleted,
                };
                saveModuleProgress(currentModuleId, newProgress);
                return { ...prev, [currentModuleId]: newProgress };
            });
        }
    }, [isQuizActive, activeSection, currentModuleId, LAST_SUBMODULE_ID, allModuleProgress, currentSubmodules.length]);

    useEffect(() => {
        const contentDiv = contentRef.current;
        if (contentDiv) contentDiv.addEventListener("scroll", updateScrollProgress);
        updateScrollProgress(); 
        return () => {
        if (contentDiv) contentDiv.removeEventListener("scroll", updateScrollProgress);
        };
    }, [updateScrollProgress]);

    // Reset scroll and quiz state when module changes
    useEffect(() => {
        setIsQuizActive(false); 
        setQuizAttemptFailed(false);
        if (contentRef.current) contentRef.current.scrollTo(0, 0);
    }, [currentModuleId]);


    // --- NAVIGATION HANDLER ---
    const handleSectionChange = (id: string) => {
        const submodule = currentSubmodules.find((m) => m.id === id);
        if (submodule) {
            setActiveSection(id);
            setIsQuizActive(false); 
            setQuizAttemptFailed(false);
            if (contentRef.current) contentRef.current.scrollTo(0, 0);
        } 
        else if (id.startsWith("m-")) {
            const targetModule = ALL_COURSE_MODULES.find(m => m.id === id);
            
            if (targetModule && targetModule.id !== currentModuleId) {
                const targetIndex = ALL_COURSE_MODULES.findIndex(m => m.id === targetModule.id);
                const prerequisiteModuleId = ALL_COURSE_MODULES[targetIndex - 1]?.id;

                // Prerequisite check
                if (prerequisiteModuleId && !allModuleProgress[prerequisiteModuleId]?.isQuizCompleted) {
                    alert(`You must complete the previous module (${prerequisiteModuleId}) and pass its quiz before starting ${targetModule.id}!`);
                    return;
                }

                setCurrentModuleId(targetModule.id);
                if (targetModule.submodules.length > 0) {
                    setActiveSection(targetModule.submodules[0].id);
                } else {
                    setActiveSection(''); 
                    alert(`Module ${targetModule.id} is a placeholder and has no content yet!`);
                }
            }
        } 
        else if (id === "final-project") {
            alert("Final Project is locked until all prerequisites are met!");
        }
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    // Handler to launch the quiz
    const handleLaunchQuiz = () => {
        if (!moduleProgress.isCompleted) {
            alert(`Please finish all reading sections in ${currentModuleId} before attempting the quiz.`);
            return;
        }
        if (!QUIZ_QUESTIONS[currentModule.quizId] || QUIZ_QUESTIONS[currentModule.quizId].length === 0) {
             alert(`Quiz for ${currentModuleId} is not yet available.`);
             return;
        }

        setQuizAttemptFailed(false);
        setIsQuizActive(true);
        if (contentRef.current) contentRef.current.scrollTo(0, 0);
    };
    
    // Handler to go back to content from quiz
    const handleBackToContent = () => {
        setIsQuizActive(false);
        setQuizAttemptFailed(false);
    };

    const currentSubmodule =
        currentSubmodules.find((m) => m.id === activeSection) ||
        currentSubmodules[0];

    // Check if the overall module is complete (Read + Quiz)
    const isModuleFullyComplete = moduleProgress.isCompleted && moduleProgress.isQuizCompleted;
    
    // --- FRAMER MOTION VARIANT FOR PULSE EFFECT ---
    const pulseVariant = {
        pulse: {
            scale: [1, 1.01, 1],
            boxShadow: ["0 0 0 0 rgba(59,130,246,0.4)", "0 0 0 4px rgba(59,130,246,0)"], 
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            }
        }
    };

    // Sidebar Content 
    const sidebarContent = (
      <div className="w-full bg-white dark:bg-gray-900 p-4 space-y-2 h-full overflow-y-auto">
        <Button variant="outline" onClick={onBack} className="w-full mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        {/* Progress Card (Dynamic for currentModuleId) */}
        <div className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h4 className="text-sm font-semibold mb-2">
            {currentModule.id} Read Progress: {moduleProgress.readProgress}%
          </h4>
          <Progress value={moduleProgress.readProgress} className="h-2 mb-2" />
          {moduleProgress.isQuizCompleted && (
            <div className="text-xs text-green-600 font-medium mt-1 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" /> Quiz Passed!
            </div>
          )}
          {!moduleProgress.isQuizCompleted && moduleProgress.isCompleted && (
             <div className="text-xs text-yellow-600 font-medium mt-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Reading Done, Take Quiz!
            </div>
          )}
          {isModuleFullyComplete && (
            <div className="text-xs text-green-600 font-medium mt-1 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" /> {currentModule.id} Module Fully Completed!
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold mb-3 mt-4">Course Navigation</h3>
        <ul className="space-y-1">
            {/* List all major modules and their submodules */}
            {ALL_COURSE_MODULES.map((mod) => {
                const index = ALL_COURSE_MODULES.findIndex(m => m.id === mod.id);
                const prereqId = index > 0 ? ALL_COURSE_MODULES[index - 1].id : null;
                const isPrereqMet = prereqId === null || allModuleProgress[prereqId]?.isQuizCompleted;
                const isCompleted = allModuleProgress[mod.id]?.isQuizCompleted;
                const isCurrent = mod.id === currentModuleId;
                const isClickable = isPrereqMet || isCompleted || isCurrent;
                
                return (
                <React.Fragment key={mod.id}>
                    {/* Major Module Header - Clickable for navigation */}
                    <motion.li
                        onClick={() => isClickable && handleSectionChange(mod.id)}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors text-sm font-bold mt-2 
                        ${isCurrent ? "bg-blue-600 text-white hover:bg-blue-700" : 
                          isCompleted ? "text-green-600 hover:bg-green-50/50" :
                          isPrereqMet ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-white" : 
                          "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                        }`}
                        variants={isCurrent && isModuleFullyComplete && currentModule.nextModuleId ? pulseVariant : {}}
                        animate={isCurrent && isModuleFullyComplete && currentModule.nextModuleId ? "pulse" : ""}
                    >
                        <span>{mod.title}</span>
                        {isCompleted ? <CheckCircle className="h-4 w-4 text-green-300" /> : null}
                    </motion.li>

                    {/* Submodules (Only display for the active module) */}
                    {isCurrent && mod.submodules.length > 0 && mod.submodules.map((section) => (
                        <li
                            key={section.id}
                            onClick={() => handleSectionChange(section.id)}
                            className={`flex items-center justify-between pl-6 pr-3 py-2 rounded-lg cursor-pointer transition-colors text-sm
                            ${section.id === activeSection && !isQuizActive
                                ? "bg-blue-100 dark:bg-blue-800/50 font-semibold text-blue-800 dark:text-blue-200"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                            }`}
                        >
                            <span>{section.title}</span>
                        </li>
                    ))}
                    {isCurrent && mod.submodules.length === 0 && (
                        <li className="flex items-center pl-6 pr-3 py-2 text-sm text-red-500">
                            (Content Pending)
                        </li>
                    )}
                </React.Fragment>
            )})}

          <li className="flex items-center p-3 rounded-lg text-sm text-gray-400 dark:text-gray-600">
            <Target className="h-4 w-4 mr-2" />
            Final Project
          </li>
        </ul>
      </div>
    );


    return (
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 relative"
      >
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 border-r dark:border-gray-800 h-screen sticky top-0">
          {sidebarContent}
        </div>
        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 md:hidden bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="absolute left-0 top-0 w-64 h-full bg-white dark:bg-gray-900 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-end p-4">
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-6 w-6" />
                </Button>
              </div>
              {sidebarContent}
            </motion.div>
          </div>
        )}
      {/* Main Content Area - Conditionally Renders Quiz or Submodule Content */}
      <div
        ref={contentRef}
        className="flex-1 p-4 md:p-10 overflow-y-scroll max-h-screen"
      >
        <div className="max-w-4xl mx-auto">
            {!isQuizActive && (
                <header className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{currentModule.title}</h1>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </header>
            )}
            
            {isQuizActive ? (
                // --- QUIZ VIEW (Shown when isQuizActive is TRUE) ---
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <header className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
                        <h1 className="text-3xl font-bold text-blue-600">{currentModule.id} Final Assessment</h1>
                    </header>
                    <ModuleQuiz 
                        questions={QUIZ_QUESTIONS[currentModule.quizId] || []} 
                        onComplete={handleQuizComplete} 
                        onBackToContent={handleBackToContent} 
                        isPassed={moduleProgress.isQuizCompleted} 
                        showAnswers={quizAttemptFailed || moduleProgress.isQuizCompleted} 
                    />
                </motion.div>
            ) : (
                // --- READING VIEW (Shown when isQuizActive is FALSE) ---
                <>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{currentSubmodule?.title || "Select a submodule from the sidebar."}</h2>
                    <div className="flex items-center text-sm text-gray-500 my-4 space-x-4">
                        <span>Reading Time: {currentSubmodule?.estimatedReadingTime || "0 min"}</span>
                        <Share2 className="h-4 w-4 cursor-pointer" />
                        <Edit className="h-4 w-4 cursor-pointer" />
                        <Server className="h-4 w-4 cursor-pointer" />
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                        {currentSubmodule?.content || <p className="text-lg mt-8 text-gray-500">This module content is currently being drafted. Please check back soon!</p>}
                    </div>
                </>
            )}
            
            {/* === ACTION BUTTON (Always visible if quiz isn't active) === */}
            {!isQuizActive && (
                <div className="mt-10 pt-6 border-t dark:border-gray-700">
                    {isModuleFullyComplete ? (
                        // State 1: Module FULLY complete (Navigation Button, pulsing to next module)
                        currentModule.nextModuleId ? (
                            <motion.div
                                variants={pulseVariant}
                                animate="pulse"
                                className="rounded-md overflow-hidden" 
                            >
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700 text-white" 
                                    variant="default" 
                                    onClick={() => handleSectionChange(currentModule.nextModuleId!)} // ACTION: GO TO NEXT MODULE 
                                >
                                    <Play className="mr-2 h-4 w-4" /> Go to Next Module: {ALL_COURSE_MODULES.find(m => m.id === currentModule.nextModuleId)?.title}
                                </Button>
                            </motion.div>
                        ) : (
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white" disabled>
                                <CheckCircle className="mr-2 h-4 w-4" /> All Modules Complete! Start Final Project!
                            </Button>
                        )
                    ) : (
                        // State 2: Quiz Pending or Reading Pending (Always shows the quiz option)
                        <Button
                            className="w-full"
                            variant="default" 
                            onClick={handleLaunchQuiz} // ACTION: LAUNCH QUIZ
                            disabled={!moduleProgress.isCompleted || currentSubmodules.length === 0} // Disable if reading not complete or no content
                        >
                            <HelpCircle className="mr-2 h-4 w-4" /> Start {currentModule.id} Final Quiz
                        </Button>
                    )}
                </div>
            )}
        </div>
      </div>
      </motion.div>
    );
};

export default DSAIntroView;