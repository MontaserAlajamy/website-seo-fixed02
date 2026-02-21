import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePhotoAlbums } from '../hooks/usePhotoAlbums';
import { isSupabaseConfigured } from '../lib/supabase';
import MetaTags, { JsonLd, structuredData } from '../components/MetaTags';

const BASE_URL = 'https://muntasirelagami.com';

export default function Photography() {
    const { albums, loading } = usePhotoAlbums();

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-16">
            <MetaTags
                title="Photography"
                description="Explore photography albums by Ajamy Productions — events, portraits, landscapes, and creative work across Dubai and the UAE."
                keywords="photography dubai, event photographer uae, portrait photography, creative photography"
                url={`${BASE_URL}/photography`}
            />
            <JsonLd
                data={structuredData.breadcrumbs([
                    { name: 'Home', url: BASE_URL },
                    { name: 'Photography', url: `${BASE_URL}/photography` },
                ])}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                        Photography
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Explore collections from my photography work — events, portraits, landscapes, and more.
                    </p>
                </motion.div>

                {!isSupabaseConfigured ? (
                    <div className="text-center py-12">
                        <Camera className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            Photography albums coming soon.
                        </p>
                    </div>
                ) : loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : albums.length === 0 ? (
                    <div className="text-center py-12">
                        <Camera className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No albums yet. Check back soon!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {albums.map((album, index) => (
                            <motion.div
                                key={album.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    to={`/photography/${album.id}`}
                                    className="group block bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="aspect-[4/3] overflow-hidden">
                                        {album.cover_image_url ? (
                                            <img
                                                src={album.cover_image_url}
                                                alt={album.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                                <Camera className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                            {album.title}
                                        </h3>
                                        {album.description && (
                                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                                {album.description}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
