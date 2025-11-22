import { create } from 'zustand';
import { AQIData, WeatherData, UserProfile, Theme, ChatMessage, HourlyForecast } from '../types';

interface AppState {
  theme: Theme;
  currentAQI: AQIData | null;
  currentWeather: WeatherData | null;
  hourlyForecast: HourlyForecast[];
  user: UserProfile | null;
  chatMessages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  isChatOpen: boolean;

  setTheme: (theme: Theme) => void;
  setCurrentAQI: (aqi: AQIData) => void;
  setCurrentWeather: (weather: WeatherData) => void;
  setHourlyForecast: (forecast: HourlyForecast[]) => void;
  setUser: (user: UserProfile) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleChat: () => void;
}

export const useStore = create<AppState>((set) => ({
  theme: 'system',
  currentAQI: null,
  currentWeather: null,
  hourlyForecast: [],
  user: null,
  chatMessages: [],
  isLoading: false,
  error: null,
  isChatOpen: false,

  setTheme: (theme) => set({ theme }),
  setCurrentAQI: (aqi) => set({ currentAQI: aqi }),
  setCurrentWeather: (weather) => set({ currentWeather: weather }),
  setHourlyForecast: (forecast) => set({ hourlyForecast: forecast }),
  setUser: (user) => set({ user }),
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  clearChat: () => set({ chatMessages: [] }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
}));
