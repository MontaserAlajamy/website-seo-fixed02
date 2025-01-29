import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import type { Video } from '../../lib/types/video';

interface VideoCardProps {
  video: Video;
  onDragEnd: (draggedId: string, targetId: string) => void;
}

export default function VideoCard({ video, onDragEnd }: VideoCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      layout
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', video.id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        onDragEnd(draggedId, video.id);
      }}
      className="relative rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <Play className="w-16 h-16 text-white" />
          </motion.div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {video.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {video.tags?.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}