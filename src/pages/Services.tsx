import React, { useState } from 'react';
import { PetServices } from '../components/PetServices';
import { MapPin, Search } from 'lucide-react';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export default function Services() {
  const [location, setLocation] = useState<Location>();

  const handleLocationSelect = (loc: Location) => {
    setLocation(loc);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <div className="rounded-full bg-green-100 p-2">
          <MapPin className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pet Services Directory</h1>
          <p className="text-gray-600">
            Find veterinarians, groomers, pet stores, and other essential services in your area.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter your location..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {location && <PetServices {...location} />}
    </div>
  );
}