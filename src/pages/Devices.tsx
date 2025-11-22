import { useState } from 'react';
import { Plus, Power, Wind as WindIcon } from 'lucide-react';
import { getAQIColor } from '../utils/aqi';

const mockDevices = [
  { id: '1', room: 'Living Room', currentAQI: 45, mode: 'auto' as const, fanSpeed: 60 },
  { id: '2', room: 'Bedroom', currentAQI: 38, mode: 'low' as const, fanSpeed: 30 },
  { id: '3', room: 'Home Office', currentAQI: 52, mode: 'medium' as const, fanSpeed: 70 },
];

type DeviceMode = 'off' | 'auto' | 'low' | 'medium' | 'max';

export function Devices() {
  const [devices, setDevices] = useState(mockDevices);

  const setDeviceMode = (id: string, mode: DeviceMode) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, mode, fanSpeed: mode === 'off' ? 0 : d.fanSpeed } : d))
    );
  };

  const setDeviceFanSpeed = (id: string, speed: number) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, fanSpeed: speed } : d)));
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg pb-20">
      <div className="max-w-mobile mx-auto px-4 pt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Devices</h1>
          <button className="w-12 h-12 bg-aqi-good text-white rounded-2xl flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity">
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {devices.map((device) => (
            <div
              key={device.id}
              className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {device.room}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: device.mode === 'off' ? '#9CA3AF' : getAQIColor(device.currentAQI) }}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {device.mode === 'off' ? 'Offline' : 'Active'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="text-4xl font-bold mb-1"
                    style={{ color: getAQIColor(device.currentAQI) }}
                  >
                    {device.currentAQI}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Room AQI</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mode</span>
                  {device.currentAQI < 50 && (
                    <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                      ✓ Suggested: Auto
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {(['off', 'auto', 'low', 'medium', 'max'] as DeviceMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setDeviceMode(device.id, mode)}
                      className={`py-3 rounded-2xl font-medium text-sm transition-all capitalize ${
                        device.mode === mode
                          ? 'bg-aqi-good text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {mode === 'off' ? <Power className="w-4 h-4 mx-auto" /> : mode}
                    </button>
                  ))}
                </div>
              </div>

              {device.mode !== 'off' && device.mode !== 'auto' && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <WindIcon className="w-4 h-4" />
                      Fan Speed
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {device.fanSpeed}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={device.fanSpeed}
                    onChange={(e) => setDeviceFanSpeed(device.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-aqi-good"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              )}

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {device.currentAQI > 80
                    ? '💡 Consider running on High mode until AQI drops below 60'
                    : device.mode === 'off'
                    ? '💡 Air quality is good. You can turn off the purifier to save energy'
                    : '✓ Current settings are optimal for air quality'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {Math.round(devices.reduce((acc, d) => acc + d.currentAQI, 0) / devices.length)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Avg Home AQI</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {devices.filter((d) => d.mode !== 'off').length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Active Devices</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
