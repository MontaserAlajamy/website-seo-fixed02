import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { SOCIAL_LINKS } from '../../lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Muntasir Elagami</h3>
            <p className="text-gray-400">
              Professional Videographer & Photographer
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <Link to="/" className="block text-gray-400 hover:text-white">
                Home
              </Link>
              <Link to="/portfolio" className="block text-gray-400 hover:text-white">
                Portfolio
              </Link>
              <Link to="/about" className="block text-gray-400 hover:text-white">
                About
              </Link>
              <Link to="/contact" className="block text-gray-400 hover:text-white">
                Contact
              </Link>
            </nav>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex flex-wrap gap-4">
              {SOCIAL_LINKS.map(({ platform, url, icon }) => {
                const Icon = Icons[icon as keyof typeof Icons];
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={platform}
                  >
                    <Icon className="w-6 h-6" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {currentYear} Muntasir Elagami. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}