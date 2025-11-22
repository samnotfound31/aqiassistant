export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-dark-bg">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-aqi-good border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );
}
