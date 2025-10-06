import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mic, MicOff, XCircle, Video, VideoOff, PhoneOff, MessageCircle, Clock, Pause
} from 'lucide-react';

// ⚠️ IMPORTANT: Update the backend URL if necessary
const SUBMIT_ANSWER_URL = 'http://localhost:8000/submit_answer/'; 

// --- TYPE DEFINITIONS ---
interface Question {
  order: number;
  question: string;
  allocated_time: number;
}

interface SessionData {
  session_id: number;
  user_name: string;
  questions: Question[];
}

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

// Mock components for self-contained functionality
const Button = ({ onClick, children, className, disabled, title }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-md transition-all duration-200 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
    disabled={disabled}
    title={title}
  >
    {children}
  </button>
);

// Formats seconds into MM:SS string
const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

// Chat Panel Component
const ChatPanel = ({ messages, botAnimating, isListening, messagesEndRef, onClose, timeLeft }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Interview Questions & Answers</h2>
        <Button onClick={onClose} className="lg:hidden p-1 rounded-full text-white bg-gray-700/70 hover:bg-gray-600/90">
          <XCircle className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 rounded-lg bg-gray-800 shadow-inner max-h-96">
        {messages.map((message, index) => (
          <motion.div
            key={message.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[90%] ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-gray-700 border border-gray-600 rounded-bl-none'
            } rounded-xl p-4 shadow-sm`}>
              <div className="flex items-start space-x-2">
                <div className="text-xs text-gray-300 mt-1 min-w-0">
                  {message.type === 'user' ? '👤 You' : '🤖 AI'}
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-white whitespace-pre-wrap">{message.content}</p>
                  {/* Kept timestamp for general chat order, removed specific answer duration/time display */}
                  <div className="text-xs opacity-70 text-gray-400 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {botAnimating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-gray-700 border border-gray-600 rounded-xl rounded-bl-none p-4 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-300">🤖 AI</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Audio Recording Status Area (Correct place for recording time) */}
      <div className="border-t border-gray-700 p-4 bg-gray-900 rounded-b-xl shadow-md">
        <div className="mb-2">
          <div className="text-xs text-gray-400 mb-1">Answer Status:</div>
          <div className="min-h-[60px] p-3 rounded-lg border border-gray-600 bg-gray-800 text-white flex items-center justify-center">
            {isListening ? (
              <div className="flex items-center text-green-400">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
                <span className="text-sm font-medium">Recording... Time remaining: {formatTime(timeLeft)}</span>
              </div>
            ) : (
              <div className="text-gray-500 italic text-sm">
                {messages.length > 0 && messages[messages.length - 1].type === 'bot' ? 'AI is speaking or waiting for your action.' : 'Start recording when ready to answer.'}
              </div>
            )}
          </div>
        </div>
        {/* Removed Start Recording/Skip Question from here as requested */}
      </div>
    </>
  );
};

// WAV Encoder Function
const encodeWAV = (audioBuffer: AudioBuffer): Blob => {
  const samples = audioBuffer.getChannelData(0); 
  const sampleRate = audioBuffer.sampleRate;
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeString = (view: DataView, offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  let offset = 0;
  writeString(view, offset, "RIFF"); offset += 4;
  view.setUint32(offset, 36 + samples.length * 2, true); offset += 4;
  writeString(view, offset, "WAVE"); offset += 4;
  writeString(view, offset, "fmt "); offset += 4;
  view.setUint32(offset, 16, true); offset += 4;
  view.setUint16(offset, 1, true); offset += 2; // PCM
  view.setUint16(offset, 1, true); offset += 2; // mono
  view.setUint32(offset, sampleRate, true); offset += 4;
  view.setUint32(offset, sampleRate * 2, true); offset += 4;
  view.setUint16(offset, 2, true); offset += 2;
  view.setUint16(offset, 16, true); offset += 2;
  writeString(view, offset, "data"); offset += 4;
  view.setUint32(offset, samples.length * 2, true); offset += 4;

  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([buffer], { type: "audio/wav" });
};

// Main Interview Room Component
function InterviewRoom({ onInterviewComplete }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [botAnimating, setBotAnimating] = useState(false);
  const [systemMessage, setSystemMessage] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isListening, setIsListening] = useState(false); // Now means "is recording"
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [apiBaseUrl] = useState('http://localhost:8000');
  const [finalWavBlob, setFinalWavBlob] = useState<Blob | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userMediaStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isProcessingQuestionRef = useRef(false);
  const sessionDataRef = useRef<SessionData | null>(null);
  const isSubmissionPendingRef = useRef(false); 
  const currentQuestionIndexRef = useRef(0); 
  const isUserStoppedRef = useRef(false); 

  // REFS for Audio Recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Keep refs synchronized with state for non-stale access
  useEffect(() => {
    sessionDataRef.current = sessionData;
  }, [sessionData]);

  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);


  // Initialize session and webcam
  useEffect(() => {
    initializeInterview();
    return cleanup;
  }, []);

  const initializeInterview = async () => {
    try {
      console.log("🎬 Initializing interview...");
      
      // Get webcam access (audio stream needed for MediaRecorder)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        userMediaStreamRef.current = stream;
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        console.log("📹 Webcam and Audio initialized");
      } catch (error) {
        console.warn("📹 Webcam access denied, continuing without video/audio:", error);
        showSystemMessage("Webcam and microphone access denied. Audio recording is disabled.", 8000);
        // We allow the user to continue, but recording functions will fail
      }

      // Test speech synthesis
      testSpeechSynthesis();
      
      // Load session data ONLY from local storage
      await loadSessionData();
      
    } catch (error) {
      console.error("❌ Error initializing interview:", error);
      showSystemMessage("Initialization error. Please refresh.", 5000);
    }
  };

  /**
   * Loads session data ONLY from local storage, as requested.
   * No backend fetch is performed.
   */
  const loadSessionData = async () => {
    try {
      // Access token is required for submissions later
      const accessToken = localStorage.getItem('access_token');
      // Session data is required for questions
      const storedSessionData = localStorage.getItem('session_data');

      if (!accessToken) {
        showSystemMessage("No access token found in local storage. Cannot start interview or submit answers.", 8000);
        return;
      }

      let session: SessionData | null = null;

      if (storedSessionData) {
        try {
          // The JSON structure in localStorage must be correctly handled.
          // The image shows an object with session_id and questions
          // The string in localStorage would be:
          // '{"session_id": 82, "username": "venkat", "questions": [...]}' 
          const parsedData = JSON.parse(storedSessionData);
          
          // Reconstruct SessionData structure to match the interface if needed,
          // but based on the image, the structure looks correct for direct use.
          session = {
            session_id: parsedData.session_id,
            user_name: parsedData.username,
            questions: parsedData.questions.map(q => ({
                order: q.order,
                question: q.question,
                allocated_time: q.allocated_time // Ensure this property exists in your localStorage data
            }))
          };

          // Check for minimal validity
          if (session && session.session_id && session.questions?.length) {
            console.log("📋 Session data loaded from Local Storage:", session);
            setSessionData(session);
            setTimeout(() => startInterviewWithGreeting(session!), 2000);
            return;
          }
        } catch(e) {
          console.warn("⚠️ Invalid session data in Local Storage.", e);
        }
      }

      // If we reach here, either stored data was invalid or non-existent
      console.log("📋 Session data not found or invalid in Local Storage. Cannot start interview.");
      showSystemMessage("Interview session data is missing or corrupted in local storage. Please log in again.", 5000);
      
    } catch (error) {
      console.error("❌ Error loading session data from local storage:", error);
      showSystemMessage("Failed to load interview session data. Please try again.", 5000);
    }
  };


  const testSpeechSynthesis = () => {
    if ('speechSynthesis' in window) {
      console.log("🔊 Speech synthesis available");
      window.speechSynthesis.cancel();
      setSpeechEnabled(true);
      
      // Test with a short phrase
      const testUtterance = new SpeechSynthesisUtterance("Test");
      testUtterance.volume = 0; // Silent test
      testUtterance.onend = () => console.log("✅ Speech synthesis test passed");
      testUtterance.onerror = () => {
        console.warn("⚠️ Speech synthesis test failed");
        setSpeechEnabled(false); 
        showSystemMessage("Text-to-speech failed to initialize. Questions will be displayed only.", 5000);
      };
      window.speechSynthesis.speak(testUtterance);
    } else {
      console.log("❌ Speech synthesis not available");
      setSpeechEnabled(false);
      showSystemMessage("Text-to-speech not available. Questions will be displayed only.", 5000);
    }
  };

  const cleanup = () => {
    console.log("🧹 Cleaning up resources...");
    
    if (userMediaStreamRef.current) {
      userMediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    window.speechSynthesis.cancel();
    isProcessingQuestionRef.current = false;
  };

  const showSystemMessage = useCallback((message: string, duration = 3000) => {
    console.log("💬 System message:", message);
    setSystemMessage(message);
    setTimeout(() => setSystemMessage(null), duration);
  }, []);

  const speakText = useCallback((text: string, onComplete: (() => void) | null = null) => {
    if (!speechEnabled) {
      console.log("🔇 Speech disabled, skipping:", text);
      if (onComplete) setTimeout(onComplete, 1000);
      return;
    }
    
    console.log("🗣️ Speaking:", text);
    
    window.speechSynthesis.cancel();
    
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      utterance.lang = 'en-US';
      
      utterance.onstart = () => {
        console.log("🎙️ Speech started");
        setIsSpeaking(true);
        setBotAnimating(true);
      };
      
      utterance.onend = () => {
        console.log("🎙️ Speech ended");
        setIsSpeaking(false);
        setBotAnimating(false);
        if (onComplete) {
          setTimeout(onComplete, 500);
        }
      };
      
      utterance.onerror = (event) => {
        console.error('❌ Speech synthesis error:', event);
        setIsSpeaking(false);
        setBotAnimating(false);
        if (onComplete) setTimeout(onComplete, 1000);
      };
      
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }, 200);
    
  }, [speechEnabled]);
  
  const speakTextWithCallback = (text: string, callback: () => void) => {
    if (!speechEnabled) {
      if (callback) setTimeout(callback, 1000);
      return;
    }

    window.speechSynthesis.cancel();
    
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      utterance.lang = 'en-US';
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        setBotAnimating(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setBotAnimating(false);
        if (callback) setTimeout(callback, 500);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event);
        setIsSpeaking(false);
        setBotAnimating(false);
        if (callback) setTimeout(callback, 1000);
      };
      
      window.speechSynthesis.speak(utterance);
    }, 200);
  };

  const startInterviewWithGreeting = (session: SessionData) => {
    if (isProcessingQuestionRef.current) {
      console.log("⏸️ Already processing, skipping greeting");
      return;
    }

    console.log("👋 Starting interview with greeting");
    isProcessingQuestionRef.current = true;
    
    const userName = session.user_name || 'there';
    const greetingMessage = `Hello ${userName}! Welcome to your AI interview. I'm your virtual interviewer today. We have ${session.questions.length} questions prepared for you. Are you ready? Let's begin with the first question.`;
    
    const greetingMsg: Message = {
      id: Date.now(),
      type: 'bot',
      content: greetingMessage,
      timestamp: new Date()
    };
    
    setMessages([greetingMsg]);
    
    speakText(greetingMessage, () => {
      console.log("✅ Greeting complete, starting first question");
      setIsInterviewActive(true);
      setTimeout(() => {
        isProcessingQuestionRef.current = false;
        startQuestion(0, session);
      }, 1500);
    });
  };

  const startQuestion = useCallback((questionIndex: number, session: SessionData | null = sessionData) => {
    if (isProcessingQuestionRef.current && questionIndex !== 0) {
      console.log("⏸️ Already processing question, skipping");
      return;
    }

    if (!session || !session.questions || questionIndex >= session.questions.length) {
      console.log("📝 All questions completed or session data is invalid");
      completeInterview();
      return;
    }

    console.log(`❓ Starting question ${questionIndex + 1}`);
    isProcessingQuestionRef.current = true;
    const question = session.questions[questionIndex];
    const questionText = question.question;
    const allocatedTime = question.allocated_time;
    
    setCurrentQuestionIndex(questionIndex);
    isUserStoppedRef.current = false; // Reset stop flag for the new question
    setFinalWavBlob(null); // Clear previous WAV data
    
    const questionMessage: Message = {
      id: Date.now() + questionIndex,
      type: 'bot',
      content: `Question ${questionIndex + 1}: ${questionText}`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, questionMessage]);
    
    const speakTextContent = speechEnabled 
      ? `Question ${questionIndex + 1}. ${questionText}. You have ${allocatedTime} seconds to answer.`
      : null;
    
    const startRecordingAfterSpeech = () => {
        console.log("✅ Question speech complete, starting recording");
        setTimeout(() => {
          isProcessingQuestionRef.current = false;
          // Start with the full allocated time for a new question
          startAudioRecording(allocatedTime, question.order); 
        }, 1000);
    };

    if (speakTextContent) {
      console.log("🗣️ Speaking question:", speakTextContent);
      speakTextWithCallback(speakTextContent, startRecordingAfterSpeech);
    } else {
      // If speech is disabled, show message and start listening
      showSystemMessage(`Question ${questionIndex + 1} displayed. Start recording when ready.`, 3000);
      setTimeout(() => {
        isProcessingQuestionRef.current = false;
        startAudioRecording(allocatedTime, question.order);
      }, 2000);
    }
    
  }, [sessionData, speechEnabled, showSystemMessage]);

  const startAudioRecording = useCallback((allocatedTime: number, orderId: number) => {
    console.log(`🎤 Starting audio recording from ${allocatedTime} seconds`);
    
    if (!userMediaStreamRef.current || !audioContextRef.current) {
        showSystemMessage("Microphone not available. Cannot start recording.", 5000);
        return;
    }
    
    const audioTrack = userMediaStreamRef.current.getAudioTracks()[0];
    if (!audioTrack || audioTrack.readyState !== 'live') {
        showSystemMessage("Microphone stream is not active. Please refresh and grant permissions.", 5000);
        return;
    }
    
    // Clear previous chunks
    audioChunksRef.current = [];
    
    // Stop any existing recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
    }

    try {
        mediaRecorderRef.current = new MediaRecorder(userMediaStreamRef.current); 
        
        mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
            console.log(`Received audio data chunk: ${event.data.type}`);
            audioChunksRef.current.push(event.data);
        };

        // CRITICAL: onstop is now responsible for WAV conversion and non-blocking submission
        mediaRecorderRef.current.onstop = async () => {
            console.log("🎙️ Recording stopped, starting WAV conversion...");
            setIsListening(false);
            
            // 1. Combine chunks into a single Blob.
            const rawBlobType = audioChunksRef.current[0]?.type || 'audio/webm';
            const rawBlob = new Blob(audioChunksRef.current, { type: rawBlobType });
            
            // 2. Decode, encode to WAV
            setSystemMessage("Processing audio...");
            let wavBlob: Blob | null = null;
            let submissionText = isUserStoppedRef.current ? "Manually stopped answer" : "Timed out answer";
            
            // Calculate time elapsed BEFORE potential conversion failure
            const currentQuestion = sessionDataRef.current?.questions[currentQuestionIndexRef.current];
            const allocatedTimeTotal = currentQuestion?.allocated_time || 0;
            // Use the last set timeLeft, or 0 if the timer was cleared/finished.
            const timeElapsed = allocatedTimeTotal - (timerRef.current ? timeLeft : 0); 
            
            try {
                const arrayBuffer = await rawBlob.arrayBuffer();
                const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
                wavBlob = encodeWAV(audioBuffer);
                setFinalWavBlob(wavBlob);
                setSystemMessage("Audio processed to WAV.");
            } catch (conversionError) {
                console.error("❌ Audio conversion failed:", conversionError);
                setSystemMessage(`Audio processing failed: ${conversionError.name}. Submitting empty answer.`);
                wavBlob = null;
            }

            // 3. Submission logic
            handleAnswerSubmission(orderId, submissionText, timeElapsed, wavBlob);
        };
        
        // Start the recorder
        mediaRecorderRef.current.start();
        setIsListening(true);

    } catch(e) {
        console.error("❌ Failed to start MediaRecorder:", e);
        showSystemMessage(`Failed to start audio recording: ${e.name}. Check mic permissions/browser support.`, 5000);
        return;
    }

    // Timer setup
    let currentTime = allocatedTime; 
    setTimeLeft(currentTime); // Initialize state immediately
    
    if (timerRef.current) {
        clearInterval(timerRef.current);
    }
    
    console.log(`⏰ Initial timer set to ${allocatedTime}`);

    // Timer runs until 0, then triggers submission
    timerRef.current = setInterval(() => {
      currentTime--;
      setTimeLeft(currentTime);
      
      if (currentTime <= 0) {
        console.log("⏰ Time's up! Stopping recording.");
        clearInterval(timerRef.current);
        timerRef.current = null;
        
        // At time end, always stop recorder to trigger the onstop logic (conversion/submission)
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop(); 
        } else {
            // Fallback for empty/failed recording: submit a 'no audio' payload
            const totalAllocatedTime = sessionDataRef.current?.questions[currentQuestionIndexRef.current]?.allocated_time || 0;
            // Ensure handleAnswerSubmission is called with a timeElapsed of the full duration
            handleAnswerSubmission(orderId, "No audio recorded (Timed out)", totalAllocatedTime, null);
        }
      }
    }, 1000) as unknown as number; // Type assertion for setInterval return
  }, [showSystemMessage, timeLeft]); 

  // 📝 Updated to simplify the user message in the chat
  const handleAnswerSubmission = (orderId: number, answerDisplay: string, timeTaken: number, audioBlob: Blob | null) => {
    // Critical lock to prevent duplicate calls from race conditions (timer/onerror/onend)
    if (isSubmissionPendingRef.current) {
        console.warn("🚫 Submission already in progress. Ignoring duplicate call.");
        return;
    }
    isSubmissionPendingRef.current = true; // Set lock
    
    // Stop the interval timer, if it's still running (e.g., from manual stop or skip)
    if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }
    
    // Display a simplified message in the chat as requested
    const userMessage: Message = {
      id: Date.now() + 1000,
      type: 'user',
      content: 'Answer recorded and submitted.', // Simplified text
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    showSystemMessage("Answer submitted. Moving to next question...", 3000);
    
    // 💥 CRITICAL CHANGE APPLIED HERE: Fire-and-forget submission and move to next question immediately.
    // Initiate non-blocking submission. The promise is allowed to resolve/reject in the background.
    submitAnswer(orderId, answerDisplay, timeTaken, audioBlob); 
    
    isSubmissionPendingRef.current = false; // Release lock immediately after sending submission
    moveToNextQuestion(); // Move to the next question immediately
  };

  // 📤 Non-blocking submission function
  const submitAnswer = async (orderId: number, answerTextFallback: string, timeTaken: number, audioBlob: Blob | null) => {
    
    console.log("📤 Submitting answer:", { orderId, timeTaken, hasAudio: !!audioBlob });
    
    let accessToken = localStorage.getItem('access_token');
    const sessionId = sessionDataRef.current?.session_id;

    if (!accessToken || !sessionId) {
      console.log(`📝 No access token or session ID (${sessionId}), cannot submit. Skipping.`);
      return; 
    }
    
    // Use FormData for file upload
    const formData = new FormData();
    formData.append('session_id', sessionId.toString());
    formData.append('order_id', orderId.toString());
    formData.append('time_taken', timeTaken.toString());
    
    // Send the WAV file using the key 'answer_audio' expected by the Django backend
    if (audioBlob) {
        formData.append('answer_audio', audioBlob, 'answer.wav');
    } else {
        // Fallback text if no audio was recorded (e.g., skip or error)
        formData.append('answer_text', answerTextFallback);
    }
    
    // Attempt API submission
    try {
      const response = await fetch(`${apiBaseUrl}/submit_answer/`, {
        method: 'POST',
        // DO NOT set Content-Type header when using FormData for file uploads
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData 
      });
      
      if (!response.ok) {
        // Log the failure, but don't hold up the user/interview flow
        console.error(`❌ Non-blocking Submission Failed: HTTP error! status: ${response.status}`);
        // No user-facing message needed, as requested.
        return;
      }
      
      const data = await response.json();
      console.log("✅ Non-blocking Answer submitted successfully:", data);
      
    } catch (error) {
      console.error('❌ Non-blocking Submission Failed (Network/CORS):', error);
      // No user-facing message needed, as requested.
    }
  };
  
  const moveToNextQuestion = useCallback(() => {
    if (isProcessingQuestionRef.current) {
      console.log("⏸️ Already processing, skipping move to next question");
      return;
    }

    const nextIndex = currentQuestionIndexRef.current + 1;
    const currentSession = sessionDataRef.current;
    const questionsLength = currentSession?.questions?.length || 0;
    
    console.log(`➡️ Moving to question ${nextIndex + 1} (Total questions: ${questionsLength})`);
    
    if (nextIndex < questionsLength) {
      setTimeout(() => {
        startQuestion(nextIndex, currentSession); 
      }, 1000);
    } else {
      console.log("🏁 All questions processed. Completing interview.");
      completeInterview();
    }
  }, [startQuestion]); 

  const completeInterview = async () => {
    if (interviewCompleted) {
      console.log("📝 Interview already completed, skipping");
      return;
    }

    console.log("🏁 Completing interview");
    
    setIsInterviewActive(false);
    setInterviewCompleted(true);
    isProcessingQuestionRef.current = true;
    
    const completionMessage = "Excellent! You have completed all the questions. Thank you for your time and effort. I'm now analyzing your responses and will provide you with a detailed summary of your performance shortly.";
    
    setMessages(prev => [...prev, {
      id: Date.now() + 3000,
      type: 'bot',
      content: completionMessage,
      timestamp: new Date()
    }]);
    
    speakText(completionMessage, () => {
      setTimeout(() => {
        getInterviewSummary();
      }, 2000);
    });
  };

  const getInterviewSummary = async () => {
    const accessToken = localStorage.getItem('access_token');
    const sessionId = sessionDataRef.current?.session_id;
    
    // Summary call uses POST with session_id to retrieve the report.
    if (!sessionId || !accessToken) {
      console.log("❌ Cannot fetch summary: No session ID or access token. Falling back.");
    }
    
    console.log("📊 Attempting to get interview summary...");
    
    try {
      const response = await fetch(`${apiBaseUrl}/get_interview_summary/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ session_id: sessionId })
      });
      
      let summaryText: string;
      if (response.ok) {
        const data = await response.json();
        summaryText = data.summary || "Thank you for completing the interview. Your responses show good technical understanding. Continue practicing to improve your communication skills and technical depth.";
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setMessages(prev => [...prev, {
        id: Date.now() + 4000,
        type: 'bot',
        content: summaryText,
        timestamp: new Date()
      }]);
      
      speakText(summaryText, () => {
        setTimeout(() => {
          endSession(); // End session and redirect after speaking summary
        }, 5000);
      });
      
    } catch (error) {
      console.error('❌ Error getting summary:', error);
      const fallbackMessage = "Interview completed successfully, but the summary could not be retrieved due to an error. Your responses have been recorded and saved. Thank you!";
      
      setMessages(prev => [...prev, {
        id: Date.now() + 5000,
        type: 'bot',
        content: fallbackMessage,
        timestamp: new Date()
      }]);
      
      speakText(fallbackMessage, () => {
        setTimeout(() => {
          endSession(); // End session and redirect after speaking fallback
        }, 5000);
      });
    }
  };
  
  /**
   * Cleans up and calls the provided redirect handler.
   * Redirects to the dashboard page after cleanup.
   */
