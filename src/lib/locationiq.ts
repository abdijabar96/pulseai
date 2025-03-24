const API_KEY = 'pk.5a2d1b0d4efb8cb013e72b711f2f0805';
const BASE_URL = 'https://api.locationiq.com/v1';

export interface PetService {
  name: string;
  address: string;
  distance: number;
  type: 'vet' | 'groomer' | 'park';
  rating?: number;
  openNow?: boolean;
}

export async function geocodeAddress(address: string): Promise<{ latitude: number; longitude: number }> {
  const url = `${BASE_URL}/search?key=${API_KEY}&q=${encodeURIComponent(address)}&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to geocode address');
    }
    
    const data = await response.json();

    if (!data || !data[0]) {
      throw new Error('Address not found');
    }

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon)
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export async function getNearbyPetServices(
  latitude: number,
  longitude: number,
  type: 'vet' | 'groomer' | 'park'
): Promise<PetService[]> {
  const searchTerms = {
    vet: 'veterinary clinic',
    groomer: 'pet grooming',
    park: 'dog park'
  };

  const url = `${BASE_URL}/search?key=${API_KEY}&q=${encodeURIComponent(searchTerms[type])}&format=json&lat=${latitude}&lon=${longitude}&dedupe=1`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('LocationIQ API error:', errorData);
      throw new Error('Failed to fetch nearby services');
    }
    
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error('Unexpected response format:', data);
      return [];
    }

    return data
      .filter(place => place.display_name && place.lat && place.lon)
      .map(place => ({
        name: place.display_name.split(',')[0] || 'Unknown',
        address: place.display_name || 'No address available',
        distance: Math.round(getDistance(
          latitude,
          longitude,
          parseFloat(place.lat),
          parseFloat(place.lon)
        ) * 10) / 10,
        type,
        rating: undefined,
        openNow: undefined
      }))
      .filter(place => place.distance <= 5) // Only show places within 5km
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10); // Limit to 10 results
  } catch (error) {
    console.error('Error fetching nearby pet services:', error);
    throw error;
  }
}