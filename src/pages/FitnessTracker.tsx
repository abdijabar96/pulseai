import React from 'react';
import { Activity } from 'lucide-react';

export default function FitnessTracker() {
  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <div className="rounded-full bg-indigo-100 p-2">
          <Activity className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pet Fitness Tracker</h1>
          <p className="mt-2 text-gray-600">
            Track your pet's daily activity, set fitness goals, and compete with friends.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 text-center shadow-lg">
        <p className="text-gray-600">Coming Soon!</p>
        <p className="mt-2 text-sm text-gray-500">
          We're working hard to bring you a comprehensive pet fitness tracking system.
          Check back soon for updates!
        </p>
      </div>
    </div>
  );
}