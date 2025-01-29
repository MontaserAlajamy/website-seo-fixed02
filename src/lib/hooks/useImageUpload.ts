import { useState } from 'react';
import type { ImageData } from '../types/image';
import { processImage, generateThumbnails } from '../utils/image';

interface UseImageUploadOptions {
  maxSize?: number;
  allowedFormats?: string[];
  generateSizes?: boolean;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<{ success: boolean; data?: ImageData; error?: string }> => {
    try {
      setLoading(true);
      setError(null);

      // Validate file
      if (options.maxSize && file.size > options.maxSize) {
        throw new Error(`File size must be less than ${options.maxSize / 1024 / 1024}MB`);
      }

      if (options.allowedFormats && !options.allowedFormats.includes(file.type.split('/')[1])) {
        throw new Error(`File must be one of: ${options.allowedFormats.join(', ')}`);
      }

      // Process image
      const processed = await processImage(file);
      
      // Generate thumbnails if needed
      const sizes = options.generateSizes ? await generateThumbnails(processed) : [];

      // Create image data
      const imageData: ImageData = {
        id: crypto.randomUUID(),
        url: URL.createObjectURL(processed),
        alt: file.name,
        width: processed.width,
        height: processed.height,
        format: file.type.split('/')[1] as 'jpeg' | 'png' | 'webp',
        sizes,
      };

      return { success: true, data: imageData };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload image';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadImage,
    loading,
    error,
  };
}