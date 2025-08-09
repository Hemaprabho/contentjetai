
import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { UserSettings } from '../../Dashboard';

interface WelcomeHeaderProps {
    settings: UserSettings;
    postsThisWeekCount: number;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const StatCard: React.FC<{ value: React.ReactNode; label: string }> = ({ value, label }) => (
    <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm text-center">
        <p className="text-2xl font-bold bg-gradient-to-r from-accent-start to-accent-end bg-clip-text text-transparent">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
    </motion.div>
);

const motivationalQuotes = [
    "The secret of getting ahead is getting started.",
    "The best time to post was yesterday. The second best time is now.",
    "Your voice matters. Let's make it heard.",
    "Create content you love, and the audience will follow.",
    "Don't wait for inspiration. Create it.",
    "One viral post can change everything. Let's make it today.",
    "Every post is a new opportunity to connect."
];


const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ settings, postsThisWeekCount }) => {
    const [quoteIndex, setQuoteIndex] = React.useState(0);

    React.useEffect(() => {
        const quoteTimer = setInterval(() => {
            setQuoteIndex(prevIndex => (prevIndex + 1) % motivationalQuotes.length);
        }, 7000);
        
        return () => {
            clearInterval(quoteTimer);
        };
    }, []);

    const { jetPoints, username, creationStreak, postsSaved, achievements } = settings;
    
    return (
        <section className="space-y-8">
            <motion.div
                className="flex flex-col sm:flex-row justify-between sm:items-start gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <h1 className="font-sora text-4xl md:text-5xl font-extrabold text-white">Welcome back, {username !== 'Creator' ? username : 'Creator'} 👋</h1>
                    <div className="mt-2 text-lg text-gray-400 h-8 relative">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={quoteIndex}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.5 }}
                                className="absolute"
                            >
                                "{motivationalQuotes[quoteIndex]}"
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </motion.div>
                 <motion.div variants={itemVariants} className="text-center sm:text-right bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm shrink-0">
                    <p className="text-4xl font-bold bg-gradient-to-r from-accent-start to-accent-end bg-clip-text text-transparent animate-pulse">{jetPoints.toLocaleString()}</p>
                    <p className="text-sm text-gray-400 font-semibold">JetPoints Earned</p>
                </motion.div>
            </motion.div>

            <motion.div 
                className="grid grid-cols-2 sm:grid-cols-4 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <StatCard value={postsSaved} label="🌟 Posts Saved" />
                <StatCard value={achievements.length} label="🏆 Achievements" />
                <StatCard value={postsThisWeekCount} label="🗓️ Posts This Week" />
                <StatCard 
                    value={creationStreak > 0 ? `${creationStreak} ${creationStreak > 1 ? 'Days' : 'Day'}` : '🔥'}
                    label={creationStreak > 0 ? '🔥 Creation Streak' : 'Start a Streak!'}
                />
            </motion.div>
        </section>
    );
};

export default WelcomeHeader;
