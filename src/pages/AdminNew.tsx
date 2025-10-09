import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Lock, LogOut, Video, Camera, MessageSquare, Settings,
  FileText, Award, User
} from 'lucide-react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import LoginForm from '../components/admin/LoginFormNew';
import VideoManagement from '../components/admin/VideoManagement';
import PhotoManagement from '../components/admin/PhotoManagement';
import ContactMessagesView from '../components/admin/ContactMessagesView';
import SiteSettingsView from '../components/admin/SiteSettingsView';
import SkillsManagement from '../components/admin/SkillsManagement';
import ProfileManagement from '../components/admin/ProfileManagement';

type TabType = 'videos' | 'photos' | 'messages' | 'settings' | 'skills' | 'profile';

export default function AdminNew() {
  const { isAuthenticated, signOut, loading } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState<TabType>('videos');

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const tabs = [
    { id: 'videos' as TabType, label: 'Video Portfolio', icon: Video },
    { id: 'photos' as TabType, label: 'Photo Portfolio', icon: Camera },
    { id: 'messages' as TabType, label: 'Messages', icon: MessageSquare },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'skills' as TabType, label: 'Skills', icon: Award },
    { id: 'settings' as TabType, label: 'Site Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your portfolio content and settings
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex flex-wrap -mb-px">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'videos' && <VideoManagement />}
              {activeTab === 'photos' && <PhotoManagement />}
              {activeTab === 'messages' && <ContactMessagesView />}
              {activeTab === 'profile' && <ProfileManagement />}
              {activeTab === 'skills' && <SkillsManagement />}
              {activeTab === 'settings' && <SiteSettingsView />}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
