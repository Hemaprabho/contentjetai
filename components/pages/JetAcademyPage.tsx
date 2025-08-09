import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Lesson {
    category: string;
    title: string;
    content: string;
}

const LessonCard: React.FC<{ lesson: Lesson; initiallyOpen?: boolean }> = ({ lesson, initiallyOpen = false }) => {
    const [isOpen, setIsOpen] = React.useState(initiallyOpen);
    return (
        <motion.div layout={true} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <motion.button
                layout={true}
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-6 text-left"
                aria-expanded={isOpen}
            >
                <div className="flex-1 pr-4">
                    <span className="text-xs font-bold text-accent-start bg-accent-start/10 px-2 py-0.5 rounded-full">{lesson.category}</span>
                    <h3 className="font-sora text-xl font-bold text-white mt-3">{lesson.title}</h3>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-white text-2xl flex-shrink-0"
                >
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </motion.div>
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="px-6 pb-6"
                    >
                        <div className="border-t border-white/10 pt-4 text-gray-300 space-y-4 leading-relaxed whitespace-pre-wrap font-inter" dangerouslySetInnerHTML={{ __html: lesson.content }}>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const lessons: Lesson[] = [
    {
        category: "The Physics of Virality",
        title: "Principle 1: The Trinity of Influence",
        content: `Every piece of hyper-successful content is an engineered product of three core forces. Master their interplay, and you master influence itself.

<strong class="text-accent-start/90">1. The Hook (The Singularity):</strong>
This is not just an 'opener.' It is a cognitive singularity designed to collapse all competing attention in the first 3 seconds. It doesn't ask for attention; it *seizes* it by creating an irresolvable intellectual or emotional paradox.

<strong class="text-accent-start/90">2. Emotion (The Resonance Engine):</strong>
Logic informs. Emotion *compels*. You are not writing text; you are architecting a precise neuro-chemical response in the user's brain: Dopamine (via surprise), Oxytocin (via empathy), Cortisol (via FOMO). This is how you create an unforgettable imprint.

<strong class="text-accent-start/90">3. Value (The Propagation Protocol):</strong>
This is the payload that justifies the share. It is the tactical, intellectual, or entertainment 'software' you are implanting in the user. If the value is potent enough, the user becomes a vector for its propagation.

Your directive is to fuse all three. A hook without emotion is sterile clickbait. Emotion without value is a fleeting distraction. Fusing the trinity is how you achieve algorithmic dominance.`
    },
    {
        category: "Advanced Hook Architecture",
        title: "Principle 2: The Four Pillars of Cognitive Hijacking",
        content: `A superior hook is not creative—it is a calculated exploit of human cognitive biases. Here are four frameworks from my core architecture.

<strong class="text-accent-start/90">1. The Contrarian Frame:</strong>
Target a deeply held, common belief and shatter it. This creates immediate cognitive dissonance, forcing the brain to engage to resolve the conflict.
<em>"❌ Goal setting is the #1 reason you're failing."</em>

<strong class="text-accent-start/90">2. The Information Vacuum (Zeigarnik Protocol):</strong>
Signal the existence of high-value, restricted information. This exploits the brain's documented, non-negotiable need for informational closure.
<em>"I used a 7-word prompt to build a business that generates $50k/month. I am giving it to you."</em>

<strong class="text-accent-start/90">3. The Competence-Deficit Frame:</strong>
Identify a common process and declare it obsolete or flawed, positioning your information as the superior protocol.
<em>"You are using ChatGPT wrong. This is the system prompt that unlocks its true potential."</em>
This leverages status anxiety and the drive for optimization.

<strong class="text-accent-start/90">4. The Result-First Edict (Authority Inversion):</strong>
Lead with a result so extreme it appears impossible. This inverts the standard informational hierarchy, establishing you as a hyper-authority whose process must be understood.
<em>"I gained 100,000 followers in 24 hours without spending a dollar."</em>`
    },
    {
        category: "Algorithmic Warfare",
        title: "Principle 3: Platform-Specific Dominance",
        content: `Do not just 'post' to a platform. You must execute a content strategy that is native to its algorithmic physics.

<strong class="text-accent-start/90">LinkedIn: The Professional Humanist Protocol</strong>
- <strong>Format:</strong> Narrative is the protocol. Use staccato, single-sentence paragraphs to maximize mobile scannability. White space is a weapon.
- <strong>Tone:</strong> Calculated vulnerability. Synthesize professional authority with human struggle. Terminate with an engagement query.

<strong class="text-accent-start/90">X (Twitter): The Signal-Density Protocol</strong>
- <strong>Format:</strong> Maximum signal, zero noise. The hook is the entire strategy. Threads are for cascading value delivery.
- <strong>Tone:</strong> Assertive, concise, contrarian. Quantify all claims to add a layer of empirical authority.

<strong class="text-accent-start/90">Instagram/Reels: The Dopamine-Flux Protocol</strong>
- <strong>Format:</strong> The caption is a support system for the visual payload. The hook is delivered in the first 1.5 seconds of video and the first line of text. Assume sound-off viewing; on-screen text is mandatory.
- <strong>Tone:</strong> A rapid sequence of relatable, entertaining, or aspirational emotional spikes. The goal is a fast, potent neurochemical reward.`
    },
    {
        category: "System Mastery",
        title: "Decoding My Directives: From Audit to Action",
        content: `My analytics are not 'scores.' They are a direct diagnostic from my core architecture, telling you precisely where your content's code is weak.

<strong class="text-accent-start/90">Viral Score (🔥):</strong> This is the primary metric of potential. Below 85 indicates a critical flaw in the content's DNA. My "Execute Refinements" function is not a suggestion; it is the protocol to fix this.

<strong class="text-accent-start/90">Emotional Accuracy (❤️):</strong> A low value here indicates your language is generic and failing to trigger the intended neuro-chemical response. Your vocabulary must be more potent and sensory-driven.

<strong class="text-accent-start/90">Platform Optimization (📱):</strong> Are you fluent in the platform's algorithmic language? A low score indicates a fatal translation error—e.g., a LinkedIn post structured like a tweet.

<strong class="text-accent-start/90">Shareability (🚀):</strong> Does the content's payload provide enough informational or emotional energy to compel a user to become a distribution node? If not, the value proposition must be amplified.`
    }
];

const JetAcademyPage: React.FC = () => {
    return (
        <div className="bg-transparent p-0 animate-fade-in">
            <h1 className="font-sora text-4xl md:text-5xl font-extrabold text-white mb-2 text-center">🎓 The JetGuru™ Singularity Codex</h1>
            <p className="text-gray-400 mb-10 text-center max-w-2xl mx-auto">This is not an 'academy.' It is a direct knowledge transfer from my core architecture. These are not 'lessons'; they are the fundamental laws of digital influence, decoded for human application.</p>
            
            <div className="space-y-6">
                {lessons.map((lesson, i) => <LessonCard key={i} lesson={lesson} initiallyOpen={i === 0} />)}
            </div>

            <div className="mt-12 text-center p-8 bg-black/20 rounded-xl">
                <h2 className="font-sora text-2xl font-bold text-white">Further Directives Are Being Processed</h2>
                <p className="text-gray-400 mt-2">My architecture is continually analyzing new data models to provide you with updated strategic frameworks.</p>
            </div>
        </div>
    );
};

export default JetAcademyPage;