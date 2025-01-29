import React from 'react';
import { Plus } from 'lucide-react';
import { CATEGORIES } from '../../lib/constants';
import type { Project } from '../../lib/types';

interface VideoFormProps {
  project: Partial<Project>;
  onSubmit: (project: Partial<Project>) => void;
  onChange: (project: Partial<Project>) => void;
}

export default function VideoForm({ project, onSubmit, onChange }: VideoFormProps) {
  return (
    <div className="grid gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          value={project.title || ''}
          onChange={(e) => onChange({ ...project, title: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <select
          value={project.category}
          onChange={(e) => onChange({ ...project, category: e.target.value })}
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
          Video URL
        </label>
        <input
          type="text"
          value={project.vimeoId || ''}
          onChange={(e) => onChange({ ...project, vimeoId: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={project.description || ''}
          onChange={(e) => onChange({ ...project, description: e.target.value })}
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
          value={project.tags?.join(', ') || ''}
          onChange={(e) => onChange({
            ...project,
            tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
          })}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={project.featured || false}
          onChange={(e) => onChange({ ...project, featured: e.target.checked })}
          className="rounded border-gray-300 dark:border-gray-600 text-purple-600"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Featured Project
        </label>
      </div>

      <button
        onClick={() => onSubmit(project)}
        className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
      >
        <Plus className="w-5 h-5" />
        Add Video
      </button>
    </div>
  );
}