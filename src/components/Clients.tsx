import React from 'react';
import { motion } from 'framer-motion';

export default function Clients() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Trusted by Leading Organizations
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Proud to collaborate with industry leaders and innovative brands across various sectors
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 md:p-12 shadow-xl">
            <img
              src="/My Clients 3.png"
              alt="Trusted clients including RTA, GITEX Global, UAEU, Dubai Courts, Metro Pool Lounge, TwoFour54, Arab Media Summit, Dubai Media Academy, Real Madrid Foundation, Women's Insurance Brokers, Licensing Horizons, EMA, Emirates Society of Cardiothoracic Surgery, and Property Shop Investment"
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent dark:from-gray-900/50 pointer-events-none rounded-2xl"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Working with prestigious clients to deliver exceptional visual content
          </p>
        </motion.div>
      </div>
    </section>
  );
}
