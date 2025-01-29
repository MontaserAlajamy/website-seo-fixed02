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

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Let's Create Stunning Visuals Together!</h2>
          <button
            onClick={() => window.contactForm.showModal()}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full text-lg font-semibold hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
          >
            Get in Touch
          </button>
        </div>
      </div>
    </div>
  );
}