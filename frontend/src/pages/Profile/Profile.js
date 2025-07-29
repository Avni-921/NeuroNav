import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Profile
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Your coding journey and achievements
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="card p-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Welcome, {user?.username}!
          </h3>
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Email:</span>
              <span className="ml-2 text-sm text-gray-900">{user?.email}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Name:</span>
              <span className="ml-2 text-sm text-gray-900">
                {user?.profile?.firstName} {user?.profile?.lastName}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Problems Solved:</span>
              <span className="ml-2 text-sm text-gray-900">{user?.stats?.problemsSolved || 0}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Total Submissions:</span>
              <span className="ml-2 text-sm text-gray-900">{user?.stats?.totalSubmissions || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}