import { Home, TrendingUp, Route, Cpu, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/insights', icon: TrendingUp, label: 'Insights' },
    { path: '/routes', icon: Route, label: 'Routes' },
    { path: '/devices', icon: Cpu, label: 'Devices' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-800 safe-bottom z-50">
      <div className="max-w-mobile mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${
                isActive(path)
                  ? 'text-aqi-good'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon size={24} strokeWidth={isActive(path) ? 2.5 : 2} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
