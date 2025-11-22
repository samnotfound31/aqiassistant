import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, Route, Home, Check } from 'lucide-react';
import { reverseGeocode } from '../api/openmeteo';
import { TransportMode } from '../types';

type Step = 'basics' | 'commute' | 'home' | 'notifications';

const transportModes: { mode: TransportMode; label: string }[] = [
  { mode: 'walk', label: 'Walk' },
  { mode: 'cycle', label: 'Cycle' },
  { mode: 'bike', label: 'Bike' },
  { mode: 'bus', label: 'Bus' },
  { mode: 'metro', label: 'Metro' },
  { mode: 'car', label: 'Car' },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('basics');
  const [location, setLocation] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [isSensitive, setIsSensitive] = useState(false);
  const [selectedModes, setSelectedModes] = useState<TransportMode[]>([]);
  const [hasPurifier, setHasPurifier] = useState(false);
  const [rooms, setRooms] = useState(['Living Room']);
  const [notifications, setNotifications] = useState({
    morning: true,
    aqi: true,
    commute: true,
  });

  useEffect(() => {
    if (step === 'basics' && !location) {
      detectLocation();
    }
  }, [step, location]);

  const detectLocation = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const loc = await reverseGeocode(latitude, longitude);
        setLocation(`${loc.city}, ${loc.country}`);
      });
    }
  };

  const toggleMode = (mode: TransportMode) => {
    setSelectedModes((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  };

  const addRoom = () => {
    setRooms([...rooms, `Room ${rooms.length + 1}`]);
  };

  const handleNext = () => {
    if (step === 'basics') setStep('commute');
    else if (step === 'commute') setStep('home');
    else if (step === 'home') setStep('notifications');
    else {
      localStorage.setItem('hasOnboarded', 'true');
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step === 'commute') setStep('basics');
    else if (step === 'home') setStep('commute');
    else if (step === 'notifications') setStep('home');
  };

  const steps = ['basics', 'commute', 'home', 'notifications'];
  const currentStepIndex = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg p-4">
      <div className="max-w-mobile mx-auto pt-8 pb-24">
        <div className="flex gap-2 mb-8">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-all ${
                i <= currentStepIndex ? 'bg-aqi-good' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        <div className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800">
          {step === 'basics' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Basic Info</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tell us about yourself</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-aqi-good focus:border-transparent outline-none"
                  placeholder="Auto-detected location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Age Group
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-aqi-good focus:border-transparent outline-none"
                >
                  <option value="">Select age group</option>
                  <option value="18-30">18-30</option>
                  <option value="31-50">31-50</option>
                  <option value="51-70">51-70</option>
                  <option value="70+">70+</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Sensitive Group</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Children, elderly, or respiratory conditions
                  </div>
                </div>
                <button
                  onClick={() => setIsSensitive(!isSensitive)}
                  className={`w-12 h-7 rounded-full transition-colors ${
                    isSensitive ? 'bg-aqi-good' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      isSensitive ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {step === 'commute' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center">
                  <Route className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Commute Habits</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">How do you get around?</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Transport Modes
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {transportModes.map(({ mode, label }) => (
                    <button
                      key={mode}
                      onClick={() => toggleMode(mode)}
                      className={`py-3 rounded-2xl font-medium transition-all ${
                        selectedModes.includes(mode)
                          ? 'bg-aqi-good text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'home' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Home Setup</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Smart device integration</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">Smart Air Purifier</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Do you have a smart purifier?</div>
                </div>
                <button
                  onClick={() => setHasPurifier(!hasPurifier)}
                  className={`w-12 h-7 rounded-full transition-colors ${
                    hasPurifier ? 'bg-aqi-good' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      hasPurifier ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {hasPurifier && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Rooms
                  </label>
                  <div className="space-y-2">
                    {rooms.map((room, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-900 dark:text-gray-100"
                      >
                        {room}
                      </div>
                    ))}
                    <button
                      onClick={addRoom}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-gray-600 dark:text-gray-400 hover:border-aqi-good hover:text-aqi-good transition-colors"
                    >
                      + Add Room
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center">
                  <Check className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notifications</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Stay informed</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { key: 'morning', label: 'Morning Summary', desc: 'Daily AQI briefing' },
                  { key: 'aqi', label: 'AQI Alerts', desc: 'When air quality changes' },
                  { key: 'commute', label: 'Commute Alerts', desc: 'Best time to travel' },
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
          )}

          <div className="flex gap-3 mt-8">
            {step !== 'basics' && (
              <button
                onClick={handleBack}
                className="flex-1 py-4 rounded-2xl font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 py-4 rounded-2xl font-semibold bg-aqi-good text-white hover:opacity-90 transition-opacity"
            >
              {step === 'notifications' ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
