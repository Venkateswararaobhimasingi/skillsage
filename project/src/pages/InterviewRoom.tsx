import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Spline } from '@splinetool/react-spline'; // Assuming you have @splinetool/react-spline installed
import {
  Send,
  Mic,
  MicOff,
  XCircle, // End Interview icon
  Video,
  VideoOff,
  PhoneOff, // End Call icon
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Define the Message interface
interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  feedback?: string;
}

// Sample questions (repeated for self-containment, ideally centralized)
const sampleQuestions: { [key: string]: string[] } = {
  frontend: [
    "Tell me about a challenging React project you've worked on recently.",
    "How do you optimize performance in a React application?",
    "Explain the difference between controlled and uncontrolled components.",
    "How do you handle state management in large applications?"
  ],
  backend: [
    "Describe your experience with database optimization.",
    "How do you handle API rate limiting?",
    "Explain your approach to microservices architecture.",
    "How do you ensure data consistency across distributed systems?"
  ],
  'data-science': [
    "Explain the difference between supervised and unsupervised learning.",
    "How do you handle missing data in a dataset?",
    "Describe a time you used A/B testing.",
    "What are the assumptions of linear regression?"
  ],
  'hr': [
    "Tell me about yourself.",
    "Why are you interested in this role?",
    "What are your strengths and weaknesses?",
    "Where do you see yourself in five years?"
  ]
};

const interviewTopics = [ // Also needed for topicLabel
  { value: 'frontend', label: 'Frontend Development', description: 'HTML, CSS, JavaScript, React, Vue, Angular, etc.' },
  { value: 'backend', label: 'Backend Development', description: 'Node.js, Python, Java, Databases, APIs, etc.' },
  { value: 'fullstack', label: 'Full Stack Development', description: 'Combines frontend and backend skills.' },
  { value: 'data-science', label: 'Data Science', description: 'Machine Learning, Statistics, Data Analysis, etc.' },
  { value: 'devops', label: 'DevOps Engineering', description: 'CI/CD, Cloud, Automation, Infrastructure.' },
  { value: 'mobile', label: 'Mobile Development', 'description': 'iOS, Android, React Native, Flutter.' },
  { value: 'product-management', label: 'Product Management', 'description': 'Strategy, Roadmapping, User Stories.' },
  { value: 'design', label: 'UX/UI Design', description: 'User Research, Wireframing, Prototyping.' },
  { value: 'hr', label: 'HR Interview', description: 'Behavioral questions, soft skills, culture fit.' },
  { value: 'system-design', label: 'System Design', description: 'Scalability, Architecture, Distributed Systems.' },
];

