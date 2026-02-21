import { motion } from 'framer-motion';
import { Film, Palette, Music, Sparkles, Award } from 'lucide-react';
import { useSkills } from '../hooks/useSkills';
import type { LucideIcon } from 'lucide-react';

// Map of icon names (from DB) to Lucide components
const iconMap: Record<string, LucideIcon> = {
  film: Film,
  palette: Palette,
  music: Music,
  sparkles: Sparkles,
  award: Award,
};

// Static fallback features when no skills exist in the database
const fallbackFeatures = [
  {
    icon: Film,
    title: 'Cinematic Excellence',
    description: 'Crafting visually stunning narratives with state-of-the-art equipment and techniques. Every frame is meticulously composed to deliver maximum impact.'
  },
  {
    icon: Palette,
    title: 'Color Grading',
    description: 'Professional color correction and grading that brings your vision to life. Creating mood, atmosphere, and visual consistency across every scene.'
  },
  {
    icon: Music,
    title: 'Sound Design',
    description: 'Immersive audio experiences that complement and enhance the visual narrative. From subtle ambience to powerful sound effects.'
  },
  {
    icon: Sparkles,
    title: 'Visual Effects',
    description: 'Seamless visual effects and motion graphics that elevate your content. Adding that extra layer of polish and professionalism.'
  }
];

export default function Features() {
  const { skills, loading } = useSkills();

  // Use database skills if available, otherwise fall back to static data
  const features = skills.length > 0
    ? skills.map((skill) => ({
      icon: iconMap[skill.icon?.toLowerCase()] || Award,
      title: skill.name,
      description: skill.description,
    }))
    : fallbackFeatures;

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            What I Do Best
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transforming raw footage into captivating stories through expert editing, color grading, and post-production mastery.
          </p>
        </motion.div>

        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(features.length, 4)} gap-8`}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-gradient-to-r from-purple-600/10 to-blue-500/10">
                <feature.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </section>
  );
}