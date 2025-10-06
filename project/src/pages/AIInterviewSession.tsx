import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

const AIInterviewSession = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [answers, setAnswers] = useState(['', '', '']);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [questionSpoken, setQuestionSpoken] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  const recognitionRef = useRef(null);
  const speechSynthRef = useRef(null);
  const timerRef = useRef(null);
  const finalTranscriptRef = useRef('');

  const questions = [
    "Tell me about yourself and your background.",
    "What are your greatest strengths and how do they apply to this role?", 
    "Where do you see yourself in five years?"
  ];

  const questionTime = 60; // 1 minute per question

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        console.log('Speech recognition started');
      };
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          finalTranscriptRef.current += finalTranscript;
          console.log('Final transcript:', finalTranscript);
        }
        
        setCurrentTranscript(finalTranscriptRef.current + interimTranscript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        // Auto-restart if still in session and not speaking
        if (sessionStarted && !sessionEnded && !isSpeaking && timeLeft > 0) {
          setTimeout(() => {
            if (recognitionRef.current && !isSpeaking) {
              try {
                recognitionRef.current.start();
              } catch (error) {
                console.log('Recognition restart error:', error);
              }
            }
          }, 500);
        }
      };
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      speechSynthRef.current = window.speechSynthesis;
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);

  const speak = (text) => {
    return new Promise((resolve) => {
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => {
          setIsSpeaking(true);
          console.log('AI started speaking:', text);
        };
        
        utterance.onend = () => {
          setIsSpeaking(false);
          console.log('AI finished speaking');
          resolve();
        };
        
        speechSynthRef.current.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  const startSession = async () => {
    setSessionStarted(true);
    setCurrentQuestion(0);
    setAnswers(['', '', '']);
    finalTranscriptRef.current = '';
    setCurrentTranscript('');
    
    // Greet and ask first question
    await speak("Welcome to the AI interview session. Let's begin with the first question.");
    await speak(questions[0]);
    setQuestionSpoken(true);
    startListeningAndTimer();
  };

  const startListeningAndTimer = () => {
    // Reset transcript for new question
    finalTranscriptRef.current = '';
    setCurrentTranscript('');
    setTimeLeft(questionTime);
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          moveToNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Start listening
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.log('Recognition start error:', error);
      }
    }
  };

  const moveToNextQuestion = async () => {
    // Stop timer and recognition
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    setIsListening(false);
    
    // Save current answer
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = finalTranscriptRef.current.trim();
    setAnswers(newAnswers);
    
    console.log(`Question ${currentQuestion + 1} answer:`, finalTranscriptRef.current.trim());
    
    if (currentQuestion < questions.length - 1) {
      // Move to next question
      const nextQuestionIndex = currentQuestion + 1;
      setCurrentQuestion(nextQuestionIndex);
      setQuestionSpoken(false);
      
      // Small delay then speak next question
      await new Promise(resolve => setTimeout(resolve, 1500));
      await speak(`Next question: ${questions[nextQuestionIndex]}`);
      setQuestionSpoken(true);
      
      // Start listening for next question
      setTimeout(() => {
        startListeningAndTimer();
      }, 1000);
    } else {
      // End session
      endSession();
    }
  };

  const endSession = async () => {
    setSessionEnded(true);
    setIsListening(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    await speak("Thank you! The interview session is complete. You can now review your answers.");
  };

  const resetSession = () => {
    setSessionStarted(false);
    setSessionEnded(false);
    setCurrentQuestion(0);
    setAnswers(['', '', '']);
    setTimeLeft(60);
    setIsListening(false);
    setIsSpeaking(false);
    setQuestionSpoken(false);
    setCurrentTranscript('');
    finalTranscriptRef.current = '';
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Welcome Screen
  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center border border-white/20">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Mic className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Voice Interview</h1>
            <p className="text-white/80">Interactive interview with voice recognition</p>
          </div>
          
          <div className="bg-white/10 rounded-2xl p-4 mb-6 text-left">
            <h3 className="text-white font-semibold mb-2">Session Info:</h3>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• 3 questions, 1 minute each</li>
              <li>• AI reads questions aloud</li>
              <li>• Voice answers recorded</li>
              <li>• Automatic progression</li>
            </ul>
          </div>
          
          <button
            onClick={startSession}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-2xl transition duration-300 transform hover:scale-105"
          >
            Start Voice Interview
          </button>
        </div>
      </div>
    );
  }

  // Results Screen
  if (sessionEnded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Interview Results</h1>
              <p className="text-white/80">Here are all your voice responses:</p>
            </div>
            
            <div className="space-y-6 mb-8">
              {questions.map((question, index) => (
                <div key={index} className="bg-white/10 rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <h3 className="text-white font-semibold">Question {index + 1}</h3>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4 mb-4">
                    <p className="text-white/90 italic">"{question}"</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-xl p-4">
                    <h4 className="text-green-300 text-sm font-medium mb-2">Your Voice Answer:</h4>
                    <p className="text-white leading-relaxed">
                      {answers[index] || "No response recorded - please check your microphone permissions"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <button
                onClick={resetSession}
                className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-2xl transition duration-300 transform hover:scale-105"
              >
                Start New Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Interview Session Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 text-center border border-white/20">
          <h1 className="text-2xl font-bold text-white mb-2">AI Interview in Progress</h1>
          <div className="flex items-center justify-center space-x-4">
            <span className="text-white/80">Question {currentQuestion + 1} of {questions.length}</span>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            <span className="text-white/80">Time: {formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 text-center border border-white/20">
          <div className="text-6xl font-bold text-white mb-4">{formatTime(timeLeft)}</div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                timeLeft > 30 ? 'bg-gradient-to-r from-green-400 to-blue-500' :
                timeLeft > 15 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                'bg-gradient-to-r from-red-400 to-pink-500'
              }`}
              style={{ width: `${(timeLeft / questionTime) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Question */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-6 border border-white/20">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-white font-bold">{currentQuestion + 1}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Current Question</h2>
              <div className="flex items-center space-x-2 mt-1">
                {isSpeaking && (
                  <>
                    <Volume2 className="w-4 h-4 text-blue-300" />
                    <span className="text-blue-300 text-sm">AI Speaking...</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-2xl p-6 mb-6">
            <p className="text-white text-lg leading-relaxed">{questions[currentQuestion]}</p>
          </div>

          {/* Voice Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`flex items-center justify-center space-x-3 px-4 py-3 rounded-2xl ${
              isListening ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'
            }`}>
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              <span className="font-medium">
                {isListening ? 'Listening...' : 'Not Listening'}
              </span>
              {isListening && (
                <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-green-400 rounded animate-pulse"></div>
                  <div className="w-1 h-6 bg-green-400 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-5 bg-green-400 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                </div>
              )}
            </div>
            
            <div className="bg-white/10 rounded-2xl px-4 py-3 text-center">
              <span className="text-white/80 text-sm">Words captured: </span>
              <span className="text-white font-bold">
                {currentTranscript.split(' ').filter(word => word.length > 0).length}
              </span>
            </div>
          </div>

          {/* Live Transcript */}
          {currentTranscript && (
            <div className="mt-6 bg-white/5 rounded-2xl p-4">
              <h4 className="text-white/60 text-sm mb-2">Live transcript:</h4>
              <p className="text-white/90 leading-relaxed">{currentTranscript}</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 text-center border border-white/20">
          <p className="text-white/80">
            {isSpeaking ? "🤖 AI is speaking the question..." : 
             isListening ? "🎤 Speak your answer now!" : 
             "⏳ Preparing to listen..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewSession;