import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Clock, Globe } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

export default function Profile() {
  const { profile } = useProfile();

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {profile.photo ? (
              <img
                src={profile.photo}
                alt={profile.name}
                className="rounded-lg shadow-2xl w-full aspect-square object-cover"
              />
            ) : (
              <div className="rounded-lg shadow-2xl w-full aspect-square bg-gradient-to-r from-purple-600 to-blue-500" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-500/20 rounded-lg" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              {profile.name || 'Muntasir Elagami'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg">
              {profile.bio ||
                'Muntasir Elagami is a visionary Video Editor and Producer based in Dubai, UAE, blending a foundation in Computer Science with a passion for storytelling. From honing his craft at Dialektik Films in Khartoum to shaping narratives at Libyan TV, his journey reflects a seamless fusion of technical expertise and artistic expression. A master of sound and visuals, Muntasir brings stories to life with precision and creativity, drawing inspiration from music, technology, and the rhythm of everyday life. Fluent in Arabic and English, his work resonates with a universal elegance, leaving an indelible mark on every frame he touches.'}
            </p>

            <div className="space-y-4">
              {profile.visibility.showWhatsApp && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    WhatsApp: {profile.contact.whatsapp}
                  </span>
                </div>
              )}

              {profile.visibility.showAvailability && (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Available: {profile.contact.availableHours}
                  </span>
                </div>
              )}

              {profile.visibility.showLanguages &&
                profile.contact.languages.length > 0 && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <div className="flex flex-wrap gap-2">
                      {profile.contact.languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
