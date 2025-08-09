
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GuruData } from '../../Dashboard';
import MagicWandIcon from '../icons/MagicWandIcon';
import CloseIcon from '../icons/CloseIcon';

interface JetGuruProps {
    guruData: GuruData;
    onRefine: () => void;
}

const RatingBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div className="p-3 bg-black/20 rounded-lg">
        <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-gray-300 font-medium">{label}</p>
            <p className="font-bold bg-gradient-to-r from-accent-start to-accent-end bg-clip-text text-transparent">{value}<span className="text-xs text-gray-500">/100</span></p>
        </div>
        <div className="w-full bg-black/40 rounded-full h-2.5">
            <motion.div className="bg-gradient-to-r from-accent-start to-accent-end h-2.5 rounded-full" initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8, ease: "easeOut" }}></motion.div>
        </div>
    </div>
);

const JetGuru: React.FC<JetGuruProps> = ({ guruData, onRefine }) => {
    const [explanation, setExplanation] = React.useState<string | null>(null);
    const [isExplaining, setIsExplaining] = React.useState(false);
    
    const handleExplainSuggestion = async (suggestion: string) => {
        setIsExplaining(true);
        setExplanation(null);
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'explain', payload: { suggestion } })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setExplanation(data.text);
        } catch (error) {
            console.error("Failed to get explanation:", error);
            setExplanation("Sorry, the AI coach is busy sipping coffee. Please try again.");
        } finally {
            setIsExplaining(false);
        }
    };

    const encouragementText = () => {
        if (!guruData) return "";
        const score = guruData.viralScore;
        if (score >= 90) return "This is a flawless execution. It resonates with the core signals of virality. Deploy it.";
        if (score >= 75) return "High potential detected. The structure is sound. My suggestions will elevate it from 'great' to 'inevitable'.";
        if (score >= 50) return "The foundation is present but lacks potency. The current trajectory is mediocrity. My analysis provides the necessary corrections for virality.";
        return "This content is misaligned with virality principles. A fundamental rebuild is required. Follow my suggestions precisely.";
    }

    return (
        <section
            id="performance"
            className="p-6 bg-gradient-to-br from-[#0f0c29] to-[#0A0A10] border border-white/10 rounded-2xl backdrop-blur-lg space-y-6 w-full"
        >
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div>
                     <h2 className="font-sora text-2xl font-bold text-white text-center sm:text-left">JetGuru™: Virality Audit</h2>
                     <p className="text-sm text-gray-300 text-center sm:text-left">{encouragementText()}</p>
                </div>
            </div>
        
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1 }} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RatingBar label="🔥 Viral Score" value={guruData.viralScore} />
                    <RatingBar label="🚀 Shareability" value={guruData.shareability} />
                    <RatingBar label="❤️ Emotional Accuracy" value={guruData.emotionalAccuracy} />
                    <RatingBar label="📱 Platform Optimization" value={guruData.platformOptimization} />
                </div>

                <div className="p-3 bg-black/20 rounded-lg">
                    <h3 className="text-sm font-semibold text-white mb-2">💬 Guru's Quotable Line</h3>
                    {(guruData.quotableLine && !guruData.quotableLine.toLowerCase().includes('none')) ? (
                        <p className="italic text-gray-300">"{guruData.quotableLine}"</p>
                    ) : (
                        <p className="italic text-gray-500">No standout line identified. A great opportunity for refinement!</p>
                    )}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="p-3 bg-black/20 rounded-lg">
                        <h3 className="text-sm font-semibold text-white mb-2">📌 Guru's Strategic Directives</h3>
                        <ul className="list-none space-y-2">
                            {guruData.suggestions.map((suggestion, index) => (
                                <li key={index}>
                                    <button onClick={() => handleExplainSuggestion(suggestion)} className="text-left bg-transparent border-none p-0 cursor-pointer group flex items-start gap-2 text-sm text-gray-300 hover:text-accent-start transition-colors">
                                        <span className="text-accent-start mt-1">→</span>
                                        <span>{suggestion}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <AnimatePresence>
                            {(isExplaining || explanation) && (
                                <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '12px' }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="pt-3 border-t border-white/10">
                                    {isExplaining && <p className="text-xs text-gray-400 italic">JetGuru is thinking...</p>}
                                    {explanation && <p className="text-xs text-gray-300">{explanation}</p>}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="p-3 bg-black/20 rounded-lg">
                        <h3 className="text-sm font-semibold text-white mb-2">🗓️ How To Post: Max Impact Protocol</h3>
                        <div className="text-sm text-gray-300 whitespace-pre-wrap space-y-2" dangerouslySetInnerHTML={{ __html: guruData.howToPost.replace(/\n/g, '<br />') }}></div>
                    </div>
                </div>


                {guruData.viralScore < 95 && (
                    <motion.div initial={{ opacity: 0, y:10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                        <button onClick={onRefine} className="w-full mt-2 group relative inline-flex items-center justify-center px-6 py-2.5 font-bold text-black transition-all duration-300 bg-gradient-to-br from-accent-start to-accent-end rounded-xl shadow-lg shadow-accent-start/30 hover:shadow-accent-end/40 transform hover:scale-105 active:scale-100">
                            <MagicWandIcon size={18} />
                            <span className="ml-2">Execute Guru's Refinements</span>
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
};

export default JetGuru;
