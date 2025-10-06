// src/pages/frontend/ReactFundamentalsView.tsx
// --- ReactFundamentalsView.tsx (F-201 Module View - React Fundamentals) ---

import React, { useState, useEffect, useCallback, useRef } from "react";
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
    Component, // Icon for React Component
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from "react-router-dom";

/* -------------------- QUIZ DATA (Embedded for F-201) -------------------- */
interface QuizQuestion { id: string; question: string; options: string[]; answer: number; }

const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
    "f-201-final": [
        {
            id: "f201-q1",
            question: "In React, what must a functional component always return in its final output?",
            options: [
                "A JavaScript Object.",
                "A single root JSX element or Fragment (<>).",
                "A custom Hook.",
                "An array of elements without a wrapper.",
            ],
            answer: 1, 
        },
        {
            id: "f201-q2",
            question: "How is data typically passed from a parent component down to a child component?",
            options: [
                "Using the local 'state' of the child.",
                "Through component 'Props'.",
                "Via the 'useEffect' hook.",
                "Directly by mutating the child component's DOM.",
            ],
            answer: 1, 
        },
        {
            id: "f201-q3",
            question: "What is the correct way to initialize and update a mutable state variable in a functional component?",
            options: [
                "const [value] = initializeState(0);",
                "const [value, setValue] = useState(0);",
                "this.state.value = 0;",
                "var value = 0; value++;",
            ],
            answer: 1, 
        },
        {
            id: "f201-q4",
            question: "When a parent passes an event handler (like 'handleClick') to a child component, how is it received?",
            options: [
                "As a property of the component's state.",
                "As a lifecycle method.",
                "As a prop.",
                "Through the component's internal context.",
            ],
            answer: 2, 
        },
        {
            id: "f201-q5",
            question: "Which expression is the equivalent of the following conditional rendering logic in JSX? `if (isLoading) { return <Spinner />; }`",
            options: [
                "`{isLoading || <Spinner />}`",
                "`{isLoading ? <Spinner /> : null}`",
                "`{isLoading && <Spinner />}`",
                "`{isLoading === <Spinner />}`",
            ],
            answer: 2, 
        },
    ],
};

