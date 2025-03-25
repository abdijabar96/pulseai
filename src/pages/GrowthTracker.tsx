import React, { useState } from 'react';
import { analyzeGrowthData } from '../lib/gemini';
import { LineChart, Loader2 } from 'lucide-react';

interface GrowthData {
  age: number;
  weight: number;
  height?: number;
  breed: string;
  species: 'dog' | 'cat';
}

export default function GrowthTracker() {
  const [data, setData] = useState<GrowthData>({
    age: 0,
    weight: 0,
    breed: '',
    species: 'dog'
  });
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await analyzeGrowthData(data);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze growth data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <div className="rounded-full bg-blue-100 p-2">
          <LineChart className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Growth Tracker</h1>
          <p className="mt-2 text-gray-600">
            Track your pet's growth and compare it to breed standards.
            Get personalized insights and recommendations.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900">Enter Growth Data</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Species
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={data.species === 'dog'}
                  onChange={() => setData({ ...data, species: 'dog' })}
                  className="h-4 w-4 text-blue-600"
                />
                <span>Dog</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={data.species === 'cat'}
                  onChange={() => setData({ ...data, species: 'cat' })}
                  className="h-4 w-4 text-blue-600"
                />
                <span>Cat</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Breed
            </label>
            <input
              type="text"
              value={data.breed}
              onChange={(e) => setData({ ...data, breed: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Age (months)
            </label>
            <input
              type="number"
              value={data.age || ''}
              onChange={(e) => setData({ ...data, age: parseInt(e.target.value) })}
              min="0"
              step="1"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weight (kg)
            </label>
            <input
              type="number"
              value={data.weight || ''}
              onChange={(e) => setData({ ...data, weight: parseFloat(e.target.value) })}
              min="0"
              step="0.1"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Height (cm, optional)
            </label>
            <input
              type="number"
              value={data.height || ''}
              onChange={(e) => setData({ ...data, height: parseFloat(e.target.value) })}
              min="0"
              step="0.1"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-gray-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <LineChart className="h-5 w-5" />
                <span>Analyze Growth</span>
              </>
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {analysis && (
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900">Growth Analysis</h2>
          <div className="mt-4 whitespace-pre-wrap text-gray-700">{analysis}</div>
        </div>
      )}
    </div>
  );
}