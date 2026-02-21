import { useState } from 'react';
import { BarChart3, ExternalLink, RefreshCw, Globe, TrendingUp } from 'lucide-react';

/**
 * Analytics dashboard tab — embeds the Tianji share dashboard
 * and provides quick stats overview.
 */

const TIANJI_BASE = 'https://tianji.ajamy.tech';
const WEBSITE_ID = 'cma6w1ur50001z7jicpd8tgvb';
const SHARE_URL = `${TIANJI_BASE}/website/${WEBSITE_ID}`;

type TimeRange = '24h' | '7d' | '30d' | '90d';

export default function AnalyticsView() {
    const [timeRange, setTimeRange] = useState<TimeRange>('7d');
    const [iframeKey, setIframeKey] = useState(0);

    const timeRanges: { value: TimeRange; label: string }[] = [
        { value: '24h', label: 'Last 24h' },
        { value: '7d', label: '7 Days' },
        { value: '30d', label: '30 Days' },
        { value: '90d', label: '90 Days' },
    ];

    const iframeSrc = `${SHARE_URL}`;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Visitor insights powered by Tianji
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Time range selector */}
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        {timeRanges.map((tr) => (
                            <button
                                key={tr.value}
                                onClick={() => setTimeRange(tr.value)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeRange === tr.value
                                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {tr.label}
                            </button>
                        ))}
                    </div>

                    {/* Refresh */}
                    <button
                        onClick={() => setIframeKey(k => k + 1)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Refresh analytics"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>

                    {/* Open in Tianji */}
                    <a
                        href={SHARE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open Tianji
                    </a>
                </div>
            </div>

            {/* Quick info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Tracking</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Cookie-free Analytics</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">GDPR & CCPA compliant</p>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Bot Filtering</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">30+ Bot Patterns</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Real visitors only</p>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Dashboard</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Self-hosted Tianji</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">tianji.ajamy.tech</p>
                </div>
            </div>

            {/* Embedded Tianji dashboard */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Live Dashboard — {timeRanges.find(t => t.value === timeRange)?.label}
                    </h4>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                        </span>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Live</span>
                    </div>
                </div>
                <iframe
                    key={iframeKey}
                    src={iframeSrc}
                    className="w-full border-0"
                    style={{ height: '700px' }}
                    title="Tianji Analytics Dashboard"
                    loading="lazy"
                />
            </div>

            {/* Note */}
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                Analytics data is collected via your self-hosted Tianji instance. Bot traffic is automatically filtered client-side.
            </p>
        </div>
    );
}
