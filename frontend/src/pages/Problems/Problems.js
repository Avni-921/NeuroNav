import React from 'react';

export default function Problems() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Problems
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose a problem to solve from our collection
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="card p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Problems Coming Soon!
          </h3>
          <p className="text-gray-500">
            We're working on adding an extensive collection of coding problems. 
            Check back soon to start solving challenges!
          </p>
        </div>
      </div>
    </div>
  );
}