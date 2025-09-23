// Header component for the dashboard

import React from 'react';
import ShinyText from '../ShinyText';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">
              <ShinyText 
                text="Net Worth Dashboard"
                speed={3}
                className=""
              />
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
