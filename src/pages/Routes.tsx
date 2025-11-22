import { MapPin, Plus, Clock } from 'lucide-react';
import { getAQIColor, getAQILabel } from '../utils/aqi';
import { TransportMode } from '../types';

const mockRoutes = [
  {
    id: '1',
    name: 'Home to Office',
    start: 'Home',
    end: 'Office',
    mode: 'metro' as TransportMode,
    avgExposure: 85,
    duration: 35,
  },
  {
    id: '2',
    name: 'Morning Run',
    start: 'Home',
    end: 'Central Park',
    mode: 'walk' as TransportMode,
    avgExposure: 120,
    duration: 25,
  },
  {
    id: '3',
    name: 'Gym Commute',
    start: 'Office',
    end: 'Gym',
    mode: 'bike' as TransportMode,
    avgExposure: 95,
    duration: 15,
  },
];

const modeIcons: Record<TransportMode, string> = {
  walk: '🚶',
  cycle: '🚴',
  bike: '🏍️',
  bus: '🚌',
  metro: '🚇',
  car: '🚗',
};

export function Routes() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg pb-20">
      <div className="max-w-mobile mx-auto px-4 pt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Routes</h1>
          <button className="w-12 h-12 bg-aqi-good text-white rounded-2xl flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {mockRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{modeIcons[route.mode]}</span>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {route.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {route.start} → {route.end}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>{route.duration} min</span>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="text-3xl font-bold mb-1"
                    style={{ color: getAQIColor(route.avgExposure) }}
                  >
                    {route.avgExposure}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Avg AQI</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                  <span>Exposure Level</span>
                  <span>{getAQILabel(route.avgExposure <= 50 ? 'good' : route.avgExposure <= 100 ? 'moderate' : 'unhealthy')}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min((route.avgExposure / 200) * 100, 100)}%`,
                      backgroundColor: getAQIColor(route.avgExposure),
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {route.avgExposure > 100
                    ? '⚠️ Consider taking this route during off-peak hours or when AQI improves'
                    : '✅ Good time to travel this route'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Route Recommendations
          </h3>
          <div className="space-y-3">
            {[
              'Best time for morning run: 6:00 AM - 7:30 AM',
              'Office commute has lowest AQI between 10 AM - 11 AM',
              'Evening gym route exposure 30% higher than morning',
            ].map((rec, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl"
              >
                <div className="w-2 h-2 bg-aqi-good rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
