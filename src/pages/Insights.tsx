import { useEffect, useState } from 'react';
import { TrendingUp, Activity, AlertCircle, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { fetchHourlyForecast } from '../api/openmeteo';
import { getAQIColor } from '../utils/aqi';

export function Insights() {
  const { hourlyForecast, setHourlyForecast, currentAQI } = useStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d'>('24h');

  useEffect(() => {
    loadForecast();
  }, []);

  const loadForecast = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const forecast = await fetchHourlyForecast(latitude, longitude);
        setHourlyForecast(forecast);
      });
    }
  };

  const maxAQI = Math.max(...(hourlyForecast.map((f) => f.aqi) || [100]));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg pb-20">
      <div className="max-w-mobile mx-auto px-4 pt-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Insights</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedPeriod('24h')}
            className={`flex-1 py-3 rounded-2xl font-semibold transition-all ${
              selectedPeriod === '24h'
                ? 'bg-aqi-good text-white'
                : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300'
            }`}
          >
            24 Hours
          </button>
          <button
            onClick={() => setSelectedPeriod('7d')}
            className={`flex-1 py-3 rounded-2xl font-semibold transition-all ${
              selectedPeriod === '7d'
                ? 'bg-aqi-good text-white'
                : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300'
            }`}
          >
            7 Days
          </button>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg mb-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            AQI Trend
          </h3>
          <div className="h-48 relative">
            {hourlyForecast.length > 0 ? (
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="aqi-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={getAQIColor(currentAQI?.aqi || 0)} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={getAQIColor(currentAQI?.aqi || 0)} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="url(#aqi-gradient)"
                  stroke="none"
                  points={`0,100 ${hourlyForecast
                    .slice(0, 24)
                    .map((f, i) => `${(i / 23) * 100},${100 - (f.aqi / maxAQI) * 100}`)
                    .join(' ')} 100,100`}
                />
                <polyline
                  fill="none"
                  stroke={getAQIColor(currentAQI?.aqi || 0)}
                  strokeWidth="0.5"
                  points={hourlyForecast
                    .slice(0, 24)
                    .map((f, i) => `${(i / 23) * 100},${100 - (f.aqi / maxAQI) * 100}`)
                    .join(' ')}
                />
              </svg>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Loading forecast...
              </div>
            )}
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>Now</span>
            <span>12h</span>
            <span>24h</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
            <TrendingUp className="w-8 h-8 text-green-500 mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {currentAQI?.aqi || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Current AQI</div>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
            <AlertCircle className="w-8 h-8 text-orange-500 mb-3" />
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {Math.max(...(hourlyForecast.slice(0, 24).map((f) => f.aqi) || [0]))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">24h Peak</div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg mb-4 border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Weekly Exposure
          </h3>
          <div className="space-y-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
              const exposure = Math.random() * 100;
              return (
                <div key={day}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{day}</span>
                    <span className="text-gray-600 dark:text-gray-400">{Math.round(exposure)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-aqi-good rounded-full transition-all"
                      style={{ width: `${exposure}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            AI Insights
          </h3>
          <div className="space-y-3">
            {[
              'Air quality tends to be better in the morning before 8 AM',
              'PM2.5 levels spike during evening rush hour (5-7 PM)',
              'Your weekly exposure is 15% lower than last week',
              'Consider indoor exercise when AQI exceeds 150',
            ].map((insight, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl"
              >
                <div className="w-2 h-2 bg-aqi-good rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
