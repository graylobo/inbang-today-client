function StreamerCardSkeleton() {
  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-gray-200 animate-pulse">
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-300"></div>

      {/* Footer Info */}
      <div className="p-2 bg-gray-300">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-400 rounded w-20"></div>
          <div className="h-4 bg-gray-400 rounded w-8"></div>
        </div>
        <div className="mt-1 h-3 bg-gray-400 rounded w-16"></div>
      </div>
    </div>
  );
}

export default StreamerCardSkeleton;
