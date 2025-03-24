import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { searchLocation } from '../lib/tomtom';
import { analyzeLocation } from '../lib/gemini';

interface LocationInputProps {
  onLocationSelect: (location: { latitude: number; longitude: number; address: string }) => void;
}

export function LocationInput({ onLocationSelect }: LocationInputProps) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [locationAnalysis, setLocationAnalysis] = useState<string>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    setLocationAnalysis(undefined);

    try {
      const location = await searchLocation(address);
      onLocationSelect(location);
      
      // After getting location, analyze it with Gemini
      setIsAnalyzing(true);
      const analysis = await analyzeLocation(location.address);
      setLocationAnalysis(analysis);
    } catch (err) {
      setError('Address not found. Please try again.');
    } finally {
      setLoading(false);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="flex items-center text-xl font-semibold text-gray-900">
          <MapPin className="mr-2 h-5 w-5 text-blue-500" />
          Your Location
        </h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address or city"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading || isAnalyzing}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>
        {(loading || isAnalyzing) && (
          <div className="mt-2 flex items-center text-sm text-gray-600">
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            {loading ? 'Finding location...' : 'Analyzing area for pet-friendly features...'}
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {locationAnalysis && (
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Area Analysis</h3>
          <div className="prose prose-blue max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">{locationAnalysis}</div>
          </div>
        </div>
      )}
    </div>
  );
}