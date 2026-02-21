import { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  Pause,
  PlayCircle,
  Loader2,
} from "lucide-react";
import { useTheme } from "../ThemeContext";

export default function InterviewRecorder({ transcript, onUpdate, onNext }) {
  const { isDark } = useTheme();

  /* ================= MODE TOGGLE ================= */
  const [mode, setMode] = useState("record"); // "record" or "paste"

  /* ================= RECORD STATES ================= */
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const intervalRef = useRef(null);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRecording, isPaused]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  /* ================= START RECORDING ================= */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      setTimer(0);
      setTranscriptionError(null);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        stream.getTracks().forEach((track) => track.stop());

        setIsRecording(false);
        setIsPaused(false);

        await handleTranscribe(audioBlob);
      };

      recorder.start();
      setIsRecording(true);
      setIsPaused(false);
    } catch (err) {
      alert("Microphone permission denied.");
    }
  };

  /* ================= PAUSE ================= */
  const pauseRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === "recording") {
      recorder.pause();
      setIsPaused(true);
    }
  };

  /* ================= RESUME ================= */
  const resumeRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === "paused") {
      recorder.resume();
      setIsPaused(false);
    }
  };

  /* ================= STOP ================= */
  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  };

  /* ================= TRANSCRIBE ================= */
  const handleTranscribe = async (audioBlob) => {
    setIsTranscribing(true);
    setTranscriptionError(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch("/api/interview/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.transcript) {
        onUpdate(
          transcript
            ? transcript + "\n\n" + data.transcript
            : data.transcript
        );
      } else {
        throw new Error("Transcription failed");
      }
    } catch (error) {
      setTranscriptionError("Transcription failed. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-8">

      {/* MODE TOGGLE */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setMode("record")}
          className={`px-6 py-2 rounded-lg ${
            mode === "record"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Record Audio
        </button>

        <button
          onClick={() => setMode("paste")}
          className={`px-6 py-2 rounded-lg ${
            mode === "paste"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Paste Text
        </button>
      </div>

      {/* ================= RECORD MODE ================= */}
      {mode === "record" && (
        <div className="flex flex-col items-center">

          <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-gray-100">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="w-24 h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center"
              >
                <Mic size={32} />
              </button>
            ) : (
              <div className="flex gap-4">
                {isPaused ? (
                  <button
                    onClick={resumeRecording}
                    className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center"
                  >
                    <PlayCircle size={24} />
                  </button>
                ) : (
                  <button
                    onClick={pauseRecording}
                    className="w-16 h-16 rounded-full bg-yellow-500 text-white flex items-center justify-center"
                  >
                    <Pause size={24} />
                  </button>
                )}

                <button
                  onClick={stopRecording}
                  className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center"
                >
                  <Square size={20} />
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 text-3xl font-mono">
            {formatTime(timer)}
          </div>

          <p className="mt-2 text-gray-500">
            {isRecording
              ? isPaused
                ? "Recording paused"
                : "Recording in progress..."
              : "Click microphone to start"}
          </p>

          {isTranscribing && (
            <div className="mt-4 flex items-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              <span>Transcribing...</span>
            </div>
          )}

          {transcriptionError && (
            <p className="text-red-500 mt-2">{transcriptionError}</p>
          )}
        </div>
      )}

      {/* ================= PASTE MODE ================= */}
      {mode === "paste" && (
        <textarea
          value={transcript}
          onChange={(e) => onUpdate(e.target.value)}
          placeholder="Paste interview response here..."
          className="w-full h-40 p-4 border rounded-xl"
        />
      )}

      {/* SUBMIT */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!transcript}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl disabled:opacity-50"
        >
          Submit for AI Evaluation
        </button>
      </div>
    </div>
  );
}