function InterviewRoom() {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'Welcome to your personalized interview session! I am your AI interviewer. Let\'s begin.',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [botAnimating, setBotAnimating] = useState(false);
  const [systemMessage, setSystemMessage] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userMediaStreamRef = useRef<MediaStream | null>(null);
  const [isMediaReady, setIsMediaReady] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        userMediaStreamRef.current = stream;
        setIsMediaReady(true);
        console.log("Webcam and microphone connected.");
      } catch (error) {
        console.error("Error accessing user media:", error);
        console.error("Unable to access webcam or microphone. Please check permissions.");
      }
    };
    getUserMedia();
    return () => {
      userMediaStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  useEffect(() => {
    if (isMediaReady && videoRef.current) {
      videoRef.current.srcObject = userMediaStreamRef.current;
      if (userMediaStreamRef.current) {
        userMediaStreamRef.current.getAudioTracks().forEach(track => track.enabled = !isMuted);
        userMediaStreamRef.current.getVideoTracks().forEach(track => track.enabled = !isVideoOff);
      }
    }
  }, [isMediaReady, isMuted, isVideoOff]);

  const showSystemMessage = useCallback((message: string, duration: number = 3000) => {
    setSystemMessage(message);
    const timer = setTimeout(() => {
      setSystemMessage(null);
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setBotAnimating(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        type: 'bot',
        content: generateBotResponse(userMessage.content, topic || 'general'),
        timestamp: new Date(),
        feedback: generateFeedback()
      };
      setMessages(prev => [...prev, botResponse]);
      setBotAnimating(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string, currentTopic: string): string => {
    const topicQuestions = sampleQuestions[currentTopic] || sampleQuestions['hr'];
    return topicQuestions[Math.floor(Math.random() * topicQuestions.length)];
  };

  const generateFeedback = (): string => {
    const feedbacks = [
      "Great technical depth! Consider adding more specific examples.",
      "Good structure, but try to quantify your achievements more.",
      "Excellent communication! Your explanation was clear and concise.",
      "Strong answer! Consider mentioning any challenges you overcame."
    ];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  };

  const handleEndInterview = () => {
    // Using a custom modal or confirmation UI is recommended instead of window.confirm
    // For this example, we'll keep window.confirm as per the original code's pattern.
    if (window.confirm("Are you sure you want to end the interview and return to the dashboard?")) {
      userMediaStreamRef.current?.getTracks().forEach(track => track.stop());
      navigate('/dashboard');
    }
  };

  const topicLabel = interviewTopics.find(t => t.value === topic)?.label || topic || 'Selected';

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black text-white p-4 lg:p-6">
      {/* Main Interview Area (Spline Bot and User Video) */}
      <motion.div
        className="flex-1 flex flex-col items-center justify-center bg-gray-900 rounded-xl shadow-lg relative p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* User Webcam Feed - Smaller and positioned */}
        <div className="absolute top-4 left-4 lg:top-6 lg:left-6 w-32 h-24 lg:w-48 lg:h-36 bg-gray-800 rounded-lg overflow-hidden shadow-md border-2 border-primary-foreground z-10 aspect-video">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          {(!isMediaReady || !userMediaStreamRef.current || userMediaStreamRef.current.getVideoTracks().length === 0) && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-500 text-xs lg:text-sm">
              <Video className="h-6 w-6 lg:h-8 lg:w-8" />
            </div>
          )}
        </div>

        {/* Spline Bot Area (Main view) */}
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Spline Bot placeholder</p>
          </div>
          {/* <Spline scene="https://prod.spline.design/YOUR_SPLINE_SCENE_URL/scene.splinecode" /> */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xl font-medium pointer-events-none">
            Loading AI Interviewer...
          </div>
        </div>

        {/* Recording Indicator */}
        <div className="absolute top-4 right-4 flex items-center px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium z-10">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          REC
        </div>

        {systemMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg z-20"
          >
            {systemMessage}
          </motion.div>
        )}
        
        {/* Video Controls, Call End, and Mobile Chat Toggle Button (Unified) */}
        {/* This div now contains all the action buttons, visible on both desktop and mobile */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
          <Button
            size="icon"
            className="rounded-full bg-gray-800/70 text-white hover:bg-gray-700/90"
            onClick={() => setIsVideoOff(!isVideoOff)}
            title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
          >
            {isVideoOff ? <VideoOff className="h-5 w-5 text-red-500" /> : <Video className="h-5 w-5" />}
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-gray-800/70 text-white hover:bg-gray-700/90"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <MicOff className="h-5 w-5 text-red-500" /> : <Mic className="h-5 w-5" />}
          </Button>
          {/* End Call Button (PhoneOff icon) - visible on both mobile and desktop */}
          <Button
            size="icon"
            className="rounded-full bg-red-600/70 text-white hover:bg-red-500/90"
            onClick={handleEndInterview}
            title="End Call"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
          {/* End Interview Button (XCircle icon) - now visible on both mobile and desktop */}
          <Button
            size="icon"
            className="rounded-full bg-gray-800/70 text-red-400 hover:bg-gray-700/90 hover:text-red-300"
            onClick={handleEndInterview}
            title="End Interview"
          >
            <XCircle className="h-5 w-5" />
          </Button>
          {/* Mobile chat toggle button - hidden on desktop */}
          <Button
            size="icon"
            className="rounded-full bg-gray-800/70 lg:hidden text-white hover:bg-gray-700/90"
            onClick={() => setIsChatOpen(true)}
            title="Open Chat"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      {/* Chat Interface - Split into Desktop and Mobile */}

      {/* Desktop Chat (Always Visible on large screens) */}
      <div className="hidden lg:flex lg:w-1/3 xl:w-1/4 flex-col bg-gray-900 border-l border-gray-700 p-4 rounded-xl shadow-inner mt-4 lg:mt-0 lg:ml-4">
        <ChatPanel
          messages={messages}
          botAnimating={botAnimating}
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          handleSendMessage={handleSendMessage}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          messagesEndRef={messagesEndRef}
          onClose={() => {}} // No close function on desktop, so pass a dummy function
        />
      </div>

      {/* Mobile Chat (Conditionally Rendered and Animated) */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            key="mobile-chat"
            className={`fixed inset-x-0 bottom-0 flex-col bg-gray-900 border-t border-gray-700 p-4 rounded-t-xl shadow-inner z-50 lg:hidden`}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.3 }}
          >
            <ChatPanel
              messages={messages}
              botAnimating={botAnimating}
              currentMessage={currentMessage}
              setCurrentMessage={setCurrentMessage}
              handleSendMessage={handleSendMessage}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              messagesEndRef={messagesEndRef}
              onClose={() => setIsChatOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// A new component to encapsulate the chat panel logic for reuse
const ChatPanel = ({ messages, botAnimating, currentMessage, setCurrentMessage, handleSendMessage, isRecording, setIsRecording, messagesEndRef, onClose }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Interview Chat</h2>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden" // This close button is only for mobile chat panel
          onClick={onClose}
        >
          <XCircle className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 rounded-lg bg-gray-800 shadow-inner">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${
              message.type === 'user'
                ? 'bg-primary text-primary-foreground rounded-br-none'
                : 'bg-gray-700 border border-gray-600 rounded-bl-none'
            } rounded-xl p-4 shadow-sm`}>
              <p className="text-sm leading-relaxed text-white">{message.content}</p>
              <div className="flex justify-between items-center mt-2 text-xs opacity-70 text-gray-400">
                <span>{message.timestamp.toLocaleTimeString()}</span>
                {message.type === 'user' && (
                  <span className="ml-2">✓</span>
                )}
              </div>
              {message.feedback && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <p className="text-xs text-gray-500 italic">
                    💡 {message.feedback}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {botAnimating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-700 border border-gray-600 rounded-xl rounded-bl-none p-4 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-700 p-4 bg-gray-900 rounded-b-xl shadow-md">
        <div className="flex space-x-3">
          <Input
            placeholder="Type your answer here..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={botAnimating}
            className="flex-1 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Button
            onClick={() => setIsRecording(!isRecording)}
            variant="outline"
            size="icon"
            className={`rounded-full shadow-sm transition-all duration-200 ${isRecording ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || botAnimating}
            className="rounded-full shadow-sm transition-all duration-200"
            variant="gradient"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex justify-center mt-4 space-x-4 text-xs text-gray-500">
          <span>💡 Be specific and detailed</span>
          <span>⏱️ Take your time to think</span>
        </div>
      </div>
    </>
  );
};

export default InterviewRoom;