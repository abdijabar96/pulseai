import React, { useState } from 'react';
import { generateMemorial } from '../lib/gemini';
import { Heart, Loader2 } from 'lucide-react';

interface PetInfo {
  name: string;
  species: string;
  years: number;
  description: string;
}

export default function Memorial() {
  const [petInfo, setPetInfo] = useState<PetInfo>({
    name: '',
    species: '',
    years: 0,
    description: ''
  });
  const [memorial, setMemorial] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await generateMemorial(petInfo);
      setMemorial(result);
    } catch (err) {
      setError('Failed to generate memorial. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <div className="rounded-full bg-pink-100 p-2">
          <Heart className="h-6 w-6 text-pink-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pet Memorial</h1>
          <p className="mt-2 text-gray-600">
            Create a beautiful tribute to honor and remember your beloved pet.
            Share memories, celebrate their life, and find comfort in remembrance.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-900">Create Memorial</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pet's Name
            </label>
            <input
              type="text"
              value={petInfo.name}
              onChange={(e) => setPetInfo({ ...petInfo, name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Species/Breed
            </label>
            <input
              type="text"
              value={petInfo.species}
              onChange={(e) => setPetInfo({ ...petInfo, species: e.target.value })}
              placeholder="e.g., Golden Retriever, Siamese Cat"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Years Together
            </label>
            <input
              type="number"
              value={petInfo.years || ''}
              onChange={(e) => setPetInfo({ ...petInfo, years: parseInt(e.target.value) })}
              min="0"
              step="1"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Share Your Memories
            </label>
            <textarea
              value={petInfo.description}
              onChange={(e) => setPetInfo({ ...petInfo, description: e.target.value })}
              rows={4}
              placeholder="Tell us about your pet's personality, favorite things, special moments..."
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-pink-500 px-4 py-2 text-white transition-colors hover:bg-pink-600 disabled:bg-gray-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating Memorial...</span>
              </>
            ) : (
              <>
                <Heart className="h-5 w-5" />
                <span>Create Memorial</span>
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

      {memorial && (
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900">
            In Loving Memory of {petInfo.name}
          </h2>
          <div className="mt-4 whitespace-pre-wrap text-gray-700">{memorial}</div>
        </div>
      )}
    </div>
  );
}