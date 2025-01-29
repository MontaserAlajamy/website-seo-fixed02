import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, Trash2, Lock, Edit, Eye, Settings, Image as ImageIcon } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import VimeoPlayer from '../components/VimeoPlayer';
import { CATEGORIES } from '../lib/constants';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';

interface VideoProject {
  id: string;
  title: string;
  category: string;
  vimeoId: string;
  description: string;
  thumbnail: string;
  featured?: boolean;
  order?: number;
  tags?: string[];
}

interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  profileImage: string;
  contactEmail: string;
  socialLinks: { platform: string; url: string }[];
}

export default function Admin() {
  const { isAuthenticated, login, logout } = useAuth();
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'videos' | 'settings'>('videos');
  const [editMode, setEditMode] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<VideoProject | null>(null);
  const [newProject, setNewProject] = React.useState<Partial<VideoProject>>({
    category: CATEGORIES[0],
    tags: [],
  });
  const [settings, setSettings] = React.useState<SiteSettings>(() => {
    const saved = localStorage.getItem('siteSettings');
    return saved ? JSON.parse(saved) : {
      heroTitle: 'Muntasir Elagami',
      heroSubtitle: 'Professional Video Editor & Videographer',
      aboutText: '',
      profileImage: '',
      contactEmail: '',
      socialLinks: [],
    };
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(password);
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    setEditMode(false);
  };

  const handleAddProject = () => {
    if (!newProject.title || !newProject.vimeoId || !newProject.description) {
      setError('Please fill in all required fields');
      return;
    }

    const project: VideoProject = {
      id: crypto.randomUUID(),
      title: newProject.title,
      category: newProject.category || CATEGORIES[0],
      vimeoId: newProject.vimeoId,
      description: newProject.description,
      thumbnail: `https://vumbnail.com/${newProject.vimeoId}.jpg`,
      tags: newProject.tags || [],
      featured: newProject.featured || false,
      order: projects.length,
    };

    addProject(project);
    setNewProject({ category: CATEGORIES[0], tags: [] });
  };

  const handleUpdateProject = (project: VideoProject) => {
    updateProject(project);
    setSelectedProject(null);
  };

  const handleReorderProjects = (draggedId: string, targetId: string) => {
    const updatedProjects = [...projects];
    const draggedIndex = updatedProjects.findIndex(p => p.id === draggedId);
    const targetIndex = updatedProjects.findIndex(p => p.id === targetId);
    
    const [draggedProject] = updatedProjects.splice(draggedIndex, 1);
    updatedProjects.splice(targetIndex, 0, draggedProject);
    
    updatedProjects.forEach((project, index) => {
      updateProject({ ...project, order: index });
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full"
        >
          <div className="flex justify-center mb-6">
            <Lock className="w-12 h-12 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Admin Access
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            {error && (
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'videos'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'settings'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Settings
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {activeTab === 'videos' ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Add New Video
              </h2>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newProject.title || ''}
                    onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Vimeo ID
                  </label>
                  <input
                    type="text"
                    value={newProject.vimeoId || ''}
                    onChange={(e) => setNewProject(prev => ({ ...prev, vimeoId: e.target.value }))}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newProject.description || ''}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newProject.tags?.join(', ') || ''}
                    onChange={(e) => setNewProject(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    }))}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newProject.featured || false}
                    onChange={(e) => setNewProject(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded border-gray-300 dark:border-gray-600 text-purple-600"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Featured Project
                  </label>
                </div>
                <button
                  onClick={handleAddProject}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  Add Video
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <motion.div
                  key={project.id}
                  layoutId={project.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', project.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const draggedId = e.dataTransfer.getData('text/plain');
                    handleReorderProjects(draggedId, project.id);
                  }}
                >
                  <div className="aspect-video">
                    <VimeoPlayer videoId={project.vimeoId} />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {project.title}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="p-1 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                          Featured
                        </span>
                      )}
                    </div>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-1 rounded-md text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Site Settings
              </h2>
              <div className="flex gap-2">
                {editMode ? (
                  <>
                    <button
                      onClick={handleSaveSettings}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Settings
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={settings.heroTitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, heroTitle: e.target.value }))}
                  disabled={!editMode}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hero Subtitle
                </label>
                <input
                  type="text"
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                  disabled={!editMode}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  About Text
                </label>
                <textarea
                  value={settings.aboutText}
                  onChange={(e) => setSettings(prev => ({ ...prev, aboutText: e.target.value }))}
                  disabled={!editMode}
                  rows={5}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profile Image URL
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={settings.profileImage}
                    onChange={(e) => setSettings(prev => ({ ...prev, profileImage: e.target.value }))}
                    disabled={!editMode}
                    className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
                  />
                  {settings.profileImage && (
                    <img
                      src={settings.profileImage}
                      alt="Profile Preview"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                  disabled={!editMode}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Social Links
                </label>
                {settings.socialLinks.map((link, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={link.platform}
                      onChange={(e) => {
                        const newLinks = [...settings.socialLinks];
                        newLinks[index].platform = e.target.value;
                        setSettings(prev => ({ ...prev, socialLinks: newLinks }));
                      }}
                      disabled={!editMode}
                      placeholder="Platform"
                      className="w-1/3 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...settings.socialLinks];
                        newLinks[index].url = e.target.value;
                        setSettings(prev => ({ ...prev, socialLinks: newLinks }));
                      }}
                      disabled={!editMode}
                      placeholder="URL"
                      className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-60"
                    />
                    {editMode && (
                      <button
                        onClick={() => {
                          const newLinks = settings.socialLinks.filter((_, i) => i !== index);
                          setSettings(prev => ({ ...prev, socialLinks: newLinks }));
                        }}
                        className="p-2 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                {editMode && (
                  <button
                    onClick={() => {
                      setSettings(prev => ({
                        ...prev,
                        socialLinks: [...prev.socialLinks, { platform: '', url: '' }]
                      }));
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Social Link
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}