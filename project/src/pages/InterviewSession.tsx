import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import {
  Send,
  Mic,
  MicOff,
  Settings,
  Play,
  RotateCcw,
  ChevronLeft,
  Video,
  Volume2,
  Webcam,
  XCircle,
  Headphones,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define the Message interface
interface Message {
  id: number;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  feedback?: string;
}

// Data for interview topics (repeated here for self-containment, ideally imported from a central file)
const interviewTopics = [
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

// Sample questions for different topics (repeated here for self-containment)
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

interface InterviewSessionProps {
  selectedTopic: string;
  onGoBack: () => void;
}

function InterviewSession({ selectedTopic, selectedDifficulty, onGoBack }: InterviewSessionProps) {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // State for chat messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI interview assistant. I\'ll conduct a personalized interview session based on your selected parameters. Are you ready to begin?',
      timestamp: new Date()
    }
  ]);
  // State for the current message being typed by the user
  const [currentMessage, setCurrentMessage] = useState('');
  // State for recording status (microphone) - for actual interview recording
  const [isRecording, setIsRecording] = useState(false);
  // State to indicate if the interview has started
  const [isInterviewActive, setIsInterviewActive] = useState(false); // This state will now primarily control UI within this page
  // State to simulate bot's thinking/typing
  const [botAnimating, setBotAnimating] = useState(false);
  // State for displaying temporary system messages (e.g., device test results)
  const [systemMessage, setSystemMessage] = useState<string | null>(null);

  // New states for managing API call
  const [isLoadingInterviewData, setIsLoadingInterviewData] = useState(false);
  const [interviewData, setInterviewData] = useState<any | null>(null); // State to hold data from backend

  // Device states
  const [availableMics, setAvailableMics] = useState<MediaDeviceInfo[]>([]);
  const [selectedMicId, setSelectedMicId] = useState<string>('');
  const [availableSpeakers, setAvailableSpeakers] = useState<MediaDeviceInfo[]>([]);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>('');
  const [availableWebcams, setAvailableWebcams] = useState<MediaDeviceInfo[]>([]);
  const [selectedWebcamId, setSelectedWebcamId] = useState<string>('');

  // Ref for auto-scrolling chat messages
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Ref for the video element to display webcam feed
  const videoRef = useRef<HTMLVideoElement>(null);
  // State to hold the primary media stream (video and audio) for the display
  const [primaryMediaStream, setPrimaryMediaStream] = useState<MediaStream | null>(null);
  // Ref for AudioContext to handle audio tests
  const audioContextRef = useRef<AudioContext | null>(null);

  // State for audio recording test
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isRecordingTest, setIsRecordingTest] = useState(false);
  // New state to store the URL of the last recorded audio for playback
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);


  // Scroll to the latest message whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Displays a temporary system message in the UI.
   * @param message The message to display.
   * @param duration The duration in milliseconds for which the message should be visible.
   */
  const showSystemMessage = useCallback((message: string, duration: number = 3000) => {
    setSystemMessage(message);
    const timer = setTimeout(() => {
      setSystemMessage(null);
    }, duration);
    return () => clearTimeout(timer); // Cleanup function for useEffect
  }, []);

  /**
   * Enumerates available media input and output devices and sets initial selections.
   */
  const getMediaDevices = useCallback(async () => {
    try {
      // Request temporary media stream to get device labels (required by some browsers for full labels)
      // This will also prompt for permissions if not already granted.
      const tempStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      tempStream.getTracks().forEach(track => track.stop()); // Stop immediately after getting labels

      const devices = await navigator.mediaDevices.enumerateDevices();

      const mics = devices.filter(device => device.kind === 'audioinput');
      const speakers = devices.filter(device => device.kind === 'audiooutput');
      const webcams = devices.filter(device => device.kind === 'videoinput');

      setAvailableMics(mics);
      if (mics.length > 0 && !mics.some(mic => mic.deviceId === selectedMicId)) {
        setSelectedMicId(mics[0].deviceId); // Select first available if current isn't valid
      } else if (mics.length === 0) {
        setSelectedMicId('');
      }

      setAvailableSpeakers(speakers);
      if (speakers.length > 0 && !speakers.some(speaker => speaker.deviceId === selectedSpeakerId)) {
        setSelectedSpeakerId(speakers[0].deviceId);
      } else if (speakers.length === 0) {
        setSelectedSpeakerId('');
      }

      setAvailableWebcams(webcams);
      if (webcams.length > 0 && !webcams.some(webcam => webcam.deviceId === selectedWebcamId)) {
        setSelectedWebcamId(webcams[0].deviceId);
      } else if (webcams.length === 0) {
        setSelectedWebcamId('');
      }

    } catch (error) {
      console.error("Error enumerating devices:", error);
      showSystemMessage("Unable to access media devices. Please check permissions.", 5000);
    }
  }, [selectedMicId, selectedSpeakerId, selectedWebcamId, showSystemMessage]);

  // Effect to enumerate devices on mount and listen for changes
  useEffect(() => {
    getMediaDevices(); // Initial enumeration

    navigator.mediaDevices.addEventListener('devicechange', getMediaDevices);

    return () => {
      // Cleanup: stop all tracks from the primaryMediaStream
      primaryMediaStream?.getTracks().forEach(track => track.stop());
      audioContextRef.current?.close();
      if (recordedAudioUrl) {
        URL.revokeObjectURL(recordedAudioUrl);
      }
      navigator.mediaDevices.removeEventListener('devicechange', getMediaDevices);
    };
  }, [getMediaDevices, primaryMediaStream, recordedAudioUrl]);

  // Effect to manage the webcam stream based on selectedWebcamId
  // This is the core fix for camera shaking: manage tracks within one stream
  useEffect(() => {
    const updateVideoSource = async () => {
      // Stop any existing video tracks from the current primary stream
      primaryMediaStream?.getVideoTracks().forEach(track => {
        track.stop();
        // It's safer to remove the track if it was added
        if (primaryMediaStream) primaryMediaStream.removeTrack(track);
      });

      if (!selectedWebcamId) {
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        // If no webcam selected, and no audio tracks remain, clear the stream entirely
        if (primaryMediaStream && primaryMediaStream.getAudioTracks().length === 0) {
          setPrimaryMediaStream(null);
        }
        showSystemMessage("No webcam selected or available.", 3000);
        return;
      }

      try {
        // Get a new stream just for the selected video device
        const newVideoConstraint: MediaStreamConstraints = {
          video: { deviceId: selectedWebcamId, width: 1280, height: 720 }, // Add constraints for better resolution
          audio: false, // Do NOT request audio here to avoid conflicts with mic test and main audio input
        };
        const newVideoTrackStream = await navigator.mediaDevices.getUserMedia(newVideoConstraint);
        const newVideoTrack = newVideoTrackStream.getVideoTracks()[0];

        setPrimaryMediaStream(prevStream => {
          if (prevStream) {
            // Add the new video track to the existing stream
            prevStream.addTrack(newVideoTrack);
            return prevStream; // Return the same stream object
          } else {
            // If no existing stream, create a new one with the video track
            return new MediaStream([newVideoTrack]);
          }
        });

        if (videoRef.current) {
          // This line is important to re-assign srcObject if the stream object reference changes
          // or if it was null before.
          videoRef.current.srcObject = primaryMediaStream || new MediaStream([newVideoTrack]);
        }
        showSystemMessage(`Webcam set to: ${availableWebcams.find(w => w.deviceId === selectedWebcamId)?.label || 'Unknown Webcam'}`, 3000);

      } catch (error) {
        console.error("Error accessing selected webcam:", error);
        if ((error as DOMException).name === 'NotAllowedError') {
          showSystemMessage("Webcam access denied. Please allow camera permissions.", 5000);
        } else if ((error as DOMException).name === 'NotFoundError') {
          showSystemMessage("No webcam found for selected device. Try 'Restart devices'.", 5000);
        } else {
          showSystemMessage(`Webcam error: ${error instanceof Error ? error.message : String(error)}.`, 5000);
        }
      }
    };

    updateVideoSource();
  }, [selectedWebcamId, primaryMediaStream, availableWebcams, showSystemMessage]);


  // Find the label for the selected topic
  const topicLabel = interviewTopics.find(t => t.value === selectedTopic)?.label || selectedTopic;

  /**
   * Handles sending a message from the user.
   * Adds the user's message to the chat and then simulates a bot response.
   */
  const handleSendMessage = () => {
    if (!currentMessage.trim()) return; // Don't send empty messages

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]); // Add user message
    setCurrentMessage(''); // Clear input field
    setBotAnimating(true); // Show bot typing indicator

    // Simulate AI response after a short delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        type: 'bot',
        content: generateBotResponse(currentMessage, selectedTopic), // Generate response based on user input and topic
        timestamp: new Date(),
        feedback: generateFeedback() // Generate simulated feedback
      };

      setMessages(prev => [...prev, botResponse]); // Add bot message
      setBotAnimating(false); // Hide bot typing indicator
    }, 1500); // Simulate network delay
  };

  /**
   * Generates a simulated bot response.
   * In a real application, this would involve an API call to an LLM.
   * @param userInput The user's message.
   * @param topic The selected interview topic.
   * @returns A string representing the bot's response.
   */
  const generateBotResponse = (userInput: string, topic: string): string => {
    const defaultResponses = [
      "That's a great point! Let me follow up with this: How would you handle error boundaries in React to improve user experience?",
      "Excellent! Your understanding shows depth. Now, can you walk me through how you would implement lazy loading in a React application?",
      "I can see you have solid experience. Tell me about a time when you had to refactor legacy code. What was your approach?",
      "Good answer! Building on that, how do you ensure code quality and maintainability in your projects?"
    ];

    // Try to get a question specific to the topic, otherwise use general ones
    const topicQuestions = sampleQuestions[topic] || defaultResponses;
    return topicQuestions[Math.floor(Math.random() * topicQuestions.length)];
  };

  /**
   * Generates simulated feedback for the user's response.
   * In a real application, this would be generated by an LLM based on the user's answer.
   * @returns A string representing the feedback.
   */
  const generateFeedback = (): string => {
    const feedbacks = [
      "Great technical depth! Consider adding more specific examples.",
      "Good structure, but try to quantify your achievements more.",
      "Excellent communication! Your explanation was clear and concise.",
      "Strong answer! Consider mentioning any challenges you overcame."
    ];

    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
  };

  /**
   * Starts the interview session by fetching data from the backend first, then navigating.
   */
  const startInterview = async () => {
    // Check for required devices before attempting to start
    if (!selectedMicId || !selectedWebcamId || !primaryMediaStream || primaryMediaStream.getVideoTracks().length === 0) {
      showSystemMessage("Please ensure a microphone and webcam are selected and working before starting.", 5000);
      return;
    }

    setIsLoadingInterviewData(true);
    showSystemMessage("Starting interview session...", 3000);

    const backendUrl = "http://127.0.0.1:8000/api/start-interview/";
    const requestBody = {
      course: selectedTopic,
      difficulty: selectedDifficulty // Placeholder difficulty level
    };

    try {
      const token = localStorage.getItem("access_token"); 
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data successfully fetched from backend:", data); // Log the data to console
      setInterviewData(data); // Store the data in state
      
      localStorage.setItem('session_data', JSON.stringify(data));
      

      showSystemMessage("Interview data loaded successfully! Redirecting...", 3000);

      // Now, redirect to the InterviewRoom page, passing the selected topic
      navigate(`/interview-room/${selectedTopic}`);

    } catch (error) {
      console.error("Failed to fetch interview data from backend:", error);
      showSystemMessage("Failed to start interview. Check backend connection.", 5000);
      setIsLoadingInterviewData(false);
    }
  };

  /**
   * Resets the interview session to its initial state, allowing a fresh start.
   */
  const restartSession = () => {
    setMessages([{
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI interview assistant. I\'ll conduct a personalized interview session based on your selected parameters. Are you ready to begin?',
      timestamp: new Date()
    }]);
    setCurrentMessage('');
    setIsRecording(false);
    setBotAnimating(false);
    showSystemMessage("Interview session restarted.", 3000);
  };

  /**
   * Handles the microphone test: records for 5 seconds from the selected mic and stores the audio URL.
   */
  const handleTestMic = async () => {
    // If an audio is currently recorded from previous test, revoke it
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      setRecordedAudioUrl(null);
    }

    if (isRecordingTest) {
      // If already recording, stop it
      mediaRecorderRef.current?.stop();
      // Don't stop the stream here, let the onstop event handle it
      setIsRecordingTest(false);
      showSystemMessage("Microphone test recording stopped.", 3000);
      console.log("Mic test stopped by user.");
      return;
    }

    if (!selectedMicId) {
      showSystemMessage("No microphone selected. Please choose one from the dropdown.", 5000);
      console.warn("Attempted mic test without selectedMicId.");
      return;
    }

    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: selectedMicId } });
      console.log("Mic stream obtained successfully.");

      // Determine the best MIME type supported by the browser
      let mimeType = 'audio/webm; codecs=opus'; // Preferred: WebM with Opus
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm'; // Fallback 1: WebM (browser default codec)
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4'; // Fallback 2: MP4 (with AAC usually)
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'audio/wav'; // Fallback 3: WAV (uncompressed, very wide support)
            if (!MediaRecorder.isTypeSupported(mimeType)) {
              showSystemMessage("No supported audio recording format found for your browser.", 7000);
              console.error("No supported audio format found.");
              stream.getTracks().forEach(track => track.stop());
              return;
            }
          }
        }
      }
      console.log(`Using MIME type for recording: ${mimeType}`);


      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      setAudioChunks([]); // Clear previous chunks before starting new recording
      console.log("MediaRecorder initialized.");

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data]);
          // console.log(`Data available: ${event.data.size} bytes. Total chunks: ${audioChunks.length + 1}`); // Log chunk size
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log("MediaRecorder stopped. Finalizing audio blob.");
        const audioBlob = new Blob(audioChunks, { type: mimeType }); // Use the determined mimeType
        const newAudioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(newAudioUrl); // Store the new audio URL
        stream?.getTracks().forEach(track => track.stop()); // Stop mic access
        showSystemMessage("Microphone test recording complete. Click 'Play test sound' to listen.", 5000);
        setIsRecordingTest(false); // Ensure state is reset
        console.log("Audio Blob created:", audioBlob);
        console.log("Recorded Audio URL:", newAudioUrl);
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        showSystemMessage(`Recording error: ${event.error?.message || 'Unknown error'}`, 5000);
        stream?.getTracks().forEach(track => track.stop()); // Ensure stream is stopped on error
        setIsRecordingTest(false);
      };


      mediaRecorderRef.current.start();
      setIsRecordingTest(true);
      showSystemMessage("Recording microphone test for 5 seconds...", 5000);
      console.log("MediaRecorder started.");

      // Stop recording after 5 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          console.log("Stopping MediaRecorder after 5 seconds timeout.");
          mediaRecorderRef.current.stop();
        }
      }, 5000); // Record for 5 seconds

    } catch (err) {
      console.error("Mic test failed:", err);
      if ((err as DOMException).name === 'NotAllowedError') {
        showSystemMessage("Microphone access denied. Please allow microphone permissions.", 5000);
      } else if ((err as DOMException).name === 'NotFoundError') {
        showSystemMessage("No microphone found for selected device. Try 'Restart devices'.", 5000);
      } else {
        showSystemMessage(`Mic test failed: ${err instanceof Error ? err.message : String(err)}.`, 5000);
      }
      stream?.getTracks().forEach(track => track.stop()); // Ensure stream is stopped on error
      setIsRecordingTest(false);
    }
  };

  /**
   * Plays the last recorded audio if available, otherwise plays a test beep through the selected speaker.
   */
  const handlePlayTestSound = async () => {
    // If an AudioContext is currently active from a previous test beep, close it.
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        await audioContextRef.current.close();
        console.log("Closed previous AudioContext.");
      } catch (e) {
        console.error("Error closing previous AudioContext:", e);
      }
    }

    if (recordedAudioUrl) {
      console.log("Attempting to play recorded audio from URL:", recordedAudioUrl);
      const audio = new Audio(recordedAudioUrl);

      audio.onended = () => {
        showSystemMessage("Playback complete.", 3000);
        console.log("Recorded audio playback ended.");
        // Revoke the URL after playback is complete.
        // This is safe because `recordedAudioUrl` is either nullified on new recording
        // or on component unmount.
        // URL.revokeObjectURL(recordedAudioUrl); // Consider if you want to play multiple times. If so, revoke on unmount only.
      };
      audio.onerror = (e) => {
        console.error("Audio playback error (HTMLAudioElement):", e);
        showSystemMessage("Error during playback of recorded audio. (Check browser console for details)", 7000);
        // This is where the NotSupportedError usually appears.
      };

      if (selectedSpeakerId && typeof (audio as any).setSinkId === 'function') {
        try {
          console.log("Attempting to set sinkId for HTMLAudioElement:", selectedSpeakerId);
          await (audio as any).setSinkId(selectedSpeakerId);
          audio.play();
          showSystemMessage("Playing your recorded audio through selected speaker...", 3000);
        } catch (e) {
          console.error("Error setting sinkId on HTMLAudioElement, falling back to default speaker:", e);
          showSystemMessage("Could not play recorded audio through selected speaker. Playing default.", 3000);
          audio.play(); // Fallback to default speaker
        }
      } else {
        audio.play();
        showSystemMessage("Playing your recorded audio...", 3000);
      }
    } else {
      // Fallback to playing a beep sound if no audio is recorded
      console.log("No recorded audio URL found. Playing test beep.");
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = context; // Store context for cleanup
        console.log("AudioContext created for beep test.");

        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = "sine"; // Sine wave for a clear beep
        oscillator.frequency.setValueAtTime(440, context.currentTime); // 440 Hz (A4 note)
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        // Set the output device if a speaker is selected and the browser supports setSinkId on AudioContext
        if (selectedSpeakerId && typeof (context as any).setSinkId === 'function') {
          try {
            console.log("Attempting to set sinkId for AudioContext:", selectedSpeakerId);
            await (context as any).setSinkId(selectedSpeakerId);
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
            oscillator.stop(context.currentTime + 1);
            showSystemMessage(`No recorded audio found. Playing test beep through selected speaker (${availableSpeakers.find(s => s.deviceId === selectedSpeakerId)?.label || 'Unknown'}).`, 3000);
          } catch (e) {
            console.error("Error setting sinkId for AudioContext, falling back to default speaker:", e);
            showSystemMessage("Could not play beep through selected speaker. Playing default.", 3000);
            oscillator.start(); // Fallback to default speaker
            gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
            oscillator.stop(context.currentTime + 1);
          }
        } else {
          oscillator.start();
          gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
          oscillator.stop(context.currentTime + 1);
          showSystemMessage("No recorded audio found. Playing test beep.", 3000);
        }

        setTimeout(() => {
          if (context.state !== 'closed') {
            context.close().catch(e => console.error("Error closing AudioContext after beep:", e)); // Close context after sound plays
            console.log("AudioContext closed after beep test.");
          }
        }, 1200); // Slightly longer than beep duration
      } catch (err) {
        console.error("Sound test failed (beep generation):", err);
        showSystemMessage("Sound test failed: Audio playback not supported or error occurred.", 3000);
      }
    }
  };

  /**
   * Attempts to re-enumerate and re-access media devices (webcam and microphone).
   */
  const handleRestartDevices = async () => {
    showSystemMessage("Restarting devices... This may prompt for permissions.", 4000);

    // Stop all current tracks in primaryMediaStream and any recording streams
    primaryMediaStream?.getTracks().forEach(track => track.stop());
    mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop()); // Stop stream associated with recorder
    setPrimaryMediaStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setRecordedAudioUrl(null); // Clear recorded audio

    // Re-enumerate devices and trigger webcam update via selectedWebcamId useEffect
    setTimeout(async () => {
      await getMediaDevices(); // This will re-populate device lists and trigger webcam useEffect
      showSystemMessage("Devices restarted. Please select your microphone and webcam if they are not automatically chosen.", 6000);
    }, 1500); // Simulate a slight delay for devices to reset
  };

  return (
    // Main container flexbox that changes direction for mobile/desktop
    <div className="h-screen flex flex-col lg:flex-row bg-black text-white">

      {/* Left Panel - Video Display (Always visible) and Device Settings (Conditional) */}
      <motion.div
        className={`p-6 flex flex-col ${isInterviewActive ? 'w-full lg:w-2/3 xl:w-3/4' : 'w-full lg:w-2/3 xl:w-3/4'}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          {/* Back button always visible */}
          <Button
            onClick={onGoBack}
            variant="ghost"
            size="icon"
            className="mr-2 rounded-full hover:bg-gray-800"
          >
            <ChevronLeft className="h-5 w-5 text-gray-300" />
          </Button>
          <h1 className="text-2xl font-bold text-white">
            {topicLabel} Interview
          </h1>
        </div>

        {/* Video Feed Placeholder */}
        <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden relative flex items-center justify-center shadow-lg mb-4 aspect-video">
          {/* Video element to display webcam stream */}
          <video ref={videoRef} className="w-full h-full object-cover rounded-xl" autoPlay muted playsInline />

          {/* Fallback text if video stream is not available or no webcam selected */}
          {(!primaryMediaStream || primaryMediaStream.getVideoTracks().length === 0 || !selectedWebcamId) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 text-lg font-medium bg-gray-900">
              <Video className="h-16 w-16 mb-2" />
              <p>{selectedWebcamId ? "Awaiting camera access..." : "No webcam selected or available."}</p>
              {!selectedWebcamId && availableWebcams.length > 0 && (
                 <p className="text-sm mt-2">Please select a webcam from the settings below.</p>
              )}
            </div>
          )}

          {/* Overlay for recording indicator */}
          {isInterviewActive && (
            <div className="absolute top-4 left-4 flex items-center px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              REC
            </div>
          )}
          {/* System Message Display */}
          {systemMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm shadow-lg z-10"
            >
              {systemMessage}
            </motion.div>
          )}

          {/* NEW: End Interview Button/Symbol - only visible during active interview */}
          {isInterviewActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="absolute top-4 right-4 z-10"
            >
              <Button
                onClick={() => setIsInterviewActive(false)} // Ends the interview, showing the "Get Ready" screen again
                variant="ghost"
                size="icon"
                className="rounded-full bg-gray-800/70 hover:bg-gray-700/90 text-red-400 hover:text-red-300 backdrop-blur-sm"
                title="End Interview"
              >
                <XCircle className="h-7 w-7" /> {/* Using XCircle for a clear "cancel" */}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Device Settings - Only visible when interview is NOT active */}
        {!isInterviewActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col md:flex-row justify-around items-center bg-gray-900 p-4 rounded-xl shadow-md space-y-4 md:space-y-0 md:space-x-4"
          >
            <div className="flex flex-col items-center space-y-2 text-gray-300 w-full md:w-1/3">
              <div className="flex items-center space-x-2">
                <Mic className="h-5 w-5" />
                <span className="font-semibold">Microphone</span>
              </div>
              <Select onValueChange={setSelectedMicId} value={selectedMicId} disabled={availableMics.length === 0}>
                <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select Microphone" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  {availableMics.length > 0 ? (
                    availableMics.map(mic => (
                      <SelectItem key={mic.deviceId} value={mic.deviceId}>
                        {mic.label || `Microphone (${mic.deviceId.substring(0, 4)}...)`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-mic" disabled>No microphones found</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Button variant="link" className="text-sm p-0 h-auto text-gray-400 hover:text-white" onClick={handleTestMic} disabled={!selectedMicId}>
                {isRecordingTest ? "Stop Recording" : "Test your mic"}
              </Button>
            </div>

            <div className="flex flex-col items-center space-y-2 text-gray-300 w-full md:w-1/3">
              <div className="flex items-center space-x-2">
                <Headphones className="h-5 w-5" />
                <span className="font-semibold">Speakers</span>
              </div>
              <Select onValueChange={setSelectedSpeakerId} value={selectedSpeakerId} disabled={availableSpeakers.length === 0}>
                <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select Speakers" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  {availableSpeakers.length > 0 ? (
                    availableSpeakers.map(speaker => (
                      <SelectItem key={speaker.deviceId} value={speaker.deviceId}>
                        {speaker.label || `Speaker (${speaker.deviceId.substring(0, 4)}...)`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-speaker" disabled>No speakers found</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Button variant="link" className="text-sm p-0 h-auto text-gray-400 hover:text-white" onClick={handlePlayTestSound} disabled={!selectedSpeakerId && !recordedAudioUrl}>Play test sound</Button>
            </div>

            <div className="flex flex-col items-center space-y-2 text-gray-300 w-full md:w-1/3">
              <div className="flex items-center space-x-2">
                <Webcam className="h-5 w-5" />
                <span className="font-semibold">Webcam</span>
              </div>
              <Select onValueChange={setSelectedWebcamId} value={selectedWebcamId} disabled={availableWebcams.length === 0}>
                <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Select Webcam" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-700">
                  {availableWebcams.length > 0 ? (
                    availableWebcams.map(webcam => (
                      <SelectItem key={webcam.deviceId} value={webcam.deviceId}>
                        {webcam.label || `Webcam (${webcam.deviceId.substring(0, 4)}...)`}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-webcam" disabled>No webcams found</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Button variant="link" className="text-sm p-0 h-auto text-gray-400 hover:text-white" onClick={handleRestartDevices}>Restart devices</Button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Right Panel - Interview Controls / Chat Interface (Always visible, changes content) */}
      <div className={`transition-all duration-500 ease-in-out ${isInterviewActive ? 'w-full lg:w-1/3 xl:w-1/4' : 'w-full lg:w-1/3 xl:w-1/4'} bg-gray-900 border-l border-gray-700 p-6 flex flex-col shadow-inner`}>
        {!isInterviewActive ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full justify-center items-center text-center"
          >
            <h2 className="text-3xl font-bold mb-4 text-white">
              Get ready for your AI interview
            </h2>
            <ul className="text-lg text-gray-300 space-y-3 mb-8 list-none p-0">
              <li className="flex items-center justify-center">
                <Play className="h-5 w-5 mr-2 text-primary" /> Start now or come back later
              </li>
              <li className="flex items-center justify-center">
                <Mic className="h-5 w-5 mr-2 text-primary" /> Find a quiet place with stable internet
              </li>
              <li className="flex items-center justify-center">
                <Settings className="h-5 w-5 mr-2 text-primary" /> Check your device settings
              </li>
            </ul>
            <Button
              onClick={startInterview} // THIS BUTTON NOW REDIRECTS!
              className="w-full max-w-xs py-3 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              variant="gradient"
              // Disable button while loading or if devices are not ready
              disabled={!selectedMicId || !selectedWebcamId || !primaryMediaStream || primaryMediaStream.getVideoTracks().length === 0 || isLoadingInterviewData}
            >
              {isLoadingInterviewData ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Start Interview
                </>
              )}
            </Button>
            <div className="flex space-x-4 mt-6">
              <Button variant="link" className="text-sm text-gray-400 hover:text-white">FAQs</Button>
              <Button variant="link" className="text-sm text-gray-400 hover:text-white">I'm having issues</Button>
            </div>
            <p className="text-xs text-gray-500 mt-8 px-4">
              SkillSage Ai uses generative AI to conduct the AI interview. Your responses are used only to assess your candidacy and are never used to train AI models.
            </p>
          </motion.div>
        ) : (
          // This section is technically no longer reachable as `startInterview` navigates away.
          // It's kept for completeness but won't be rendered if the redirection works.
          <>
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
              {/* Bot typing indicator */}
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
              <div ref={messagesEndRef} /> {/* Scroll target */}
            </div>

            {/* Input Area */}
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

              <Button onClick={restartSession} variant="outline" className="w-full mt-4 rounded-lg text-gray-300 border-gray-600 hover:bg-gray-800">
                <RotateCcw className="mr-2 h-4 w-4" />
                Restart Session
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default InterviewSession;