// Main Interview Room Component (InterviewRoom.tsx)

// ... (Existing code above endSession)

  /**
   * Cleans up and calls the provided redirect handler.
   * Redirects to the dashboard page after cleanup.
   */
  const endSession = () => {
    console.log("🔚 Ending session");
    
    setIsInterviewActive(false);
    setInterviewCompleted(true);
    setIsListening(false);
    setTimeLeft(0);
    
    // 📢 Explicitly mentioning the dashboard URL in the system message for clarity
    showSystemMessage("Interview session completed. Redirecting to dashboard...", 3000);
    
    cleanup();
    
    // CRITICAL: Call the prop function to handle redirection to dashboard
    if (onInterviewComplete) {
      setTimeout(() => {
        // 💥 CRITICAL UPDATE: Hard-redirecting to the specified URL
        // window.location.replace is used to prevent the user from using the back button to return to the interview.
        window.location.replace('http://localhost:5173/dashboard');
        
        // The onInterviewComplete prop is still called, just in case it contains 
        // other necessary cleanup logic (e.g., from a parent component).
        onInterviewComplete();
      }, 3000); // Wait for the system message to display
    }
  };

// ... (Existing code below endSession)


  const toggleMute = () => {
    if (userMediaStreamRef.current) {
      const audioTrack = userMediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  const toggleVideo = () => {
    if (userMediaStreamRef.current) {
      const videoTrack = userMediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoOff;
        setIsVideoOff(!isVideoOff);
      }
    }
  };
  
  // NOTE: Manual recording controls have been removed from the UI as requested.
  // The logic below is still present but now only callable via debug or if you re-add the buttons.

  const manualStartRecording = () => {
    if (!isListening && sessionDataRef.current && currentQuestionIndex < sessionDataRef.current.questions.length) {
      const question = sessionDataRef.current.questions[currentQuestionIndex];
      
      const startTime = (timeLeft > 0 && timeLeft < question.allocated_time) 
        ? timeLeft 
        : question.allocated_time;

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      isUserStoppedRef.current = false; 

      // Call the new audio recording function
      startAudioRecording(startTime, question.order);
    }
  };

  // Logic to stop the recording and let the submission/next question logic handle it
  const manualStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        // Set flag to ensure onstop handles the submission correctly
        isUserStoppedRef.current = true; 
        mediaRecorderRef.current.stop(); 
        // Submission logic is now inside mediaRecorder.onstop
        console.log("🎙️ User manually stopped recording. Submission will occur after WAV conversion.");
        showSystemMessage("Recording stopped. Submitting answer...", 3000);
    }
  }

  const skipToNextQuestion = () => {
    console.log("⏩ Skipping question.");
    
    // 1. Stop all active processes
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop(); // This will trigger onstop and submission logic
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null; // Clear timer ref to prevent submission call
    }
    isUserStoppedRef.current = false; // Reset stop flag
    setIsListening(false);
    
    // 2. Calculate time taken (Time taken is the amount of time elapsed)
    const currentQuestion = sessionDataRef.current?.questions[currentQuestionIndexRef.current];
    const allocatedTime = currentQuestion?.allocated_time || 0;
    const timeTaken = allocatedTime - (timeLeft > 0 ? timeLeft : 0);
    
    // 3. Force submission with a fallback text and null audio blob
    if (currentQuestion) {
      handleAnswerSubmission(currentQuestion.order, "Skipped by user", timeTaken, null);
    } else {
      moveToNextQuestion();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black text-white p-4 lg:p-6">
      {/* Main Interview Area */}
      <motion.div 
        className="flex-1 flex flex-col items-center justify-center bg-gray-900 rounded-xl shadow-lg relative p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* User Webcam Feed */}
        <div className="absolute top-4 left-4 lg:top-6 lg:left-6 w-32 h-24 lg:w-48 lg:h-36 bg-gray-800 rounded-lg overflow-hidden shadow-md border-2 border-blue-600 z-10 aspect-video">
          <video 
            ref={videoRef} 
            className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
            autoPlay 
            muted 
            playsInline 
          />
          {isVideoOff && (
            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500">
              <VideoOff className="h-6 w-6 lg:h-8 lg:w-8" />
            </div>
          )}
        </div>

        {/* AI Bot Visualization Area */}
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="text-center">
            <motion.div 
              className={`w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center ${
                isSpeaking ? 'animate-pulse scale-110' : ''
              }`}
              animate={isSpeaking ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: isSpeaking ? Infinity : 0 }}
            >
              <div className="text-4xl">🤖</div>
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-300">AI Interviewer</h3>
            
            {/* Status Messages - Simplified as requested */}
            {isSpeaking && (
              <motion.div 
                className="mt-2 text-sm text-blue-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Speaking...
              </motion.div>
            )}
            {isInterviewActive && !isSpeaking && !isListening && (
              <div className="mt-2 text-sm text-yellow-400">
                Ready to record answer...
              </div>
            )}
             {/* Completion Message */}
            {interviewCompleted && !isInterviewActive && (
                 <div className="mt-4 text-xl font-bold text-green-400">
                   Session Ended wait for results by ai and completed. Thank you!
                 </div>
            )}
          </div>
        </div>

        {/* Timer Display */}
        {isInterviewActive && timeLeft > 0 && (
          <motion.div 
            className={`absolute top-4 right-4 flex items-center px-4 py-2 rounded-full text-lg font-bold z-10 ${
              timeLeft <= 10 ? 'bg-red-600 animate-pulse' : timeLeft <= 30 ? 'bg-yellow-600' : 'bg-blue-600'
            } text-white`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <Clock className="h-5 w-5 mr-2" />
            <span>{formatTime(timeLeft)}</span>
          </motion.div>
        )}

        {/* Question Progress */}
        {sessionDataRef.current && isInterviewActive && (
          <div className="absolute top-20 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-sm z-10">
            Question {currentQuestionIndex + 1} of {sessionDataRef.current.questions.length}
          </div>
        )}

        {/* Recording Indicator */}
        {isListening && (
          <motion.div 
            className="absolute bottom-32 left-1/2 -translate-x-1/2 flex items-center px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            RECORDING - {formatTime(timeLeft)} left
          </motion.div>
        )}

        {/* REMOVED: Manual Start Recording & Skip Controls (as requested)
          REMOVED: Manual Stop Recording Button (as requested)
        */}

        {/* System Messages */}
        <AnimatePresence>
          {systemMessage && (
            <motion.div 
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg z-20 max-w-md text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {systemMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Control Buttons */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
          <Button 
            className="rounded-full bg-gray-800/70 text-white hover:bg-gray-700/90" 
            onClick={toggleVideo}
            title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
          >
            {isVideoOff ? <VideoOff className="h-5 w-5 text-red-500" /> : <Video className="h-5 w-5" />}
          </Button>
          
          <Button 
            className="rounded-full bg-gray-800/70 text-white hover:bg-gray-700/90" 
            onClick={toggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Button 
            className="rounded-full bg-red-600/70 text-white hover:bg-red-500/90" 
            onClick={endSession}
            title="End Interview"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
          
          <Button 
            className="rounded-full bg-gray-800/70 lg:hidden text-white hover:bg-gray-700/90" 
            onClick={() => setIsChatOpen(true)}
            title="Open Chat"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      {/* Desktop Chat Interface */}
      <div className="hidden lg:flex lg:w-1/3 xl:w-1/4 flex-col bg-gray-900 border-l border-gray-700 p-4 rounded-xl shadow-inner mt-4 lg:mt-0 lg:ml-4">
        <ChatPanel
          messages={messages}
          botAnimating={botAnimating}
          isListening={isListening}
          messagesEndRef={messagesEndRef}
          onClose={() => {}}
          timeLeft={timeLeft}
        />
      </div>

      {/* Mobile Chat Interface */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            className="fixed inset-0 bg-gray-900 z-50 lg:hidden flex flex-col"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: '0%' }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-4 flex-1 flex flex-col">
              <ChatPanel
                messages={messages}
                botAnimating={botAnimating}
                isListening={isListening}
                messagesEndRef={messagesEndRef}
                onClose={() => setIsChatOpen(false)}
                timeLeft={timeLeft}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs z-50">
          <div>Question: {currentQuestionIndex + 1}/{sessionDataRef.current?.questions?.length || 0}</div>
          <div>Recording: {isListening ? 'Yes' : 'No'}</div>
          <div>Speaking: {isSpeaking ? 'Yes' : 'No'}</div>
          <div>Speech Enabled: {speechEnabled ? 'Yes' : 'No'}</div>
          <div>Processing: {isProcessingQuestionRef.current ? 'Yes' : 'No'}</div>
          <div>User Stopped: {isUserStoppedRef.current ? 'Yes' : 'No'}</div>
          <div>Time Left: {timeLeft}</div>
          <div>WAV Blob: {finalWavBlob ? (finalWavBlob.size / 1024).toFixed(2) + ' KB' : 'None'}</div>
        </div>
      )}
    </div>
  );
}

export default InterviewRoom;