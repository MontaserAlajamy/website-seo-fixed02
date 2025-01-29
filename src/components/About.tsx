import React from 'react';
import { useProfile } from '../hooks/useProfile';

export default function About() {
  const { profile } = useProfile();

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src={profile.photo}
              alt="Profile"
              className="w-full h-auto rounded-lg shadow-2xl object-contain"
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              About Me
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {profile.bio}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                <h3 className="font-semibold mb-2 text-purple-600 dark:text-purple-400">
                  Video Editing
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Advanced editing techniques with industry-standard software
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                <h3 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">
                  Color Grading
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Professional color correction and grading for cinematic looks
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                <h3 className="font-semibold mb-2 text-purple-600 dark:text-purple-400">
                  Sound Design
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Immersive audio mixing and sound effects creation
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                <h3 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">
                  Motion Graphics
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Dynamic visual effects and animated elements
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}