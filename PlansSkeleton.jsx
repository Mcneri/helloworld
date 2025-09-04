import React from 'react';

export default function PlansSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50 animate-pulse">
      {/* Header Section */}
      <section className="relative bg-gradient-to-r from-teal-600 via-purple-600 to-cyan-600 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-white/20 rounded-full mx-auto"></div>
            <div className="h-12 bg-white/20 rounded w-2/3 mx-auto"></div>
            <div className="h-6 bg-white/20 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Billing Toggle */}
        <div className="text-center space-y-4">
          <div className="h-16 bg-gray-200 rounded-xl w-80 mx-auto"></div>
          <div className="h-12 bg-gray-200 rounded-2xl w-96 mx-auto"></div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white border-2 border-gray-200 rounded-lg shadow-xl p-8 space-y-6">
              {/* Plan Header */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto"></div>
                <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="space-y-2">
                  <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  <div className="h-20 bg-gray-200 rounded-lg"></div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                {[1,2,3,4,5,6,7,8].map(j => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div className="h-4 bg-gray-200 rounded flex-grow"></div>
                  </div>
                ))}
              </div>

              {/* Button */}
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>

        {/* Additional Sections */}
        <div className="space-y-8">
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
          <div className="h-48 bg-gray-200 rounded-2xl"></div>
        </div>
      </section>
    </div>
  );
}