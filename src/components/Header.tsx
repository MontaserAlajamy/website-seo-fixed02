import React from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export default function Header({ toggleTheme, isDarkMode }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/photography', label: 'Photography' },
    { to: '/blog', label: 'Blog' },
  ];

  return (
    <header
      className="fixed w-full z-50 bg-opacity-95 dark:bg-opacity-95 bg-white dark:bg-gray-900 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link
            to="/"
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-gray-900 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              <img
                src="/logo.png"
                alt="Ajamy Productions"
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-blue-300 transition-colors">
              Muntasir Elagami
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:scale-105 transition-all"
              >
                {link.label}
              </Link>
            ))}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-700" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window as any).contactForm.showModal()}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
            >
              Contact Me
            </motion.button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white dark:bg-gray-900 py-4"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                (window as any).contactForm.showModal();
                setIsMenuOpen(false);
              }}
              className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
            >
              Contact Me
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
}