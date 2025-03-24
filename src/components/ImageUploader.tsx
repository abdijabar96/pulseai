import React, { useState, useRef } from 'react';
import { Upload, Camera, Video, AlertCircle, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (imageData: string) => void;
  onVideoSelect: (videoData: string) => void;
}

export function ImageUploader({ onImageSelect, onVideoSelect }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadError, setUploadError] = useState<string>();
  const [previewMedia, setPreviewMedia] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number>();

  const startCamera = async (video = false) => {
    // For mobile devices, trigger the native camera app
    if (video) {
      videoInputRef.current?.click();
    } else {
      photoInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setShowCamera(false);
    setIsRecording(false);
    setRecordingTime(0);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setUploadError(undefined);
    
    const files = e.dataTransfer.files;
    if (files?.[0]) {
      await processFile(files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUploadError(undefined);
    if (e.target.files?.[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    // Check file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setUploadError('Please upload an image or video file');
      return;
    }

    // Check file size (30MB limit)
    if (file.size > 30 * 1024 * 1024) {
      setUploadError('File size must be less than 30MB');
      return;
    }

    // For videos, check duration
    if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.preload = 'metadata';

      const duration = await new Promise<number>((resolve) => {
        video.onloadedmetadata = () => resolve(video.duration);
        video.src = URL.createObjectURL(file);
      });

      URL.revokeObjectURL(video.src);

      if (duration > 60) {
        setUploadError('Video must be shorter than 60 seconds');
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      setPreviewMedia(data);
      setIsVideo(file.type.startsWith('video/'));
      if (file.type.startsWith('image/')) {
        onImageSelect(data);
      } else {
        onVideoSelect(data);
      }
    };
    reader.onerror = () => {
      setUploadError('Error reading file');
    };
    reader.readAsDataURL(file);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetUpload = () => {
    setPreviewMedia(null);
    setIsVideo(false);
    setUploadError(undefined);
    if (photoInputRef.current) photoInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (previewMedia) {
    return (
      <div className="relative rounded-lg border-2 border-gray-300 p-4">
        <button
          onClick={resetUpload}
          className="absolute right-2 top-2 z-10 rounded-full bg-gray-800 bg-opacity-50 p-2 text-white hover:bg-opacity-70"
        >
          <X className="h-4 w-4" />
        </button>
        {isVideo ? (
          <video
            src={previewMedia}
            controls
            className="mx-auto max-h-96 rounded-lg"
          />
        ) : (
          <img
            src={previewMedia}
            alt="Preview"
            className="mx-auto max-h-96 rounded-lg object-contain"
          />
        )}
        <p className="mt-4 text-center text-sm text-gray-600">
          Analyzing your pet's {isVideo ? 'video' : 'photo'}...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-lg border-2 border-dashed p-8 text-center
        ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {/* Hidden input for file uploads */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,video/*"
        onChange={handleChange}
      />

      {/* Hidden input for photo capture */}
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />

      {/* Hidden input for video capture */}
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full bg-gray-100 p-3 hover:bg-gray-200"
          >
            <Upload className="h-6 w-6 text-gray-600" />
          </button>
          <button
            onClick={() => startCamera(false)}
            className="rounded-full bg-gray-100 p-3 hover:bg-gray-200"
          >
            <Camera className="h-6 w-6 text-gray-600" />
          </button>
          <button
            onClick={() => startCamera(true)}
            className="rounded-full bg-gray-100 p-3 hover:bg-gray-200"
          >
            <Video className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="space-y-2">
          <p className="text-base font-medium text-gray-700">
            Drop your pet's photo or video here, or use the buttons above
          </p>
          <p className="text-sm text-gray-500">
            Supports: Images (JPG, PNG, GIF) and Videos (MP4, WEBM) up to 30MB
          </p>
          <p className="text-sm text-gray-500">
            Videos should be shorter than 60 seconds
          </p>
        </div>
        {uploadError && (
          <div className="mt-2 flex items-center text-sm text-red-600">
            <AlertCircle className="mr-1 h-4 w-4" />
            {uploadError}
          </div>
        )}
      </div>
    </div>
  );
}