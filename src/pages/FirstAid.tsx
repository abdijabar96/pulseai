import React from 'react';
import { FirstAidGuidance } from '../components/FirstAidGuidance';
import { AlertTriangle } from 'lucide-react';

export default function FirstAid() {
  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <div className="rounded-full bg-red-100 p-2">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pet First Aid</h1>
          <p className="mt-2 text-gray-600">
            Get immediate guidance for pet emergencies. Remember, this is first aid
            advice only - always contact your veterinarian for emergencies.
          </p>
        </div>
      </div>
      
      <FirstAidGuidance />
    </div>
  );
}