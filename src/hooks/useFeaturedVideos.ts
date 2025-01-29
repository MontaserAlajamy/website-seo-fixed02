import { useProjects } from './useProjects';

export function useFeaturedVideos() {
  const { projects } = useProjects();
  
  // Get all featured projects or use any project if not enough featured ones
  const allEligibleVideos = projects.filter(project => project.featured || true);
  
  // Shuffle array and take first 6 items
  const shuffledVideos = [...allEligibleVideos]
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);
    
  return { videos: shuffledVideos };
}