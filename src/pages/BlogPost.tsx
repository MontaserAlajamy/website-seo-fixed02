import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useBlogPosts, type BlogPost } from '../hooks/useBlogPosts';
import MetaTags, { JsonLd, structuredData } from '../components/MetaTags';

const BASE_URL = 'https://muntasirelagami.com';

// Configure marked
marked.setOptions({
    breaks: true,
    gfm: true,
});

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const { posts, loading } = useBlogPosts();

    const post = posts.find((p: BlogPost) => p.slug === slug);

    const renderedContent = useMemo(() => {
        if (!post?.content) return '';
        try {
            const raw = marked.parse(post.content) as string;
            return DOMPurify.sanitize(raw);
        } catch {
            return '<p>Error rendering content</p>';
        }
    }, [post?.content]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-16">
                <MetaTags
                    title="Post Not Found"
                    description="The blog post you're looking for doesn't exist."
                />
                <div className="max-w-3xl mx-auto px-4 text-center py-20">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">The blog post you're looking for doesn't exist.</p>
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-16">
            <MetaTags
                title={post.title}
                description={post.excerpt || `Read "${post.title}" on the Ajamy Productions blog.`}
                image={post.cover_image_url || undefined}
                url={`${BASE_URL}/blog/${post.slug}`}
                type="article"
                publishedTime={post.published_at || undefined}
            />
            <JsonLd
                data={structuredData.blogPosting({
                    headline: post.title,
                    description: post.excerpt || post.title,
                    datePublished: post.published_at || post.created_at || new Date().toISOString(),
                    author: 'Muntasir Elagami',
                    image: post.cover_image_url || undefined,
                    url: `${BASE_URL}/blog/${post.slug}`,
                })}
            />
            <JsonLd
                data={structuredData.breadcrumbs([
                    { name: 'Home', url: BASE_URL },
                    { name: 'Blog', url: `${BASE_URL}/blog` },
                    { name: post.title, url: `${BASE_URL}/blog/${post.slug}` },
                ])}
            />
            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back link */}
                <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                </Link>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Cover image */}
                    {post.cover_image_url && (
                        <div className="aspect-video rounded-2xl overflow-hidden mb-8">
                            <img
                                src={post.cover_image_url}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {post.published_at
                                ? new Date(post.published_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })
                                : 'Draft'}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {post.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                >
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Rendered Markdown Content */}
                    <div
                        className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-img:rounded-xl prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800"
                        dangerouslySetInnerHTML={{ __html: renderedContent }}
                    />
                </motion.div>
            </article>
        </div>
    );
}
