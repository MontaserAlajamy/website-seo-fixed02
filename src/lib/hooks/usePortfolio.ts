import { useState, useCallback } from 'react';
import { Video } from '../types/video';

export function usePortfolio() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reorderVideos = useCallback((draggedId: string, targetId: string) => {
    setVideos(prev => {
      const newVideos = [...prev];
      const draggedIndex = newVideos.findIndex(v => v.id === draggedId);
      const targetIndex = newVideos.findIndex(v => v.id === targetId);
      
      const [draggedVideo] = newVideos.splice(draggedIndex, 1);
      newVideos.splice(targetIndex, 0, draggedVideo);
      
      return newVideos.map((video, index) => ({
        ...video,
        order: index + 1,
      }));
    });
  }, []);

  const addVideo = useCallback((video: Omit<Video, 'id'>) => {
    const newVideo = {
      ...video,
      id: crypto.randomUUID(),
      order: videos.length + 1,
    };
    setVideos(prev => [...prev, newVideo]);
  }, [videos.length]);

  const updateVideo = useCallback((id: string, updates: Partial<Video>) => {
    setVideos(prev => prev.map(video => 
      video.id === id ? { ...video, ...updates } : video
    ));
  }, []);

  const deleteVideo = useCallback((id: string) => {
    setVideos(prev => prev.filter(video => video.id !== id));
  }, []);

  return {
    videos,
    loading,
    error,
    reorderVideos,
    addVideo,
    updateVideo,
    deleteVideo,
  };
}