// ModuleQuiz.tsx (FINAL FUNCTIONAL QUIZ COMPONENT)

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Interfaces (Must match CourseData.ts) ---
interface QuizQuestion { id: string; question: string; options: string[]; answer: string; }

interface ModuleQuizProps {
    questions: QuizQuestion[];
    onComplete: (success: boolean) => void;
    onBackToContent: () => void;
    isPassed: boolean; // Indicates if the user has passed this quiz previously
}

export const ModuleQuiz: React.FC<ModuleQuizProps> = ({ questions, onComplete, onBackToContent, isPassed }) => {
    // State to track user's current answers
    const [answers, setAnswers] = useState<Record<string, string>>({});
    // State to manage submission/result view
    const [submitted, setSubmitted] = useState(isPassed);
    // State to track the score (show 100% if already passed)
    const [score, setScore] = useState(isPassed ? 100 : 0); 
    
    // Passing score threshold (66%)
    const PASS_THRESHOLD = 66;
    const hasPassed = score >= PASS_THRESHOLD;

    const handleSelect = (qid: string, option: string) => {
        if (!submitted) {
            setAnswers((prev) => ({ ...prev, [qid]: option }));
        }
    };

    const handleSubmit = () => {
        if (Object.keys(answers).length < questions.length) {
            alert("Please answer all questions before submitting.");
            return;
        }
        let correctCount = 0;
        questions.forEach((q) => {
            if (answers[q.id] === q.answer) {
                correctCount++;
            }
        });
        
        const finalScore = Math.round((correctCount / questions.length) * 100);
        setScore(finalScore);
        setSubmitted(true);
        
        const success = finalScore >= PASS_THRESHOLD; 
        onComplete(success); // Notify parent (CoreJSView) of success/failure
    };

    // Allows the user to try again if they failed or review content
    const handleTryAgain = () => {
        setSubmitted(false);
        setAnswers({}); // Clear previous answers for a fresh attempt
        setScore(0);
        onBackToContent(); // Redirects back to the content list in the parent view
    };

    // If already passed, show a simplified status view
    if (isPassed && submitted) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 h-full text-center">
                <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                <h2 className="text-3xl font-bold mb-2 text-green-700">Congratulations!</h2>
                <p className="text-lg text-muted-foreground mb-6">You have already passed this assessment.</p>
                <Button onClick={onBackToContent} size="lg">
                    <Play className="h-5 w-5 mr-2" /> Go to Next Module (Python Essentials)
                </Button>
            </motion.div>
        );
    }
    
    // --- Main Quiz Content ---
    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="p-6 h-full overflow-y-auto"
        >
            <Button variant="outline" onClick={onBackToContent} className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Content Review
            </Button>
            
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Module Final Assessment</h2>
            <p className="mb-6 text-sm text-muted-foreground">
                Passing Score: {PASS_THRESHOLD}%. Answer all {questions.length} questions.
            </p>
            
            <div className="space-y-6">
                {questions.map((q) => (
                    <div key={q.id} className="p-4 border rounded-md shadow-sm bg-card/50">
                        <p className="mb-3 font-semibold">{q.question}</p>
                        <div className="flex flex-col space-y-2">
                            {q.options.map((opt) => {
                                const isCorrect = submitted && opt === q.answer;
                                const isSelected = answers[q.id] === opt;
                                const isSelectedWrong = submitted && isSelected && opt !== q.answer;

                                return (
                                    <Button
                                        key={opt}
                                        variant={isSelected ? "default" : "outline"}
                                        className={`text-left justify-start ${submitted ? (isCorrect ? 'bg-green-100/50 text-green-700 border-green-500 hover:bg-green-100/50' : isSelectedWrong ? 'bg-red-100/50 text-red-700 border-red-500 hover:bg-red-100/50' : '') : ''}`}
                                        onClick={() => handleSelect(q.id, opt)}
                                        disabled={submitted}
                                    >
                                        {opt}
                                        {submitted && isCorrect && <CheckCircle className="h-4 w-4 ml-auto text-green-700" />}
                                        {submitted && isSelectedWrong && <X className="h-4 w-4 ml-auto text-red-700" />}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 pt-4 border-t">
                {!submitted ? (
                    // Button: Submit Quiz
                    <Button 
                        onClick={handleSubmit} 
                        className="w-full" 
                        disabled={Object.keys(answers).length < questions.length}
                        size="lg"
                    >
                        Submit Quiz & Finalize Module
                    </Button>
                ) : (
                    // Display results after submission
                    <div className={`p-6 rounded-md text-center ${hasPassed ? 'bg-green-50/70 text-green-800 border border-green-300' : 'bg-red-50/70 text-red-800 border border-red-300'}`}>
                        <h4 className="text-3xl font-bold">{score}%</h4>
                        <p className="mt-2 text-lg font-semibold">{hasPassed ? 'Module Unlocked! You passed.' : 'Assessment Failed.'}</p>
                        
                        {hasPassed ? (
                            // Button: Go to Next Module (Python Essentials)
                            <Button onClick={onBackToContent} className="w-full mt-4" size="lg">
                                <Play className="mr-2 h-4 w-4" /> Go to Next Module: Python Essentials
                            </Button>
                        ) : (
                            // Button: Review and Try Again
                            <Button onClick={handleTryAgain} className="w-full mt-4" variant="destructive" size="lg">
                                Review Content & Try Again
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};