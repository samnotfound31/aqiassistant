import { LucideIcon } from 'lucide-react';

interface WeatherCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
}

export function WeatherCard({ icon: Icon, label, value, unit, className = '' }: WeatherCardProps) {
  return (
    <div
      className={`flex-shrink-0 w-32 bg-white dark:bg-dark-card rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 ${className}`}
    >
      <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400 mb-2" />
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {value}
        {unit && <span className="text-sm ml-1">{unit}</span>}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
    </div>
  );
}
