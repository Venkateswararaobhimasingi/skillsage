// src/pages/fullstack/PythonEssentialsView.tsx
// --- PythonEssentialsView.tsx (B-101 Module View - Python Essentials) ---

import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

/**
 * NOTE:
 * - This file is intentionally self-contained: ModuleQuiz + QUIZ_QUESTIONS are defined below.
 * - If you already have shared ModuleQuiz / courseData, you may remove the duplicates and import instead.
 */

/* -------------------- INTERFACES -------------------- */
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
interface ModuleProgress {
  readProgress: number;
  isCompleted: boolean;
  isQuizCompleted: boolean;
}
interface CourseViewProps {
  onBack: () => void;
  planTitle: string;
}

/* -------------------- QUIZ DATA (embedded) -------------------- */
const QUIZ_QUESTIONS: Record<string, any[]> = {
  "b-101-final": [
    {
      id: "q1",
      question: "Which of these is the correct way to define a function in Python?",
      options: [
        "function greet() {}",
        "def greet():",
        "fun greet():",
        "create function greet()",
      ],
      answer: 1,
    },
    {
      id: "q2",
      question: "Which Python data type is immutable?",
      options: ["list", "dict", "tuple", "set"],
      answer: 2,
    },
    {
      id: "q3",
      question: "What will `print([1,2,3][1])` output?",
      options: ["1", "2", "3", "Error"],
      answer: 1,
    },
    {
      id: "q4",
      question:
        "Which of the following is the correct way to do integer division (floor) in Python?",
      options: ["/", "//", "%", "^"],
      answer: 1,
    },
    {
      id: "q5",
      question:
        "Which keyword is used to create an object-oriented class in Python?",
      options: ["object", "class", "struct", "module"],
      answer: 1,
    },
  ],
};

/* -------------------- ModuleQuiz Component (embedded) -------------------- */
/**
 * Lightweight quiz component:
 * - Supports answer selection
 * - Submit calculates score
 * - showAnswers flag highlights correct option(s) in green (and chosen wrong in red)
 * - onComplete callback receives boolean (passed/failed)
 */
