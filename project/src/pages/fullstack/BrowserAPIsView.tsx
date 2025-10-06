// src/pages/frontend/BrowserAPIsView.tsx
// --- BrowserAPIsView.tsx (F-104 Module View - Browser APIs & DOM - NO QUIZ) ---

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
    Globe, 
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from "react-router-dom";
// Removed imports for ModuleQuiz and QUIZ_QUESTIONS

/* -------------------- INTERFACES -------------------- */
interface CourseSection { id: string; title: string; isCompleted: boolean; }
interface DetailedSubmodule { id: string; title: string; content: React.ReactNode; estimatedReadingTime: string; }
interface ModuleProgress { readProgress: number; isCompleted: boolean; }
interface CourseViewProps { onBack: () => void; planTitle: string; }


/* -------------------- STATIC CONTENT DATA (Declared ONCE) -------------------- */
const MODULE_ID = "f-104";

const ALL_SUBMODULE_DATA: DetailedSubmodule[] = [
    {
        id: "dom-manipulation",
        title: "1. Core DOM Manipulation",
        estimatedReadingTime: "6 min",
        content: (
            <>
                <p className="mb-4">
                    The **Document Object Model (DOM)** is a programming interface for web documents. 
                    It represents the page structure so that programs can change the document structure, style, and content.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Selecting Elements:</h4>
                <ul className="list-disc ml-4 space-y-2">
                    <li>**`document.getElementById('id')`**</li>
                    <li>**`document.querySelector('.class')`** (returns the first match)</li>
                    <li>**`document.querySelectorAll('tag')`** (returns a NodeList)</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Modifying Content and Style</h4>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        const title = document.querySelector('h1');&lt;br/&gt;
                        title.textContent = 'New Title';&lt;br/&gt;
                        title.style.color = 'blue';&lt;br/&gt;
                        title.setAttribute('data-status', 'updated');
                    </code>
                </pre>
            </>
        ),
    },
    {
        id: "event-handling",
        title: "2. Event Handling & Propagation",
        estimatedReadingTime: "5 min",
        content: (
            <>
                <p className="mb-4">
                    Events allow JavaScript to react to user actions (clicks, key presses) or browser actions (loading, resizing).
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Propagation Concepts:</h4>
                <ul className="list-disc ml-4 space-y-2">
                    <li>**Bubbling (Default):** Event starts at the target element and bubbles up to ancestors.</li>
                    <li>**Capturing:** Event starts at the window/document and moves down to the target.</li>
                    <li>**Event Delegation:** Attaching a single event listener to a common ancestor to manage events for many descendants.</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Example: Event Delegation</h4>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        {/* Escaped the arrow function syntax */}
                        document.getElementById('list').addEventListener('click', (e) =&gt; &lcub;<br/>
                        &nbsp;&nbsp;if (e.target.tagName === 'LI') &lcub;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;console.log(e.target.textContent);<br/>
                        &nbsp;&nbsp;&rcub;<br/>
                        &rcub;);
                    </code>
                </pre>
            </>
        ),
    },
    {
        id: "storage-apis",
        title: "3. Storage APIs (Local/Session Storage, Cookies)",
        estimatedReadingTime: "4 min",
        content: (
            <>
                <p className="mb-4">
                    Browser storage allows you to save user data locally.
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Local vs. Session Storage:</h4>
                <ul className="list-disc ml-4 space-y-2">
                    <li>**Local Storage:** Data persists even after the browser is closed.</li>
                    <li>**Session Storage:** Data is cleared when the browser tab is closed.</li>
                    <li>**Both:** Use a simple key/value API and store data as strings (`setItem`, `getItem`).</li>
                </ul>
                <h4 className="text-xl font-semibold mt-6 mb-3">Cookies:</h4>
                <p className="mb-4">
                    Cookies are small data files stored on the client. They are often used for session management 
                    and tracking. Unlike Local Storage, they are automatically sent with every HTTP request.
                </p>
            </>
        ),
    },
    {
        id: "fetch-api",
        title: "4. Data Networking & The Fetch API",
        estimatedReadingTime: "7 min",
        content: (
            <>
                <p className="mb-4">
                    The **Fetch API** is the modern, promise-based way to make network requests (e.g., getting data from a backend API).
                </p>
                <h4 className="text-xl font-semibold mt-6 mb-3">Basic GET Request (Async/Await)</h4>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        async function loadPosts() &lcub;<br/>
                        &nbsp;&nbsp;const response = await fetch('/api/posts');&lt;br/&gt;
                        &nbsp;&nbsp;if (!response.ok) &lcub;<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;throw new Error(`HTTP error! status: ${"{"}response.status{"}"}`);&lt;br/&gt;
                        &nbsp;&nbsp;&rcub;<br/>
                        &nbsp;&nbsp;const data = await response.json();&lt;br/&gt;
                        &nbsp;&nbsp;return data;<br/>
                        &rcub;
                    </code>
                </pre>
                <p className="mt-4 mb-8">
                    Always check the `response.ok` property for successful status codes (200-299) before processing the data. This is the last section of the module!
                </p>
            </>
        ),
    },
];

