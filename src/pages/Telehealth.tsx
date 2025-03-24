import React from 'react';
import { TelehealthChat } from '../components/TelehealthChat';

export default function Telehealth() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Pet Health Assessment</h1>
      <p className="text-gray-600">
        Get instant AI-powered analysis and recommendations for your pet's health concerns.
      </p>
      <TelehealthChat />
    </div>
  );
}