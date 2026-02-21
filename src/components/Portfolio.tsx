import React from 'react';
import ProjectGrid from './portfolio/ProjectGrid';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Portfolio
        </h1>

        <ProjectGrid />
      </div>
    </div>
  );
}