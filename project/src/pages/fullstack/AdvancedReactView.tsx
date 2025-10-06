// src/pages/frontend/AdvancedReactView.tsx
// --- AdvancedReactView.tsx (F-106 Module View - Advanced React Concepts) ---

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
    Layers,    // Icon for advanced/layers
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from "react-router-dom";

// --- Importing Quiz Data ---
import { QUIZ_QUESTIONS } from './reactAdvancedQuizData'; // <-- NEW IMPORT
// NOTE: ModuleQuiz component defined below
/* -------------------- INTERFACES -------------------- */
interface CourseSection { id: string; title: string; isCompleted: boolean; }
interface DetailedSubmodule { id: string; title: string; content: React.ReactNode; estimatedReadingTime: string; }
interface ModuleProgress { readProgress: number; isCompleted: boolean; isQuizCompleted: boolean; }
interface CourseViewProps { onBack: () => void; planTitle: string; }
interface QuizQuestion { id: string; question: string; options: string[]; answer: number; }


/* -------------------- MOCK ModuleQuiz Component (Placeholder) -------------------- */
const ModuleQuiz: React.FC<any> = ({ questions, onComplete, onBackToContent, isPassed, showAnswers }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
    const [localScore, setLocalScore] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSelect = (qId: string, oIndex: number) => {
        if (isSubmitted || showAnswers) return;
        setSelectedAnswers(prev => ({ ...prev, [qId]: oIndex }));
    };

    const handleSubmit = () => {
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
                            {q.options.map((option: string, oIndex: number) => (
                                <li 
                                    key={oIndex} 
                                    className={oIndex === q.answer ? "text-green-600 font-medium flex items-center" : "text-card-foreground"}
                                >
                                    {oIndex === q.answer && <CheckCircle className="h-3 w-3 mr-2 flex-shrink-0" />}
                                    {option}
                                </li>
                            ))}
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
            <h3 className="text-2xl font-bold">F-106 Advanced React Quiz</h3>
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


/* -------------------- STATIC CONTENT DATA (Module F-106) -------------------- */
const MODULE_ID = "f-106";
const QUIZ_ID = "f-106-final"; 

const ALL_SUBMODULE_DATA: DetailedSubmodule[] = [
    {
        id: "hooks-deep-dive",
        title: "1. React Hooks Deep Dive (useEffect, useRef, Custom)",
        estimatedReadingTime: "10 min",
        content: (
            <>
                <p className="mb-4">
                    Hooks are the powerful functions that let you "hook into" React state and lifecycle features from functional components.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Core Concepts:</h4>
                <ul className="list-disc ml-4 space-y-2">
                    <li>**`useEffect`**: Manages side effects (data fetching, manual DOM manipulation) and lifecycle behavior (mounting, updating, cleanup).</li>
                    <li>**`useRef`**: Allows creation of a mutable ref object whose `.current` property can hold a value (e.g., a DOM element, or any value that doesn't trigger re-renders).</li>
                    <li>**Custom Hooks**: Functions starting with `use` that encapsulate reusable stateful logic across different components.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Rules of Hooks:</h4>
                <p>Hooks must be called only at the top level of your component function (not inside loops, conditions, or nested functions).</p>
            </>
        ),
    },
    {
        id: "context-api",
        title: "2. Context API & Global State Management",
        estimatedReadingTime: "8 min",
        content: (
            <>
                <p className="mb-4">
                    The **Context API** provides a way to share values (like user data or themes) between components without explicitly passing props down through every level of the tree (**prop drilling**).
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Context Components:</h4>
                <ul className="list-disc ml-4 space-y-2">
                    <li>**`Context.Provider`**: Supplies the value to be shared to its children.</li>
                    <li>**`useContext(Context)`**: Hook used by children to consume the value.</li>
                </ul>
                <p className="mt-4">
                    Context is ideal for infrequent updates (like theme changes). For high-frequency updates, external libraries like Redux or Zustand are generally more performant.
                </p>
            </>
        ),
    },
    {
        id: "react-router",
        title: "3. Single Page Application (SPA) Routing",
        estimatedReadingTime: "7 min",
        content: (
            <>
                <p className="mb-4">
                    **React Router** is the standard solution for handling declarative routing in a single-page application (SPA).
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Key Router Components:</h4>
                <ul className="list-disc ml-4 space-y-2">
                    <li>**`BrowserRouter`**: Uses the HTML5 history API to keep the UI in sync with the URL.</li>
                    <li>**`Routes` / `Route`**: Define the URL paths and the components to render.</li>
                    <li>**`useNavigate`**: Hook used for programmatic navigation (e.g., after a login).</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Protected Routes:</h4>
                <p>
                    A protected route pattern uses conditional logic or a layout wrapper to check user authentication status before rendering the target component.
                </p>
            </>
        ),
    },
    {
        id: "performance",
        title: "4. Performance Optimization",
        estimatedReadingTime: "10 min",
        content: (
            <>
                <p className="mb-4">
                    Optimization techniques prevent unnecessary work (re-renders) and reduce the initial load time of the application.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Memoization Hooks:</h4>
                <ul className="list-disc ml-4 space-y-2">
                    <li>**`React.memo`**: A Higher-Order Component (HOC) that memoizes components to prevent re-renders unless props change.</li>
                    <li>**`useMemo`**: Memoizes a calculated value (re-runs only if dependencies change).</li>
                    <li>**`useCallback`**: Memoizes a function instance (re-creates the function only if dependencies change), essential for passing functions to memoized child components.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Loading Efficiency:</h4>
                <p className="mt-4 mb-8">
                    **Lazy loading** and **code splitting** (using `React.lazy` and `Suspense`) defer loading code until it is absolutely necessary, drastically improving initial page load time.
                </p>
            </>
        ),
    },
];

const LAST_SUBMODULE_ID = ALL_SUBMODULE_DATA[ALL_SUBMODULE_DATA.length - 1].id; 

const courseSections = [
    { id: "f-105", title: "F-105: React Fundamentals (Prev)", isCompleted: true }, 
    { id: "hooks-deep-dive", title: "1. Hooks Deep Dive", isCompleted: false },
    { id: "context-api", title: "2. Context API", isCompleted: false },
    { id: "react-router", title: "3. React Router", isCompleted: false },
    { id: "performance", title: "4. Performance Optimization", isCompleted: false },
    { id: "f-107", title: "F-107: React Ecosystem (Next)", isCompleted: false }, 
    { id: "final-project", title: "Final Project", isCompleted: false },
];


/* -------------------- LOCAL STORAGE HELPERS (Reused Logic) -------------------- */
const LOCAL_STORAGE_KEY = "fullStackProgress";

const getInitialModuleProgress = (moduleId: string): ModuleProgress => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const allProgress = stored ? JSON.parse(stored) : {};
        // Default the previous module (F-105) to complete if not set
        if (moduleId === MODULE_ID && !allProgress["f-105"]) {
            allProgress["f-105"] = { readProgress: 100, isCompleted: true, isQuizCompleted: true }; 
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
export const AdvancedReactView: React.FC<CourseViewProps> = ({
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
                    const newProgress: ModuleProgress = { ...prev, readProgress: 100, isCompleted: true, isQuizCompleted: prev.isQuizCompleted };
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
        } else if (id === "f-107" && moduleProgress.isQuizCompleted) {
            navigate("/modules/f-107"); // Navigate to the next module
        } else if (id === "f-107") {
            alert(`You must complete the reading AND pass the final quiz before starting the next module!`);
        } else if (id === "f-105") {
            navigate("/modules/f-105"); // Navigate to the previous module
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
            F-106 Read Progress: {moduleProgress.readProgress}%
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
                <CheckCircle className="h-3 w-3 mr-1" /> F-106 Module Fully Completed!
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold mb-3 mt-4">Course Navigation</h3>
        <ul className="space-y-1">
             {/* Link to PREVIOUS module (F-105) */}
            <li onClick={() => handleSectionChange("f-105")} className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm text-green-600 hover:bg-accent">
                <span>F-105: React Fundamentals (Prev)</span>
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
          {/* Next Module Link (F-107) */}
          <motion.li
            onClick={() => handleSectionChange('f-107')}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm
            ${isModuleFullyComplete ? "font-semibold text-blue-600 hover:bg-accent" : "text-muted-foreground"}`}
            variants={isModuleFullyComplete ? pulseVariant : {}}
            animate={isModuleFullyComplete ? "pulse" : ""}
          >
            <span>F-107: React Ecosystem (Next)</span>
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
                <h1 className="text-3xl font-bold text-primary">F-106 Final Assessment</h1>
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
              <Layers className="h-4 w-4 cursor-pointer" />
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
                        onClick={() => handleSectionChange('f-107')} // ACTION: GO TO NEXT MODULE (F-107)
                    >
                        <Play className="mr-2 h-4 w-4" /> Go to Next Module: React Ecosystem (F-107)
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
                    <HelpCircle className="mr-2 h-4 w-4" /> Start F-106 Final Quiz
                </Button>
            )}
        </div>
      </div>
      </motion.div>
    );
};

export default AdvancedReactView;