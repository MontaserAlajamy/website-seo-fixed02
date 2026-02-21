import { motion } from 'framer-motion';
import { Mail, MessageSquare } from 'lucide-react';

export default function ContactCTA() {
    const openContact = () => {
        if ((window as any).contactForm) {
            (window as any).contactForm.showModal();
        }
    };

    return (
        <section className="py-20 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                        Let's Create Stunning Visuals Together!
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                        Have a project in mind or just want to chat about creative possibilities?
                        I'm always open to new collaborations and exciting challenges.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={openContact}
                            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full text-lg font-semibold hover:from-purple-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-purple-500/25 flex items-center gap-2"
                        >
                            <MessageSquare className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Get in Touch
                        </button>
                        <a
                            href="mailto:info@muntasirelagami.com"
                            className="px-8 py-4 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-full text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
                        >
                            <Mail className="w-5 h-5" />
                            Email Me Directly
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
