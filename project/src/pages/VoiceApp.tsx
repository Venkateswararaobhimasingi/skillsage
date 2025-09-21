import React, { useState, useRef, useEffect } from "react";

export default function VoiceApp() {
  const [history, setHistory] = useState([]); // store all spoken texts
  const recognitionRef = useRef(null);

  // Load saved history from localStorage on first render
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("voiceHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort(); // stop old one if running
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      console.log("User said:", spokenText);

      // Speak it back
      const utter = new SpeechSynthesisUtterance(spokenText);
      window.speechSynthesis.speak(utter);

      // Save spoken text to history when recognition stops (handled in onend)
      recognitionRef.current.spokenText = spokenText;
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
    };

    recognition.onend = () => {
      const spokenText = recognitionRef.current?.spokenText;
      if (spokenText) {
        const updatedHistory = [...history, spokenText];
        setHistory(updatedHistory);
        localStorage.setItem("voiceHistory", JSON.stringify(updatedHistory));
        recognitionRef.current.spokenText = null;
      }
      console.log("Recognition ended");
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    console.log("Stopped listening");
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("voiceHistory");
    window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    console.log("Cleared history and stopped TTS");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-xl font-bold">🎤 Browser TTS + Voice Recognition</h1>

      <div className="flex gap-4">
        <button
          onClick={startListening}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Start
        </button>
        <button
          onClick={stopListening}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Stop
        </button>
        <button
          onClick={clearHistory}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Clear
        </button>
      </div>

      <div className="w-80 p-4 border rounded bg-gray-50">
        <h2 className="font-semibold mb-2">📝 Your Voice History:</h2>
        {history.length === 0 ? (
          <p className="text-gray-500">No saved text yet...</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {history.map((item, index) => (
              <li key={index} className="text-gray-800">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
