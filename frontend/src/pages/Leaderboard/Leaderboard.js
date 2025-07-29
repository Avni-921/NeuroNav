import React from 'react';

export default function Leaderboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Leaderboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            See how you rank among other programmers
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="card p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Leaderboard Coming Soon!
          </h3>
          <p className="text-gray-500">
            We're preparing the global rankings and statistics. 
            Start solving problems to see your progress here!
          </p>
        </div>
      </div>
    </div>
  );
}