import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

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

                    <div className="flex justify-center">
                        <button
                            onClick={openContact}
                            className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full text-xl font-semibold hover:from-purple-700 hover:to-blue-600 transition-all duration-300 shadow-xl shadow-purple-500/25 flex items-center gap-3 hover:scale-105"
                        >
                            <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            Get in Touch
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
