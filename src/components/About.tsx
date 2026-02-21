import React from 'react';
import { User } from 'lucide-react';
import { useSupabaseProfile } from '../hooks/useSupabaseProfile';
import { useSkills } from '../hooks/useSkills';

// Fallback profile
const fallbackProfile = {
  name: 'Muntasir Elagami',
  bio: 'With over a decade of experience in video editing and production, I specialize in crafting compelling visual narratives that captivate audiences and deliver powerful messages.',
  avatar_url: 'https://live.staticflickr.com/65535/54228285929_32905e3f5b_k.jpg',
};

// Fallback skills displayed as cards
const fallbackSkillCards = [
  { name: 'Video Editing', description: 'Advanced editing techniques with industry-standard software' },
  { name: 'Color Grading', description: 'Professional color correction and grading for cinematic looks' },
  { name: 'Sound Design', description: 'Immersive audio mixing and sound effects creation' },
  { name: 'Motion Graphics', description: 'Dynamic visual effects and animated elements' },
];

export default function About() {
  const { profile: dbProfile } = useSupabaseProfile();
  const { skills } = useSkills();

  const profile = dbProfile ?? fallbackProfile;
  const skillCards = skills.length > 0
    ? skills.slice(0, 4).map((s) => ({ name: s.name, description: s.description }))
    : fallbackSkillCards;

  const colors = ['purple', 'blue', 'purple', 'blue'];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="w-full h-auto rounded-lg shadow-2xl object-contain"
              />
            ) : (
              <div className="w-full aspect-square rounded-lg shadow-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                <User className="w-32 h-32 text-white/80" />
              </div>
            )}
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              About Me
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {profile.bio}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {skillCards.map((skill, i) => (
                <div key={skill.name} className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
                  <h3 className={`font-semibold mb-2 text-${colors[i % colors.length]}-600 dark:text-${colors[i % colors.length]}-400`}>
                    {skill.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}