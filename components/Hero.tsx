import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, Variants } from 'framer-motion';

interface HeroProps {
  onNavigate: () => void;
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

const buttonVariants: Variants = {
    hover: { scale: 1.05, transition: { type: 'spring', stiffness: 300 } },
    tap: { scale: 0.98 }
};

const emojiVariants: Variants = {
    hover: { scale: 1.5, rotate: [-15, 15, 0], transition: { duration: 0.4, type: 'spring' } }
}

const Hero: React.FC<HeroProps> = ({ onNavigate, onLinkClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], ['12deg', '-12deg']), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], ['-12deg', '12deg']), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };


  return (
    <section id="hero" className="relative py-20 md:py-32 min-h-[calc(100vh-80px)] flex items-center overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            className="text-center md:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              variants={itemVariants}
              className="font-sora text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight"
            >
              <span className="bg-gradient-to-r from-accent-start to-accent-end bg-clip-text text-transparent bg-cover animate-gradient" style={{ backgroundSize: '200% auto' }}>
                Create Viral Content
              </span>
              <br />
              in 5 Seconds 🚀
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="mt-6 text-lg md:text-xl text-gray-300 max-w-lg mx-auto md:mx-0"
            >
              ContentJet AI writes scroll-stopping posts for Instagram, LinkedIn, YouTube, Twitter & blogs — powered by trend signals and emotional psychology.
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
            >
              <motion.button 
                onClick={onNavigate}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full sm:w-auto group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-black transition-shadow duration-300 bg-gradient-to-br from-accent-start to-accent-end rounded-xl shadow-lg shadow-accent-start/30 hover:shadow-accent-end/40"
              >
                Start Creating
              </motion.button>
              <motion.a 
                href="#how-it-works" 
                onClick={onLinkClick} 
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-full sm:w-auto px-8 py-3 text-lg font-bold bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                🧠 How It Works
              </motion.a>
            </motion.div>
          </motion.div>
          <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ 
                transformStyle: "preserve-3d",
                rotateX,
                rotateY,
            }}
            className="relative animate-float group"
          >
            <div className="absolute -inset-2.5 bg-gradient-to-br from-accent-start to-accent-end rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div 
              style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}
              className="relative p-px bg-gradient-to-br from-white/20 to-transparent rounded-2xl"
            >
              <div className="relative bg-[#0A0A10] p-6 rounded-[15px] space-y-4 overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-background-shine" style={{ backgroundSize: '400% 100%' }}></div>
                <p className="text-xl font-medium text-white">
                  Unlock your voice. Captivate millions. AI-crafted content that hits hard and converts.
                </p>
                <div className="flex items-center justify-between text-sm text-gray-400 pt-4 border-t border-white/10">
                  <span>❤️ 1.2k</span>
                  <span>🔁 783</span>
                  <span>💬 230+</span>
                   <motion.div className="flex items-center space-x-1">
                    <motion.span variants={emojiVariants} whileHover="hover">🔥</motion.span>
                    <motion.span variants={emojiVariants} whileHover="hover">🤯</motion.span>
                    <motion.span variants={emojiVariants} whileHover="hover">💖</motion.span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;