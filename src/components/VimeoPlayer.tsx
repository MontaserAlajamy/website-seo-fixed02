import React from 'react';

interface VimeoPlayerProps {
  videoId: string;
  className?: string;
  autoplay?: boolean;
  background?: boolean;
}

export default function VimeoPlayer({ 
  videoId, 
  className = '', 
  autoplay = false,
  background = false
}: VimeoPlayerProps) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const baseUrl = `https://player.vimeo.com/video/${videoId}`;
  const params = new URLSearchParams({
    ...(autoplay && { autoplay: '1' }),
    ...(background && { background: '1' }),
    muted: '1',
    controls: background ? '0' : '1',
    loop: background ? '1' : '0',
  });

  return (
    <div className={`relative ${className}`} style={{ paddingBottom: '56.25%' }}>
      <iframe
        ref={iframeRef}
        src={`${baseUrl}?${params.toString()}`}
        className="absolute inset-0 w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        style={{ border: 'none' }}
      />
    </div>
  );
}