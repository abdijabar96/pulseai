import React, { useState } from 'react';
import { LocationInput } from '../components/LocationInput';
import { Plane, MapPin, Hotel, PawPrint } from 'lucide-react';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export default function TravelPlanner() {
  const [location, setLocation] = useState<Location>();

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <div className="rounded-full bg-blue-100 p-2">
          <Plane className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pet-Friendly Travel Planner</h1>
          <p className="text-gray-600">
            Plan your perfect pet-friendly vacation with comprehensive travel guides and accommodation recommendations.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <Hotel className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Pet-Friendly Hotels</h2>
          <p className="mt-2 text-gray-600">Find accommodations that welcome your furry friends</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <PawPrint className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Pet Activities</h2>
          <p className="mt-2 text-gray-600">Discover pet-friendly attractions and activities</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
            <MapPin className="h-6 w-6 text-orange-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Emergency Services</h2>
          <p className="mt-2 text-gray-600">Locate nearby veterinarians and pet care services</p>
        </div>
      </div>
      
      <LocationInput onLocationSelect={setLocation} />
    </div>
  );
}