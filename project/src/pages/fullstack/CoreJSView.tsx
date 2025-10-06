// src/pages/fullstack/CoreJSView.tsx
// --- CoreJSView.tsx (F-103 Module View - Core JavaScript) ---

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
    CheckCircle,
    Play,
    ArrowLeft,
    Share2,
    Edit,
    MoreVertical,
    Target,
    Menu,
    X,
    Clock,
    HelpCircle,
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from "react-router-dom";
import { ModuleQuiz } from "./ModuleQuiz";
import { QUIZ_QUESTIONS } from './courseData'; // Import quiz data

// --- 1. INTERFACES ---
interface CourseSection { id: string; title: string; isCompleted: boolean; }
interface DetailedSubmodule { id: string; title: string; content: React.ReactNode; estimatedReadingTime: string; }
// Updated interface for Quiz tracking
interface ModuleProgress { readProgress: number; isCompleted: boolean; isQuizCompleted: boolean; }
interface CourseViewProps { onBack: () => void; planTitle: string; }


// --- 2. STATIC CONTENT DATA (Declared ONCE) ---
const MODULE_ID = "f-103";
const QUIZ_ID = "f-103-final"; // Key to fetch quiz data

const ALL_SUBMODULE_DATA: DetailedSubmodule[] = [
    {
        id: "variables-scope",
        title: "1. Variables (`let`, `const`) and Function Scope",
        estimatedReadingTime: "5 min",
        content: (
            <>
                <p className="mb-4">
                    **`let`** and **`const`** introduced in ES6 solve the scope issues of `var`. 
                    They are **block-scoped**, meaning they only exist within the nearest curly braces `{}`.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Key Differences:</h4>
                <ul className="list-disc ml-4 space-y-2">
                    <li>**`const`**: Cannot be reassigned. Use it by default.</li>
                    <li>**`let`**: Can be reassigned. Use only when the value must change.</li>
                    <li>**`var`**: Function-scoped and hoisted with `undefined`. Avoid using it.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Hoisting and Closures</h4>
                <p>
                    **Hoisting** moves variable and function declarations to the top of their scope during compilation. 
                    `let`/`const` are hoisted but remain in a "temporal dead zone."
                </p>
                <p className="mt-2">
                    A **Closure** is a function bundled together with its lexical (surrounding) environment. 
                    It gives the function access to its outer function's scope even after the outer function has finished executing.
                </p>
            </>
        ),
    },
    {
        id: "functions-classes",
        title: "2. Arrow Functions, Classes, and Prototypes",
        estimatedReadingTime: "7 min",
        content: (
            <>
                {/* FIX APPLIED HERE: Escaped => as &gt; in the title */}
                <h4 className="text-xl font-semibold mt-6 mb-3">Arrow Functions (`=&gt;`)</h4>
                <p className="mb-4">
                    Arrow functions provide a concise syntax and, most importantly, do not bind their own `this`. 
                    They inherit `this` from the surrounding scope, which is ideal for methods in objects and callbacks.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">ES6 Classes and Inheritance</h4>
                <p className="mb-2">
                    The `class` syntax is sugar over JavaScript's existing prototype-based inheritance model. 
                    It makes object-oriented programming easier to read.
                </p>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        {/* Escaped { and } inside JSX content using entities */}
                        class User &lcub;<br/>
                        &nbsp;&nbsp;constructor(name) &lcub; this.name = name; &rcub;<br/>
                        &nbsp;&nbsp;greet() &lcub; return `Hello, ${"{"}this.name{"}"}`; &rcub;<br/>
                        &rcub;<br/>
                        class Admin extends User &lcub; /* ... */ &rcub;
                    </code>
                </pre>
            </>
        ),
    },
    {
        id: "promises-async",
        title: "3. Asynchronous JS, Promises & Async/Await",
        estimatedReadingTime: "8 min",
        content: (
            <>
                <p className="mb-4">
                    **Promises** are objects representing the eventual completion (or failure) of an asynchronous operation. 
                    This is crucial for network requests and reading files.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Async/Await Error Handling</h4>
                <p className="mb-2">
                    **`async/await`** is the preferred modern pattern, wrapping asynchronous logic 
                    in synchronous-looking code, with errors handled by standard `try...catch`.
                </p>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        {/* Escaped { and } inside JSX content using entities */}
                        async function fetchData() &lcub;<br/>
                        &nbsp;&nbsp;try &lcub;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;const response = await fetch('/api/data');<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;const data = await response.json();<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;console.log(data);<br/>
                        &nbsp;&nbsp;&rcub; catch (error) &lcub;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;console.error('Error:', error);<br/>
                        &nbsp;&nbsp;&rcub;<br/>
                        &rcub;
                    </code>
                </pre>
            </>
        ),
    },
    {
        id: "array-methods",
        title: "4. Higher-Order Array Methods (Map, Filter, Reduce)",
        estimatedReadingTime: "2 min",
        content: (
            <>
                <p className="mb-4">
                    These functional methods are essential for transforming and iterating over data 
                    without mutating the original array—a core principle in modern JavaScript frameworks.
                </p>
                
                <h4 className="text-xl font-semibold mt-6 mb-3">Map, Filter, Reduce:</h4>
                <ul className="list-disc ml-4 space-y-2">
                    {/* Escaped => as &gt; in these list items */}
                    <li>**`.map()`**: Transforms each element, returns a **new array** of the same length.</li>
                    <li>**`.filter()`**: Selects elements that pass a test, returns a **new array** with fewer or same elements.</li>
                    <li>**`.reduce()`**: Aggregates the array into a **single value** (e.g., sum, object mapping).</li>
                </ul>
                <p className="mt-6 mb-8">This module content is long. Scroll to the very bottom to mark F-103 as completed!</p>
            </>
        ),
    },
];

