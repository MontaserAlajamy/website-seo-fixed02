import React from 'react';
import { X } from 'lucide-react';
import UniversalPlayer, { detectVideoSource } from './UniversalPlayer';
import type { VideoSource } from './UniversalPlayer';

interface VideoModalProps {
  videoId: string;
  videoUrl?: string;
  videoSource?: VideoSource;
  onClose: () => void;
}

export default function VideoModal({ videoId, videoUrl, videoSource, onClose }: VideoModalProps) {
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Determine the source — if videoUrl provided, auto-detect
  let resolvedSource = videoSource || 'vimeo';
  let resolvedId = videoId;

  if (videoUrl) {
    const detected = detectVideoSource(videoUrl);
    resolvedSource = videoSource || detected.source;
    resolvedId = detected.id;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl mx-auto bg-black rounded-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
        >
          <X className="w-8 h-8" />
        </button>
        <UniversalPlayer
          videoId={resolvedId}
          source={resolvedSource}
          autoplay
          controls
        />
      </div>
    </div>
  );
}