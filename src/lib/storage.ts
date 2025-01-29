import { Project, SiteSettings, ProfileData } from './types';

const STORAGE_KEYS = {
  PROJECTS: 'videoProjects',
  SETTINGS: 'siteSettings', 
  PROFILE: 'profileData',
  AUTH: 'isAdminAuthenticated',
} as const;

export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorageItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}

export const storage = {
  projects: {
    get: () => getStorageItem<Project[]>(STORAGE_KEYS.PROJECTS, []),
    set: (projects: Project[]) => setStorageItem(STORAGE_KEYS.PROJECTS, projects),
  },
  settings: {
    get: () => getStorageItem<SiteSettings>(STORAGE_KEYS.SETTINGS, {
      heroTitle: '',
      heroSubtitle: '',
      aboutText: '',
      profileImage: '',
      contactEmail: '',
      socialLinks: [],
    }),
    set: (settings: SiteSettings) => setStorageItem(STORAGE_KEYS.SETTINGS, settings),
  },
  profile: {
    get: () => getStorageItem<ProfileData>(STORAGE_KEYS.PROFILE, {
      name: '',
      photo: '',
      bio: '',
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
    }),
    set: (profile: ProfileData) => setStorageItem(STORAGE_KEYS.PROFILE, profile),
  },
  auth: {
    get: () => sessionStorage.getItem(STORAGE_KEYS.AUTH) === 'true',
    set: (value: boolean) => sessionStorage.setItem(STORAGE_KEYS.AUTH, String(value)),
    remove: () => sessionStorage.removeItem(STORAGE_KEYS.AUTH),
  },
};