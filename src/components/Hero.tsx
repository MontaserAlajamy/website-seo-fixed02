import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useSiteContent } from '../hooks/useSiteContent';

export default function Hero() {
  const { get, loading } = useSiteContent();

  const heroTitle = get('hero_title', 'Muntasir Elagami');
  const heroSubtitle = get('hero_subtitle', 'Video Editor and Videographer');
  const heroTagline = get('hero_tagline', 'Transforming Ideas into Cinematic Reality');
  const heroVideoUrl = get('hero_video_url', 'https://customer-4lrqk43t1t0tnv7t.cloudflarestream.com/e46eeb670cac1e345a54d903d7a997c8/iframe?muted=true&preload=true&loop=true&autoplay=true&poster=https%3A%2F%2Fcustomer-4lrqk43t1t0tnv7t.cloudflarestream.com%2Fe46eeb670cac1e345a54d903d7a997c8%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600');

  if (loading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div className="relative z-20 h-screen flex flex-col items-center justify-center text-white text-center px-4 max-w-6xl mx-auto">
          <div className="w-3/4 h-16 bg-gray-700 animate-pulse rounded-lg mb-6" />
          <div className="w-2/3 h-12 bg-gray-700 animate-pulse rounded-lg mb-4" />
          <div className="w-1/2 h-8 bg-gray-700 animate-pulse rounded-lg mb-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src={heroVideoUrl}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            minWidth: '100%',
            minHeight: '100%',
            width: 'max(100%, 177.78vh)',
            height: 'max(100%, 56.25vw)',
            transform: 'translate(-50%, -50%)',
            border: 'none',
          }}
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>

      {/* Darker Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content */}
      <div className="relative z-20 h-screen flex flex-col items-center justify-center text-white text-center px-4 max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
          {heroTitle}
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-4 text-white">
          {heroSubtitle}
        </h2>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 text-gray-300">
          {heroTagline}
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

