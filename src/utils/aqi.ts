import { AQILevel } from '../types';

export function getAQIColor(aqi: number, isDark: boolean = false): string {
  if (isDark) {
    if (aqi <= 50) return '#B4F65C';
    if (aqi <= 100) return '#F4E85C';
    if (aqi <= 150) return '#FF9F68';
    if (aqi <= 200) return '#FF6B6B';
    return '#E74C6C';
  }

  if (aqi <= 50) return '#B4F65C';
  if (aqi <= 100) return '#F4E85C';
  if (aqi <= 150) return '#FF9F68';
  if (aqi <= 200) return '#FF6B6B';
  return '#E74C6C';
}

export function getAQIBackground(level: AQILevel, isDark: boolean = false): string {
  if (isDark) {
    switch (level) {
      case 'good':
        return 'from-emerald-950 via-emerald-900 to-teal-950';
      case 'moderate':
        return 'from-yellow-950 via-yellow-900 to-amber-950';
      case 'unhealthy':
        return 'from-orange-950 via-orange-900 to-red-950';
      case 'very-unhealthy':
        return 'from-red-950 via-red-900 to-rose-950';
      case 'hazardous':
        return 'from-fuchsia-950 via-purple-950 to-violet-950';
      default:
        return 'from-gray-950 via-gray-900 to-slate-950';
    }
  }

  switch (level) {
    case 'good':
      return 'from-lime-100 via-green-50 to-emerald-100';
    case 'moderate':
      return 'from-yellow-100 via-amber-50 to-orange-100';
    case 'unhealthy':
      return 'from-orange-200 via-orange-100 to-red-100';
    case 'very-unhealthy':
      return 'from-red-200 via-red-100 to-rose-200';
    case 'hazardous':
      return 'from-fuchsia-200 via-purple-100 to-violet-200';
    default:
      return 'from-gray-100 via-gray-50 to-slate-100';
  }
}

export function getAQILabel(level: AQILevel): string {
  switch (level) {
    case 'good':
      return 'Good';
    case 'moderate':
      return 'Moderate';
    case 'unhealthy':
      return 'Unhealthy';
    case 'very-unhealthy':
      return 'Very Unhealthy';
    case 'hazardous':
      return 'Hazardous';
    default:
      return 'Unknown';
  }
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}
