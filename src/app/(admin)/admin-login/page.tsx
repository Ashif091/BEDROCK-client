"use client"
import React, { useState } from 'react';

const AdminLogin: React.FC = () => {
  const [adminId, setAdminId] = useState('');
  const [entryKey, setEntryKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" >
      <div className="w-full max-w-sm  p-8 space-y-8 rounded-lg bg-[#3e3fb0] bg-opacity-10 backdrop-filter backdrop-blur-sm">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-white">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="adminId" className="sr-only">
                Admin ID
              </label>
              <input
                id="adminId"
                name="adminId"
                type="text"
                required
                className="bg-transparent appearance-none rounded-md mb-5 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Admin ID"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="entryKey" className="sr-only">
                Entry Key
              </label>
              <input
                id="entryKey"
                name="entryKey"
                type="password"
                required
                className="bg-transparent appearance-none rounded-md mb-5 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Entry Key"
                value={entryKey}
                onChange={(e) => setEntryKey(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;