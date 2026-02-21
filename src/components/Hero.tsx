import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';
import UniversalPlayer from './UniversalPlayer';

export default function Hero() {
  const { get, loading } = useSiteContent();

  const heroTitle = get('hero_title', 'Muntasir Elagami');
  const heroSubtitle = get('hero_subtitle', 'Creative Photographer & Filmmaker');
  const heroTagline = get('hero_tagline', 'Capturing the essence of life through the lens of creativity.');

  // High quality showreel fallback if DB is empty
  const defaultShowreel = 'https://vimeo.com/1107871758';
  const heroVideoUrl = get('hero_video_url', defaultShowreel);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {!loading && (
          <UniversalPlayer
            videoUrl={heroVideoUrl}
            fill
            autoplay
            muted
            loop
            background
          />
        )}
      </div>

      {/* Darker Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Content */}
      <div className="relative z-20 h-screen flex flex-col items-center justify-center text-white text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
            {heroTitle}
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-4 text-white">
            {heroSubtitle}
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 text-gray-300 max-w-2xl">
            {heroTagline}
          </p>
          <Link
            to="/portfolio"
            className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full text-base sm:text-lg font-semibold hover:from-purple-700 hover:to-blue-600 transition-all duration-300 hover:scale-105"
          >
            View Portfolio
            <Play className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

