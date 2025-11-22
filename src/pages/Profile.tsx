import { useState } from 'react';
import { User, MapPin, Bell, Moon, Sun, Monitor, LogOut, Route, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Theme } from '../types';

export function Profile() {
  const { theme, setTheme } = useStore();
  const [notifications, setNotifications] = useState({
    morning: true,
    aqi: true,
    commute: false,
  });

  const themeOptions: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg pb-20">
      <div className="max-w-mobile mx-auto px-4 pt-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Profile</h1>

        <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg mb-4 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-aqi-good to-green-400 rounded-3xl flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">John Doe</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">john.doe@example.com</p>
            </div>
          </div>
          <button className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Edit Profile
          </button>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg mb-4 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Location</h3>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <div className="text-gray-900 dark:text-gray-100 font-medium mb-1">
              San Francisco, CA
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Age Group: 18-30</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Sensitive Group: No</div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg mb-4 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Theme</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`py-4 rounded-2xl font-medium transition-all flex flex-col items-center gap-2 ${
                  theme === value
                    ? 'bg-aqi-good text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg mb-4 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
          </div>
          <div className="space-y-4">
            {[
              { key: 'morning', label: 'Morning Summary', desc: 'Daily AQI briefing at 7 AM' },
              { key: 'aqi', label: 'AQI Alerts', desc: 'When air quality changes significantly' },
              { key: 'commute', label: 'Commute Alerts', desc: 'Optimal travel time notifications' },
            ].map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{desc}</div>
                </div>
                <button
                  onClick={() =>
                    setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
                  }
                  className={`w-12 h-7 rounded-full transition-colors ${
                    notifications[key as keyof typeof notifications]
                      ? 'bg-aqi-good'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      notifications[key as keyof typeof notifications]
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg mb-4 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <Route className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Commute Routes
            </h3>
          </div>
          <div className="space-y-3">
            {['Home to Office', 'Morning Run', 'Gym Commute'].map((route, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl"
              >
                <span className="text-gray-900 dark:text-gray-100">{route}</span>
                <button className="text-sm text-aqi-good hover:underline">Edit</button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg mb-4 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Alerts</h3>
          </div>
          <div className="space-y-3">
            {[
              { time: '2 hours ago', message: 'AQI increased to 120 in your area' },
              { time: '5 hours ago', message: 'Good time for outdoor exercise' },
              { time: 'Yesterday', message: 'Air quality improving trend detected' },
            ].map((alert, i) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div className="text-sm text-gray-900 dark:text-gray-100 mb-1">{alert.message}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{alert.time}</div>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
