import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, User } from 'lucide-react';
import { useSupabaseProfile } from '../hooks/useSupabaseProfile';

// Fallback profile data when database is empty
const fallbackProfile = {
  name: 'Muntasir Elagami',
  title: 'Professional Video Editor & Filmmaker',
  bio: 'With over a decade of experience in video editing and production, I specialize in crafting compelling visual narratives that captivate audiences and deliver powerful messages.',
  avatar_url: 'https://live.staticflickr.com/65535/54228285929_32905e3f5b_k.jpg',
  email: '',
  phone: null as string | null,
  location: null as string | null,
};

export default function Profile() {
  const { profile: dbProfile, loading } = useSupabaseProfile();

  // Use database profile if available, otherwise fall back to static data
  const profile = dbProfile ?? fallbackProfile;

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center gap-12"
        >
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl ring-4 ring-purple-500/20 flex-shrink-0">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                <User className="w-24 h-24 text-white/80" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              {profile.name}
            </h2>
            {profile.title && (
              <p className="text-lg text-purple-600 dark:text-purple-400 mb-4 font-medium">
                {profile.title}
              </p>
            )}
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl">
              {profile.bio}
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {profile.location && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </a>
              )}
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>{profile.phone}</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </section>
  );
}
