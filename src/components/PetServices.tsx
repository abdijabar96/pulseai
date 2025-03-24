import React, { useState, useEffect } from 'react';
import { MapPin, Binary as Veterinary, Scissors, Trees as Tree } from 'lucide-react';
import { searchNearbyServices } from '../lib/tomtom';

interface PetServicesProps {
  latitude: number;
  longitude: number;
  address: string;
}

interface Service {
  name: string;
  address: string;
  distance: number;
  phone?: string;
  url?: string;
}

export function PetServices({ latitude, longitude, address }: PetServicesProps) {
  const [selectedType, setSelectedType] = useState<'vet' | 'groomer' | 'park'>('vet');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      setError(undefined);
      try {
        const categoryMap = {
          vet: 'veterinarian',
          groomer: 'pet-service',
          park: 'pet-park'
        };
        
        const results = await searchNearbyServices(latitude, longitude, categoryMap[selectedType]);
        setServices(results);
      } catch (err) {
        setError('Failed to fetch nearby services. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    if (latitude && longitude) {
      fetchServices();
    }
  }, [latitude, longitude, selectedType]);

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h2 className="flex items-center text-xl font-semibold text-gray-900">
        <MapPin className="mr-2 h-5 w-5 text-blue-500" />
        Pet Services near {address}
      </h2>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => setSelectedType('vet')}
          className={`flex items-center rounded-full px-4 py-2 ${
            selectedType === 'vet'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Veterinary className="mr-2 h-4 w-4" />
          Veterinarians
        </button>
        <button
          onClick={() => setSelectedType('groomer')}
          className={`flex items-center rounded-full px-4 py-2 ${
            selectedType === 'groomer'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Scissors className="mr-2 h-4 w-4" />
          Groomers
        </button>
        <button
          onClick={() => setSelectedType('park')}
          className={`flex items-center rounded-full px-4 py-2 ${
            selectedType === 'park'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Tree className="mr-2 h-4 w-4" />
          Pet Parks
        </button>
      </div>

      {loading ? (
        <div className="mt-6 flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          <span className="ml-2 text-gray-600">Loading services...</span>
        </div>
      ) : error ? (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      ) : services.length === 0 ? (
        <div className="mt-6 text-center text-gray-500">
          No {selectedType === 'vet' ? 'veterinarians' : selectedType === 'groomer' ? 'pet groomers' : 'pet parks'} found nearby.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
              <p className="mt-1 text-gray-600">{service.address}</p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>{service.distance} km away</span>
                {service.phone && (
                  <a
                    href={`tel:${service.phone}`}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    {service.phone}
                  </a>
                )}
                {service.url && (
                  <a
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}