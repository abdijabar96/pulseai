import React, { useState, useEffect } from 'react';
import { Client } from '@petfinder/petfinder-js';
import { Home, Search, MapPin, Phone, Globe } from 'lucide-react';

const client = new Client({
  apiKey: 'wFUgkjM3L4CHr4qDbpGhIuo2uT17pwvFDGL2oxLvApmIC55CHX',
  secret: 'your-secret-here'
});

interface Organization {
  id: string;
  name: string;
  address: {
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  phone?: string;
  email?: string;
  url?: string;
  distance?: number;
}

export default function AdoptionCenters() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const searchOrganizations = async () => {
    if (!location.trim()) return;

    setLoading(true);
    setError(undefined);

    try {
      const response = await client.organizations.search({
        location: location,
        distance: 50,
        limit: 20,
      });

      setOrganizations(response.data.organizations);
    } catch (err) {
      setError('Failed to fetch adoption centers. Please try again.');
      console.error('Error fetching organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <div className="rounded-full bg-purple-100 p-2">
          <Home className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Adoption & Rescue Centers</h1>
          <p className="text-gray-600">
            Find nearby pet adoption centers and help give a forever home to a pet in need.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location (city, state)"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            onClick={searchOrganizations}
            disabled={loading || !location.trim()}
            className="flex items-center space-x-2 rounded-lg bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600 disabled:bg-gray-300"
          >
            <Search className="h-5 w-5" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {organizations.map((org) => (
          <div key={org.id} className="rounded-lg bg-white p-6 shadow-lg transition-all hover:shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">{org.name}</h2>
            
            <div className="mt-4 space-y-2 text-gray-600">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span>
                  {org.address.city}, {org.address.state} {org.address.postcode}
                </span>
              </div>
              
              {org.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <a href={`tel:${org.phone}`} className="text-purple-600 hover:text-purple-700">
                    {org.phone}
                  </a>
                </div>
              )}
              
              {org.url && (
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <a
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>

            {org.distance && (
              <div className="mt-4 inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-700">
                {Math.round(org.distance)} miles away
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}