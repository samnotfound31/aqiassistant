import { AQIData, AQILevel } from '../types';

const API_KEY = import.meta.env.VITE_AQICN_API_KEY;
const BASE_URL = 'https://api.waqi.info';

function getAQILevel(aqi: number): AQILevel {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy';
  if (aqi <= 200) return 'very-unhealthy';
  return 'hazardous';
}

export async function fetchAQIData(city: string): Promise<AQIData> {
  try {
    const response = await fetch(`${BASE_URL}/feed/${city}/?token=${API_KEY}`);
    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error('Failed to fetch AQI data');
    }

    const aqiValue = data.data.aqi;
    const iaqi = data.data.iaqi || {};

    return {
      aqi: aqiValue,
      pm25: iaqi.pm25?.v || 0,
      pm10: iaqi.pm10?.v || 0,
      dominantPollutant: data.data.dominentpol || 'pm25',
      lastUpdate: data.data.time.s,
      city: data.data.city.name,
      level: getAQILevel(aqiValue),
    };
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    throw error;
  }
}

export async function fetchAQIByCoordinates(lat: number, lon: number): Promise<AQIData> {
  try {
    const response = await fetch(`${BASE_URL}/feed/geo:${lat};${lon}/?token=${API_KEY}`);
    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error('Failed to fetch AQI data');
    }

    const aqiValue = data.data.aqi;
    const iaqi = data.data.iaqi || {};

    return {
      aqi: aqiValue,
      pm25: iaqi.pm25?.v || 0,
      pm10: iaqi.pm10?.v || 0,
      dominantPollutant: data.data.dominentpol || 'pm25',
      lastUpdate: data.data.time.s,
      city: data.data.city.name,
      level: getAQILevel(aqiValue),
    };
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    throw error;
  }
}