const LAST_SUBMODULE_ID = ALL_SUBMODULE_DATA[ALL_SUBMODULE_DATA.length - 1].id; // 'fetch-api'

const courseSections: CourseSection[] = [
    { id: "f-103", title: "F-103: Core JavaScript (Prev)", isCompleted: true }, // Link to previous module
    { id: "dom-manipulation", title: "1. DOM Manipulation", isCompleted: false },
    { id: "event-handling", title: "2. Event Handling", isCompleted: false },
    { id: "storage-apis", title: "3. Storage APIs", isCompleted: false },
    { id: "fetch-api", title: "4. Data Networking & Fetch", isCompleted: false },
    { id: "f-101", title: "F-101: Web Essentials (Next)", isCompleted: false }, // Updated Next Link target
];

/* -------------------- LOCAL STORAGE HELPERS -------------------- */
const LOCAL_STORAGE_KEY = "fullStackProgress";

// Updated to match simplified ModuleProgress interface
const getInitialModuleProgress = (moduleId: string): ModuleProgress => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const allProgress = stored ? JSON.parse(stored) : {};
        
        // Default the previous module (F-103) to complete if not set
        if (moduleId === MODULE_ID && !allProgress["f-103"]) {
            allProgress["f-103"] = { readProgress: 100, isCompleted: true, isQuizCompleted: true };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allProgress));
        }

        const storedProgress = allProgress[moduleId] || {};

        return {
            readProgress: storedProgress.readProgress || 0,
            isCompleted: storedProgress.isCompleted || false,
        };
        
    } catch {
        return { readProgress: 0, isCompleted: false };
    }
};

// Updated to save only the necessary keys
const saveModuleProgress = (moduleId: string, newProgress: ModuleProgress) => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const allProgress = stored ? JSON.parse(stored) : {};
        
        allProgress[moduleId] = {
            readProgress: newProgress.readProgress,
            isCompleted: newProgress.isCompleted,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allProgress));
    } catch {}
};

