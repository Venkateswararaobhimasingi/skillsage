// CSSMastery.tsx (F-102 Module View - FINAL TSX ERROR-FREE VERSION - Fix 2)

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

// --- 1. INTERFACES ---
interface CourseSection { id: string; title: string; isCompleted: boolean; }
interface DetailedSubmodule { id: string; title: string; content: React.ReactNode; estimatedReadingTime: string; }
interface ModuleProgress { readProgress: number; isCompleted: boolean; }
interface CourseViewProps { onBack: () => void; planTitle: string; }

// --- 2. STATIC CONTENT DATA (F-102 Module Content - Expanded) ---
const ALL_SUBMODULE_DATA: DetailedSubmodule[] = [
    {
        id: "box-model",
        title: "1. Box Model & Sizing Fundamentals",
        estimatedReadingTime: "8 min",
        content: (
            <>
                <p className="mb-4">
                    The **CSS Box Model** dictates how space is consumed around every HTML element. Understanding it prevents layout confusion. Every box consists of four layers: **Content, Padding, Border, and Margin.**
                </p>
                
                <h4 className="text-xl font-semibold mt-6 mb-3">The Box Model Layers:</h4>
                <ul className="list-disc ml-4 space-y-2">
                    <li>**Content:** The actual image, text, or video.</li>
                    <li>**Padding:** Space between the content and the border (uses the element's background color).</li>
                    <li>**Border:** The line surrounding the padding.</li>
                    <li>**Margin:** Clear space *outside* the border, separating the element from others (transparent).</li>
                </ul>

                <h4 className="text-xl font-semibold mt-6 mb-3">The `box-sizing` Magic Property</h4>
                <p className="mb-2">
                    By default (`content-box`), setting a width of 200px means the total width will be `200px + padding + border`. This is confusing!
                </p>
                <p className="mb-2">
                    Use **`box-sizing: border-box;`** globally to ensure `width: 200px` means the total width (including padding and border) is 200px.
                </p>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        /* Global reset for modern layouts */<br/>
                        * {'{'} box-sizing: border-box; {'}'}<br/>
                        <br/>
                        .card {'{'}<br/>
                        &nbsp;&nbsp;width: 200px; <br/>
                        &nbsp;&nbsp;padding: 10px; /* Included in the 200px total width */<br/>
                        &nbsp;&nbsp;border: 5px solid red;<br/>
                        {'}'}
                    </code>
                </pre>
                <p className="mt-4 mb-8">
                    This single property is a game-changer for responsive design and predictable sizing.
                </p>
            </>
        ),
    },
    {
        id: "selectors",
        title: "2. Advanced Selectors & Specificity",
        estimatedReadingTime: "10 min",
        content: (
            <>
                <p className="mb-4">
                    **Specificity** is how the browser decides which styles apply when multiple rules target the same element. Higher specificity wins.
                </p>
                
                <h4 className="text-xl font-semibold mt-6 mb-3">Specificity Hierarchy (Highest to Lowest):</h4>
                <ol className="list-decimal ml-6 space-y-2">
                    <li>**Inline Styles** (`style=""` attribute).</li>
                    <li>**IDs** (`#id`).</li>
                    <li>**Classes** (`.class`), Attributes (`[type="text"]`), and Pseudo-classes (`:hover`).</li>
                    <li>**Elements** (`p`, `div`) and Pseudo-elements (`::before`).</li>
                </ol>
                <p className="mt-4 text-sm text-red-500">
                    **Note:** The `!important` rule overrides all of the above but should almost never be used.
                </p>

                <h4 className="text-xl font-semibold mt-6 mb-3">Advanced Selectors (Combinators)</h4>
                <ul className="list-disc ml-4 space-y-2">
                    {/* FIXED: Replaced the literal > with &gt; in the combinator definition string */}
                    <li>**Descendant (` `):** `div p` selects *all* `&lt;p&gt;` elements inside a `&lt;div&gt;`.</li>
                    <li>**Child (`&gt;`):** `ul &gt; li` selects only *direct* `&lt;li&gt;` children of a `&lt;ul&gt;`.</li>
                    <li>**Adjacent Sibling (`+`):** `h2 + p` selects the first `&lt;p&gt;` immediately following an `&lt;h2&gt;`.</li>
                    <li>**General Sibling (`~`):** `h2 ~ p` selects *all* `&lt;p&gt;` elements following an `&lt;h2&gt;`.</li>
                </ul>

                <h4 className="text-xl font-semibold mt-6 mb-3">Example: Targeting the first link in a menu</h4>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        .menu-item:first-child a {'{'} font-weight: bold; {'}'}<br/>
                        <br/>
                        /* Using pseudo-elements to add an icon */<br/>
                        .button::before {'{'} content: "➤"; margin-right: 5px; {'}'}
                    </code>
                </pre>
                <p className="mt-4 mb-8">
                    Mastering selectors allows you to write clean, reusable, and highly targeted CSS.
                </p>
            </>
        ),
    },
    {
        id: "flexbox",
        title: "3. Flexbox for One-Dimensional Layouts",
        estimatedReadingTime: "12 min",
        content: (
            <>
                <p className="mb-4">
                    **Flexbox** (Flexible Box Module) is designed for laying out, aligning, and distributing space among items in a container, even when their size is unknown or dynamic. It is one-dimensional (row or column).
                </p>

                <h4 className="text-xl font-semibold mt-6 mb-3">Flex Container Properties:</h4>
                <ul className="list-disc ml-4 space-y-2">
                    <li>**`display: flex;`**: Defines the container.</li>
                    <li>**`flex-direction`**: Sets the main axis (`row`, `column`).</li>
                    <li>**`justify-content`**: Alignment along the main axis (e.g., `space-between`, `center`).</li>
                    <li>**`align-items`**: Alignment along the cross axis (e.g., `center`, `flex-start`).</li>
                </ul>
                
                <h4 className="text-xl font-semibold mt-6 mb-3">Flex Item Properties:</h4>
                <ul className="list-disc ml-4 space-y-2">
                    <li>**`flex-grow`**: Defines the ability for an item to grow if necessary (e.g., `flex-grow: 1` fills remaining space).</li>
                    <li>**`flex-shrink`**: Defines the ability for an item to shrink if necessary.</li>
                    <li>**`flex-basis`**: Sets the default size of an element before distribution.</li>
                </ul>

                <h4 className="text-xl font-semibold mt-6 mb-3">Example: Responsive Navigation Bar</h4>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        .nav-bar {'{'}<br/>
                        &nbsp;&nbsp;display: flex;<br/>
                        &nbsp;&nbsp;justify-content: space-between;<br/>
                        &nbsp;&nbsp;align-items: center;<br/>
                        {'}'}
                    </code>
                </pre>

                <p className="mt-4 mb-8">
                    Flexbox is your go-to tool for nearly all component-level layouts.
                </p>
            </>
        ),
    },
    {
        id: "css-grid",
        title: "4. CSS Grid for Two-Dimensional Layouts",
        estimatedReadingTime: "15 min",
        content: (
            <>
                <p className="mb-4">
                    **CSS Grid** is the most powerful tool for creating complex, two-dimensional (rows *and* columns) web page layouts. It operates by defining tracks and placing items onto them.
                </p>

                <h4 className="text-xl font-semibold mt-6 mb-3">Key Grid Container Properties:</h4>
                <ul className="list-disc ml-4 space-y-2">
                    <li>**`display: grid;`**: Defines the grid container.</li>
                    <li>**`grid-template-columns`**: Defines the column tracks (e.g., `1fr 200px 1fr`).</li>
                    <li>**`grid-template-rows`**: Defines the row tracks.</li>
                    <li>**`gap`**: Sets the space between grid tracks.</li>
                </ul>
                
                <h4 className="text-xl font-semibold mt-6 mb-3">Grid Item Properties (Placement):</h4>
                <ul className="list-disc ml-4 space-y-2">
                    <li>**`grid-column-start` / `grid-column-end`**: Spans an item across columns.</li>
                    <li>**`grid-area`**: Assigns a name to an item for placement in a template.</li>
                </ul>

                <h4 className="text-xl font-semibold mt-6 mb-3">Example: Standard Page Layout (Header/Sidebar/Main)</h4>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        .page-layout {'{'}<br/>
                        &nbsp;&nbsp;display: grid;<br/>
                        &nbsp;&nbsp;grid-template-columns: 200px 1fr;<br/>
                        &nbsp;&nbsp;grid-template-rows: auto 1fr auto;<br/>
                        &nbsp;&nbsp;grid-template-areas: <br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"header header"<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"sidebar main"<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;"footer footer";<br/>
                        {'}'}<br/>
                        <br/>
                        .sidebar {'{'} grid-area: sidebar; {'}'}<br/>
                        .header {'{'} grid-area: header; {'}'}
                    </code>
                </pre>
                <p className="mt-4 mb-8">
                    CSS Grid is the superior tool for macro-layouts, while Flexbox handles the micro-layouts within the grid cells. Scroll to the very bottom to mark F-102 as completed!
                </p>
            </>
        ),
    },
];

// --- Sidebar Data ---
const MODULE_ID = "f-102";
// We define the ID of the last content submodule to control button rendering
const LAST_SUBMODULE_ID = ALL_SUBMODULE_DATA[ALL_SUBMODULE_DATA.length - 1].id; // 'css-grid'

const courseSections: CourseSection[] = [
    { id: "box-model", title: "1. Box Model & Sizing", isCompleted: false },
    { id: "selectors", title: "2. CSS Selectors", isCompleted: false },
    { id: "flexbox", title: "3. Flexbox", isCompleted: false },
    { id: "css-grid", title: "4. CSS Grid", isCompleted: false },
    { id: "f-103", title: "F-103: Core JS (Next)", isCompleted: false }, // Link to next module
    { id: "final-project", title: "Final Project", isCompleted: false },
];

// --- 3. PROGRESS PERSISTENCE ---
const LOCAL_STORAGE_KEY = "fullStackProgress";

const getInitialModuleProgress = (moduleId: string): ModuleProgress => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const allProgress = stored ? JSON.parse(stored) : {};
        return allProgress[moduleId] || { readProgress: 0, isCompleted: false };
    } catch {
        return { readProgress: 0, isCompleted: false };
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
export const CSSMasteryView: React.FC<CourseViewProps> = ({
    onBack,
    planTitle,
}) => {
    const navigate = useNavigate();
    const currentModuleId = MODULE_ID;

    const [activeSection, setActiveSection] = useState<string>(ALL_SUBMODULE_DATA[0].id);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [moduleProgress, setModuleProgress] = useState<ModuleProgress>(() => getInitialModuleProgress(MODULE_ID));

    const contentRef = useRef<HTMLDivElement>(null);

    // --- SCROLL TRACKING LOGIC ---
    const updateScrollProgress = useCallback(() => {
        const contentDiv = contentRef.current;
        if (!contentDiv) return;
        const { scrollTop, scrollHeight, clientHeight } = contentDiv;
        if (scrollHeight <= clientHeight) return;
        const scrollableHeight = scrollHeight - clientHeight;
        const currentProgress = Math.min(100, Math.round((scrollTop / scrollableHeight) * 100));

        if (currentProgress !== moduleProgress.readProgress) {
            // Module completion only set if user scrolls past 95% AND is viewing the last submodule
            const isCompleted = currentProgress >= 95 && activeSection === LAST_SUBMODULE_ID;
            
            setModuleProgress((prev) => {
                const newProgress: ModuleProgress = {
                    readProgress: currentProgress,
                    isCompleted: prev.isCompleted || isCompleted,
                };
                saveModuleProgress(MODULE_ID, newProgress);
                return newProgress;
            });
        }
    }, [moduleProgress.readProgress, activeSection]);

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
        } else if (id === "f-103" && moduleProgress.isCompleted) {
        // Navigate to next module if F-102 is completed
        navigate("/modules/f-103"); 
        } else if (id === "f-103") {
            alert('Complete the F-102 reading before starting the next module!');
        } else if (id === "final-project") {
        alert("Final Project is locked until all prerequisites are met!");
        }
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const currentSubmodule =
        ALL_SUBMODULE_DATA.find((m) => m.id === activeSection) ||
        ALL_SUBMODULE_DATA[0];

    const dynamicSidebarSections: CourseSection[] = courseSections.map(
        (section) => ({
            ...section,
            isCompleted:
                section.id === MODULE_ID ? moduleProgress.isCompleted : section.isCompleted,
        })
    );

    // Sidebar Content
    const sidebarContent = (
        <div className="w-full bg-card p-4 space-y-2 h-full overflow-y-auto">
            <Button variant="outline" onClick={onBack} className="w-full mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
            </Button>
            <div className="p-3 border rounded-lg bg-accent/20">
                <h4 className="text-sm font-semibold mb-2">
                    F-102 Progress: {moduleProgress.readProgress}%
                </h4>
                <Progress value={moduleProgress.readProgress} className="h-2" />
                {moduleProgress.isCompleted && (
                    <div className="text-xs text-green-500 font-medium mt-1 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" /> F-102 Module Completed!
                    </div>
                )}
            </div>
            <h3 className="text-lg font-bold mb-3 mt-4">Course Navigation</h3>
            <ul className="space-y-1">
                {courseSections.slice(0, 4).map((section) => (
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
                {/* Next Module/Project Links */}
                {dynamicSidebarSections.slice(4).map((section) => (
                    <li
                        key={section.id}
                        onClick={() => handleSectionChange(section.id)}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm
                        ${section.id === activeSection ? "bg-primary/20" : "hover:bg-accent"}`}
                    >
                        <span>{section.title}</span>
                        {section.isCompleted && (
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        )}
                    </li>
                ))}
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
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                        {sidebarContent}
                    </motion.div>
                </div>
            )}
            {/* Main Content */}
            <div
                ref={contentRef}
                className="flex-1 p-4 md:p-10 overflow-y-scroll max-h-screen"
            >
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
                
                {/* Action Button (Visible ONLY on the last submodule: 'css-grid') */}
                {activeSection === LAST_SUBMODULE_ID && (
                    <div className="mt-10 pt-6 border-t">
                        <Button
                            className="w-full"
                            variant={moduleProgress.isCompleted ? "default" : "secondary"}
                            disabled={!moduleProgress.isCompleted}
                            onClick={() => moduleProgress.isCompleted && handleSectionChange('f-103')} // Navigate to F-103
                        >
                            {moduleProgress.isCompleted ? (
                                <>
                                    <Play className="mr-2 h-4 w-4" /> Go to Next Module: **Core JS**
                                </>
                            ) : (
                                <>
                                    <Clock className="mr-2 h-4 w-4" /> Complete Reading to Proceed
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};