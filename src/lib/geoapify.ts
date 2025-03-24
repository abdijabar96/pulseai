const API_KEY = '7fca004edcb84af1976a7d4fa27523ac';

export interface PetService {
  name: string;
  address: string;
  distance: number;
  type: 'vet' | 'groomer' | 'park';
  rating?: number;
  openNow?: boolean;
}

export async function getNearbyPetServices(
  latitude: number,
  longitude: number,
  type: 'vet' | 'groomer' | 'park'
): Promise<PetService[]> {
  // Updated categories to use supported Geoapify categories
  const categories = {
    vet: 'service.veterinary',
    groomer: 'service.pet',
    park: 'leisure.park'
  };

  const url = `https://api.geoapify.com/v2/places?categories=${categories[type]}&filter=circle:${longitude},${latitude},5000&bias=proximity:${longitude},${latitude}&limit=10&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.features) {
      console.error('Invalid response structure:', data);
      return [];
    }

    return data.features
      .filter((feature: any) => feature?.properties?.name)
      .map((feature: any) => ({
        name: feature.properties.name || 'Unknown',
        address: feature.properties.formatted || 'No address available',
        distance: Math.round((feature.properties.distance_meters || 0) / 100) / 10,
        type,
        rating: feature.properties.rating,
        openNow: feature.properties.opening_hours?.open_now
      }));
  } catch (error) {
    console.error('Error fetching nearby pet services:', error);
    return [];
  }
}