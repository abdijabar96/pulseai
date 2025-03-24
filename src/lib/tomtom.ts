import { services } from '@tomtom-international/web-sdk-services';

const API_KEY = 'Zoe2z18CZ9qITtkxk2BGQNSgegogXc8E';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export async function searchLocation(query: string): Promise<Location> {
  try {
    const response = await services.fuzzySearch({
      key: API_KEY,
      query,
      limit: 1
    });

    if (!response.results.length) {
      throw new Error('Location not found');
    }

    const result = response.results[0];
    return {
      latitude: result.position.lat,
      longitude: result.position.lon,
      address: result.address.freeformAddress
    };
  } catch (error) {
    console.error('Error searching location:', error);
    throw new Error('Failed to search location. Please try again.');
  }
}

export async function searchNearbyServices(
  latitude: number,
  longitude: number,
  category: string
): Promise<any[]> {
  try {
    const response = await services.poiSearch({
      key: API_KEY,
      radius: 5000,
      limit: 10,
      categorySet: category,
      lat: latitude,
      lon: longitude
    });

    return response.results.map(result => ({
      name: result.poi.name,
      address: result.address.freeformAddress,
      distance: Math.round(result.dist / 100) / 10, // Convert to km
      position: result.position,
      categories: result.poi.categories,
      phone: result.poi.phone,
      url: result.poi.url
    }));
  } catch (error) {
    console.error('Error searching nearby services:', error);
    throw new Error('Failed to fetch nearby services. Please try again.');
  }
}