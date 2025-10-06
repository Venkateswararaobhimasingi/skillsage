import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
    CheckCircle,
    Play,
    ArrowLeft,
    Share2,
    Database, // Added Database icon for thematic touch
    Target,
    Menu,
    X,
    Clock,
    // Removed HelpCircle as quiz is gone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
// Removed import for ModuleQuiz and QUIZ_QUESTIONS

// --- INTERFACES ---
interface CourseSection {
    id: string;
    title: string;
    isCompleted: boolean;
}
interface DetailedSubmodule {
    id: string;
    title: string;
    content: React.ReactNode;
    estimatedReadingTime: string;
}
// Simplified ModuleProgress: isQuizCompleted is not used here
interface ModuleProgress {
    readProgress: number;
    isCompleted: boolean; // Module complete when reading is done
}
interface CourseViewProps {
    onBack: () => void;
    planTitle: string;
}

// --- STATIC CONTENT DATA ---
const MODULE_ID = "b-102";
// QUIZ_ID removed

const ALL_SUBMODULE_DATA: DetailedSubmodule[] = [
    {
        id: "intro-to-sql",
        title: "1. Introduction to SQL and Databases",
        estimatedReadingTime: "5 min",
        content: (
            <>
                <p className="mb-4">
                    **SQL (Structured Query Language)** is used to manage and query data in
                    relational databases. It allows you to define tables, insert, modify,
                    and retrieve data efficiently.
                </p>
                <h4 className="text-xl font-semibold mt-4 mb-3">
                    Common SQL Database Systems:
                </h4>
                <ul className="list-disc ml-5 space-y-2">
                    <li>MySQL</li>
                    <li>PostgreSQL</li>
                    <li>SQLite</li>
                    <li>Oracle</li>
                </ul>
                <p className="mt-4">
                    SQL is divided into categories: DDL, DML, DCL, and TCL.
                </p>
            </>
        ),
    },
    {
        id: "ddl-dml",
        title: "2. DDL & DML – Create and Modify Data",
        estimatedReadingTime: "6 min",
        content: (
            <>
                <h4 className="text-xl font-semibold mt-4 mb-3">DDL (Data Definition Language)</h4>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        CREATE TABLE Students (
                        <br />&nbsp;&nbsp;id INT PRIMARY KEY,
                        <br />&nbsp;&nbsp;name VARCHAR(100),
                        <br />&nbsp;&nbsp;age INT
                        <br />);
                        <br />
                        ALTER TABLE Students ADD email VARCHAR(255);
                        <br />
                        DROP TABLE Students;
                    </code>
                </pre>

                <h4 className="text-xl font-semibold mt-6 mb-3">DML (Data Manipulation Language)</h4>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        INSERT INTO Students (id, name, age) VALUES (1, 'Alice', 21);
                        <br />
                        UPDATE Students SET age = 22 WHERE id = 1;
                        <br />
                        DELETE FROM Students WHERE id = 1;
                    </code>
                </pre>
                <p className="mt-4">
                    DDL changes structure, while DML manipulates the data inside tables.
                </p>
            </>
        ),
    },
    {
        id: "queries-and-joins",
        title: "3. SELECT Queries and Joins",
        estimatedReadingTime: "7 min",
        content: (
            <>
                <h4 className="text-xl font-semibold mt-4 mb-3">Basic SELECT Query</h4>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        SELECT name, age FROM Students WHERE age &gt; 18;
                    </code>
                </pre>
                <p className="mt-3">
                    Filtering is done using WHERE, and sorting using ORDER BY.
                </p>

                <h4 className="text-xl font-semibold mt-6 mb-3">JOIN Example</h4>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        SELECT s.name, c.course_name
                        <br />
                        FROM Students s
                        <br />
                        JOIN Courses c ON s.id = c.student_id;
                    </code>
                </pre>
                <p className="mt-3 mb-6">
                    Joins combine related data from multiple tables. Common types include
                    INNER JOIN, LEFT JOIN, and RIGHT JOIN.
                </p>
            </>
        ),
    },
    {
        id: "constraints",
        title: "4. Constraints and Keys",
        estimatedReadingTime: "5 min",
        content: (
            <>
                <p className="mb-4">
                    **Constraints** ensure data accuracy and integrity. They define rules for
                    table columns.
                </p>
                <ul className="list-disc ml-5 space-y-2">
                    <li>PRIMARY KEY – Uniquely identifies a record.</li>
                    <li>FOREIGN KEY – Links to another table’s primary key.</li>
                    <li>UNIQUE – Ensures no duplicate values.</li>
                    <li>NOT NULL – Disallows empty (NULL) values.</li>
                    <li>CHECK – Adds a condition that values must satisfy.</li>
                </ul>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800 mt-4">
                    <code>
                        CREATE TABLE Orders (
                        <br />&nbsp;&nbsp;order_id INT PRIMARY KEY,
                        <br />&nbsp;&nbsp;price DECIMAL CHECK (price &gt; 0)
                        <br />);
                    </code>
                </pre>
                <p className="mt-6 mb-8">
                    With constraints, SQL databases maintain consistency even with complex
                    relationships.
                </p>
            </>
        ),
    },
];