const LAST_SUBMODULE_ID = ALL_SUBMODULE_DATA[ALL_SUBMODULE_DATA.length - 1].id; // 'array-methods'

// The sidebar now matches the new ALL_SUBMODULE_DATA
const courseSections: CourseSection[] = [
    { id: "variables-scope", title: "1. Variables & Scope (let/const)", isCompleted: false },
    { id: "functions-classes", title: "2. Functions, Classes & OOP", isCompleted: false },
    { id: "promises-async", title: "3. Promises & Async/Await", isCompleted: false },
    { id: "array-methods", title: "4. Array Methods (Map/Reduce)", isCompleted: false },
    { id: "b-101", title: "B-101: Python Essentials (Next)", isCompleted: false }, // Link to next module (Backend)
    { id: "final-project", title: "Final Project", isCompleted: false },
];

// --- 3. PROGRESS PERSISTENCE ---
const LOCAL_STORAGE_KEY = "fullStackProgress";

const getInitialModuleProgress = (moduleId: string): ModuleProgress => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const allProgress = stored ? JSON.parse(stored) : {};
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

// --- MAIN COMPONENT ---
export const CoreJSView: React.FC<CourseViewProps> = ({
    onBack,
    planTitle,
}) => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<string>(ALL_SUBMODULE_DATA[0].id);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [moduleProgress, setModuleProgress] = useState<ModuleProgress>(() => getInitialModuleProgress(MODULE_ID));
    const [isQuizActive, setIsQuizActive] = useState(false);
    const [quizAttemptFailed, setQuizAttemptFailed] = useState(false); 

    const contentRef = useRef<HTMLDivElement>(null);

    // --- QUIZ COMPLETION HANDLER ---
    const handleQuizComplete = useCallback((success: boolean) => {
        if (success) {
            setQuizAttemptFailed(false); // Clear any previous failure state on success
            setModuleProgress((prev) => {
                const newProgress: ModuleProgress = {
                    ...prev,
                    isQuizCompleted: true,
                };
                saveModuleProgress(MODULE_ID, newProgress);
                setIsQuizActive(false); // Hide the quiz and return to the content view on success
                return newProgress;
            });
            setTimeout(() => alert("Quiz passed! Next module is unlocked."), 200);
        } else {
            // QUIZ FAILED: Set failure state, keep the quiz active, and prompt the user to review.
            setQuizAttemptFailed(true);
            alert("Quiz attempt failed. Please review the answers below to identify areas for review before attempting again.");
        }
    }, []);

    // --- SCROLL TRACKING LOGIC ---
    const updateScrollProgress = useCallback(() => {
        if (isQuizActive) return;

        const contentDiv = contentRef.current;
        if (!contentDiv) return;
        const { scrollTop, scrollHeight, clientHeight } = contentDiv;
        // Handle case where content isn't scrollable
        if (scrollHeight <= clientHeight && ALL_SUBMODULE_DATA.length > 0) {
             const isReadCompleted = activeSection === LAST_SUBMODULE_ID;
             if (isReadCompleted && moduleProgress.readProgress !== 100) {
                setModuleProgress((prev) => {
                    const newProgress = { ...prev, readProgress: 100, isCompleted: true };
                    saveModuleProgress(MODULE_ID, newProgress);
                    return newProgress;
                });
             }
             return;
        }

        const scrollableHeight = scrollHeight - clientHeight;
        const currentProgress = Math.min(100, Math.round((scrollTop / scrollableHeight) * 100));

        if (currentProgress !== moduleProgress.readProgress) {
            const isReadCompleted = currentProgress >= 95 && activeSection === LAST_SUBMODULE_ID;
            
            setModuleProgress((prev) => {
                const newProgress: ModuleProgress = {
                    ...prev,
                    readProgress: currentProgress,
                    isCompleted: prev.isCompleted || isReadCompleted,
                };
                saveModuleProgress(MODULE_ID, newProgress);
                return newProgress;
            });
        }
    }, [moduleProgress.readProgress, isQuizActive, activeSection, moduleProgress.isCompleted]);

    useEffect(() => {
        const contentDiv = contentRef.current;
        if (contentDiv) contentDiv.addEventListener("scroll", updateScrollProgress);
        updateScrollProgress();
        return () => {
        if (contentDiv) contentDiv.removeEventListener("scroll", updateScrollProgress);
        };
    }, [updateScrollProgress]);

    // --- NAVIGATION HANDLER ---
    const handleSectionChange = (id: string) => {
        // If navigating to a content submodule
        if (ALL_SUBMODULE_DATA.find((m) => m.id === id)) {
            setActiveSection(id);
            setIsQuizActive(false); 
            setQuizAttemptFailed(false); // Clear review mode on navigation
            if (contentRef.current) contentRef.current.scrollTo(0, 0);
        } else if (id === "b-101" && moduleProgress.isQuizCompleted) {
            navigate("/modules/b-101"); // Navigate only if quiz is passed
        } else if (id === "b-101") {
            alert(`You must complete the reading AND pass the final quiz before starting the next module!`);
        } else if (id === "final-project") {
            alert("Final Project is locked until all prerequisites are met!");
        }
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    // Handler to launch the quiz
    const handleLaunchQuiz = () => {
        if (!moduleProgress.isCompleted) {
             alert("Please finish the module reading (scroll to the bottom) before attempting the quiz.");
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
        ALL_SUBMODULE_DATA.find((m) => m.id === activeSection) ||
        ALL_SUBMODULE_DATA[0];

    // Check if the overall module is complete (Read + Quiz)
    const isModuleFullyComplete = moduleProgress.isCompleted && moduleProgress.isQuizCompleted;
    
    // --- FRAMER MOTION VARIANT FOR PULSE EFFECT (Used for Next Module Navigation) ---
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
      <div className="w-full bg-card p-4 space-y-2 h-full overflow-y-auto">
        <Button variant="outline" onClick={onBack} className="w-full mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="p-3 border rounded-lg bg-accent/20">
          <h4 className="text-sm font-semibold mb-2">
            F-103 Read Progress: {moduleProgress.readProgress}%
          </h4>
          <Progress value={moduleProgress.readProgress} className="h-2 mb-2" />
          {moduleProgress.isQuizCompleted && (
            <div className="text-xs text-green-500 font-medium mt-1 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" /> Quiz Passed!
            </div>
          )}
          {!moduleProgress.isQuizCompleted && moduleProgress.isCompleted && (
             <div className="text-xs text-yellow-500 font-medium mt-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Reading Done, Take Quiz!
            </div>
          )}
          {isModuleFullyComplete && (
            <div className="text-xs text-green-500 font-medium mt-1 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" /> F-103 Module Fully Completed!
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold mb-3 mt-4">Course Navigation</h3>
        <ul className="space-y-1">
          {ALL_SUBMODULE_DATA.map((section) => (
            <li
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm
                ${
                  section.id === activeSection && !isQuizActive
                    ? "bg-primary/20 dark:bg-primary/40 font-semibold text-primary"
                    : "hover:bg-accent text-card-foreground"
                }`}
            >
              <span>{section.title}</span>
            </li>
          ))}
          {/* Next Module Link (B-101) */}
          <motion.li
            onClick={() => handleSectionChange('b-101')}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm
            ${isModuleFullyComplete ? "font-semibold text-blue-600 hover:bg-accent" : "text-muted-foreground"}`}
            variants={isModuleFullyComplete ? pulseVariant : {}}
            animate={isModuleFullyComplete ? "pulse" : ""}
          >
            <span>B-101: Python Essentials (Next)</span>
            {isModuleFullyComplete ? <Play className="h-4 w-4 text-blue-600 flex-shrink-0" /> : null}
          </motion.li>
          <li className="flex items-center p-3 rounded-lg text-sm text-muted-foreground">
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
        className="min-h-screen flex flex-col md:flex-row bg-background relative"
      >
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 border-r h-screen sticky top-0">
          {sidebarContent}
        </div>
        {/* Mobile Sidebar (no change) */}
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
              className="absolute left-0 top-0 w-64 h-full bg-card shadow-xl"
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
        {isQuizActive ? (
          // --- QUIZ VIEW (Shown when isQuizActive is TRUE) ---
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <header className="flex justify-between items-center mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-primary">F-103 Final Assessment</h1>
            </header>
            <ModuleQuiz 
                questions={QUIZ_QUESTIONS[QUIZ_ID] || []} 
                onComplete={handleQuizComplete} 
                onBackToContent={handleBackToContent} 
                isPassed={moduleProgress.isQuizCompleted} 
                showAnswers={quizAttemptFailed || moduleProgress.isQuizCompleted} 
            />
          </motion.div>
        ) : (
          // --- READING VIEW (Shown when isQuizActive is FALSE) ---
          <>
            <header className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold">{currentSubmodule.title}</h1>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </header>
            <div className="flex items-center text-sm text-muted-foreground mb-6 space-x-4">
              <span>Reading Time: {currentSubmodule.estimatedReadingTime}</span>
              <Share2 className="h-4 w-4 cursor-pointer" />
              <Edit className="h-4 w-4 cursor-pointer" />
              <MoreVertical className="h-4 w-4 cursor-pointer" />
            </div>
            <div className="prose dark:prose-invert max-w-none">
              {currentSubmodule.content}
            </div>
          </>
        )}
        
        {/* === ACTION BUTTON (Always visible if quiz isn't active) === */}
        {/* The button appears on EVERY submodule page */}
        {!isQuizActive && (
            <div className="mt-10 pt-6 border-t">
                {isModuleFullyComplete ? (
                    // State 1: Module FULLY complete (Navigation Button, pulsing)
                    <motion.div
                        variants={pulseVariant}
                        animate="pulse"
                        className="rounded-md overflow-hidden" 
                    >
                        <Button
                            className="w-full"
                            variant="default" 
                            onClick={() => handleSectionChange('b-101')} // ACTION: GO TO NEXT MODULE
                        >
                            <Play className="mr-2 h-4 w-4" /> Go to Next Module: Python Essentials
                        </Button>
                    </motion.div>
                ) : (
                    // State 2: Quiz Pending or Reading Pending (Always shows the quiz option)
                    <Button
                        className="w-full"
                        variant="default" 
                        onClick={handleLaunchQuiz} // ACTION: LAUNCH QUIZ
                        disabled={!moduleProgress.isCompleted} // Disable if reading not complete
                    >
                        <HelpCircle className="mr-2 h-4 w-4" /> Start F-103 Final Quiz
                    </Button>
                )}
            </div>
        )}
      </div>
      </motion.div>
    );
};