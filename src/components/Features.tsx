import React from 'react';
import { motion } from 'framer-motion';
import { Film, Wand2, Palette, Zap, Users } from 'lucide-react';

const features = [
  {
    icon: Film,
    title: 'Cinematic Excellence',
    description: 'Crafting visually stunning narratives with state-of-the-art equipment and techniques. Every frame is meticulously composed to deliver maximum impact.'
  },
  {
    icon: Wand2,
    title: 'Creative Direction',
    description: 'Transforming concepts into compelling visual stories through innovative storytelling approaches. We bring your vision to life with a unique creative perspective.'
  },
  {
    icon: Palette,
    title: 'Color Mastery',
    description: 'Professional color grading that enhances mood and atmosphere. Our advanced color science ensures your content stands out with a distinctive visual style.'
  },
  {
    icon: Zap,
    title: 'Rapid Delivery',
    description: 'Efficient workflow systems that maintain quality while meeting tight deadlines. Quick turnaround without compromising on creative excellence.'
  },
  {
    icon: Users,
    title: 'Collaborative Approach',
    description: 'Working closely with clients to understand and execute their vision. Our partnership-focused process ensures your story is told exactly as you envision it.'
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Why Choose Us
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Elevating your content with professional expertise and creative innovation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
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
      </div>
    </section>
  );
}