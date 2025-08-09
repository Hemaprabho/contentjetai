
import React from 'react';
import { motion, Variants } from 'framer-motion';

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

const Founder: React.FC = () => {
  return (
    <motion.section 
      id="founder" 
      className="py-20 sm:py-32 bg-black/20"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div variants={itemVariants}>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              When I started ContentJet AI, I wasn’t just building another tool — I was building the future I wished existed. As a 15-year-old (as of 2025) creator and dreamer, I saw how many brilliant minds struggled to express themselves online — not because they lacked ideas, but because the tools were clunky, generic, or simply out of reach. I wanted to fix that. I wanted to give every creator, student, founder, artist, and storyteller a personal AI companion that could think, feel, and write with them — not just for them.
              <br/><br/>
              ContentJet AI isn’t about automation — it’s about amplification. It’s about helping you generate content that connects deeply, moves fast, and speaks your truth — whether you're sharing on Instagram, YouTube, Twitter, or writing for the world. With emotion-based algorithms, platform-optimized precision, and a design-first experience, we're setting a new standard for creative technology. I built this because I believe the next generation of creators — like you — deserve tools that work just as brilliantly as your ideas.
            </p>
            <div className="mt-8">
              <p className="font-sora text-3xl font-bold">
                <span className="bg-gradient-to-r from-accent-start to-accent-end bg-clip-text text-transparent">Hemaprabho Bhattacharyya</span>
              </p>
              <p className="text-gray-400 mt-1">Founder & CEO — ContentJet AI</p>
              <a href="mailto:hemaprabho37@gmail.com" className="text-accent-start hover:text-accent-end transition-colors mt-2 inline-block">
                📧 hemaprabho37@gmail.com
              </a>
            </div>
          </motion.div>
      </div>
    </motion.section>
  );
};

export default Founder;
