import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastType } from '../../App';
import CopyIcon from '../icons/CopyIcon';

interface BulkResult {
    idea: string;
    post: string;
    status: 'success' | 'error';
    error?: string;
}

const BulkGenerator: React.FC<{ showToast: (message: string, type?: ToastType) => void }> = ({ showToast }) => {
    const [ideas, setIdeas] = React.useState<string[]>([]);
    const [results, setResults] = React.useState<BulkResult[]>([]);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [fileName, setFileName] = React.useState('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                const lines = text.split('\n').map(line => line.trim()).filter(line => line);
                setIdeas(lines);
                showToast(`${lines.length} ideas loaded from ${file.name}`, 'success');
            };
            reader.readAsText(file);
        }
    };

    const handleGenerateAll = async () => {
        if (ideas.length === 0) {
            showToast("Please upload a CSV with ideas first.", 'error');
            return;
        }
        setIsGenerating(true);
        setResults([]);

        for (const idea of ideas) {
            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'content',
                        payload: { idea, platform: 'instagram', emotionPreset: ['curiosity'], tone: 'Viral', language: 'en' }
                    })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error);
                setResults(prev => [...prev, { idea, post: data.text, status: 'success' }]);
            } catch (error) {
                setResults(prev => [...prev, { idea, post: '', status: 'error', error: error.message }]);
            }
        }
        setIsGenerating(false);
        showToast("Bulk generation complete!", "success");
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast("Post copied!", "success");
    };
    
    const progress = (results.length / ideas.length) * 100;

    return (
        <div id="bulk-generator" className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg space-y-6">
            <h2 className="font-sora text-2xl font-bold text-white">⚡ Bulk Post Generator</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                    <p className="text-gray-400 mb-2">Upload a CSV file with one content idea per line. The AI will generate a post for each idea.</p>
                    <label htmlFor="csv-upload" className="w-full text-center cursor-pointer bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-lg block border border-dashed border-white/30">
                        {fileName ? `✅ ${fileName}` : '📂 Click to upload CSV'}
                    </label>
                    <input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
                </div>
                <button onClick={handleGenerateAll} disabled={isGenerating || ideas.length === 0} className="w-full h-[48px] group relative inline-flex items-center justify-center px-6 py-3 font-bold text-black transition-all duration-300 bg-gradient-to-br from-accent-start to-accent-end rounded-xl shadow-lg hover:shadow-[0_0_25px_theme(colors.accent.start/0.8)] disabled:opacity-50 disabled:shadow-none">
                    {isGenerating ? 'Generating...' : `Generate ${ideas.length} Posts`}
                </button>
            </div>
            {isGenerating && (
                <div className="w-full bg-black/40 rounded-full h-2.5">
                    <motion.div className="bg-gradient-to-r from-accent-start to-accent-end h-2.5 rounded-full" style={{ width: `${progress}%` }}></motion.div>
                </div>
            )}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                <AnimatePresence>
                    {results.map((result, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-lg ${result.status === 'success' ? 'bg-black/20' : 'bg-red-900/50'}`}>
                            <p className="text-sm font-bold text-gray-400 mb-2">Idea: <span className="text-white">{result.idea}</span></p>
                            {result.status === 'success' ? (
                                <>
                                    <p className="whitespace-pre-wrap text-sm text-gray-300">{result.post}</p>
                                    <button onClick={() => handleCopy(result.post)} className="mt-2 text-xs flex items-center gap-1 hover:text-accent-start"><CopyIcon size={12}/> Copy</button>
                                </>
                            ) : (
                                <p className="text-sm text-red-300">Error: {result.error}</p>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BulkGenerator;