// --- MOCK ModuleQuiz Component (This mock displays the quiz/answers based on parent state) ---
const ModuleQuiz: React.FC<any> = ({ questions, onComplete, onBackToContent, isPassed, showAnswers }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
    const [localScore, setLocalScore] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSelect = (qId: string, oIndex: number) => {
        if (isSubmitted || showAnswers) return;
        setSelectedAnswers(prev => ({ ...prev, [qId]: oIndex }));
    };

    const handleSubmit = () => {
        // Simulate score calculation
        const mockScore = Math.floor(Math.random() * 40) + 40; 
        const passed = mockScore >= 60; 

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
            <h3 className="text-2xl font-bold">F-201 Quiz</h3>
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
                                        className={`p-2 rounded cursor-pointer transition-colors ${isSelected ? 'bg-primary/20 font-medium' : 'hover:bg-accent'}`}
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
// --- END MOCK ModuleQuiz Component ---


/* -------------------- INTERFACES -------------------- */
interface CourseSection { id: string; title: string; isCompleted: boolean; }
interface DetailedSubmodule { id: string; title: string; content: React.ReactNode; estimatedReadingTime: string; }
interface ModuleProgress { readProgress: number; isCompleted: boolean; isQuizCompleted: boolean; }
interface CourseViewProps { onBack: () => void; planTitle: string; }


/* -------------------- STATIC CONTENT DATA (Module F-201) -------------------- */
const MODULE_ID = "f-201"; // CORRECTED MODULE ID
const QUIZ_ID = "f-201-final"; // CORRECTED QUIZ ID

const ALL_SUBMODULE_DATA: DetailedSubmodule[] = [
    {
        id: "intro-jsx",
        title: "1. Introduction to React & JSX",
        estimatedReadingTime: "7 min",
        content: (
            <>
                <p className="mb-4">
                    React is a **declarative, component-based** JavaScript library for building user interfaces. It focuses on isolating complex UIs into predictable, reusable pieces.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Understanding JSX:</h4>
                <p>
                    **JSX (JavaScript XML)** is a syntax extension that allows you to write HTML-like code within your JavaScript files. It is not mandatory but highly recommended.
                </p>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        {`const element = <h1>Hello, {user.name}!</h1>;`}
                    </code>
                </pre>
                <p className="mt-4">
                    JSX expressions must be wrapped in curly braces (`{}`) and always return a single root element.
                </p>
            </>
        ),
    },
    {
        id: "components-props",
        title: "2. Components & Props (Reusability)",
        estimatedReadingTime: "8 min",
        content: (
            <>
                <p className="mb-4">
                    Components are the core building blocks of React applications. They can be **Functional** (using Hooks) or **Class-based**.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Functional Components & Props:</h4>
                <p>
                    **Props (Properties)** are used to pass data and configuration from a parent component down to a child component, ensuring a predictable **unidirectional data flow**.
                </p>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        {`function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// Usage: <Welcome name="Sara" />`}
                    </code>
                </pre>
                <p className="mt-4">
                    The data passed via props is immutable (read-only) inside the child component.
                </p>
            </>
        ),
    },
    {
        id: "state-lifecycle",
        title: "3. State & Lifecycle (The `useState` Hook)",
        estimatedReadingTime: "9 min",
        content: (
            <>
                <p className="mb-4">
                    **State** allows components to manage and react to changes over time. The **`useState` Hook** is the fundamental way to add local, mutable state to functional components.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Using the `useState` Hook:</h4>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        {`import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count is: {count}
    </button>
  );
}`}
                    </code>
                </pre>
                <h4 className="text-xl font-semibold mt-6 mb-3">Lifecycle in Functional Components</h4>
                <p>
                    The primary lifecycle phases (**mounting, updating, unmounting**) are managed using Hooks like `useState` (initialization) and `useEffect` (side effects and cleanup).
                </p>
            </>
        ),
    },
    {
        id: "events-conditional",
        title: "4. Event Handling & Conditional Rendering",
        estimatedReadingTime: "6 min",
        content: (
            <>
                <p className="mb-4">
                    React handles events by passing functions to DOM elements (e.g., `onClick`).
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Conditional Rendering:</h4>
                <p>
                    Use JavaScript operators to control which elements are rendered.
                </p>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        {`// Ternary Operator:
{isLoggedIn ? <LogoutButton /> : <LoginButton />}

// Logical && Operator:
{count > 0 && <p>You have {count} items.</p>}`}
                    </code>
                </pre>
                <p className="mt-4 mb-8">
                    Mastering these fundamentals is the essential first step to building scalable React applications!
                </p>
            </>
        ),
    },
];

const LAST_SUBMODULE_ID = ALL_SUBMODULE_DATA[ALL_SUBMODULE_DATA.length - 1].id; 

const courseSections = [
    { id: "f-104", title: "F-104: Browser APIs (Prev)", isCompleted: true }, 
    { id: "intro-jsx", title: "1. Introduction to React & JSX", isCompleted: false },
    { id: "components-props", title: "2. Components & Props", isCompleted: false },
    { id: "state-lifecycle", title: "3. State & Lifecycle (Hooks)", isCompleted: false },
    { id: "events-conditional", title: "4. Event Handling & Rendering", isCompleted: false },
    { id: "f-202", title: "F-202: Advanced React (Next)", isCompleted: false }, 
    { id: "final-project", title: "Final Project", isCompleted: false },
];


/* -------------------- LOCAL STORAGE HELPERS (Reused Logic) -------------------- */
const LOCAL_STORAGE_KEY = "fullStackProgress";

const getInitialModuleProgress = (moduleId: string): ModuleProgress => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const allProgress = stored ? JSON.parse(stored) : {};
        // Default the previous module (F-104) to complete if not set
        if (moduleId === MODULE_ID && !allProgress["f-104"]) {
            allProgress["f-104"] = { readProgress: 100, isCompleted: true, isQuizCompleted: true }; 
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allProgress));
        }

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
export const ReactFundamentalsView: React.FC<CourseViewProps> = ({
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
            setQuizAttemptFailed(false);
            setModuleProgress((prev) => {
                const newProgress: ModuleProgress = { ...prev, isQuizCompleted: true };
                saveModuleProgress(MODULE_ID, newProgress);
                return newProgress;
            });
            setIsQuizActive(false);
            setTimeout(() => alert("Quiz passed! Next module is unlocked."), 200);
        } else {
            setQuizAttemptFailed(true);
            alert("Quiz attempt failed. Please review the answers below before attempting again.");
        }
    }, []);

    // --- SCROLL TRACKING LOGIC ---
    const updateScrollProgress = useCallback(() => {
        if (isQuizActive) return;
        const contentDiv = contentRef.current;
        if (!contentDiv) return;
        const { scrollTop, scrollHeight, clientHeight } = contentDiv;
        
        const scrollableHeight = scrollHeight - clientHeight;
        
        if (scrollableHeight <= 0) {
             const isReadCompleted = activeSection === LAST_SUBMODULE_ID;
             if (isReadCompleted && moduleProgress.readProgress !== 100) {
                setModuleProgress((prev) => {
                    const newProgress: ModuleProgress = { ...prev, readProgress: 100, isCompleted: true };
                    saveModuleProgress(MODULE_ID, newProgress);
                    return newProgress;
                });
             }
             return;
        }

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
        if (ALL_SUBMODULE_DATA.find((m) => m.id === id)) {
            setActiveSection(id);
            setIsQuizActive(false); 
            setQuizAttemptFailed(false);
            if (contentRef.current) contentRef.current.scrollTo(0, 0);
        } else if (id === "f-202" && moduleProgress.isQuizCompleted) { // TARGET F-202 CHECK
            navigate("/modules/f-202"); 
        } else if (id === "f-202") {
            alert(`You must complete the reading AND pass the final quiz before starting the Advanced React module!`);
        } else if (id === "f-104") {
            navigate("/modules/f-104"); // Navigate to the previous module
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
      <div className="w-full bg-card p-4 space-y-2 h-full overflow-y-auto">
        <Button variant="outline" onClick={onBack} className="w-full mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="p-3 border rounded-lg bg-accent/20">
          <h4 className="text-sm font-semibold mb-2">
            F-201 Read Progress: {moduleProgress.readProgress}%
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
                <CheckCircle className="h-3 w-3 mr-1" /> F-201 Module Fully Completed!
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold mb-3 mt-4">Course Navigation</h3>
        <ul className="space-y-1">
             {/* Link to PREVIOUS module (F-104) */}
            <li onClick={() => handleSectionChange("f-104")} className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm text-green-600 hover:bg-accent">
                <span>F-104: Browser APIs (Prev)</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
            </li>
            
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
          {/* Next Module Link (F-202) */}
          <motion.li
            onClick={() => handleSectionChange('f-202')}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm
            ${isModuleFullyComplete ? "font-semibold text-blue-600 hover:bg-accent" : "text-muted-foreground"}`}
            variants={isModuleFullyComplete ? pulseVariant : {}}
            animate={isModuleFullyComplete ? "pulse" : ""}
          >
            <span>F-202: Advanced React (Next)</span>
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
                <h1 className="text-3xl font-bold text-primary">F-201 Final Assessment</h1>
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
              <Component className="h-4 w-4 cursor-pointer" />
            </div>
            <div className="prose dark:prose-invert max-w-none">
              {currentSubmodule.content}
            </div>
          </>
        )}
        
        {/* === ACTION BUTTON (Always visible if quiz isn't active) === */}
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
                        onClick={() => handleSectionChange('f-202')} // ACTION: GO TO NEXT MODULE (F-202)
                    >
                        <Play className="mr-2 h-4 w-4" /> Go to Next Module: Advanced React (F-202)
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
                    <HelpCircle className="mr-2 h-4 w-4" /> Start F-201 Final Quiz
                </Button>
            )}
        </div>
      </div>
      </motion.div>
    );
};

export default ReactFundamentalsView;