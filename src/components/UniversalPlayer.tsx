

export type VideoSource = 'vimeo' | 'cloudflare' | 'youtube' | 'direct';

interface UniversalPlayerProps {
    videoId?: string;
    videoUrl?: string;
    source?: VideoSource;
    className?: string;
    autoplay?: boolean;
    muted?: boolean;
    controls?: boolean;
    loop?: boolean;
    background?: boolean;
    fill?: boolean;
}

/**
 * Detect the video source from a URL string.
 */
export function detectVideoSource(url: string): { source: VideoSource; id: string; subdomain?: string } {
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) return { source: 'vimeo', id: vimeoMatch[1] };

    // YouTube
    const ytMatch = url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch) return { source: 'youtube', id: ytMatch[1] };

    // Cloudflare customer subdomain
    const cfCustomerMatch = url.match(/(customer-[a-z0-9]+)\.cloudflarestream\.com\/([a-f0-9]{32})/);
    if (cfCustomerMatch) return { source: 'cloudflare', subdomain: cfCustomerMatch[1], id: cfCustomerMatch[2] };

    // Cloudflare Stream (generic)
    const cfMatch = url.match(/cloudflarestream\.com\/([a-f0-9]{32})/);
    if (cfMatch) return { source: 'cloudflare', id: cfMatch[1] };

    // If it looks like a raw video file
    if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)) {
        return { source: 'direct', id: url };
    }

    // Default: treat as direct URL
    return { source: 'direct', id: url };
}

function buildVimeoUrl(id: string, opts: { autoplay?: boolean; muted?: boolean; controls?: boolean; loop?: boolean; background?: boolean }) {
    const params = new URLSearchParams();
    if (opts.autoplay) params.set('autoplay', '1');
    if (opts.muted || opts.background) params.set('muted', '1');
    if (opts.background) {
        params.set('background', '1');
        params.set('controls', '0');
        params.set('loop', '1');
    } else {
        if (opts.controls !== false) params.set('controls', '1');
        if (opts.loop) params.set('loop', '1');
    }
    params.set('title', '0');
    params.set('byline', '0');
    params.set('portrait', '0');
    return `https://player.vimeo.com/video/${id}?${params.toString()}`;
}

function buildYoutubeUrl(id: string, opts: { autoplay?: boolean; muted?: boolean; controls?: boolean; loop?: boolean }) {
    const params = new URLSearchParams();
    if (opts.autoplay) params.set('autoplay', '1');
    if (opts.muted) params.set('mute', '1');
    if (opts.controls === false) params.set('controls', '0');
    if (opts.loop) {
        params.set('loop', '1');
        params.set('playlist', id);
    }
    params.set('rel', '0');
    params.set('modestbranding', '1');
    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

function buildCloudflareUrl(id: string, subdomain: string, opts: { autoplay?: boolean; muted?: boolean; controls?: boolean; loop?: boolean }) {
    const params = new URLSearchParams();
    if (opts.autoplay) params.set('autoplay', 'true');
    if (opts.muted) params.set('muted', 'true');
    if (opts.controls === false) params.set('controls', 'false');
    if (opts.loop) params.set('loop', 'true');
    return `https://${subdomain}.cloudflarestream.com/${id}/iframe?${params.toString()}`;
}

export default function UniversalPlayer({
    videoId,
    videoUrl,
    source,
    className = '',
    autoplay = false,
    muted = false,
    controls = true,
    loop = false,
    background = false,
    fill = false,
}: UniversalPlayerProps) {
    // Determine source and ID
    let resolvedSource = source || 'vimeo';
    let resolvedId = videoId || '';
    let resolvedSubdomain = 'customer-ajj0x7flqjhaqqqt'; // Observed default for home page background

    if (videoUrl) {
        const detected = detectVideoSource(videoUrl);
        resolvedSource = source || detected.source;
        resolvedId = detected.id;
        if (detected.subdomain) {
            resolvedSubdomain = detected.subdomain;
        }
    }

    const opts = { autoplay, muted: muted || background, controls: controls && !background, loop: loop || background, background };

    const containerStyle = fill
        ? { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' } as const
        : { position: 'relative', paddingBottom: '56.25%', width: '100%' } as const;

    const mediaStyle = fill
        ? {
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            width: '100vw',
            height: '56.25vw', // 9/16 * 100
            minHeight: '100vh',
            minWidth: 'calc(100vh * (16/9))',
            transform: 'translate(-50%, -50%) scale(1.05)',
            objectFit: 'cover' as const, // for direct video
        }
        : {
            position: 'absolute' as const,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
        };

    // Direct video — use <video> tag
    if (resolvedSource === 'direct') {
        return (
            <div className={`${className}`} style={containerStyle}>
                <video
                    src={resolvedId}
                    style={mediaStyle as any}
                    autoPlay={opts.autoplay}
                    muted={opts.muted}
                    controls={opts.controls}
                    loop={opts.loop}
                    playsInline
                />
            </div>
        );
    }

    // Build the appropriate iframe URL
    let iframeSrc = '';
    switch (resolvedSource) {
        case 'vimeo':
            iframeSrc = buildVimeoUrl(resolvedId, opts);
            break;
        case 'youtube':
            iframeSrc = buildYoutubeUrl(resolvedId, opts);
            break;
        case 'cloudflare':
            iframeSrc = buildCloudflareUrl(resolvedId, resolvedSubdomain, opts);
            break;
    }

    return (
        <div className={`${className}`} style={containerStyle}>
            <iframe
                src={iframeSrc}
                style={mediaStyle as any}
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
            />
        </div>
    );
}
