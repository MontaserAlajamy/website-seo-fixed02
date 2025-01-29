import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../lib/hooks/usePortfolio';
import VideoCard from './VideoCard';

export default function VideoGrid() {
  const { videos, reorderVideos } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredVideos = React.useMemo(() => {
    return videos
      .filter(video => {
        if (selectedCategory && video.category !== selectedCategory) return false;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            video.title.toLowerCase().includes(query) ||
            video.description.toLowerCase().includes(query) ||
            video.tags?.some(tag => tag.toLowerCase().includes(query))
          );
        }
        return true;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [videos, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="search"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
        />
        {/* Add category filter buttons here */}
      </div>

      {/* Video Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredVideos.map(video => (
          <VideoCard
            key={video.id}
            video={video}
            onDragEnd={reorderVideos}
          />
        ))}
      </motion.div>
    </div>
  );
}