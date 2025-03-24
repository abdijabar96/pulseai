import React, { useState } from 'react';
import { LocationInput } from '../components/LocationInput';
import { PetServices } from '../components/PetServices';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export default function Services() {
  const [location, setLocation] = useState<Location>();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Pet Services</h1>
      
      <LocationInput onLocationSelect={setLocation} />

      {location && (
        <PetServices
          latitude={location.latitude}
          longitude={location.longitude}
          address={location.address}
        />
      )}
    </div>
  );
}