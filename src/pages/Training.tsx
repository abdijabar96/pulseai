import React from 'react';
import { BehaviorTraining } from '../components/BehaviorTraining';
import { BookOpen } from 'lucide-react';

export default function Training() {
  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <div className="rounded-full bg-purple-100 p-2">
          <BookOpen className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pet Training</h1>
          <p className="mt-2 text-gray-600">
            Get personalized training guidance and behavioral insights to help your pet thrive.
            Our AI-powered system analyzes your pet's behavior and provides tailored solutions.
          </p>
        </div>
      </div>
      
      <BehaviorTraining />
    </div>
  );
}