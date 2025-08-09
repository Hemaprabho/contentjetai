import React from 'react';
import { motion } from 'framer-motion';

interface CTAProps {
  onNavigate: () => void;
}

const CTA: React.FC<CTAProps> = ({ onNavigate }) => {
  return (
    <motion.section 
      id="cta" 
      className="py-20 sm:py-32"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-sora text-4xl sm:text-5xl md:text-6xl font-extrabold animate-pulse-glow rounded-full">
          <span className="bg-gradient-to-r from-accent-start to-accent-end bg-clip-text text-transparent bg-cover animate-gradient" style={{ backgroundSize: '200% auto' }}>
            Ready to Create Content That Converts?
          </span>
        </h2>
        <div className="mt-12">
          <button
            onClick={onNavigate}
            className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-black transition-all duration-300 bg-gradient-to-br from-accent-start to-accent-end rounded-2xl shadow-2xl shadow-accent-start/30 hover:shadow-accent-end/50 transform hover:scale-110"
          >
            ✨ Launch ContentJet AI Now
          </button>
        </div>
        <p className="mt-6 text-gray-400">
          No signup needed · Free forever (beta) · Takes 5 seconds
        </p>
      </div>
    </motion.section>
  );
};

export default CTA;