const ModuleQuiz: React.FC<{
  questions: {
    id: string | number;
    question: string;
    options: string[];
    answer: number;
  }[];
  onComplete: (passed: boolean) => void;
  onBackToContent: () => void;
  showAnswers?: boolean;
  isPassed?: boolean;
}> = ({ questions, onComplete, onBackToContent, showAnswers = false, isPassed = false }) => {
  const [selected, setSelected] = useState<Record<string | number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSelect = (qId: string | number, optionIndex: number) => {
    if (submitted || showAnswers) return;
    setSelected((s) => ({ ...s, [qId]: optionIndex }));
  };

  const handleSubmit = () => {
    if (!questions || questions.length === 0) return;
    let correctCount = 0;
    for (const q of questions) {
      if (selected[q.id] === q.answer) correctCount++;
    }
    const percent = (correctCount / questions.length) * 100;
    const passed = percent >= 60; // pass threshold (60%)
    setScore(Math.round(percent));
    setSubmitted(true);
    setTimeout(() => onComplete(passed), 300); // small delay for UX
  };

  // If showAnswers is true (review mode), we display correct answers and a back button
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{isPassed ? "Review (Passed)" : "Knowledge Check"}</h2>
        <div className="text-sm text-muted-foreground">
          {submitted && score !== null ? `Score: ${score}%` : ""}
        </div>
      </div>

      <div className="space-y-5">
        {questions.map((q, qi) => {
          const chosen = selected[q.id];
          return (
            <div key={q.id} className="p-4 border rounded-lg bg-card">
              <p className="font-semibold mb-3">Q{qi + 1}. {q.question}</p>
              <ul className="space-y-2">
                {q.options.map((opt: string, oi: number) => {
                  const isCorrect = q.answer === oi;
                  const isChosen = chosen === oi;

                  // when showing answers (review mode) or after submit, style accordingly
                  let optionClass = "p-2 rounded cursor-pointer transition";
                  if (showAnswers || submitted) {
                    if (isCorrect) optionClass += " bg-green-50 text-green-800 dark:bg-green-900/40";
                    else if (isChosen && !isCorrect) optionClass += " bg-red-50 text-red-700 dark:bg-red-900/30";
                    else optionClass += " bg-transparent text-card-foreground";
                  } else {
                    optionClass += isChosen ? " bg-primary/20 border border-primary" : " hover:bg-accent";
                  }

                  return (
                    <li
                      key={oi}
                      onClick={() => handleSelect(q.id, oi)}
                      className={optionClass}
                    >
                      <div className="flex items-center">
                        {(showAnswers || submitted) && isCorrect && (
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        )}
                        {(!showAnswers && !submitted) && isChosen && (
                          <span className="inline-block w-3 h-3 mr-2 rounded-full bg-primary" />
                        )}
                        <span>{opt}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        {!submitted && !showAnswers && (
          <Button onClick={handleSubmit} className="w-full">
            Submit Quiz
          </Button>
        )}

        {(submitted || showAnswers) && (
          <>
            <Button onClick={onBackToContent} variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Content
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

/* -------------------- STATIC MODULE CONTENT -------------------- */
const MODULE_ID = "b-101";
const QUIZ_ID = "b-101-final";

const ALL_SUBMODULE_DATA: DetailedSubmodule[] = [
  {
    id: "syntax-and-variables",
    title: "1. Python Syntax, Variables, and Types",
    estimatedReadingTime: "5 min",
    content: (
      <>
        <p className="mb-4">
          Python favors readability: blocks are defined by indentation rather than braces.
          Variable types are inferred at runtime and need not be declared.
        </p>

        <h4 className="text-xl font-semibold mt-6 mb-3">Core Types</h4>
        <ul className="list-disc ml-5 space-y-2 mb-4">
          <li><strong>int</strong> — integers (e.g., <code>5</code>, <code>-10</code>)</li>
          <li><strong>float</strong> — floating-point numbers (e.g., <code>3.14</code>)</li>
          <li><strong>str</strong> — strings (e.g., <code>"hello"</code>)</li>
          <li><strong>bool</strong> — <code>True</code> / <code>False</code></li>
        </ul>

        <h4 className="text-xl font-semibold mt-4 mb-2">Example</h4>
        <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
          <code>{`# Single-line comment
message = "Hello, Python!"
count = 42
is_active = True

if count > 0:
    print(message)`}</code>
        </pre>

        <p className="mt-4">Remember: indentation is meaningful in Python — use a consistent number of spaces (commonly 4).</p>
      </>
    ),
  },
  {
    id: "data-structures",
    title: "2. Essential Data Structures (List, Dictionary, Tuple)",
    estimatedReadingTime: "7 min",
    content: (
      <>
        <p className="mb-4">
          Python includes powerful built-in containers that you'll use all the time.
        </p>

        <h4 className="text-xl font-semibold mt-4 mb-2">List (mutable, ordered)</h4>
        <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
          <code>{`my_list = [1, "two", 3.0]
my_list.append(4)
# my_list -> [1, "two", 3.0, 4]`}</code>
        </pre>

        <h4 className="text-xl font-semibold mt-4 mb-2">Dictionary (mutable key-value mapping)</h4>
        <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
          <code>{`user = {"name": "Alice", "age": 30}
user["age"] = 31
# Access -> user["name"] -> "Alice"`}</code>
        </pre>

        <h4 className="text-xl font-semibold mt-4 mb-2">Tuple (immutable, ordered)</h4>
        <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
          <code>{`coords = (10.0, 20.5)
# coords[0] -> 10.0`}</code>
        </pre>

        <p className="mt-4">Use the right container for the job: tuples for fixed, lightweight groups, lists for mutable sequences, dicts for keyed access.</p>
      </>
    ),
  },
  {
    id: "functions-and-flow",
    title: "3. Functions and Control Flow",
    estimatedReadingTime: "8 min",
    content: (
      <>
        <p className="mb-4">
          Functions are declared with <code>def</code>. Control flow uses <code>if/elif/else</code>, and loops <code>for</code>/<code>while</code>.
        </p>

        <h4 className="text-xl font-semibold mt-4 mb-2">Functions</h4>
        <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
          <code>{`def greet(name="Guest"):
    return f"Hello, {name}!"

print(greet("Alice"))  # -> Hello, Alice!`}</code>
        </pre>

        <h4 className="text-xl font-semibold mt-4 mb-2">If / Loop Examples</h4>
        <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-x-auto dark:bg-gray-800">
          <code>{`age = 25
if age < 18:
    print("Minor")
elif age < 65:
    print("Adult")
else:
    print("Senior")

fruits = ["apple", "banana", "cherry"]
for f in fruits:
    print(f)

count = 0
while count < 3:
    print(count)
    count += 1`}</code>
        </pre>

        <p className="mt-4 mb-8">
          This section is intentionally longer to ensure scroll/progress tracking registers — scroll to the bottom to mark the module reading as done.
        </p>

        {/* Add a bit more content so there is real scrollable height */}
        <h4 className="text-xl font-semibold mt-6 mb-3">Best Practices & Tips</h4>
        <ul className="list-disc ml-5 space-y-2">
          <li>Prefer descriptive variable and function names.</li>
          <li>Avoid deep nesting — extract helpers.</li>
          <li>Write small, testable functions.</li>
          <li>Use list/dict comprehensions where they improve clarity.</li>
        </ul>

        <p className="mt-6">End of module reading. Make sure you scroll to the end to unlock the quiz.</p>
      </>
    ),
  },
];

const LAST_SUBMODULE_ID = ALL_SUBMODULE_DATA[ALL_SUBMODULE_DATA.length - 1].id;

/* -------------------- SIDEBAR / SECTIONS -------------------- */
const courseSections: CourseSection[] = [
  { id: "f-103", title: "F-103: Core JavaScript (Prev)", isCompleted: true },
  { id: "syntax-and-variables", title: "1. Syntax, Variables & Types", isCompleted: false },
  { id: "data-structures", title: "2. Essential Data Structures", isCompleted: false },
  { id: "functions-and-flow", title: "3. Functions and Control Flow", isCompleted: false },
  { id: "sql-essentials", title: "B-102: SQL Essentials (Next)", isCompleted: false },
];

/* -------------------- LOCAL STORAGE HELPERS -------------------- */
const LOCAL_STORAGE_KEY = "fullStackProgress";

const getInitialModuleProgress = (moduleId: string): ModuleProgress => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const all = stored ? JSON.parse(stored) : {};
    // Optionally seed previous module status
    if (moduleId === MODULE_ID && !all["f-103"]) {
      all["f-103"] = { readProgress: 100, isCompleted: true, isQuizCompleted: true };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
    }
    return all[moduleId] || { readProgress: 0, isCompleted: false, isQuizCompleted: false };
  } catch {
    return { readProgress: 0, isCompleted: false, isQuizCompleted: false };
  }
};

const saveModuleProgress = (moduleId: string, newProgress: ModuleProgress) => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    const all = stored ? JSON.parse(stored) : {};
    all[moduleId] = newProgress;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error("Failed to save progress:", e);
  }
};

/* -------------------- MAIN COMPONENT -------------------- */
export const PythonEssentialsView: React.FC<CourseViewProps> = ({ onBack, planTitle }) => {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<string>(ALL_SUBMODULE_DATA[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress>(() => getInitialModuleProgress(MODULE_ID));
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizAttemptFailed, setQuizAttemptFailed] = useState(false); // show review when true

  const contentRef = useRef<HTMLDivElement | null>(null);

  // Update scroll progress
  const updateScrollProgress = useCallback(() => {
    if (isQuizActive) return;
    const div = contentRef.current;
    if (!div) return;
    const { scrollTop, scrollHeight, clientHeight } = div;
    if (scrollHeight <= clientHeight) {
      // If there's no scroll, mark as 100%
      if (moduleProgress.readProgress !== 100) {
        const updated: ModuleProgress = { ...moduleProgress, readProgress: 100, isCompleted: true };
        setModuleProgress(updated);
        saveModuleProgress(MODULE_ID, updated);
      }
      return;
    }
    const scrollable = scrollHeight - clientHeight;
    const currentProgress = Math.min(100, Math.round((scrollTop / scrollable) * 100));
    const isReadCompleted = currentProgress >= 95 && activeSection === LAST_SUBMODULE_ID;

    if (currentProgress !== moduleProgress.readProgress || (isReadCompleted && !moduleProgress.isCompleted)) {
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
  }, [activeSection, isQuizActive, moduleProgress]);

  useEffect(() => {
    const div = contentRef.current;
    if (div) {
      div.addEventListener("scroll", updateScrollProgress);
    }
    // run once on mount to initialize progress if needed
    updateScrollProgress();
    return () => {
      if (div) div.removeEventListener("scroll", updateScrollProgress);
    };
  }, [updateScrollProgress]);

  // Navigation handler
  const handleSectionChange = (id: string) => {
    if (ALL_SUBMODULE_DATA.find((m) => m.id === id)) {
      setActiveSection(id);
      setIsQuizActive(false);
      if (contentRef.current) contentRef.current.scrollTo(0, 0);
    } else if (id === "sql-essentials") {
      if (moduleProgress.isQuizCompleted) {
        navigate("/modules/b-102");
      } else {
        alert("You must complete the reading and pass the quiz to continue to SQL Essentials.");
      }
    } else if (id === "f-103") {
      navigate("/modules/f-103");
    } else {
      alert("This section is locked until prerequisites are met.");
    }

    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  // Quiz lifecycle
  const handleLaunchQuiz = () => {
    // only allow launching quiz if read is completed
    if (!moduleProgress.isCompleted) {
      alert("Please finish the module reading (scroll to the bottom) before attempting the quiz.");
      return;
    }
    // reset false state if retrying after fail
    setQuizAttemptFailed(false);
    setIsQuizActive(true);
    if (contentRef.current) contentRef.current.scrollTo(0, 0);
  };

  const handleQuizComplete = (passed: boolean) => {
    if (passed) {
      setQuizAttemptFailed(false);
      setModuleProgress((prev) => {
        const updated: ModuleProgress = { ...prev, isQuizCompleted: true };
        saveModuleProgress(MODULE_ID, updated);
        return updated;
      });
      setIsQuizActive(false);
      // optionally notify user
      setTimeout(() => alert("Quiz passed! Next module is unlocked."), 200);
    } else {
      // keep quiz active and show answers (review mode)
      setQuizAttemptFailed(true);
      // Keep isQuizActive true so ModuleQuiz is visible in review mode.
      // ModuleQuiz will use showAnswers prop to highlight correct answers.
    }
  };

  const handleBackToContent = () => {
    setIsQuizActive(false);
    setQuizAttemptFailed(false);
  };

  const currentSubmodule = ALL_SUBMODULE_DATA.find((m) => m.id === activeSection) || ALL_SUBMODULE_DATA[0];
  const isModuleFullyComplete = moduleProgress.isCompleted && moduleProgress.isQuizCompleted;

  // sidebar dynamic
  const dynamicSidebarSections = courseSections.map((s) => ({
    ...s,
    isCompleted: s.id === MODULE_ID ? isModuleFullyComplete : s.isCompleted,
  }));

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
  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }} className="min-h-screen flex flex-col md:flex-row bg-background relative">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 border-r h-screen sticky top-0">
        <div className="w-full bg-card p-4 space-y-2 h-full overflow-y-auto">
          <Button variant="outline" onClick={onBack} className="w-full mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="p-3 border rounded-lg bg-accent/20">
            <h4 className="text-sm font-semibold mb-2">B-101 Progress: {moduleProgress.readProgress}%</h4>
            <Progress value={moduleProgress.readProgress} className="h-2 mb-2" />
            {moduleProgress.isQuizCompleted && (
              <div className="text-xs text-green-500 font-medium mt-1 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" /> Quiz Passed!
              </div>
            )}
            {!moduleProgress.isQuizCompleted && moduleProgress.isCompleted && (
              <div className="text-xs text-yellow-500 font-medium mt-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" /> Reading Done — Take Quiz
              </div>
            )}
            {isModuleFullyComplete && (
              <div className="text-xs text-green-500 font-medium mt-1 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" /> Module Completed!
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold mb-3 mt-4">Course Navigation</h3>
          <ul className="space-y-1">
            {ALL_SUBMODULE_DATA.map((section) => (
              <li key={section.id} onClick={() => handleSectionChange(section.id)} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm ${section.id === activeSection ? "bg-primary/20 dark:bg-primary/40 font-semibold text-primary" : "text-card-foreground hover:bg-accent"}`}>
                <span>{section.title}</span>
              </li>
            ))}

            {/* Next modules */}
            <li onClick={() => handleSectionChange("sql-essentials")} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors text-sm ${isModuleFullyComplete ? "font-semibold text-blue-600" : "text-muted-foreground hover:bg-accent"}`}>
              <span>B-102: SQL Essentials</span>
              {isModuleFullyComplete ? <Play className="h-4 w-4 text-blue-600" /> : null}
            </li>

            <li className="flex items-center p-3 rounded-lg text-sm text-muted-foreground">
              <Target className="h-4 w-4 mr-2" />
              Final Project
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Sidebar (overlay) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/50" onClick={() => setIsSidebarOpen(false)}>
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.25 }} className="absolute left-0 top-0 w-64 h-full bg-card shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end p-4">
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="w-full p-4">{/* re-use sidebar content */}</div>
            <div className="p-4">
              <Button variant="outline" onClick={onBack} className="w-full mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <ul className="space-y-2">
                {ALL_SUBMODULE_DATA.map((section) => (
                  <li key={section.id} onClick={() => { handleSectionChange(section.id); setIsSidebarOpen(false); }} className={`p-3 rounded-lg cursor-pointer ${section.id === activeSection ? "bg-primary/20" : "hover:bg-accent"}`}>
                    {section.title}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content Area */}
      <div ref={contentRef} className="flex-1 p-4 md:p-8 overflow-y-scroll max-h-screen">
        {isQuizActive ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <header className="flex justify-between items-center mb-6 border-b pb-4">
              <h1 className="text-3xl font-bold text-primary">B-101 Python Final Assessment</h1>
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
          <>
            <header className="flex justify-between items-start mb-6">
              <h1 className="text-3xl md:text-4xl font-bold">{currentSubmodule.title}</h1>

              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center text-sm text-muted-foreground">
                  <Share2 className="h-4 w-4 mr-2 cursor-pointer" />
                  <Edit className="h-4 w-4 mr-2 cursor-pointer" />
                  <MoreVertical className="h-4 w-4 cursor-pointer" />
                </div>

                <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(true)} className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
            </header>

            <div className="flex items-center text-sm text-muted-foreground mb-6 gap-6">
              <span>Reading Time: {currentSubmodule.estimatedReadingTime}</span>
              <div className="hidden md:flex items-center gap-4">
                <span className="text-muted-foreground">Module: Python Essentials</span>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              {currentSubmodule.content}
            </div>
          </>
        )}

        {/* Action Button area (shown when quiz is not active) */}
        {!isQuizActive && (
          <div className="mt-10 pt-6 border-t">
            {isModuleFullyComplete ? (
              <motion.div variants={pulseVariant} animate="pulse" className="rounded-md overflow-hidden">
                <Button className="w-full" variant="default" onClick={() => handleSectionChange("sql-essentials")}>
                  <Play className="mr-2 h-4 w-4" /> Go to Next Module: SQL Essentials
                </Button>
              </motion.div>
            ) : moduleProgress.isCompleted ? (
              <Button className="w-full" variant="default" onClick={handleLaunchQuiz}>
                <HelpCircle className="mr-2 h-4 w-4" /> Start B-101 Final Quiz
              </Button>
            ) : (
              <Button className="w-full" variant="secondary" disabled>
                <Clock className="mr-2 h-4 w-4" /> Scroll to the end of the module to unlock the quiz
              </Button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PythonEssentialsView;
