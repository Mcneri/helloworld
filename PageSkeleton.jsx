import React from 'react';

export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFF9E8] animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-32">
            <div className="flex items-center space-x-3">
              <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex space-x-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="lg:hidden">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Skeleton */}
      <div className="bg-gradient-to-r from-orange-100 via-purple-100 to-blue-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Title */}
          <div className="text-center space-y-4">
            <div className="h-12 bg-gray-200 rounded w-2/3 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
          
          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}