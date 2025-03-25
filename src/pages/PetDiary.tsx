import React, { useState, useRef } from 'react';
import { BookOpenCheck, Camera, Mic, Plus, X, Calendar, Save } from 'lucide-react';

interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  media?: string;
  type: 'text' | 'photo' | 'voice';
}

export default function PetDiary() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [newEntry, setNewEntry] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const newDiaryEntry: DiaryEntry = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          content: 'Voice Note',
          media: audioUrl,
          type: 'voice'
        };

        setEntries([newDiaryEntry, ...entries]);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      const startTime = Date.now();
      const timerInterval = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      // Stop recording after 60 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
          setIsRecording(false);
          clearInterval(timerInterval);
        }
      }, 60000);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setRecordingTime(0);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newDiaryEntry: DiaryEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        content: 'Photo Entry',
        media: reader.result as string,
        type: 'photo'
      };

      setEntries([newDiaryEntry, ...entries]);
    };
    reader.readAsDataURL(file);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    const newDiaryEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      content: newEntry,
      type: 'text'
    };

    setEntries([newDiaryEntry, ...entries]);
    setNewEntry('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <div className="rounded-full bg-indigo-100 p-2">
          <BookOpenCheck className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pet Diary</h1>
          <p className="text-gray-600">
            Keep track of your pet's daily activities, milestones, and precious moments.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="flex space-x-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            <Camera className="h-5 w-5" />
            <span>Add Photo</span>
          </button>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-white transition-colors ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            <Mic className="h-5 w-5" />
            <span>{isRecording ? `Stop (${formatTime(recordingTime)})` : 'Record Voice'}</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>

        <form onSubmit={handleTextSubmit} className="mt-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="Write about your pet's day..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!newEntry.trim()}
              className="flex items-center space-x-2 rounded-lg bg-indigo-500 px-4 py-2 text-white transition-colors hover:bg-indigo-600 disabled:bg-gray-300"
            >
              <Save className="h-5 w-5" />
              <span>Save Entry</span>
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="rounded-lg bg-white p-6 shadow-lg transition-all hover:shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-500">
                <Calendar className="h-5 w-5" />
                <span>{formatDate(entry.date)}</span>
              </div>
            </div>

            {entry.type === 'photo' && entry.media && (
              <img
                src={entry.media}
                alt="Pet diary photo"
                className="mb-4 rounded-lg"
              />
            )}

            {entry.type === 'voice' && entry.media && (
              <audio
                controls
                src={entry.media}
                className="mb-4 w-full"
              />
            )}

            {entry.type === 'text' && (
              <p className="text-gray-700">{entry.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}