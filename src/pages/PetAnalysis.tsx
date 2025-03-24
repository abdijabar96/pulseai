import React from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { AnalysisResult } from '../components/AnalysisResult';
import { useState } from 'react';
import { analyzePetMedia } from '../lib/gemini';

export default function PetAnalysis() {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleMediaSelect = async (mediaData: string, video = false) => {
    setSelectedMedia(mediaData);
    setIsVideo(video);
    setIsLoading(true);
    setError(undefined);
    
    try {
      const result = await analyzePetMedia(mediaData, video);
      setAnalysis(result);
    } catch (err) {
      setError(`Failed to analyze the ${video ? 'video' : 'image'}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Pet Analysis</h1>
      
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900">Upload Pet Photo or Video</h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose a clear photo or short video of your pet for AI-powered analysis
        </p>
        <div className="mt-4">
          <ImageUploader 
            onImageSelect={(data) => handleMediaSelect(data, false)}
            onVideoSelect={(data) => handleMediaSelect(data, true)}
          />
        </div>
      </div>

      {selectedMedia && (
        <div className="overflow-hidden rounded-lg bg-white p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
          <div className="mt-4">
            {isVideo ? (
              <video
                src={selectedMedia}
                controls
                className="mx-auto max-h-96 rounded-lg"
              />
            ) : (
              <img
                src={selectedMedia}
                alt="Pet preview"
                className="mx-auto max-h-96 rounded-lg object-contain"
              />
            )}
          </div>
        </div>
      )}

      <AnalysisResult
        analysis={analysis}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}