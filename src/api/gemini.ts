import { AQIData, WeatherData, UserProfile } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface GeminiRequest {
  aqi: AQIData;
  weather: WeatherData;
  user?: Partial<UserProfile>;
  query: string;
}

export async function askGemini(request: GeminiRequest): Promise<string> {
  try {
    const context = `
Current Air Quality:
- AQI: ${request.aqi.aqi} (${request.aqi.level})
- PM2.5: ${request.aqi.pm25}
- PM10: ${request.aqi.pm10}
- Location: ${request.aqi.city}

Current Weather:
- Temperature: ${request.weather.temperature}°C (Feels like ${request.weather.feelsLike}°C)
- Humidity: ${request.weather.humidity}%
- Wind: ${request.weather.windSpeed} km/h
- UV Index: ${request.weather.uv}

User Question: ${request.query}

Provide a concise, helpful response focused on health and safety recommendations.
`;

    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: context,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return generateMockResponse(request);
  }
}

function generateMockResponse(request: GeminiRequest): string {
  const { aqi, query } = request;

  if (query.toLowerCase().includes('run') || query.toLowerCase().includes('exercise')) {
    if (aqi.aqi > 150) {
      return 'Not recommended. The AQI is unhealthy. Consider indoor exercise or postpone until air quality improves.';
    }
    return 'Air quality is acceptable for outdoor exercise. Stay hydrated and monitor how you feel.';
  }

  if (query.toLowerCase().includes('commute') || query.toLowerCase().includes('time')) {
    return 'Based on current trends, air quality tends to improve after 10 AM. Consider commuting during mid-morning or early afternoon.';
  }

  if (query.toLowerCase().includes('mask')) {
    if (aqi.aqi > 100) {
      return 'Yes, wearing an N95 or KN95 mask is recommended for outdoor activities.';
    }
    return 'A mask is not necessary at current air quality levels, but sensitive individuals may still benefit from wearing one.';
  }

  return `Current AQI is ${aqi.aqi} (${aqi.level}). ${
    aqi.aqi > 150
      ? 'Stay indoors and use air purifiers if available.'
      : 'Air quality is moderate. Sensitive groups should limit prolonged outdoor activities.'
  }`;
}

export async function* streamGeminiResponse(request: GeminiRequest): AsyncGenerator<string> {
  const response = await askGemini(request);
  const words = response.split(' ');

  for (const word of words) {
    yield word + ' ';
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}
