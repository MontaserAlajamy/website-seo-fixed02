import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <div
          className="relative w-full h-full"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          <iframe
            src="https://customer-4lrqk43t1t0tnv7t.cloudflarestream.com/a3d30559f19ba6bef83436fa6d337424/iframe?muted=true&preload=true&loop=true&autoplay=true&poster=https%3A%2F%2Fcustomer-4lrqk43t1t0tnv7t.cloudflarestream.com%2Fa3d30559f19ba6bef83436fa6d337424%2Fthumbnails%2Fthumbnail.jpg&controls=false"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              transform: 'translate(-50%, -50%)',
              border: 'none',
              objectFit: 'cover',
              zIndex: 0,
            }}
            allow="autoplay; fullscreen"
            allowFullScreen
            className="video-frame"
          />
        </div>
      </div>

      {/* Darker Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content */}
      <div className="relative z-20 h-screen flex flex-col items-center justify-center text-white text-center px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
          Muntasir Elagami
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-4 text-white">
          Video Editor and Videographer
        </h2>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 text-gray-300">
          Transforming Ideas into Cinematic Reality
        </p>
        <Link
          to="/portfolio"
          className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full text-base sm:text-lg font-semibold hover:from-purple-700 hover:to-blue-600 transition-all duration-300 hover:scale-105"
        >
          View Portfolio
          <Play className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
