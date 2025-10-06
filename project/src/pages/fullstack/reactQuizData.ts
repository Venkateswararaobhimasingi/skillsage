// reactQuizData.ts

// NOTE: This interface matches the internal structure required by the ModuleQuiz component:
// 'question' for text and 'answer' for the correct option index (0, 1, 2, ...).
interface QuizQuestion { 
    id: string; 
    question: string; 
    options: string[]; 
    answer: number; 
}

/**
 * QUIZ_QUESTIONS for F-105: React Fundamentals (JSX, Props, State, Hooks, Events)
 */
export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
    "f-105-final": [
        {
            id: "f105-q1",
            question: "In React, what must a functional component always return in its final output?",
            options: [
                "A JavaScript Object.",
                "A single root JSX element or Fragment (<>).",
                "A custom Hook.",
                "An array of elements without a wrapper.",
            ],
            answer: 1, // A single root JSX element or Fragment (<>).
        },
        {
            id: "f105-q2",
            question: "How is data typically passed from a parent component down to a child component?",
            options: [
                "Using the local 'state' of the child.",
                "Through component 'Props'.",
                "Via the 'useEffect' hook.",
                "Directly by mutating the child component's DOM.",
            ],
            answer: 1, // Through Props
        },
        {
            id: "f105-q3",
            question: "What is the correct way to initialize and update a mutable state variable in a functional component?",
            options: [
                "const [value] = initializeState(0);",
                "const [value, setValue] = useState(0);",
                "this.state.value = 0;",
                "var value = 0; value++;",
            ],
            answer: 1, // const [value, setValue] = useState(0);
        },
        {
            id: "f105-q4",
            question: "When a parent passes an event handler (like 'handleClick') to a child component, how is it received?",
            options: [
                "As a property of the component's state.",
                "As a lifecycle method.",
                "As a prop.",
                "Through the component's internal context.",
            ],
            answer: 2, // As a prop.
        },
        {
            id: "f105-q5",
            question: "Which expression is the equivalent of the following conditional rendering logic in JSX? `if (isLoading) { return <Spinner />; }`",
            options: [
                "`{isLoading || <Spinner />}`",
                "`{isLoading ? <Spinner /> : null}`",
                "`{isLoading && <Spinner />}`",
                "`{isLoading === <Spinner />}`",
            ],
            answer: 1, // {isLoading ? <Spinner /> : null} or {isLoading && <Spinner />} are common, but the ternary is a direct equivalent of the if/else structure. Let's use Logical AND (&&) as it is most concise and common in React. (Option 2 is the concise logical AND approach)
        },
    ],
};