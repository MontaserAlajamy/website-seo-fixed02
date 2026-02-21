import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePhotoAlbums, usePhotos } from '../hooks/usePhotoAlbums';
import MetaTags, { JsonLd, structuredData } from '../components/MetaTags';

const BASE_URL = 'https://muntasirelagami.com';

export default function Album() {
    const { albumId } = useParams<{ albumId: string }>();
    const { albums } = usePhotoAlbums();
    const { photos, loading } = usePhotos(albumId);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const album = albums.find((a) => a.id === albumId);

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);
    const prevPhoto = () => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : photos.length - 1));
    const nextPhoto = () => setLightboxIndex((i) => (i !== null && i < photos.length - 1 ? i + 1 : 0));

    // Keyboard navigation
    React.useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevPhoto();
            if (e.key === 'ArrowRight') nextPhoto();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightboxIndex, photos.length]);

    // Memoize JSON-LD to avoid re-creating on every render
    const galleryLd = useMemo(() => {
        if (!album || photos.length === 0) return null;
        return structuredData.imageGallery({
            name: album.title,
            description: album.description || `Photography album: ${album.title}`,
            images: photos.map((p) => ({
                url: p.image_url,
                name: p.title || album.title,
            })),
        });
    }, [album, photos]);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-16">
            {album && (
                <>
                    <MetaTags
                        title={album.title}
                        description={album.description || `Browse the ${album.title} photography album by Ajamy Productions.`}
                        image={album.cover_image_url || undefined}
                        url={`${BASE_URL}/photography/${albumId}`}
                    />
                    <JsonLd
                        data={structuredData.breadcrumbs([
                            { name: 'Home', url: BASE_URL },
                            { name: 'Photography', url: `${BASE_URL}/photography` },
                            { name: album.title, url: `${BASE_URL}/photography/${albumId}` },
                        ])}
                    />
                    {galleryLd && <JsonLd data={galleryLd} />}
                </>
            )}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back button + title */}
                <div className="mb-8">
                    <Link
                        to="/photography"
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Albums
                    </Link>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            {album?.title || 'Album'}
                        </h1>
                        {album?.description && (
                            <p className="text-lg text-gray-600 dark:text-gray-300">{album.description}</p>
                        )}
                    </motion.div>
                </div>

                {/* Photo grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : photos.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No photos in this album yet.</p>
                    </div>
                ) : (
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                        {photos.map((photo, index) => (
                            <motion.div
                                key={photo.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="break-inside-avoid"
                            >
                                <button
                                    onClick={() => openLightbox(index)}
                                    className="group relative w-full overflow-hidden rounded-lg cursor-pointer"
                                >
                                    <img
                                        src={photo.thumbnail_url || photo.image_url}
                                        alt={photo.title || ''}
                                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxIndex !== null && photos[lightboxIndex] && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
                        onClick={closeLightbox}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white z-10"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        {/* Navigation */}
                        <button
                            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white z-10"
                        >
                            <ChevronLeft className="w-10 h-10" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white z-10"
                        >
                            <ChevronRight className="w-10 h-10" />
                        </button>

                        {/* Image */}
                        <motion.img
                            key={lightboxIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            src={photos[lightboxIndex].image_url}
                            alt={photos[lightboxIndex].title || ''}
                            className="max-h-[90vh] max-w-[90vw] object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {/* Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                            {lightboxIndex + 1} / {photos.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
