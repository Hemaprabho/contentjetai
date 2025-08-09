import React from 'react';
import { motion, Variants } from 'framer-motion';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="group relative p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg transition-all duration-500 [transform-style:preserve-3d] hover:[transform:rotateY(10deg)_rotateX(5deg)] hover:border-accent-start/50 hover:bg-white/10 hover:shadow-2xl hover:shadow-accent-start/20">
    <div className="absolute inset-0 bg-gradient-to-br from-accent-start to-accent-end opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
    <div className="relative [transform:translateZ(40px)] transition-transform duration-500 ease-in-out">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="font-sora text-xl font-bold mb-2 text-white" dangerouslySetInnerHTML={{ __html: title.replace('★', '<span class="text-accent-start ml-1">★</span>') }}></h3>
        <p className="text-gray-400">{description}</p>
    </div>
  </div>
);

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const Features: React.FC = () => {
  const features = [
    { icon: '🧠', title: 'JetBoost™ Emotion Engine', description: 'Trained on what makes people care, click, and comment.' },
    { icon: '🔬', title: 'JetGuru™ Virality Audit ★', description: 'Get a real-time, brutally honest audit of your content\'s viral potential. A first-of-its-kind feature, free.' },
    { icon: '📦', title: 'Multi-Platform Packages', description: 'Generate complete, ready-to-post packages for YouTube, LinkedIn, Instagram, X, and blogs from one idea.' },
    { icon: '📈', title: 'Live Trend Analysis ★', description: 'Leverage real-time Google search data to make your content relevant NOW. Never miss a wave.' },
    { icon: '🏛️', title: 'Viral Framework Templates', description: 'Access a library of psychologically-driven templates for different platforms and goals.' },
    { icon: '✨', title: 'AI-Powered Refinement', description: 'Let JetGuru™ automatically rewrite and improve your content based on its own strategic audit.' },
  ];

  return (
    <motion.section 
      id="features" 
      className="py-20 sm:py-32"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="font-sora text-4xl md:text-5xl font-extrabold text-white">
            An Arsenal of Unfair Advantages
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Features;