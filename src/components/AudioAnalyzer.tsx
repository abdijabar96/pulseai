import React, { useState, useRef } from 'react';
import { Mic, StopCircle, Play, AlertCircle, Loader2, Volume2 } from 'lucide-react';
import { analyzePetAudio } from '../lib/gemini';

interface AudioAnalyzerProps {
  onAnalysisComplete: (analysis: string) => void;
  onError: (error: string) => void;
  isLoading: boolean;
}

export function AudioAnalyzer({ onAnalysisComplete, onError, isLoading }: AudioAnalyzerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number>();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        // Convert blob to base64 for analysis
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64Audio = reader.result as string;
            const analysis = await analyzePetAudio(base64Audio);
            onAnalysisComplete(analysis);
          } catch (error) {
            onError('Failed to analyze audio. Please try again.');
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      onError('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      clearInterval(timerRef.current);
      setIsRecording(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayback = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  return (
    <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-4">
          {!isRecording && !audioURL && (
            <button
              onClick={startRecording}
              className="flex items-center space-x-2 rounded-full bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
            >
              <Mic className="h-5 w-5" />
              <span>Start Recording</span>
            </button>
          )}

          {isRecording && (
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 rounded-full bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-800"
            >
              <StopCircle className="h-5 w-5" />
              <span>Stop Recording</span>
            </button>
          )}

          {audioURL && !isRecording && (
            <button
              onClick={handlePlayback}
              className="flex items-center space-x-2 rounded-full bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            >
              <Play className="h-5 w-5" />
              <span>Play Recording</span>
            </button>
          )}
        </div>

        {isRecording && (
          <div className="flex items-center space-x-2 text-red-500">
            <div className="h-3 w-3 animate-pulse rounded-full bg-red-500"></div>
            <span>Recording: {formatTime(recordingTime)}</span>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center space-x-2 text-blue-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Analyzing audio...</span>
          </div>
        )}

        <div className="text-center text-sm text-gray-500">
          <p className="flex items-center justify-center">
            <Volume2 className="mr-1 h-4 w-4" />
            Record your pet's sounds for AI analysis
          </p>
          <p className="mt-1">Maximum recording time: 30 seconds</p>
        </div>
      </div>
    </div>
  );
}