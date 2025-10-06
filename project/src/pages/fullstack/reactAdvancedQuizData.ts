// src/pages/frontend/reactAdvancedQuizData.ts

interface QuizQuestion { 
    id: string; 
    question: string; 
    options: string[]; 
    answer: number; 
}

/**
 * QUIZ_QUESTIONS for F-106: Advanced React Concepts
 */
export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
    "f-106-final": [
        {
            id: "f106-q1",
            question: "Which hook should be used to manage side effects, perform data fetching, or set up subscriptions?",
            options: [
                "useMemo",
                "useContext",
                "useEffect",
                "useCallback",
            ],
            answer: 2, // useEffect
        },
        {
            id: "f106-q2",
            question: "What is the primary purpose of the Context API?",
            options: [
                "Managing performance optimizations (memoization).",
                "Providing global state accessible across deeply nested components.",
                "Handling complex forms and validation.",
                "Creating dynamic routing within the application.",
            ],
            answer: 1, // Providing global state accessible across deeply nested components.
        },
        {
            id: "f106-q3",
            question: "To prevent a component from re-rendering when its props are unchanged, which utility should you use?",
            options: [
                "React.memo",
                "useContext",
                "useRef",
                "Redux Toolkit",
            ],
            answer: 0, // React.memo
        },
        {
            id: "f106-q4",
            question: "Which hook allows you to store a mutable value that does NOT cause a re-render when updated?",
            options: [
                "useState",
                "useCallback",
                "useRef",
                "useReducer",
            ],
            answer: 2, // useRef
        },
        {
            id: "f106-q5",
            question: "What must be strictly followed when using React Hooks?",
            options: [
                "They must be called conditionally inside loops or if statements.",
                "They must be placed inside the return statement of the component.",
                "They must only be called at the top level of functional components.",
                "They must be defined outside the component function entirely.",
            ],
            answer: 2, // They must only be called at the top level of functional components.
        },
    ],
};