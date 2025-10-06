// Frontend.tsx (F-101 Module View - Web Essentials)

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

// --- 1. INTERFACES ---
interface CourseSection { id: string; title: string; isCompleted: boolean; }
interface DetailedSubmodule { id: string; title: string; content: React.ReactNode; estimatedReadingTime: string; }
interface ModuleProgress { readProgress: number; isCompleted: boolean; }
interface FrontendCourseViewProps { onBack: () => void; planTitle: string; }


// --- 2. STATIC CONTENT DATA (F-101 Module Content) ---
const ALL_SUBMODULE_DATA: DetailedSubmodule[] = [
    {
        id: 'semantic-structure',
        title: '1. Semantic Structure: Header, Main, Footer',
        estimatedReadingTime: '12 min',
        content: (
            <>
                <p className="mb-4">
                    Semantic HTML provides meaning to your web page’s structure and helps browsers, developers, and assistive technologies understand the hierarchy of your content. 
                    Unlike non-semantic tags (like <code>&lt;div&gt;</code> or <code>&lt;span&gt;</code>), semantic elements clearly describe their purpose.
                </p>

                <h4 className="text-xl font-semibold mt-6 mb-3">Why Use Semantic HTML?</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Improves **SEO** — Search engines index your site more accurately.</li>
                    <li>Enhances **Accessibility** — Screen readers can interpret the structure.</li>
                    <li>Improves **Maintainability** — Other developers easily understand your layout.</li>
                </ul>

                <h4 className="text-xl font-semibold mt-6 mb-3">Common Semantic Tags and Their Uses:</h4>
                <table className="w-full text-sm border border-gray-300 dark:border-gray-700">
                    <thead className="bg-gray-200 dark:bg-gray-800">
                        <tr>
                            <th className="p-2 text-left">Tag</th>
                            <th className="p-2 text-left">Purpose</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td className="p-2"><code>&lt;header&gt;</code></td><td className="p-2">Top section for titles, logos, navigation.</td></tr>
                        <tr><td className="p-2"><code>&lt;main&gt;</code></td><td className="p-2">Primary page content (unique per page).</td></tr>
                        <tr><td className="p-2"><code>&lt;section&gt;</code></td><td className="p-2">Groups related thematic content.</td></tr>
                        <tr><td className="p-2"><code>&lt;article&gt;</code></td><td className="p-2">Self-contained content unit (blog post, news card).</td></tr>
                        <tr><td className="p-2"><code>&lt;aside&gt;</code></td><td className="p-2">Supplementary info like ads, links, or sidebars.</td></tr>
                        <tr><td className="p-2"><code>&lt;footer&gt;</code></td><td className="p-2">Bottom section for copyright and links.</td></tr>
                    </tbody>
                </table>

                <h4 className="text-xl font-semibold mt-6 mb-3">Example: Blog Page Layout</h4>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        &lt;header&gt;
                        <br />&nbsp;&nbsp;&lt;h1&gt;My Tech Blog&lt;/h1&gt;
                        <br />&nbsp;&nbsp;&lt;nav&gt;
                        <br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;a href="/"&gt;Home&lt;/a&gt;
                        <br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;a href="/about"&gt;About&lt;/a&gt;
                        <br />&nbsp;&nbsp;&lt;/nav&gt;
                        <br />&lt;/header&gt;

                        <br />&lt;main&gt;
                        <br />&nbsp;&nbsp;&lt;article&gt;
                        <br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;header&gt;&lt;h2&gt;Understanding Flexbox&lt;/h2&gt;&lt;/header&gt;
                        <br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;section&gt;...content...&lt;/section&gt;
                        <br />&nbsp;&nbsp;&nbsp;&nbsp;&lt;footer&gt;By Jane Doe&lt;/footer&gt;
                        <br />&nbsp;&nbsp;&lt;/article&gt;
                        <br />&lt;/main&gt;

                        <br />&lt;footer&gt;
                        <br />&nbsp;&nbsp;&lt;p&gt;© 2025 My Tech Blog&lt;/p&gt;
                        <br />&lt;/footer&gt;
                    </code>
                </pre>

                <h4 className="text-xl font-semibold mt-6 mb-3">Common Mistakes</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Using multiple <code>&lt;main&gt;</code> elements — only one allowed per page.</li>
                    <li>Misusing <code>&lt;section&gt;</code> without headings — every section should ideally have a heading.</li>
                    <li>Using <code>&lt;div&gt;</code> for semantic content — always prefer semantic elements.</li>
                </ul>

                <p className="mt-6 mb-8">
                    Semantic structure forms the foundation of every good webpage. It’s not just about layout — it’s about communication between humans and machines.
                </p>
            </>
        ),
    },
    {
        id: 'accessibility-roles',
        title: '2. Accessibility: ARIA Roles & Best Practices',
        estimatedReadingTime: '13 min',
        content: (
            <>
                <p className="mb-4">
                    Accessibility (A11y) ensures your website can be used by everyone, including those relying on assistive technologies such as screen readers or keyboard navigation. 
                    ARIA (Accessible Rich Internet Applications) enhances accessibility when native HTML elements fall short.
                </p>

                <h4 className="text-xl font-semibold mt-6 mb-3">Keyboard Accessibility</h4>
                <p>Every interactive element (links, buttons, inputs) must be focusable and operable with a keyboard.</p>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        &lt;button&gt;Submit&lt;/button&gt; 
                        {/* Focusable and triggers Enter/Space by default */}
                    </code>
                </pre>
                <p>For non-semantic elements, add <code>tabindex="0"</code> and a <code>role</code> attribute.</p>

                <h4 className="text-xl font-semibold mt-6 mb-3">ARIA Roles Examples</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><code>role="button"</code> – Makes a non-button act like one.</li>
                    <li><code>role="alert"</code> – Announces dynamic messages automatically.</li>
                    <li><code>role="navigation"</code> – Groups navigation links.</li>
                    <li><code>aria-live="polite"</code> – Announces updates without interrupting.</li>
                </ul>

                <h4 className="text-xl font-semibold mt-6 mb-3">Example: Accessible Custom Toggle</h4>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        &lt;div
                        <br />&nbsp;&nbsp;role="button"
                        <br />&nbsp;&nbsp;tabindex="0"
                        <br />&nbsp;&nbsp;aria-pressed="false"
                        <br />&gt;Mute Audio&lt;/div&gt;
                    </code>
                </pre>

                <h4 className="text-xl font-semibold mt-6 mb-3">Testing Accessibility</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Use **Lighthouse** (Chrome DevTools → Audits).</li>
                    <li>Use **axe DevTools** for quick accessibility scans.</li>
                    <li>Test with keyboard only — ensure you can navigate all interactive elements.</li>
                </ul>

                <p className="mt-6 mb-8">
                    ARIA is powerful, but remember: **"Don’t use ARIA when you can use native HTML."** The best accessibility comes from proper semantic structure combined with minimal ARIA.
                </p>
            </>
        ),
    },
    {
        id: 'html-forms',
        title: '3. HTML Forms & Validation',
        estimatedReadingTime: '14 min',
        content: (
            <>
                <p className="mb-4">
                    Forms are the backbone of user interaction — from login screens to surveys. 
                    A well-structured form is accessible, validated, and visually clear.
                </p>

                <h4 className="text-xl font-semibold mt-6 mb-3">1️⃣ Basic Form Anatomy</h4>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        &lt;form action="/submit" method="POST"&gt;
                        <br />&nbsp;&nbsp;&lt;label for="email"&gt;Email:&lt;/label&gt;
                        <br />&nbsp;&nbsp;&lt;input type="email" id="email" required /&gt;
                        <br />&nbsp;&nbsp;&lt;button type="submit"&gt;Submit&lt;/button&gt;
                        <br />&lt;/form&gt;
                    </code>
                </pre>

                <h4 className="text-xl font-semibold mt-6 mb-3">2️⃣ Input Types You Should Know</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><code>type="email"</code> – Validates email format.</li>
                    <li><code>type="number"</code> – Restricts input to numbers.</li>
                    <li><code>type="date"</code> – Opens a calendar picker.</li>
                    <li><code>type="password"</code> – Masks sensitive input.</li>
                    <li><code>type="file"</code> – Allows file upload.</li>
                </ul>

                <h4 className="text-xl font-semibold mt-6 mb-3">3️⃣ Validation Techniques</h4>
                <p>Always prefer **HTML5 validation** before relying on JavaScript.</p>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        &lt;input
                        <br />&nbsp;&nbsp;type="tel"
                        <br />&nbsp;&nbsp;pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        <br />&nbsp;&nbsp;required
                        <br />&nbsp;&nbsp;placeholder="123-456-7890"
                        <br />/&gt;
                    </code>
                </pre>

                <h4 className="text-xl font-semibold mt-6 mb-3">4️⃣ Accessibility in Forms</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Always associate <code>&lt;label&gt;</code> with <code>&lt;input&gt;</code> via the <code>for</code> attribute.</li>
                    <li>Use <code>aria-invalid</code> and <code>aria-describedby</code> for custom error messages.</li>
                    <li>Provide clear visual focus states for all inputs.</li>
                </ul>

                <h4 className="text-xl font-semibold mt-6 mb-3">5️⃣ Example: Accessible Login Form</h4>
                <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
                    <code>
                        &lt;form&gt;
                        <br />&nbsp;&nbsp;&lt;label for="username"&gt;Username&lt;/label&gt;
                        <br />&nbsp;&nbsp;&lt;input id="username" name="username" required /&gt;
                        <br />&nbsp;&nbsp;&lt;label for="password"&gt;Password&lt;/label&gt;
                        <br />&nbsp;&nbsp;&lt;input id="password" type="password" required /&gt;
                        <br />&nbsp;&nbsp;&lt;button type="submit"&gt;Login&lt;/button&gt;
                        <br />&lt;/form&gt;
                    </code>
                </pre>

                <p className="mt-6 mb-8">
                    By the end of this section, you’ve mastered how to create semantic, accessible, and validated forms that enhance both usability and security.
                </p>
            </>
        ),
    },
];


