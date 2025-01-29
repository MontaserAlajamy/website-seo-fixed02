import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-6 py-2 rounded-full transition-all duration-300 ${
          selectedCategory === 'all'
            ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
        }`}
      >
        All
      </button>
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-6 py-2 rounded-full transition-all duration-300 ${
            selectedCategory === category
              ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}