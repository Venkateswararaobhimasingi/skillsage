import React, { useState, useRef } from "react";

export default function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  // WAV encoder
  const encodeWAV = (audioBuffer: AudioBuffer): Blob => {
    const samples = audioBuffer.getChannelData(0); // mono
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

  const startRecording = async () => {
    setTranscript("");
    audioChunksRef.current = [];
    setRecording(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current.createMediaStreamSource(stream);

    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" });
    mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.start();
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;
    setRecording(false);
    mediaRecorderRef.current.stop();

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);

      const wavBlob = encodeWAV(audioBuffer);
      setAudioUrl(URL.createObjectURL(wavBlob));
      await uploadAudio(wavBlob);
    };
  };

  const uploadAudio = async (blob: Blob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", blob, "speech.wav");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/transcribe/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) setTranscript(data.transcript);
      else alert(data.error || "Transcription failed");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Voice Recorder</h2>
      <div className="space-x-4">
        <button
          onClick={startRecording}
          disabled={recording}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Start
        </button>
        <button
          onClick={stopRecording}
          disabled={!recording}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Stop
        </button>
      </div>

      {audioUrl && (
        <div className="mt-4">
          <audio src={audioUrl} controls />
        </div>
      )}

      {loading && <p className="mt-2">Transcribing...</p>}

      {transcript && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="font-semibold mb-2">Transcript:</h3>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
}
