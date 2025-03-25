import React, { useState } from 'react';
import { LocationInput } from '../components/LocationInput';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export default function Services() {
  const [location, setLocation] = useState<Location>();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Pet-Friendly Travel Planner</h1>
      <p className="text-gray-600">
        Find pet-friendly destinations and get detailed insights about the area.
      </p>
      
      <LocationInput onLocationSelect={setLocation} />
    </div>
  );
}