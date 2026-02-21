import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    LogOut, Video, Camera, MessageSquare, Settings,
    Award, User, BarChart3, FileText, Menu, X
} from 'lucide-react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import LoginFormNew from '../components/admin/LoginFormNew';
import VideoManagement from '../components/admin/VideoManagement';
import { isSupabaseConfigured } from '../lib/supabase';

// Lazy-load heavier admin components
const PhotoManagement = React.lazy(() => import('../components/admin/PhotoManagement'));
const ContactMessagesView = React.lazy(() => import('../components/admin/ContactMessagesView'));
const SiteContentEditor = React.lazy(() => import('../components/admin/SiteContentEditor'));
const SkillsManagement = React.lazy(() => import('../components/admin/SkillsManagement'));
const ProfileManagement = React.lazy(() => import('../components/admin/ProfileManagement'));
const PostEditor = React.lazy(() => import('../components/admin/PostEditor'));
const AnalyticsView = React.lazy(() => import('../components/admin/AnalyticsView'));

type TabType = 'overview' | 'videos' | 'photos' | 'blog' | 'messages' | 'settings' | 'skills' | 'profile' | 'analytics';

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'videos', label: 'Videos', icon: <Video className="w-5 h-5" /> },
    { id: 'photos', label: 'Albums', icon: <Camera className="w-5 h-5" /> },
    { id: 'blog', label: 'Blog', icon: <FileText className="w-5 h-5" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'skills', label: 'Skills', icon: <Award className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

function SuspenseFallback() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

function OverviewTab() {
    const [deduplicating, setDeduplicating] = React.useState(false);
    const [dedupDone, setDedupDone] = React.useState(false);
    const [dupCount, setDupCount] = React.useState<number | null>(null);
    const [stats, setStats] = React.useState({ videos: 0, albums: 0, posts: 0, published: 0, drafts: 0, messages: 0, unread: 0, photos: 0 });
    const [recentItems, setRecentItems] = React.useState<{ type: string; title: string; date: string; status?: string }[]>([]);
    const [statsLoading, setStatsLoading] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            const { supabase } = await import('../lib/supabase');
            const db = supabase as any;
            try {
                // Fetch all counts in parallel
                const [videos, albums, posts, messages, photos, dupCheck] = await Promise.all([
                    db.from('video_projects').select('id', { count: 'exact', head: true }),
                    db.from('photo_albums').select('id', { count: 'exact', head: true }),
                    db.from('blog_posts').select('id, status', { count: 'exact' }),
                    db.from('contact_messages').select('id, read', { count: 'exact' }),
                    db.from('photos').select('id', { count: 'exact', head: true }),
                    db.from('video_projects').select('vimeo_id'),
                ]);

                const postData = posts.data || [];
                const msgData = messages.data || [];
                const published = postData.filter((p: any) => p.status === 'published').length;
                const drafts = postData.filter((p: any) => p.status === 'draft').length;
                const unread = msgData.filter((m: any) => !m.read).length;

                setStats({
                    videos: videos.count || 0,
                    albums: albums.count || 0,
                    posts: posts.count || postData.length,
                    published,
                    drafts,
                    messages: messages.count || msgData.length,
                    unread,
                    photos: photos.count || 0,
                });

                // Check for duplicates
                if (dupCheck.data) {
                    const seen = new Set<string>();
                    let dups = 0;
                    for (const row of dupCheck.data as { vimeo_id: string }[]) {
                        if (seen.has(row.vimeo_id)) dups++;
                        else seen.add(row.vimeo_id);
                    }
                    setDupCount(dups);
                }

                // Get recent activity
                const [recentPosts, recentVideos, recentMsgs] = await Promise.all([
                    db.from('blog_posts').select('title, status, created_at').order('created_at', { ascending: false }).limit(3),
                    db.from('video_projects').select('title, created_at').order('created_at', { ascending: false }).limit(3),
                    db.from('contact_messages').select('name, created_at, read').order('created_at', { ascending: false }).limit(3),
                ]);

                const items: { type: string; title: string; date: string; status?: string }[] = [];
                for (const p of (recentPosts.data || [])) items.push({ type: 'post', title: p.title, date: p.created_at, status: p.status });
                for (const v of (recentVideos.data || [])) items.push({ type: 'video', title: v.title, date: v.created_at });
                for (const m of (recentMsgs.data || [])) items.push({ type: 'message', title: `Message from ${m.name}`, date: m.created_at, status: m.read ? 'read' : 'unread' });
                items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setRecentItems(items.slice(0, 8));
            } catch (err) {
                console.error('Stats fetch error:', err);
            } finally {
                setStatsLoading(false);
            }
        })();
    }, [dedupDone]);

    const handleDeduplicate = async () => {
        setDeduplicating(true);
        try {
            const { supabase } = await import('../lib/supabase');
            const { data } = await supabase
                .from('video_projects')
                .select('id, vimeo_id, order_index')
                .order('order_index', { ascending: true });

            if (data) {
                const seen = new Set<string>();
                const toDelete: string[] = [];
                for (const row of data as { id: string; vimeo_id: string }[]) {
                    if (seen.has(row.vimeo_id)) {
                        toDelete.push(row.id);
                    } else {
                        seen.add(row.vimeo_id);
                    }
                }
                if (toDelete.length > 0) {
                    for (let i = 0; i < toDelete.length; i += 20) {
                        const batch = toDelete.slice(i, i + 20);
                        await supabase.from('video_projects').delete().in('id', batch);
                    }
                }
                setDedupDone(true);
            }
        } catch (err) {
            console.error('Dedup error:', err);
        } finally {
            setDeduplicating(false);
        }
    };

    const typeIcons: Record<string, React.ReactNode> = {
        post: <FileText className="w-4 h-4 text-green-500" />,
        video: <Video className="w-4 h-4 text-blue-500" />,
        message: <MessageSquare className="w-4 h-4 text-orange-500" />,
    };

    const formatRelativeTime = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(dateStr).toLocaleDateString();
    };

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h3>

            {dupCount !== null && dupCount > 0 && !dedupDone && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-yellow-800 dark:text-yellow-300">
                            {dupCount} duplicate video{dupCount > 1 ? 's' : ''} detected
                        </p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-400">
                            Click the button to remove duplicates and keep one copy of each video.
                        </p>
                    </div>
                    <button
                        onClick={handleDeduplicate}
                        disabled={deduplicating}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 text-sm font-medium whitespace-nowrap ml-4"
                    >
                        {deduplicating ? 'Fixing...' : 'Fix Duplicates'}
                    </button>
                </div>
            )}

            {dedupDone && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-xl p-4">
                    <p className="font-semibold text-green-800 dark:text-green-300">✅ Duplicates removed! Refresh the Videos tab to see the cleaned list.</p>
                </div>
            )}

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Videos', value: statsLoading ? '…' : stats.videos.toString(), icon: <Video className="w-6 h-6" />, color: 'from-blue-500 to-blue-600', sub: null },
                    { label: 'Albums', value: statsLoading ? '…' : stats.albums.toString(), icon: <Camera className="w-6 h-6" />, color: 'from-purple-500 to-purple-600', sub: statsLoading ? null : `${stats.photos} photos` },
                    { label: 'Blog Posts', value: statsLoading ? '…' : stats.posts.toString(), icon: <FileText className="w-6 h-6" />, color: 'from-green-500 to-green-600', sub: statsLoading ? null : `${stats.published} published · ${stats.drafts} drafts` },
                    { label: 'Messages', value: statsLoading ? '…' : stats.messages.toString(), icon: <MessageSquare className="w-6 h-6" />, color: 'from-orange-500 to-orange-600', sub: statsLoading ? null : (stats.unread > 0 ? `${stats.unread} unread` : 'all read') },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-gray-700 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                                {stat.icon}
                            </div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                        {stat.sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.sub}</p>}
                    </div>
                ))}
            </div>

            {/* Recent activity */}
            <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-600">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h4>
                </div>
                {statsLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : recentItems.length === 0 ? (
                    <div className="px-5 py-8 text-center text-gray-400 dark:text-gray-500">
                        No recent activity yet. Start creating content!
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-600">
                        {recentItems.map((item, i) => (
                            <div key={i} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-600/50 transition-colors">
                                <div className="flex-shrink-0">{typeIcons[item.type]}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatRelativeTime(item.date)}</p>
                                </div>
                                {item.status && (
                                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${item.status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                        : item.status === 'unread' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                            : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                                        }`}>
                                        {item.status}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}



export default function Dashboard() {
    const { isAuthenticated, user, signOut, loading } = useSupabaseAuth();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!isSupabaseConfigured) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 flex items-center justify-center px-4">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Setup Required</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Please configure Supabase credentials in the .env file to access the dashboard.
                    </p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginFormNew />;
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab />;
            case 'videos':
                return <VideoManagement />;
            case 'photos':
                return (
                    <React.Suspense fallback={<SuspenseFallback />}>
                        <PhotoManagement />
                    </React.Suspense>
                );
            case 'blog':
                return (
                    <React.Suspense fallback={<SuspenseFallback />}>
                        <PostEditor />
                    </React.Suspense>
                );
            case 'messages':
                return (
                    <React.Suspense fallback={<SuspenseFallback />}>
                        <ContactMessagesView />
                    </React.Suspense>
                );
            case 'profile':
                return (
                    <React.Suspense fallback={<SuspenseFallback />}>
                        <ProfileManagement />
                    </React.Suspense>
                );
            case 'skills':
                return (
                    <React.Suspense fallback={<SuspenseFallback />}>
                        <SkillsManagement />
                    </React.Suspense>
                );
            case 'analytics':
                return (
                    <React.Suspense fallback={<SuspenseFallback />}>
                        <AnalyticsView />
                    </React.Suspense>
                );
            case 'settings':
                return (
                    <React.Suspense fallback={<SuspenseFallback />}>
                        <SiteContentEditor />
                    </React.Suspense>
                );
            default:
                return <OverviewTab />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-20">
            {/* Mobile sidebar toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="fixed top-24 left-4 z-50 lg:hidden p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={`fixed lg:sticky top-20 left-0 z-40 h-[calc(100vh-5rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                        }`}
                >
                    <div className="flex flex-col h-full">
                        {/* Sidebar header */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Dashboard</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user?.email}
                            </p>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </nav>

                        {/* Sign out */}
                        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main content */}
                <main className="flex-1 p-4 lg:p-8 min-h-[calc(100vh-5rem)]">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderTabContent()}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
