import { WeatherData, HourlyForecast, Location } from '../types';

const BASE_URL = 'https://api.open-meteo.com/v1';

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,pressure_msl,wind_speed_10m,wind_gusts_10m,wind_direction_10m',
      daily: 'sunrise,sunset,uv_index_max',
      timezone: 'auto',
    });

    const response = await fetch(`${BASE_URL}/forecast?${params}`);
    const data = await response.json();

    return {
      temperature: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      humidity: data.current.relative_humidity_2m,
      pressure: Math.round(data.current.pressure_msl),
      windSpeed: Math.round(data.current.wind_speed_10m),
      windGust: Math.round(data.current.wind_gusts_10m),
      windDirection: data.current.wind_direction_10m,
      uv: data.daily.uv_index_max[0],
      visibility: 10,
      sunrise: data.daily.sunrise[0],
      sunset: data.daily.sunset[0],
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

export async function fetchHourlyForecast(lat: number, lon: number): Promise<HourlyForecast[]> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      hourly: 'temperature_2m,pm2_5,pm10',
      forecast_days: '2',
      timezone: 'auto',
    });

    const response = await fetch(`${BASE_URL}/air-quality?${params}`);
    const data = await response.json();

    return data.hourly.time.slice(0, 24).map((time: string, index: number) => ({
      time,
      temperature: Math.round(data.hourly.temperature_2m?.[index] || 0),
      aqi: Math.round((data.hourly.pm2_5[index] || 0) * 2),
      pm25: Math.round(data.hourly.pm2_5[index] || 0),
      pm10: Math.round(data.hourly.pm10[index] || 0),
    }));
  } catch (error) {
    console.error('Error fetching hourly forecast:', error);
    throw error;
  }
}

export async function reverseGeocode(lat: number, lon: number): Promise<Location> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      format: 'json',
    });

    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?${params}`);
    const data = await response.json();

    const result = data.results?.[0];

    return {
      latitude: lat,
      longitude: lon,
      city: result?.name || 'Unknown',
      country: result?.country || 'Unknown',
    };
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return {
      latitude: lat,
      longitude: lon,
      city: 'Unknown',
      country: 'Unknown',
    };
  }
}