// --- Mock Data for Frontend Course Sidebar (Submodule IDs must match content IDs) ---
const MODULE_ID = 'f-101'; 
// We use the ID of the LAST submodule to control button visibility
const LAST_SUBMODULE_ID = ALL_SUBMODULE_DATA[ALL_SUBMODULE_DATA.length - 1].id; // 'html-forms'

const frontendCourseSections: CourseSection[] = [
    { id: 'semantic-structure', title: '1. Semantic Structure', isCompleted: false }, 
    { id: 'accessibility-roles', title: '2. Accessibility & ARIA', isCompleted: false }, 
    { id: 'html-forms', title: '3. HTML Forms & Validation', isCompleted: false }, 
    // F-201 is the primary Next Module
    { id: 'f-201', title: 'F-201: React Fundamentals (Next)', isCompleted: false }, 
    // F-102 is now listed after F-201
    { id: 'f-102', title: 'F-102: CSS Mastery', isCompleted: false }, 
    { id: 'final-project', title: 'Final Project', isCompleted: false },
];


// --- 3. PROGRESS PERSISTENCE AND TRACKING ---

const LOCAL_STORAGE_KEY = 'fullStackProgress';

const getInitialModuleProgress = (moduleId: string): ModuleProgress => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const allProgress = stored ? JSON.parse(stored) : {};
        return allProgress[moduleId] || { readProgress: 0, isCompleted: false };
    } catch (e) { 
        console.error("Error reading progress from localStorage:", e);
        return { readProgress: 0, isCompleted: false }; 
    }
};

