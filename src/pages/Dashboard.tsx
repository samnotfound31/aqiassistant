import { useEffect } from 'react';
import { Settings, Bell, TrendingUp, TrendingDown, Droplet, Wind, Gauge, Sun, Eye, Thermometer } from 'lucide-react';
import { useStore } from '../store/useStore';
import { fetchAQIByCoordinates } from '../api/aqicn';
import { fetchWeatherData } from '../api/openmeteo';
import { getAQIBackground, getAQILabel, getAQIColor, getWindDirection } from '../utils/aqi';
import { ParticleVisualization } from '../components/ParticleVisualization';
import { WeatherCard } from '../components/WeatherCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function Dashboard() {
  const { currentAQI, currentWeather, isLoading, setCurrentAQI, setCurrentWeather, setLoading, toggleChat } = useStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const [aqi, weather] = await Promise.all([
            fetchAQIByCoordinates(latitude, longitude),
            fetchWeatherData(latitude, longitude),
          ]);
          setCurrentAQI(aqi);
          setCurrentWeather(weather);
          setLoading(false);
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  if (isLoading || !currentAQI || !currentWeather) {
    return <LoadingSpinner />;
  }

  const bgGradient = getAQIBackground(currentAQI.level);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg pb-20">
      <div className={`bg-gradient-to-br ${bgGradient} transition-all duration-1000`}>
        <div className="max-w-mobile mx-auto px-4 pt-8 pb-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                {currentAQI.city}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Updated {new Date(currentAQI.lastUpdate).toLocaleTimeString()}
              </div>
            </div>
            <div className="flex gap-3">
              <button className="w-10 h-10 bg-white/90 dark:bg-dark-card/90 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <button className="w-10 h-10 bg-white/90 dark:bg-dark-card/90 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-8xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {currentAQI.aqi}
            </div>
            <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {getAQILabel(currentAQI.level)}
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="px-4 py-2 bg-white/90 dark:bg-dark-card/90 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 backdrop-blur-sm">
                Outdoor
              </span>
              <span className="px-4 py-2 bg-white/90 dark:bg-dark-card/90 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 backdrop-blur-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Rising
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-mobile mx-auto px-4 -mt-4">
        <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg mb-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Particulate Matter
          </h3>
          <ParticleVisualization pm25={currentAQI.pm25} pm10={currentAQI.pm10} />
        </div>

        <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg mb-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Weather Conditions
          </h3>
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="flex gap-3 pb-2">
              <WeatherCard
                icon={Thermometer}
                label="Temperature"
                value={currentWeather.temperature}
                unit="°C"
              />
              <WeatherCard
                icon={Thermometer}
                label="Feels Like"
                value={currentWeather.feelsLike}
                unit="°C"
              />
              <WeatherCard
                icon={Droplet}
                label="Humidity"
                value={currentWeather.humidity}
                unit="%"
              />
              <WeatherCard
                icon={Wind}
                label={`Wind ${getWindDirection(currentWeather.windDirection)}`}
                value={currentWeather.windSpeed}
                unit="km/h"
              />
              <WeatherCard
                icon={Gauge}
                label="Pressure"
                value={currentWeather.pressure}
                unit="hPa"
              />
              <WeatherCard
                icon={Sun}
                label="UV Index"
                value={currentWeather.uv}
              />
              <WeatherCard
                icon={Eye}
                label="Visibility"
                value={currentWeather.visibility}
                unit="km"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg mb-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            AI Concierge
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {currentAQI.aqi > 150
              ? 'Air quality is unhealthy. Limit outdoor activities and use an N95 mask if you must go outside.'
              : 'Air quality is acceptable. Sensitive groups should consider limiting prolonged outdoor exertion.'}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {['Is it safe to run?', 'Best time to commute?', 'Do I need a mask?'].map((q) => (
              <button
                key={q}
                onClick={toggleChat}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
          <button
            onClick={toggleChat}
            className="w-full py-3 bg-aqi-good text-white rounded-2xl font-semibold hover:opacity-90 transition-opacity"
          >
            Ask AI Agent
          </button>
        </div>
      </div>
    </div>
  );
}
