import { useMemo } from 'react';

interface ParticleVisualizationProps {
  pm25: number;
  pm10: number;
}

export function ParticleVisualization({ pm25, pm10 }: ParticleVisualizationProps) {
  const particles = useMemo(() => {
    const count = Math.min(Math.floor((pm25 + pm10) / 5), 100);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      isPM25: i < count * (pm25 / (pm25 + pm10)),
    }));
  }, [pm25, pm10]);

  return (
    <div className="relative w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl overflow-hidden">
      <svg className="w-full h-full">
        {particles.map((particle) => (
          <circle
            key={particle.id}
            cx={`${particle.x}%`}
            cy={`${particle.y}%`}
            r={particle.size}
            fill={particle.isPM25 ? '#FF9F68' : '#FFD700'}
            opacity={0.6}
            className="animate-pulse"
            style={{
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="flex gap-6">
            <div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{pm25}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">PM2.5</div>
            </div>
            <div className="w-px bg-gray-300 dark:bg-gray-600" />
            <div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{pm10}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">PM10</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
