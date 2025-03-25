import React, { useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { AnalysisResult } from '../components/AnalysisResult';
import { analyzePlant } from '../lib/gemini';
import { Flower2, AlertTriangle } from 'lucide-react';

export default function PlantChecker() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleImageSelect = async (imageData: string) => {
    setSelectedImage(imageData);
    setIsLoading(true);
    setError(undefined);
    
    try {
      const result = await analyzePlant(imageData);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze the plant. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <div className="rounded-full bg-green-100 p-2">
          <Flower2 className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pet-Safe Plant Checker</h1>
          <p className="mt-2 text-gray-600">
            Upload a photo of any plant to check if it's safe for your pets.
            Get detailed toxicity information and safety recommendations.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-yellow-50 p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="mt-1 h-5 w-5 text-yellow-600" />
          <div>
            <h3 className="font-medium text-yellow-800">Important Safety Note</h3>
            <p className="mt-1 text-sm text-yellow-700">
              While this tool can help identify potentially toxic plants, always err on
              the side of caution. If you suspect your pet has ingested a toxic plant,
              contact your veterinarian immediately.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900">Upload Plant Photo</h2>
        <p className="mt-1 text-sm text-gray-500">
          Take a clear photo of the plant, including leaves and any flowers if present
        </p>
        <div className="mt-4">
          <ImageUploader 
            onImageSelect={handleImageSelect}
            onVideoSelect={() => {}}
          />
        </div>
      </div>

      {selectedImage && (
        <div className="overflow-hidden rounded-lg bg-white p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900">Plant Preview</h2>
          <div className="mt-4">
            <img
              src={selectedImage}
              alt="Plant preview"
              className="mx-auto max-h-96 rounded-lg object-contain"
            />
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