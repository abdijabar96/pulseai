import React from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { AudioAnalyzer } from '../components/AudioAnalyzer';
import { AnalysisResult } from '../components/AnalysisResult';
import { useState } from 'react';
import { analyzePetMedia } from '../lib/gemini';
import { Camera, Volume2, AlertCircle } from 'lucide-react';

type AnalysisType = 'visual' | 'audio';

export default function PetAnalysis() {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [analysisType, setAnalysisType] = useState<AnalysisType>('visual');

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

  const handleAudioAnalysis = (analysis: string) => {
    setAnalysis(analysis);
  };

  const handleError = (error: string) => {
    setError(error);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Pet Analysis</h1>
      
      <div className="flex space-x-4">
        <button
          onClick={() => setAnalysisType('visual')}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors ${
            analysisType === 'visual'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Camera className="h-5 w-5" />
          <span>Visual Analysis</span>
        </button>
        <button
          onClick={() => setAnalysisType('audio')}
          className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors ${
            analysisType === 'audio'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Volume2 className="h-5 w-5" />
          <span>Audio Analysis</span>
        </button>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        {analysisType === 'visual' ? (
          <>
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
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-900">Record Pet Sounds</h2>
            <p className="mt-1 text-sm text-gray-500">
              Record your pet's vocalizations for AI-powered sound analysis
            </p>
            <div className="mt-4">
              <AudioAnalyzer
                onAnalysisComplete={handleAudioAnalysis}
                onError={handleError}
                isLoading={isLoading}
              />
            </div>
          </>
        )}
      </div>

      {analysisType === 'visual' && selectedMedia && (
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

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <AnalysisResult
        analysis={analysis}
        isLoading={isLoading}
        error={error}
        isVideo={analysisType === 'visual' && isVideo}
      />
    </div>
  );
}