const LAST_SUBMODULE_ID =
    ALL_SUBMODULE_DATA[ALL_SUBMODULE_DATA.length - 1].id;

const LOCAL_STORAGE_KEY = "fullStackProgress";

// Update initial progress function to match simplified interface and set module complete
const getInitialModuleProgress = (moduleId: string): ModuleProgress => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const allProgress = stored ? JSON.parse(stored) : {};
        
        // Default the previous module (B-101) to complete (assuming B-101 requires quiz)
        if (moduleId === "b-102" && !allProgress["b-101"]) {
            allProgress["b-101"] = {
                readProgress: 100,
                isCompleted: true,
                isQuizCompleted: true,
            };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allProgress));
        }
        
        // Return only the expected keys (isQuizCompleted must be ignored if read from storage)
        const storedProgress = allProgress[moduleId] || {};
        
        return {
            readProgress: storedProgress.readProgress || 0,
            isCompleted: storedProgress.isCompleted || false,
        };
        
    } catch {
        return { readProgress: 0, isCompleted: false };
    }
};

// Update save progress function to only save the simplified keys
const saveModuleProgress = (moduleId: string, newProgress: ModuleProgress) => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const allProgress = stored ? JSON.parse(stored) : {};
        
        // Save only the simplified structure
        allProgress[moduleId] = {
            readProgress: newProgress.readProgress,
            isCompleted: newProgress.isCompleted,
            // We explicitly set isQuizCompleted to true for B-102 if reading is done, or ignore it entirely.
            // Let's just rely on isCompleted for the simple path.
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allProgress));
    } catch {}
};

