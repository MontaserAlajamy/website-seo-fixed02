import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Mail, Phone, User, MessageSquare, X } from 'lucide-react';
import { useContactMessages } from '../../hooks/useContactMessages';

const RECIPIENT_EMAIL = 'info@muntasirelagami.com';

export default function ContactFormNew() {
  const { submitMessage } = useContactMessages();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Register global reference so Header "Contact Me" button can open the dialog
  useEffect(() => {
    (window as any).contactForm = dialogRef.current;
    return () => { delete (window as any).contactForm; };
  }, []);

  const closeDialog = () => {
    dialogRef.current?.close();
    // Reset after closing
    setTimeout(() => {
      setStatus('idle');
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 300);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const { error } = await submitMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
        status: 'new',
      });

      if (error) throw new Error(error);

      // Fire email notification (non-blocking)
      fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            recipientEmail: RECIPIENT_EMAIL,
          }),
        }
      ).catch(() => { });

      setStatus('success');

      // Auto-close dialog after 4 seconds
      setTimeout(() => {
        closeDialog();
      }, 4000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="w-full max-w-lg mx-auto rounded-3xl p-0 backdrop:bg-black/60 backdrop:backdrop-blur-sm
                 bg-transparent border-none outline-none"
      onClick={(e) => {
        // Close when clicking the backdrop
        if (e.target === dialogRef.current) closeDialog();
      }}
    >
      <div
        className="relative bg-white dark:bg-gray-800 rounded-3xl p-8
                    shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-700"
      >
        {/* Gradient top bar */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400" />

        {/* Close button */}
        <button
          onClick={closeDialog}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <AnimatePresence mode="wait">
          {/* ─── SUCCESS ─── */}
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Message Sent! 🎉
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                Thank you for reaching out. I'll get back to you as soon as possible.
              </p>
              <div className="mt-6 h-1 w-24 rounded-full bg-green-200 dark:bg-green-800 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-green-500"
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 4, ease: 'linear' }}
                />
              </div>
            </motion.div>
          ) : (
            /* ─── FORM ─── */
            <motion.div
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Get in Touch
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Have a project in mind? Let's create something amazing.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="cf-name" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                      Name <span className="text-blue-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text" id="cf-name" name="name" required
                        value={formData.name} onChange={handleChange}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
                                   bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm
                                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="cf-email" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                      Email <span className="text-blue-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email" id="cf-email" name="email" required
                        value={formData.email} onChange={handleChange}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
                                   bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm
                                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="cf-phone" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                    Phone <span className="text-gray-400 text-xs font-normal normal-case">(optional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel" id="cf-phone" name="phone"
                      value={formData.phone} onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
                                 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm
                                 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="cf-message" className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                    Message <span className="text-blue-500">*</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea
                      id="cf-message" name="message" required rows={4}
                      value={formData.message} onChange={handleChange}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600
                                 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm
                                 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>
                </div>

                {/* Error */}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                  >
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
                  </motion.div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3
                             bg-gradient-to-r from-purple-600 to-blue-500
                             hover:from-purple-700 hover:to-blue-600
                             text-white font-semibold rounded-xl text-sm
                             shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40
                             disabled:opacity-60 disabled:cursor-not-allowed
                             transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </dialog>
  );
}
