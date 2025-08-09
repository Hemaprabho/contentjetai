import React from 'react';
import { motion, Variants } from 'framer-motion';

interface TestimonialCardProps {
  quote: string;
  name: string;
  handle: string;
  imgSrc: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, handle, imgSrc }) => (
  <div className="relative p-px rounded-2xl bg-gradient-to-br from-white/10 to-transparent transition-all duration-300 hover:bg-gradient-to-br hover:from-accent-start hover:to-accent-end group">
    <div className="h-full bg-[#121218] rounded-2xl p-6 flex flex-col transition-transform duration-300 group-hover:scale-[0.99]">
      <p className="text-lg text-white flex-grow">"{quote}"</p>
      <div className="mt-6 flex items-center space-x-4">
        <img className="w-12 h-12 rounded-full object-cover" src={imgSrc} alt={`${name}'s abstract avatar`} />
        <div>
          <p className="font-bold text-white">{name}</p>
          <p className="text-sm text-gray-400">{handle}</p>
        </div>
      </div>
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

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "I was stuck in a creative rut. ContentJet AI is like having a brainstorming partner that's available 24/7. My posting frequency and quality have skyrocketed.",
      name: "Alex Rivera",
      handle: "@alexcreates",
      imgSrc: "https://picsum.photos/seed/texture1/100/100",
    },
     {
      quote: "The JetBoost Engine is pure magic. My engagement has never been higher, and I'm spending less time staring at a blank screen.",
      name: "Jordan Chen",
      handle: "@jordanvisuals",
      imgSrc: "https://picsum.photos/seed/texture2/100/100",
    },
    {
      quote: "As a founder, time is my most valuable asset. ContentJet saves me hours every week. The quality is consistently top-tier.",
      name: "Samantha Ives",
      handle: "@founder_sam",
      imgSrc: "https://picsum.photos/seed/texture3/100/100",
    },
    {
      quote: "The 'Trends' feature is my secret weapon. I'm always ahead of the curve, and my content feels incredibly relevant. Worth its weight in gold.",
      name: "Dev Patel",
      handle: "@thedevreport",
      imgSrc: "https://picsum.photos/seed/texture4/100/100",
    },
    {
      quote: "This isn't just an AI writer, it's a strategic partner. The 'JetGuru' analysis is terrifyingly accurate and has completely changed how I approach content.",
      name: "Casey Newton",
      handle: "@caseyinsights",
      imgSrc: "https://picsum.photos/seed/texture5/100/100",
    },
    {
      quote: "From a blank page to a viral-ready post in under a minute. The speed and quality are unmatched. ContentJet is now an indispensable part of my workflow.",
      name: "Maya Singh",
      handle: "@mayacodes",
      imgSrc: "https://picsum.photos/seed/texture6/100/100",
    },
  ];

  return (
    <motion.section 
      id="testimonials" 
      className="py-20 sm:py-32"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="font-sora text-4xl md:text-5xl font-extrabold text-white">
            What Our Early Creators Say
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <motion.div key={t.handle} variants={itemVariants}>
              <TestimonialCard {...t} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Testimonials;