export function generateThumbnail(vimeoId: string): string {
  return `https://vumbnail.com/${vimeoId}.jpg`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function validateVimeoId(id: string): boolean {
  return /^\d+$/.test(id);
}

export function generateVideoUrl(vimeoId: string, options: {
  autoplay?: boolean;
  background?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
} = {}): string {
  const baseUrl = `https://player.vimeo.com/video/${vimeoId}`;
  const params = new URLSearchParams({
    ...(options.autoplay && { autoplay: '1' }),
    ...(options.background && { background: '1' }),
    ...(options.muted && { muted: '1' }),
    controls: options.controls ? '1' : '0',
    loop: options.loop ? '1' : '0',
  });

  return `${baseUrl}?${params.toString()}`;
}