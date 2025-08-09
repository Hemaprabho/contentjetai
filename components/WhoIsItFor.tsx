import React from 'react';
import { motion, Variants } from 'framer-motion';

const CreatorTag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-center py-3 px-6 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-accent-start/50 transform hover:-translate-y-1">
    <span className="font-medium text-lg text-white">{children}</span>
  </div>
);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 15,
    },
  },
};

const WhoIsItFor: React.FC = () => {
  const creators = [
    '🎨 Artists', '🎥 YouTubers', '✍️ Bloggers', '💼 Founders',
    '👩‍🏫 Coaches', '📸 Instagrammers', '🧵 Thread Writers', '📈 Marketers',
  ];

  return (
    <section id="who-is-it-for" className="py-20 sm:py-32">
      <motion.div 
        className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="font-sora text-4xl md:text-5xl font-extrabold text-white">
            Made for Every Kind of Creator
          </h2>
        </motion.div>
        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          variants={containerVariants}
        >
          {creators.map((creator) => (
            <motion.div key={creator} variants={itemVariants}>
              <CreatorTag>{creator}</CreatorTag>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WhoIsItFor;