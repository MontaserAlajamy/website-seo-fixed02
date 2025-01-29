import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from '@formspree/react';

export default function ContactForm() {
  const [state, handleSubmit] = useForm('your-form-id');
  const formRef = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    if (state.succeeded) {
      const timer = setTimeout(() => {
        formRef.current?.close();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.succeeded]);

  return (
    <dialog
      ref={formRef}
      id="contactForm"
      className="modal p-8 rounded-lg bg-white dark:bg-gray-900 shadow-xl max-w-md w-full"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Get in Touch</h2>
        <button
          onClick={() => formRef.current?.close()}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {state.errors && state.errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm"
          >
            {state.errors[0].message}
          </motion.div>
        )}

        {state.succeeded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-md bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm"
          >
            Message sent successfully!
          </motion.div>
        )}

        <button
          type="submit"
          disabled={state.submitting}
          className={`w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full transition-all duration-300 ${
            state.submitting
              ? 'opacity-75 cursor-not-allowed'
              : 'hover:from-purple-700 hover:to-blue-600'
          }`}
        >
          {state.submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </dialog>
  );
}