// --- MAIN COMPONENT ---
export const SqlEssentialsView: React.FC<CourseViewProps> = ({
    onBack,
    planTitle,
}) => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<string>(
        ALL_SUBMODULE_DATA[0].id
    );
    const [moduleProgress, setModuleProgress] = useState<ModuleProgress>(() =>
        getInitialModuleProgress(MODULE_ID)
    );
    // isQuizActive and quizAttemptFailed are removed as per request
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const contentRef = useRef<HTMLDivElement>(null);


    // Quiz-related handlers removed

    const updateScrollProgress = useCallback(() => {
        // isQuizActive check is removed
        const div = contentRef.current;
        if (!div) return;

        const { scrollTop, scrollHeight, clientHeight } = div;
        const scrollable = scrollHeight - clientHeight;
        
        // Handle non-scrollable content or very short content
        if (scrollable <= 0 && ALL_SUBMODULE_DATA.length > 0 && activeSection === LAST_SUBMODULE_ID) {
             const updated: ModuleProgress = { readProgress: 100, isCompleted: true };
             // Only update if current state is different
             if (moduleProgress.readProgress !== 100) {
                 setModuleProgress(updated);
                 saveModuleProgress(MODULE_ID, updated);
             }
             return;
        }
        
        // Check if there is scrollable content
        if (scrollable <= 0) return;

        const progress = Math.min(
            100,
            Math.round((scrollTop / scrollable) * 100)
        );
        const isReadCompleted = progress >= 95 && activeSection === LAST_SUBMODULE_ID;

        // Update if progress changed or if completion was just reached
        if (progress !== moduleProgress.readProgress || (isReadCompleted && !moduleProgress.isCompleted)) {
             setModuleProgress((prev) => {
                 const newProgress: ModuleProgress = {
                     ...prev,
                     readProgress: progress,
                     isCompleted: prev.isCompleted || isReadCompleted,
                 };
                 saveModuleProgress(MODULE_ID, newProgress);
                 return newProgress;
             });
        }
    }, [activeSection, moduleProgress]);

    useEffect(() => {
        const div = contentRef.current;
        if (div) div.addEventListener("scroll", updateScrollProgress);
        updateScrollProgress();
        return () => {
            if (div) div.removeEventListener("scroll", updateScrollProgress);
        };
    }, [updateScrollProgress]);

    
    // NAVIGATION TO NEXT MODULE: B-103 (BrowserAPIsView)
    const handleNextModule = () => {
        // Navigation is simple since the quiz is removed
        navigate("/modules/b-103");
    };
    
    // Handler for sidebar content/submodule navigation
    const handleSectionChange = (id: string) => {
        if (ALL_SUBMODULE_DATA.find((m) => m.id === id)) {
            setActiveSection(id);
            // isQuizActive related logic removed
            if (contentRef.current) contentRef.current.scrollTo(0, 0);
        } else if (id === "b-101") {
            navigate("/modules/b-101"); // Previous Module
        } else if (id === "b-103") {
            if (moduleProgress.isCompleted) { // Check only for reading completion
                handleNextModule(); // Navigate to next module
            } else {
                alert("You must complete the reading to continue to the next module.");
            }
        }
        // Close sidebar on mobile navigation
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    // Module is fully complete when reading is done
    const isModuleFullyComplete = moduleProgress.isCompleted;

    const currentSubmodule =
        ALL_SUBMODULE_DATA.find((s) => s.id === activeSection) ||
        ALL_SUBMODULE_DATA[0];
        
    // Pulse animation variant for the NEXT module button/sidebar link
    const pulseVariant = {
        pulse: {
            scale: [1, 1.01, 1],
            boxShadow: ["0 0 0 0 rgba(59,130,246,0.15)", "0 0 0 8px rgba(59,130,246,0)"],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    /* -------------------- RENDER -------------------- */
    const sidebarContent = (
        <div className="w-full bg-card p-4 space-y-2 h-full overflow-y-auto">
            <Button variant="outline" onClick={onBack} className="w-full mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
            </Button>
            <div className="p-3 border rounded-lg bg-accent/20">
                <h4 className="text-sm font-semibold mb-2">
                    B-102 Read Progress: {moduleProgress.readProgress}%
                </h4>
                <Progress value={moduleProgress.readProgress} className="h-2 mb-2" />
                {isModuleFullyComplete && (
                    <div className="text-xs text-green-500 font-medium flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" /> Module Completed!
                    </div>
                )}
            </div>
            
            <h3 className="text-lg font-bold mb-3 mt-4">Course Navigation</h3>
            <ul className="space-y-1 mt-4 text-sm">
                {/* Link to PREVIOUS module (B-101) - Assume complete for this context */}
                <li onClick={() => handleSectionChange("b-101")} className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm text-green-600 hover:bg-accent">
                    <span>B-101: Python Essentials (Prev)</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                </li>
                
                {ALL_SUBMODULE_DATA.map((section) => (
                    <li
                        key={section.id}
                        onClick={() => {
                            setActiveSection(section.id);
                            if (contentRef.current) contentRef.current.scrollTo(0, 0);
                        }}
                        className={`p-3 rounded-lg cursor-pointer transition ${
                            section.id === activeSection
                                ? "bg-primary/20 text-primary font-semibold"
                                : "hover:bg-accent text-card-foreground"
                        }`}
                    >
                        {section.title}
                    </li>
                ))}
                 
                {/* Link to NEXT module (B-103) */}
                <motion.li 
                    onClick={() => handleSectionChange("b-103")} 
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm ${isModuleFullyComplete ? "font-semibold text-blue-600" : "text-muted-foreground hover:bg-accent"}`}
                    variants={isModuleFullyComplete ? pulseVariant : {}}
                    animate={isModuleFullyComplete ? "pulse" : ""}
                >
                    <span>B-103: Browser APIs & DOM</span>
                    {isModuleFullyComplete ? <Play className="h-4 w-4 text-blue-600" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
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
                <div className="fixed inset-0 z-40 md:hidden bg-black/50" onClick={() => setIsSidebarOpen(false)}>
                    <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.25 }} className="absolute left-0 top-0 w-64 h-full bg-card shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end p-4">
                            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                        {sidebarContent} 
                    </motion.div>
                </div>
            )}

            {/* Main Content */}
            <div ref={contentRef} className="flex-1 p-6 overflow-y-scroll max-h-screen">
                {/* Quiz View is completely removed */}
                
                {/* Reading View */}
                <header className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-bold">{currentSubmodule.title}</h1>
                    <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(true)} className="md:hidden">
                        <Menu className="h-6 w-6" />
                    </Button>
                </header>
                <div className="flex items-center text-sm text-muted-foreground mb-6 space-x-4">
                    <span>Reading Time: {currentSubmodule.estimatedReadingTime}</span>
                    <Database className="h-4 w-4" />
                    <Share2 className="h-4 w-4" />
                </div>
                
                <div className="prose dark:prose-invert max-w-none mb-10">
                    {currentSubmodule.content}
                </div>

                {/* --- ACTION BUTTONS --- */}
                <div className="border-t pt-6">
                    {isModuleFullyComplete ? (
                        <motion.div variants={pulseVariant} animate="pulse" className="rounded-md overflow-hidden">
                            <Button className="w-full" onClick={handleNextModule}>
                                <Play className="mr-2 h-4 w-4" /> Go to Next Module: Browser APIs (B-103)
                            </Button>
                        </motion.div>
                    ) : (
                        <div className="text-sm text-muted-foreground text-center">
                            Scroll to end to unlock the next module (B-103)
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SqlEssentialsView;