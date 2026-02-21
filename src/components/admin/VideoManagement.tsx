import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X, Star, Globe } from 'lucide-react';
import { useVideoProjects } from '../../hooks/useVideoProjects';
import { CATEGORIES } from '../../lib/constants';
import UniversalPlayer, { detectVideoSource, getThumbnailUrl, type VideoSource } from '../UniversalPlayer';

export default function VideoManagement() {
  const { projects, loading, addProject, updateProject, deleteProject } = useVideoProjects();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    vimeo_id: '',
    video_url: '',
    video_source: 'vimeo' as VideoSource,
    featured: false,
    tags: [] as string[],
    subdomain: '',
  });
  const [detectedSource, setDetectedSource] = useState<string>('');

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: CATEGORIES[0],
      vimeo_id: '',
      video_url: '',
      video_source: 'vimeo' as VideoSource,
      featured: false,
      tags: [],
      subdomain: '',
    });
    setDetectedSource('');
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleEdit = (project: any) => {
    // Detect subdomain from video_url if it's cloudflare
    let sub = '';
    if (project.video_url) {
      const d = detectVideoSource(project.video_url);
      if (d.subdomain) sub = d.subdomain;
    }

    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      vimeo_id: project.vimeo_id || '',
      video_url: project.video_url || '',
      video_source: (project.video_source as VideoSource) || 'vimeo',
      featured: project.featured,
      tags: project.tags || [],
      subdomain: sub,
    });
    setEditingId(project.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Determine target ID and Source
    const targetSource = formData.video_source;
    const targetId = targetSource === 'vimeo' ? formData.vimeo_id : (detectVideoSource(formData.video_url || formData.vimeo_id).id);

    const thumbnail = getThumbnailUrl(targetSource, targetId, formData.subdomain);

    const submitData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      vimeo_id: formData.vimeo_id,
      video_url: formData.video_url,
      video_source: formData.video_source,
      featured: formData.featured,
      tags: formData.tags,
      thumbnail_url: thumbnail,
    };

    if (editingId) {
      await updateProject(editingId, submitData);
    } else {
      await addProject(submitData);
    }

    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      await deleteProject(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Video Portfolio Management
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Video
        </button>
      </div>

      {(showAddForm || editingId) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {editingId ? 'Edit Video' : 'Add New Video'}
            </h4>
            <button
              onClick={resetForm}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Globe className="w-4 h-4 inline mr-1" />
                Video URL or Vimeo ID *
              </label>
              <input
                type="text"
                required
                value={formData.video_url || formData.vimeo_id}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.trim()) {
                    const detected = detectVideoSource(val);
                    setDetectedSource(`${detected.source} (ID: ${detected.id.substring(0, 20)}${detected.id.length > 20 ? '...' : ''})`);
                    setFormData(prev => ({
                      ...prev,
                      video_url: val.includes('://') ? val : '',
                      vimeo_id: detected.source === 'vimeo' ? detected.id : prev.vimeo_id,
                      video_source: detected.source,
                      subdomain: detected.subdomain || ''
                    }));
                  } else {
                    setDetectedSource('');
                    setFormData(prev => ({ ...prev, video_url: '', vimeo_id: '', video_source: 'vimeo' }));
                  }
                }}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Paste Vimeo/YouTube/Cloudflare URL or ID"
              />
              {detectedSource && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ✓ Detected: {detectedSource}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                  })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="corporate, promotional, social media"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Featured Project
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                {editingId ? 'Update' : 'Add'} Video
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layout
            className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="aspect-video">
              <UniversalPlayer
                videoId={project.vimeo_id || undefined}
                videoUrl={project.video_url || undefined}
                source={project.video_source as VideoSource || 'vimeo'}
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                  {project.title}
                </h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1 text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                    <Star className="w-3 h-3" />
                    Featured
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No videos yet. Add your first video!</p>
        </div>
      )}
    </div>
  );
}
