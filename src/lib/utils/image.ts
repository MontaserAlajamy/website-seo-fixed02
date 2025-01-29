interface ProcessedImage {
  width: number;
  height: number;
  blob: Blob;
}

export async function processImage(file: File): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            blob => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
            'image/jpeg',
            0.9
          );
        });

        resolve({
          width: img.width,
          height: img.height,
          blob,
        });
      } catch (err) {
        reject(err);
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

export async function generateThumbnails(image: ProcessedImage) {
  const sizes = [
    { width: 320, height: Math.round(320 * (image.height / image.width)) },
    { width: 640, height: Math.round(640 * (image.height / image.width)) },
    { width: 1280, height: Math.round(1280 * (image.height / image.width)) },
  ];

  return Promise.all(sizes.map(async size => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    canvas.width = size.width;
    canvas.height = size.height;

    const img = new Image();
    const url = URL.createObjectURL(image.blob);

    return new Promise((resolve, reject) => {
      img.onload = async () => {
        try {
          ctx.drawImage(img, 0, 0, size.width, size.height);
          
          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
              blob => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
              'image/jpeg',
              0.9
            );
          });

          resolve({
            width: size.width,
            height: size.height,
            url: URL.createObjectURL(blob),
          });
        } catch (err) {
          reject(err);
        } finally {
          URL.revokeObjectURL(url);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    });
  }));
}