/* -------------------- MAIN COMPONENT -------------------- */
export const BrowserAPIsView: React.FC<CourseViewProps> = ({
    onBack,
    planTitle,
}) => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<string>(ALL_SUBMODULE_DATA[0].id);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [moduleProgress, setModuleProgress] = useState<ModuleProgress>(() => getInitialModuleProgress(MODULE_ID));
    
    const contentRef = useRef<HTMLDivElement>(null);

    // --- SCROLL TRACKING LOGIC ---
    const updateScrollProgress = useCallback(() => {
        const contentDiv = contentRef.current;
        if (!contentDiv) return;
        const { scrollTop, scrollHeight, clientHeight } = contentDiv;
        
        const scrollableHeight = scrollHeight - clientHeight;
        
        // Handle non-scrollable or end-of-module completion
        if (scrollableHeight <= 0 && ALL_SUBMODULE_DATA.length > 0 && activeSection === LAST_SUBMODULE_ID) {
             const isReadCompleted = true;
             if (isReadCompleted && moduleProgress.readProgress !== 100) {
                setModuleProgress((prev) => {
                    const newProgress: ModuleProgress = { readProgress: 100, isCompleted: true };
                    saveModuleProgress(MODULE_ID, newProgress);
                    return newProgress;
                });
             }
             return;
        }
        
        if (scrollableHeight <= 0) return; // Prevent division by zero if content is short

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
    }, [moduleProgress.readProgress, activeSection, moduleProgress.isCompleted]);

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
            if (contentRef.current) contentRef.current.scrollTo(0, 0);
        } else if (id === "f-101") { // Check for the new F-101 target
            if (moduleProgress.isCompleted) {
                navigate("/modules/f-101"); // Navigate to the NEXT module if reading is complete
            } else {
                alert(`You must complete the reading before navigating!`);
            }
        } else if (id === "f-103") {
            navigate("/modules/f-103"); // Navigate to the previous module
        } else if (id === "final-project") {
            alert("Final Project is locked until all prerequisites are met!");
        }
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };
    
    // Module is fully complete when reading is done
    const isModuleFullyComplete = moduleProgress.isCompleted;

    const currentSubmodule =
        ALL_SUBMODULE_DATA.find((m) => m.id === activeSection) ||
        ALL_SUBMODULE_DATA[0];

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
            F-104 Read Progress: {moduleProgress.readProgress}%
          </h4>
          <Progress value={moduleProgress.readProgress} className="h-2 mb-2" />
          {isModuleFullyComplete && (
            <div className="text-xs text-green-500 font-medium mt-1 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" /> F-104 Module Fully Completed!
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold mb-3 mt-4">Course Navigation</h3>
        <ul className="space-y-1">
             {/* Link to PREVIOUS module (F-103) */}
            <li onClick={() => handleSectionChange("f-103")} className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm text-green-600 hover:bg-accent">
                <span>F-103: Core JavaScript (Prev)</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
            </li>
            
          {ALL_SUBMODULE_DATA.map((section) => (
            <li
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm
                ${
                  section.id === activeSection
                    ? "bg-primary/20 dark:bg-primary/40 font-semibold text-primary"
                    : "hover:bg-accent text-card-foreground"
                }`}
            >
              <span>{section.title}</span>
            </li>
          ))}
          {/* Next Module Link (F-101) - UPDATED TARGET */}
          <motion.li
            onClick={() => handleSectionChange('f-101')}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm
            ${isModuleFullyComplete ? "font-semibold text-blue-600 hover:bg-accent" : "text-muted-foreground"}`}
            variants={isModuleFullyComplete ? pulseVariant : {}}
            animate={isModuleFullyComplete ? "pulse" : ""}
          >
            <span>F-101: Web Essentials (Next)</span>
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
      {/* Main Content Area - Renders Reading View Only */}
      <div
        ref={contentRef}
        className="flex-1 p-4 md:p-10 overflow-y-scroll max-h-screen"
      >
        {/* Reading View */}
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
            <Globe className="h-4 w-4 cursor-pointer" />
          </div>
          <div className="prose dark:prose-invert max-w-none">
            {currentSubmodule.content}
          </div>
        </>
        
        {/* === ACTION BUTTON (Always visible) === */}
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
                        onClick={() => handleSectionChange('f-101')} // ACTION: GO TO NEXT MODULE (F-101)
                    >
                        <Play className="mr-2 h-4 w-4" /> Go to Next Module: Web Essentials (F-101)
                    </Button>
                </motion.div>
            ) : (
                // State 2: Reading Pending (Simple message)
                <div className="text-sm text-muted-foreground text-center">
                    Scroll to the end of the module to unlock the next module
                </div>
            )}
        </div>
      </div>
      </motion.div>
    );
};

export default BrowserAPIsView;