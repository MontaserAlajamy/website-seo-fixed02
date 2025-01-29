import React from 'react';
import { Twitter, Linkedin, Instagram, Youtube, Camera, Mail, MessageCircle  } from 'lucide-react';
import { FaVimeoV, FaTiktok } from 'react-icons/fa'; // Vimeo and TikTok icons from react-icons

const socialLinks = [
  {
    name: 'Vimeo',
    url: 'https://vimeo.com/showcase/muntasir-elagami',
    icon: FaVimeoV,
  },
  {
    name: 'X',
    url: 'https://twitter.com/MonTaAjamy',
    icon: Twitter,
  },
  {
    name: 'Flicker',
    url: 'https://www.flickr.com/photos/199982406@N04/',
    icon: Camera,
  },
  {
    name: 'Tiktok',
    url: 'https://www.tiktok.com/@monta.ajamy',
    icon: FaTiktok,
  },
  {
    name: 'Youtube',
    url: 'https://youtube.com/@MontaAJamy',
    icon: Youtube,
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/montaajamy?igsh=NHJhYWNoMGdzZjFq',
    icon: Instagram,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/muntasir-elagami',
    icon: Linkedin,
  },
  {
    name: 'Email',
    url: 'mailto:info@muntasirelagami.com', // Replace with your email
    icon: Mail, // Mail icon
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/971555561927?text=Hi%2C%20I%20am%20interested%20in%20your%20services.',
    icon: MessageCircle, // Message icon for WhatsApp
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <link.icon className="w-6 h-6" />
              <span className="sr-only">{link.name}</span>
            </a>
          ))}
        </div>
        <p className="text-center text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Muntasir Elagami. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}