const saveModuleProgress = (moduleId: string, newProgress: ModuleProgress): void => {
    try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const allProgress = stored ? JSON.parse(stored) : {};
        allProgress[moduleId] = newProgress;
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allProgress));
    } catch (e) { 
        console.error("Error saving progress to localStorage:", e); 
    }
};


// --- 4. MAIN COMPONENT LOGIC ---

export const FrontendCourseView: React.FC<FrontendCourseViewProps> = ({ onBack, planTitle }) => {
    const currentModuleId = MODULE_ID; 
    const navigate = useNavigate();
    
    const [activeSection, setActiveSection] = useState<string>(ALL_SUBMODULE_DATA[0].id);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
    const [moduleProgress, setModuleProgress] = useState<ModuleProgress>(() => getInitialModuleProgress(currentModuleId));

    const contentRef = useRef<HTMLDivElement>(null);
    
    // Scroll tracking logic
    const updateScrollProgress = useCallback(() => {
        const contentDiv = contentRef.current;
        if (!contentDiv) return;

        const { scrollTop, scrollHeight, clientHeight } = contentDiv;
        if (scrollHeight <= clientHeight) return;

        const scrollableHeight = scrollHeight - clientHeight;
        const currentProgress = Math.min(100, Math.round((scrollTop / scrollableHeight) * 100));

        if (currentProgress !== moduleProgress.readProgress) {
            // NOTE: isCompleted flag is set TRUE if the user scrolls past 95% of the FINAL submodule content.
            const isCompleted = currentProgress >= 95 && activeSection === LAST_SUBMODULE_ID; 
            
            setModuleProgress(prev => {
                const newProgress: ModuleProgress = {
                    readProgress: currentProgress,
                    // Once isCompleted is true, it stays true (prev.isCompleted || isCompleted)
                    isCompleted: prev.isCompleted || isCompleted, 
                };
                saveModuleProgress(currentModuleId, newProgress);
                return newProgress;
            });
        }
    }, [moduleProgress.readProgress, activeSection]); // Dependency on activeSection added for scroll completion check

    useEffect(() => {
        const contentDiv = contentRef.current;
        if (contentDiv) {
            contentDiv.addEventListener('scroll', updateScrollProgress);
        }
        updateScrollProgress(); 
        return () => {
            if (contentDiv) {
                contentDiv.removeEventListener('scroll', updateScrollProgress);
            }
        };
    }, [updateScrollProgress]);


    // Function to handle section change (updates main content and resets scroll)
   const handleSectionChange = (id: string) => {
    if (ALL_SUBMODULE_DATA.find(m => m.id === id)) {
        // Submodules stay in this module
        setActiveSection(id);
        if (contentRef.current) { contentRef.current.scrollTo(0, 0); }
    } else if (id === 'f-201' && moduleProgress.isCompleted) { // Primary Next Module: F-201
        // Navigate to React Fundamentals page (F-201)
        navigate('/modules/f-201');
    } else if (id === 'f-201') {
          alert('Please complete the current module reading (F-101) before moving on to React Fundamentals!');
    } else if (id === 'f-102') { // Secondary link: F-102
        navigate('/modules/f-102');
    } else if (id === 'final-project') {
        alert('Final Project module is locked until all prerequisites are met!');
    }

    if (window.innerWidth < 768) { setIsSidebarOpen(false); }
};

    
    // Find the currently active submodule content to display
    const currentSubmodule = ALL_SUBMODULE_DATA.find(m => m.id === activeSection) || ALL_SUBMODULE_DATA[0];

    // Sidebar data reflecting dynamic completion status
    const dynamicSidebarSections: CourseSection[] = frontendCourseSections.map(section => ({
        ...section,
        isCompleted: section.id === currentModuleId ? moduleProgress.isCompleted : section.isCompleted 
    }));
    
    // Get the F-201 section for dynamic rendering
    const f201Section = dynamicSidebarSections.find(s => s.id === 'f-201');

    // --- RENDER CONTENT ---
    const sidebarContent = (
      <div className="w-full bg-card p-4 space-y-2 h-full overflow-y-auto">
        <Button variant="outline" onClick={onBack} className="w-full mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
        </Button>
        
        {/* Module Progress Bar */}
        <div className="p-3 border rounded-lg bg-accent/20">
            <h4 className="text-sm font-semibold mb-2">
                F-101 Progress: {moduleProgress.readProgress}%
            </h4>
            <Progress value={moduleProgress.readProgress} className="h-2 bg-gray-300" />
            {moduleProgress.isCompleted && (
                <div className="text-xs text-green-500 font-medium mt-1 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" /> F-101 Module Completed!
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
                ${section.id === activeSection 
                      ? 'bg-primary/20 dark:bg-primary/40 font-semibold text-primary' 
                    : 'text-card-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
            >
              <span>{section.title}</span>
            </li>
          ))}
          
          {/* --- F-201: React Fundamentals (Primary Next Module) --- */}
          {f201Section && (
             <motion.li 
                key={f201Section.id}
                onClick={() => handleSectionChange(f201Section.id)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm
                    ${moduleProgress.isCompleted ? 'font-semibold text-blue-600 hover:bg-accent' : 'text-muted-foreground'}`}
             >
                <span>{f201Section.title}</span>
                {moduleProgress.isCompleted ? <Play className="h-4 w-4 text-blue-600 flex-shrink-0" /> : <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
            </motion.li>
          )}

          {/* --- F-102 and Final Project Links (Secondary Sections) --- */}
          {/* We manually map all sections *not* the current module or its submodules */}
          {frontendCourseSections.filter(s => 
              s.id !== 'f-201' && 
              s.id !== MODULE_ID && 
              !ALL_SUBMODULE_DATA.some(a => a.id === s.id)
          ).map((section) => (
            <li 
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm
                ${section.id === activeSection ? 'bg-primary/20' : 'hover:bg-accent'} 
                ${section.id === 'f-102' ? 'text-card-foreground' : 'text-muted-foreground'}`}
            >
              <span>{section.title}</span>
              {section.isCompleted && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
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
        {/* --- 1. Desktop Sidebar (Always Visible) --- */}
        <div className="hidden md:block w-64 border-r dark:border-gray-700 h-screen sticky top-0">
            {sidebarContent}
        </div>

        {/* --- 2. Mobile Sidebar (Overlay/Slide-out) --- */}
        {isSidebarOpen && (
            <div 
                className="fixed inset-0 z-40 md:hidden bg-black/50" 
                onClick={() => setIsSidebarOpen(false)} 
            >
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-0 w-64 h-full bg-card shadow-xl overflow-y-auto"
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

        {/* --- 3. Main Content Area (Scrollable with Ref) --- */}
        <div 
            ref={contentRef} // Attach Ref here for scroll tracking
            className="flex-1 p-4 md:p-10 overflow-y-scroll w-full max-h-screen"
        >
            <header className="flex justify-between items-start mb-6">
                <h1 className="text-3xl md:text-4xl font-bold">{currentSubmodule.title}</h1>
                
                {/* Mobile Menu Toggle Button */}
                <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setIsSidebarOpen(true)} 
                    className="md:hidden flex-shrink-0"
                >
                    <Menu className="h-6 w-6" />
                </Button>
            </header>

            {/* Content actions */}
            <div className="flex items-center text-sm text-muted-foreground mb-6 space-x-4">
                <span className="text-sm">Reading Time: {currentSubmodule.estimatedReadingTime}</span>
                <Share2 className="h-4 w-4 cursor-pointer hover:text-primary" />
                <Edit className="h-4 w-4 cursor-pointer hover:text-primary" />
                <MoreVertical className="h-4 w-4 cursor-pointer hover:text-primary" />
            </div>

            {/* Render Current Submodule Content */}
            <div className="prose dark:prose-invert max-w-none">
                {currentSubmodule.content}
            </div>

            {/* Action Button (Next Module) */}
            {/* The button only renders if the active section is the LAST_SUBMODULE_ID ('html-forms'). */}
            {activeSection === LAST_SUBMODULE_ID && (
                <div className="mt-10 pt-6 border-t">
                    <Button 
                        className="w-full" 
                        variant={moduleProgress.isCompleted ? "default" : "secondary"} 
                        disabled={!moduleProgress.isCompleted}
                        onClick={() => moduleProgress.isCompleted && handleSectionChange('f-201')} // Navigate to F-201
                    >
                        {moduleProgress.isCompleted ? (
                            <motion.div
                                initial={{ scale: 1 }}
                                animate={{ scale: [1, 1.01, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="flex items-center justify-center w-full"
                            >
                                <Play className="mr-2 h-4 w-4" /> Go to Next Module: React Fundamentals (F-201)
                            </motion.div>
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