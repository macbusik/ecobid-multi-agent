'use client';

import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    city: 'New York',
    itemsGiven: 12,
    itemsReceived: 8,
    reputation: 95,
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
        My Profile
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">📍 {user.city}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{user.itemsGiven}</p>
            <p className="text-sm text-gray-600">Items Given</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{user.itemsReceived}</p>
            <p className="text-sm text-gray-600">Items Received</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">{user.reputation}</p>
            <p className="text-sm text-gray-600">Reputation</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">About Reputation</h3>
        <p className="text-gray-600 text-sm">
          Your reputation score increases when you successfully give away items and complete pickups. 
          Higher reputation makes you more trustworthy in the community.
        </p>
      </div>
    </div>
  );
}
