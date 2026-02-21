import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, FileText } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { useBlogPosts } from '../hooks/useBlogPosts';
import MetaTags, { JsonLd, structuredData } from '../components/MetaTags';

const BASE_URL = 'https://muntasirelagami.com';

export default function Blog() {
    const { posts, loading } = useBlogPosts('published');

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-16">
            <MetaTags
                title="Blog"
                description="Behind-the-scenes stories, production insights, and creative reflections from Muntasir Elagami Production in Dubai."
                keywords="video production blog, filmmaking insights, behind the scenes dubai, creative content production"
                url={`${BASE_URL}/blog`}
            />
            <JsonLd
                data={structuredData.breadcrumbs([
                    { name: 'Home', url: BASE_URL },
                    { name: 'Blog', url: `${BASE_URL}/blog` },
                ])}
            />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                        Blog
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Behind-the-scenes stories, production insights, and creative reflections from my work.
                    </p>
                </motion.div>

                {!isSupabaseConfigured || loading ? (
                    <div className="flex justify-center py-12">
                        {loading ? (
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <div className="text-center">
                                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400 text-lg">Blog coming soon.</p>
                            </div>
                        )}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No posts yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {posts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    to={`/blog/${post.slug}`}
                                    className="group flex flex-col md:flex-row gap-6 bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                                >
                                    {post.cover_image_url && (
                                        <div className="md:w-72 aspect-video md:aspect-auto overflow-hidden flex-shrink-0">
                                            <img
                                                src={post.cover_image_url}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                                            <Calendar className="w-4 h-4" />
                                            {post.published_at
                                                ? new Date(post.published_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })
                                                : 'Draft'}
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                            {post.title}
                                        </h2>
                                        {post.excerpt && (
                                            <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{post.excerpt}</p>
                                        )}
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {post.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <span className="inline-flex items-center gap-1 text-sm text-purple-600 dark:text-purple-400 font-medium">
                                            Read More <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
