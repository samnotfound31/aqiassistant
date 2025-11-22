export type AQILevel = 'good' | 'moderate' | 'unhealthy' | 'very-unhealthy' | 'hazardous';

export interface AQIData {
  aqi: number;
  pm25: number;
  pm10: number;
  dominantPollutant: string;
  lastUpdate: string;
  city: string;
  level: AQILevel;
  trend?: 'rising' | 'falling' | 'stable';
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windGust: number;
  windDirection: number;
  uv: number;
  visibility: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  aqi: number;
  pm25: number;
  pm10: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export type TransportMode = 'walk' | 'cycle' | 'bike' | 'bus' | 'metro' | 'car';

export interface Route {
  id: string;
  name: string;
  start: string;
  end: string;
  mode: TransportMode;
  segments: RouteSegment[];
  avgExposure?: number;
}

export interface RouteSegment {
  location: string;
  aqi: number;
  duration: number;
}

export interface Device {
  id: string;
  room: string;
  currentAQI: number;
  mode: 'off' | 'auto' | 'low' | 'medium' | 'max';
  fanSpeed: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  location: Location;
  ageGroup: string;
  isSensitive: boolean;
  routes: Route[];
  devices: Device[];
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  morningSummary: boolean;
  aqiAlert: boolean;
  commuteAlert: boolean;
  threshold?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type Theme = 'light' | 'dark' | 'system';
