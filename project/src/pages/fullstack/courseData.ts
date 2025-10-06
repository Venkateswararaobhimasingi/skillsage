// CourseData.ts

import React from 'react';

// Using 'any[]' in QUIZ_QUESTIONS allows for the mixed structure until all quizzes are unified.
export interface DetailedSubmodule { 
    id: string; 
    title: string; 
    content: React.ReactNode; 
    estimatedReadingTime: string; 
    quiz?: any[];
}

// --- QUIZ DATA ---
export const QUIZ_QUESTIONS: Record<string, any[]> = { 
    // F-101 QUIZ (Existing structure - uses 'answer: string')
    "f-101-final": [
        { id: "q1", question: "Which tag defines the main, dominant content of the document?", options: ["<section>", "<main>", "<body>"], answer: "<main>" },
        { id: "q2", question: "What ARIA attribute is used to explicitly provide a name for an icon button?", options: ["aria-label", "data-name", "role"], answer: "aria-label" },
        { id: "q3", question: "The `alt` attribute on an image primarily assists with:", options: ["Lazy loading", "Screen readers and SEO", "CSS styling"], answer: "Screen readers and SEO" }
    ],
    // F-102 QUIZ (Existing structure - uses 'answer: string')
    "f-102-final": [
        { id: "q1", question: "Which layout system is one-dimensional (row or column)?", options: ["CSS Grid", "Flexbox", "Floats"], answer: "Flexbox" },
        { id: "q2", question: "The `box-sizing: border-box;` property includes what in the element's width?", options: ["Only content", "Content, padding, and border", "Only padding and margin"], answer: "Content, padding, and border" },
        { id: "q3", question: "What is the primary function of CSS Variables?", options: ["To define backend logic", "To improve specificity", "To store reusable values for consistency and theming"], answer: "To store reusable values for consistency and theming" }
    ],
    // F-103 QUIZ (Existing structure - uses 'answer: string')
    "f-103-final": [
        { id: "q1", question: "What keyword pauses an async function until a Promise is settled?", options: ["promise", "defer", "await"], answer: "await" },
        { id: "q2", question: "Which array method aggregates an array into a single value?", options: ["map()", "filter()", "reduce()"], answer: "reduce()" },
        { id: "q3", question: "What feature allows a function to remember and access its lexical scope even when that function is executed outside that scope?", options: ["Hoisting", "Callback", "Closure"], answer: "Closure" }
    ],
    
    // B-101 PYTHON ESSENTIALS QUIZ (CORRECTED to use 'question: string' for display compatibility)
    "b-101-final": [
        {
            id: "b101-q1",
            question: "Which of the following Python data types is **mutable** and is an ordered sequence of elements?",
            options: [ "Tuple", "String", "List", "Boolean" ],
            answer: 2, 
        },
        {
            id: "b101-q2",
            question: "How are code blocks defined in Python?",
            options: [ "Using curly braces `{}`", "Using parentheses `()`", "Using indentation (whitespace)", "Using the `BEGIN` and `END` keywords" ],
            answer: 2, 
        },
        {
            id: "b101-q3",
            question: "In Python, which built-in data structure is used to store key-value pairs?",
            options: [ "List", "Tuple", "Array", "Dictionary" ],
            answer: 3, 
        },
        {
            id: "b101-q4",
            question: "What keyword is used to define a function in Python?",
            options: [ "func", "define", "def", "function" ],
            answer: 2, 
        },
        {
            id: "b101-q5",
            question: "If you define `my_tuple = (1, 2, 3)`, what will happen if you try to execute `my_tuple.append(4)`?",
            options: [ 
                "The tuple will become `(1, 2, 3, 4)`", 
                "Python will raise an error because tuples are immutable", 
                "The function will return `False`", 
                "The element `4` will be added to the end of the tuple" 
            ],
            answer: 1, 
        },
    ],
};