import React from 'react';
import { motion, Variants } from 'framer-motion';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      staggerChildren: 0.2
    }
  }
};

const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "1",
      title: "Write or Paste Your Idea",
      description: "A sentence, a topic, even a link. Give our AI the spark.",
    },
    {
      step: "2",
      title: "Generate In Seconds",
      description: "Our AI builds 2–5 versions with smart hooks, tone & emojis.",
    },
    {
      step: "3",
      title: "Copy, Edit or Share",
      description: "One click to copy, schedule, or export your viral-ready content.",
    },
  ];

  return (
    <motion.section 
      id="how-it-works" 
      className="py-20 sm:py-32"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={sectionVariants} className="text-center mb-16">
          <h2 className="font-sora text-4xl md:text-5xl font-extrabold text-white">
            Here’s How ContentJet Works
          </h2>
          <p className="mt-4 text-lg text-gray-400">Simple, fast, and powerfully effective.</p>
        </motion.div>
        
        <motion.div className="relative max-w-2xl mx-auto" variants={sectionVariants}>
          {/* Vertical gradient line */}
          <div className="absolute left-5 top-5 h-[calc(100%-2.5rem)] w-0.5 bg-gradient-to-b from-accent-start/30 via-accent-end/50 to-accent-start/30" aria-hidden="true"></div>
          
          <div className="relative flex flex-col gap-y-12">
            {steps.map((item, index) => (
              <motion.div key={index} variants={sectionVariants} className="relative flex items-center">
                {/* Numbered circle */}
                <div className="z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-start to-accent-end font-bold text-black shadow-[0_0_20px_theme(colors.accent.start/0.5)]">
                  {item.step}
                </div>
                {/* Step content card */}
                <div className="ml-8 w-full rounded-2xl bg-[#111117]/80 p-6 backdrop-blur-sm border border-white/10">
                  <h3 className="font-sora text-xl font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HowItWorks;