import { ProfileData } from '../types/profile';

const PROFILE_KEY = 'profileData';

const defaultProfile: ProfileData = {
  name: 'Muntasir Elagami',
  photo: 'https://live.staticflickr.com/65535/54228285929_32905e3f5b_k.jpg',
  bio: 'With over a decade of experience in video editing and production, I specialize in crafting compelling visual narratives that captivate audiences and deliver powerful messages.',
  contact: {
    whatsapp: '',
    availableHours: '',
    languages: [],
  },
  visibility: {
    showWhatsApp: false,
    showAvailability: false,
    showLanguages: false,
  },
};

export const profileStorage = {
  get: (): ProfileData => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (!stored) {
        profileStorage.set(defaultProfile);
        return defaultProfile;
      }
      return JSON.parse(stored);
    } catch {
      return defaultProfile;
    }
  },
  
  set: (profile: ProfileData): void => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event('profile-updated'));
  },
  
  update: (updates: Partial<ProfileData>): void => {
    const current = profileStorage.get();
    const updated = { ...current, ...updates };
    profileStorage.set(updated);
  },
};