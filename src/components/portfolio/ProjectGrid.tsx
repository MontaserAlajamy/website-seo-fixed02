import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard';
import CategoryFilter from './CategoryFilter';
import VideoModal from '../VideoModal';
import { useProjects } from '../../hooks/useProjects';
import { CATEGORIES } from '../../lib/constants';

export default function ProjectGrid() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedVideo, setSelectedVideo] = React.useState<string | null>(null);
  const { projects } = useProjects();

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  return (
    <>
      <CategoryFilter
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map(project => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard
                {...project}
                onPlay={() => setSelectedVideo(project.vimeoId)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {selectedVideo && (
        <VideoModal
          videoId={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
}