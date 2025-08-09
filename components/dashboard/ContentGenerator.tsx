

import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CopyIcon from '../icons/CopyIcon';
import SaveIcon from '../icons/SaveIcon';
import YouTubeIcon from '../icons/YouTubeIcon';
import LinkedInIcon from '../icons/LinkedInIcon';
import TwitterIcon from '../icons/TwitterIcon';
import InstagramIcon from '../icons/InstagramIcon';
import BlogIcon from '../icons/BlogIcon';
import MicIcon from '../icons/MicIcon';
import SparklesIcon from '../icons/SparklesIcon';
import CloseIcon from '../icons/CloseIcon';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import { GuruData, UserSettings, SavedPost } from '../../Dashboard';
import { ToastType, SelectedTrend } from '../../App';
import { Template } from '../pages/JetTemplatesPage';

declare global {
    interface Window { SpeechRecognition?: new () => SpeechRecognition; webkitSpeechRecognition?: new () => SpeechRecognition; }
    interface SpeechRecognition extends EventTarget { continuous: boolean; interimResults: boolean; lang: string; start(): void; stop(): void; onresult: ((this: SpeechRecognition, ev: any) => any) | null; onerror: ((this: SpeechRecognition, ev: any) => any) | null; onend: ((this: SpeechRecognition, ev: Event) => any) | null; }
}

interface Variation {
    title: string;
    content: any;
    wordCount: number;
}

interface ContentGeneratorProps {
    onSavePost: (postData: { text: string, platform: string, tone: string, emotionPreset: string[], idea: string }) => void;
    onNewGuruData: (insights: GuruData | null) => void;
    onContentForAnalysis: (content: string | null) => void;
    settings: UserSettings;
    onSettingsChange: (settings: UserSettings) => void;
    showToast: (message: string, type?: ToastType) => void;
    editingPost: SavedPost | null;
    onClearEditing: () => void;
    selectedTemplate: Template | null;
    onTemplateUsed: () => void;
    selectedTrend: SelectedTrend | null;
    onTrendUsed: () => void;
    addPoints: (amount: number, type: 'generate' | 'save' | 'refine' | 'template' | 'trend' | 'streak') => void;
}

export interface ContentGeneratorHandles {
  triggerRefine: (contentToRefine: string, suggestions: string[]) => void;
}

const emotions = [ { key: 'fomo', label: '🔥 FOMO' }, { key: 'curiosity', label: '🧠 Curiosity' }, { key: 'humor', label: '😂 Humor' }, { key: 'empathy', label: '🥹 Empathy' }, { key: 'controversy', label: '💥 Controversy' }, { key: 'calm', label: '🧘 Calm' }, { key: 'motivation', label: '🎯 Motivation' }, { key: 'surprise', label: '😱 Surprise' }, { key: 'love', label: '🧡 Love' }, ];
const platforms = [ { key: 'youtube', label: 'YouTube', icon: YouTubeIcon }, { key: 'linkedin', label: 'LinkedIn', icon: LinkedInIcon }, { key: 'x', label: 'X (Twitter)', icon: TwitterIcon }, { key: 'instagram', label: 'Instagram', icon: InstagramIcon }, { key: 'blog', label: 'Blog', icon: BlogIcon }, ];
const tones = ['Viral', 'Relatable', 'Professional', 'Witty', 'Minimalist', 'Deep'];
const languages = [ { key: 'en', label: 'English' }, { key: 'hi', label: 'हिन्दी (Hindi)' }, { key: 'bn', label: 'বাংলা (Bengali)' }, { key: 'te', label: 'తెలుగు (Telugu)' }, { key: 'mr', label: 'मराठी (Marathi)' }, { key: 'ta', label: 'தமிழ் (Tamil)' }, { key: 'gu', label: 'ગુજરાતી (Gujarati)' }, { key: 'kn', label: 'ಕನ್ನಡ (Kannada)' }, { key: 'or', label: 'ଓଡ଼ିଆ (Odia)' }, { key: 'ml', label: 'മലയാളം (Malayalam)' }, { key: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' }, { key: 'ur', label: 'اردو (Urdu)' }, { key: 'as', label: 'অসমীয়া (Assamese)' }, { key: 'sa', label: 'संस्कृतम् (Sanskrit)' }, { key: 'es', label: 'Español' }, { key: 'fr', label: 'Français' }, ];

const sanitizeAIResponse = (htmlString: string): string => {
    if(!htmlString) return '';
    const sanitized = htmlString.replace(/<(?!\/?(strong|b|i|br)\b)[^>]*>/gi, '');
    return sanitized.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white/90">$1</strong>');
};

const escapeInput = (input: string): string => input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&#039;");

const useAutosizeTextArea = (textAreaRef: React.RefObject<HTMLTextAreaElement>, value: string) => {
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "0px";
            const scrollHeight = textAreaRef.current.scrollHeight;
            textAreaRef.current.style.height = scrollHeight + "px";
        }
    }, [textAreaRef, value]);
};

const PlatformCard = ({ icon: Icon, label, selected, onClick }) => ( <motion.button type="button" onClick={onClick} aria-pressed={selected} className={`group flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 w-full aspect-[4/3] sm:aspect-square focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-accent-start ${selected ? 'border-accent-start bg-accent-start/10 shadow-lg shadow-accent-start/20 animate-button-glow' : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10' }`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}> <div className="transition-transform duration-300 group-hover:scale-110"> <Icon size={32} className={`transition-colors ${selected ? 'text-accent-start' : 'text-gray-400 group-hover:text-white'}`}/> </div> <span className={`font-semibold text-sm text-center transition-colors ${selected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{label}</span> </motion.button> );
const EmotionChip = ({ children, selected, onClick }) => ( <motion.button type="button" onClick={onClick} aria-pressed={selected} className={`group px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-accent-start ${selected ? 'bg-gradient-to-r from-accent-start to-accent-end text-black border-transparent' : 'bg-white/5 border-white/20 hover:bg-white/10 text-gray-300'}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}> <span className="flex items-center gap-1.5"> <span className="transition-transform duration-200 group-hover:scale-125 group-hover:-rotate-12">{children.split(' ')[0]}</span> <span>{children.split(' ')[1]}</span> </span> </motion.button> );
const GeneratingIndicator = () => ( <div className="flex items-center justify-center space-x-1.5"> <span className="text-sm font-bold">Generating</span> <div className="flex items-end justify-center space-x-1 h-4"> <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span> <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span> <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span> </div> </div> );

const parseAIResponse = (text: string): Variation[] => {
    try {
        const data = JSON.parse(text);
        let wordCount = 100;
        if (data.script) wordCount = data.script.split(/\s+/).filter(Boolean).length;
        else if (data.body) wordCount = data.body.split(/\s+/).filter(Boolean).length;
        else if (data.caption) wordCount = data.caption.split(/\s+/).filter(Boolean).length;
        else if (data.threadTweets) wordCount = data.threadTweets.join(' ').split(/\s+/).filter(Boolean).length;
        else if (data.bodySections) wordCount = data.bodySections.map(s => s.content).join(' ').split(/\s+/).filter(Boolean).length;
        return [{ title: data.title || 'Generated Package', content: data, wordCount }];
    } catch (e) {
        const contentMatch = text.match(/(\*\*JETPOST™.*?\*\*\s*)?([\s\S]*)/);
        const content = contentMatch ? contentMatch[2].trim() : text.trim();
        if (!content) return [];
        return [{ title: 'JetPost™', content, wordCount: content.split(/\s+/).filter(Boolean).length }];
    }
};

const ContentSection = ({ title, children, isCollapsible = false }) => {
    const [isOpen, setIsOpen] = useState(!isCollapsible);
    const TitleComponent = isCollapsible ? 'button' : 'h4';
    return (
        <div className="space-y-2">
            <TitleComponent onClick={isCollapsible ? () => setIsOpen(!isOpen) : undefined} className="font-semibold text-accent-start flex justify-between items-center w-full text-left">
                {title}
                {isCollapsible && <motion.span animate={{ rotate: isOpen ? 0 : -90 }}><ChevronDownIcon size={16}/></motion.span>}
            </TitleComponent>
            <AnimatePresence>
            {isOpen && (
                <motion.div initial={isCollapsible ? {opacity: 0, height: 0} : false} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}} className="overflow-hidden">
                    {children}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};


const StructuredContentRenderer = ({ content, platform }) => {
    switch (platform) {
        case 'youtube':
            return <div className="space-y-6">
                <h3 className="font-sora text-xl font-bold text-white">🎬 {content.title}</h3>
                <ContentSection title="Hook (First 15s)"><p className="text-gray-300 italic">"{content.hook}"</p></ContentSection>
                <ContentSection title="Full Script" isCollapsible><div className="text-gray-300 whitespace-pre-wrap leading-relaxed p-3 bg-black/30 rounded-md max-h-60 overflow-y-auto">{content.script}</div></ContentSection>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ContentSection title="Thumbnail Ideas"><ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">{content.thumbnailIdeas?.map((idea, i) => <li key={i}>{idea}</li>)}</ul></ContentSection>
                    <ContentSection title="CTA & Hashtags"><p className="text-gray-300 text-sm"><strong>CTA:</strong> {content.cta}</p><div className="flex flex-wrap gap-2 text-sm">{content.hashtags?.map((tag, i) => <span key={i} className="bg-white/10 px-2 py-0.5 rounded-full text-gray-400">{tag}</span>)}</div></ContentSection>
                </div>
                <ContentSection title="SEO Description" isCollapsible><div className="text-gray-300 whitespace-pre-wrap leading-relaxed p-3 bg-black/30 rounded-md text-sm max-h-40 overflow-y-auto">{content.description}</div></ContentSection>
            </div>;
        case 'linkedin':
            return <div className="space-y-4">
                <h3 className="font-sora text-xl font-bold text-white">LinkedIn Post Package</h3>
                <ContentSection title="Hook"><p className="text-gray-300 italic">"{content.hook}"</p></ContentSection>
                <ContentSection title="Body"><div className="text-gray-300 whitespace-pre-wrap leading-relaxed p-3 bg-black/30 rounded-md">{content.body}</div></ContentSection>
                <ContentSection title="Call to Action"><p className="text-gray-300">{content.cta}</p></ContentSection>
                <ContentSection title="Suggested Visual"><p className="text-gray-400 text-sm">{content.suggestedVisual}</p></ContentSection>
            </div>;
        case 'x':
            return <div className="space-y-4 font-inter">
                 <h3 className="font-sora text-xl font-bold text-white">X (Twitter) Thread</h3>
                 <div className="space-y-3 p-3 bg-black/30 rounded-lg">
                    <p className="text-sm text-white">{content.hookTweet} <span className="text-gray-500">(1/?)</span></p>
                    {content.threadTweets?.map((tweet, i) => <p key={i} className="text-sm text-white pt-3 border-t border-white/10">{tweet} <span className="text-gray-500">({i+2}/?)</span></p>)}
                    <p className="text-sm text-white pt-3 border-t border-white/10">{content.finalTweet}</p>
                 </div>
                 <div className="flex flex-wrap gap-2 text-sm">{content.hashtags?.map((tag, i) => <span key={i} className="bg-white/10 px-2 py-0.5 rounded-full text-gray-400">{tag}</span>)}</div>
            </div>;
        case 'instagram':
             return <div className="space-y-6">
                <h3 className="font-sora text-xl font-bold text-white">Instagram Post Package</h3>
                <ContentSection title="Caption"><div className="text-gray-300 whitespace-pre-wrap leading-relaxed p-3 bg-black/30 rounded-md">{content.caption}</div></ContentSection>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ContentSection title="Hashtags"><div className="flex flex-wrap gap-2 text-sm">{content.hashtags?.map((tag, i) => <span key={i} className="bg-white/10 px-2 py-0.5 rounded-full text-gray-400">{tag}</span>)}</div></ContentSection>
                    <ContentSection title={`Visuals: ${content.visualType}`}><ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">{content.visualIdeas?.map((idea, i) => <li key={i}>{idea}</li>)}</ul></ContentSection>
                </div>
            </div>;
        case 'blog':
            return <div className="space-y-6">
                <h3 className="font-sora text-xl font-bold text-white">📝 {content.title}</h3>
                <ContentSection title="Meta Description"><p className="text-gray-400 text-sm italic">"{content.metaDescription}"</p></ContentSection>
                <ContentSection title="Introduction" isCollapsible><div className="text-gray-300 whitespace-pre-wrap leading-relaxed">{content.introduction}</div></ContentSection>
                <ContentSection title="Body Content" isCollapsible>
                    <div className="space-y-4">
                    {content.bodySections?.map((section, i) => <div key={i} className="pt-2"><h5 className="font-semibold text-white/80 mb-1">{section.heading}</h5><div className="text-gray-400 whitespace-pre-wrap text-sm">{section.content}</div></div>)}
                    </div>
                </ContentSection>
                <ContentSection title="Conclusion" isCollapsible><div className="text-gray-300 whitespace-pre-wrap leading-relaxed">{content.conclusion}</div></ContentSection>
                <ContentSection title="Suggested Featured Image"><p className="text-gray-400 text-sm">{content.suggestedImagePrompt}</p></ContentSection>
            </div>;
        default: return <div className="text-gray-300 whitespace-pre-wrap leading-relaxed space-y-2">{JSON.stringify(content, null, 2)}</div>
    }
}


const CustomToggle = ({ label, enabled, onChange }) => (
    <div>
        <label className="text-sm font-medium text-gray-300 block mb-2">{label}</label>
        <button
            type="button"
            aria-pressed={enabled}
            onClick={() => onChange(!enabled)}
            className={`flex h-7 w-14 items-center rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-accent-start ${enabled ? 'bg-gradient-to-r from-[#4f46e5] to-[#d946ef]' : 'bg-white/10'} ${enabled ? 'justify-end' : 'justify-start'}`}
        >
            <motion.div
                layout
                transition={{ type: 'spring', stiffness: 600, damping: 30 }}
                className="h-5 w-5 rounded-full bg-white shadow-lg"
            />
        </button>
    </div>
);
const CustomSelect = ({ label, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(o => o.key === value)?.label || value;
    return ( <div className="relative"> <label className="text-sm font-medium text-gray-300 block mb-2">{label}</label> <button type="button" onClick={() => setIsOpen(!isOpen)} className="relative w-full text-left p-3 bg-[#0c0c14] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-start transition-colors flex justify-between items-center"> <span>{selectedLabel}</span> <motion.div animate={{ rotate: isOpen ? 180 : 0 }}><ChevronDownIcon /></motion.div> </button> <AnimatePresence> {isOpen && ( <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-10 w-full mt-1 bg-[#1A1A2A] border border-white/20 rounded-lg shadow-lg max-h-60 overflow-y-auto"> {options.map(option => ( <button type="button" key={option.key} onClick={() => { onChange(option.key); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-accent-start/20"> {option.label} </button> ))} </motion.div> )} </AnimatePresence> </div> );
};


const ContentGenerator = forwardRef<ContentGeneratorHandles, ContentGeneratorProps>(({ onSavePost, onNewGuruData, onContentForAnalysis, settings, onSettingsChange, showToast, editingPost, onClearEditing, selectedTemplate, onTemplateUsed, selectedTrend, onTrendUsed, addPoints }, ref) => {
    const [isLoading, setIsLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<Variation[]>([]);
    const [form, setForm] = useState({ idea: '', emotionPreset: ['motivation', 'curiosity'], platform: settings.mostUsedPlatform || 'instagram', tone: settings.mostUsedTone || 'Viral', emotionEngine: true, viralSpike: true, language: 'en' });
    const ideaTextAreaRef = useRef<HTMLTextAreaElement>(null);
    useAutosizeTextArea(ideaTextAreaRef, form.idea);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const [trendingSparks, setTrendingSparks] = useState<string[]>([]);
    const [isLoadingSparks, setIsLoadingSparks] = useState(false);

    useEffect(() => {
        if (editingPost) {
            setForm(prev => ({ ...prev, idea: editingPost.idea, emotionPreset: editingPost.emotionPreset, platform: editingPost.platform, tone: editingPost.tone, }));
            setGeneratedContent([]); onNewGuruData(null);
        }
    }, [editingPost, onNewGuruData]);
    useEffect(() => {
        if (selectedTemplate) {
            const platformKeyMap = { 'LinkedIn': 'linkedin', 'X (Twitter)': 'x', 'Instagram': 'instagram', 'YouTube': 'youtube', 'Blog': 'blog' };
            setForm(prev => ({ ...prev, platform: platformKeyMap[selectedTemplate.platform] || 'instagram', tone: selectedTemplate.tone, emotionPreset: selectedTemplate.emotionPreset, idea: '', }));
            showToast(`Template "${selectedTemplate.title}" loaded!`, 'success');
        }
    }, [selectedTemplate, showToast]);
    useEffect(() => {
        if (selectedTrend) {
            setForm(prev => ({
                ...prev,
                idea: ``, // Clear idea for user input
                platform: selectedTrend.platform,
                tone: 'Viral', // Sensible default for trends
                emotionPreset: ['curiosity', 'fomo'], // Good defaults for trends
            }));
            showToast(`Trend context for "${platforms.find(p=>p.key === selectedTrend.platform)?.label}" loaded!`, 'success');
        }
    }, [selectedTrend]);
    const handleFormChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
    const handleEmotionToggle = (emotionKey) => { const newEmotions = form.emotionPreset.includes(emotionKey) ? form.emotionPreset.filter(e => e !== emotionKey) : [...form.emotionPreset, emotionKey]; handleFormChange('emotionPreset', newEmotions); };
    
    const getContentForAnalysis = (content, platform) => {
        if (typeof content !== 'object' || content === null) return content;
        switch (platform) {
            case 'youtube': return content.script;
            case 'linkedin': return content.body;
            case 'x': return [content.hookTweet, ...(content.threadTweets || []), content.finalTweet].join('\n');
            case 'instagram': return content.caption;
            case 'blog': return [content.introduction, ...(content.bodySections?.map(s => s.content) || [])].join('\n');
            default: return JSON.stringify(content);
        }
    };

    const getPerformanceInsights = async (content: string, platform: string) => {
        onNewGuruData(null);
        try {
            const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'insights', payload: { content, platform } }) });
            const insightsData = await response.json();
            if (!response.ok) { throw new Error(insightsData.error || "Failed to get insights from server."); }
            onNewGuruData(insightsData);
        } catch (error) { console.error("Error fetching performance insights:", error); showToast("Could not fetch AI analytics.", "error"); }
    };
    const handleGenerate = async (mode: 'generate' | 'refine' = 'generate', refinePayload?: {content: string, suggestions: string[]}) => {
        if (!form.idea && mode === 'generate' && !editingPost) { showToast("Please enter an idea to generate content.", "error"); return; }
        setIsLoading(true); setGeneratedContent([]); onNewGuruData(null); onContentForAnalysis(null);
        const apiPayload = mode === 'refine' ? { type: 'refine', payload: { ...refinePayload, platform: form.platform, tone: form.tone } } : { type: 'content', payload: { ...form, idea: escapeInput(form.idea), template: selectedTemplate?.content || null }};
        try { 
            const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(apiPayload) });
            const data = await response.json();
            if (!response.ok) { throw new Error(data.error || `API Request Failed (Status: ${response.status})`); }
            const parsedVariations = parseAIResponse(data.text);
            if(parsedVariations.length > 0) {
              setGeneratedContent(parsedVariations);
              addPoints(10, 'generate');
              const analysisContent = getContentForAnalysis(parsedVariations[0].content, form.platform);
              onContentForAnalysis(analysisContent);
              await getPerformanceInsights(analysisContent, form.platform);
            } else { throw new Error("AI returned an empty response."); }
        } catch (error) { console.error("Error during generation:", error); showToast(error.message || "An unknown error occurred.", "error");
        } finally { setIsLoading(false); if (selectedTemplate) onTemplateUsed(); if (selectedTrend) onTrendUsed(); }
    };
    useImperativeHandle(ref, () => ({ triggerRefine(contentToRefine, suggestions) { handleGenerate('refine', { content: contentToRefine, suggestions }); } }));
    const handleCopy = (text) => { navigator.clipboard.writeText(text); showToast("Copied to clipboard!", "success"); };
    const handleSave = (variation) => { const textToSave = typeof variation.content === 'string' ? variation.content : JSON.stringify(variation.content, null, 2); onSavePost({ text: textToSave, ...form }); };
    
    useEffect(() => {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognitionAPI) return;
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true; recognition.interimResults = true; recognition.lang = 'en-US';
        recognition.onresult = (event) => { let final_transcript = ''; for (let i = event.resultIndex; i < event.results.length; ++i) { if (event.results[i].isFinal) final_transcript += event.results[i][0].transcript; } setForm(prev => ({...prev, idea: prev.idea + final_transcript })); };
        recognition.onerror = (event) => { console.error('Speech recognition error', event.error); showToast(`Voice recognition error: ${event.error}`, "error"); setIsListening(false); };
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
        return () => recognitionRef.current?.stop();
    }, []);
    const handleToggleListen = () => { if (!recognitionRef.current) { showToast("Voice recognition not supported.", "error"); return; } if (isListening) recognitionRef.current.stop(); else recognitionRef.current.start(); setIsListening(!isListening); };
    const handleFetchSparks = async () => {
        setIsLoadingSparks(true); setTrendingSparks([]);
        try {
            const response = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'trending' }) });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to fetch trending sparks.");
            try { setTrendingSparks(JSON.parse(data.text)); } catch(parseError) { throw new Error("AI returned an unexpected format for trends."); }
        } catch (error) { showToast(error.message, "error"); } finally { setIsLoadingSparks(false); }
    };
    
    const contextBanner = selectedTemplate ? 
        { text: `Using Template: ${selectedTemplate.title}`, onClear: onTemplateUsed, color: "accent-start" } : 
        selectedTrend ? 
        { text: `Using Trend: ${selectedTrend.title}`, onClear: onTrendUsed, color: "accent-end" } : 
        null;

    return (
        <section id="content-generator" className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg space-y-6">
            <div className="flex justify-between items-center"><h2 className="font-sora text-2xl font-bold text-white">Jet Engine™</h2>{editingPost && <button onClick={onClearEditing} className="text-xs text-gray-400 hover:text-white flex items-center gap-1"><CloseIcon size={14} /> Cancel Edit</button>}</div>
            {contextBanner && <div className={`p-3 bg-${contextBanner.color}/10 border border-${contextBanner.color}/30 rounded-lg text-xs flex justify-between items-center`}><p className={`font-bold text-${contextBanner.color}`}>Using Trend: <span className="text-white">{contextBanner.text}</span></p><button onClick={contextBanner.onClear} className="text-gray-300 hover:text-white font-bold p-1 leading-none">&times; Clear</button></div>}
            <form onSubmit={(e) => { e.preventDefault(); handleGenerate('generate'); }} className="space-y-6">
                <div><label className="text-sm font-medium text-gray-300 block mb-2" htmlFor="userIdea">{selectedTemplate ? `Core concept for "${selectedTemplate.title}"?` : selectedTrend ? `Your angle on "${selectedTrend.title}"?` : "What is your post about?"}</label><div className="group relative"><div className="absolute -inset-px bg-gradient-to-r from-accent-start to-accent-end rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div><textarea ref={ideaTextAreaRef} id="userIdea" value={form.idea} onChange={(e) => handleFormChange('idea', e.target.value)} className="relative w-full min-h-[96px] resize-none overflow-hidden p-3 bg-[#0c0c14] border border-white/20 rounded-lg focus:outline-none focus:border-transparent transition placeholder:text-gray-500" placeholder={selectedTemplate ? "e.g., Importance of daily walks" : selectedTrend ? `My take is that...` : "e.g., How Gen Z is monetizing without a 9-5"} required></textarea><button type="button" onClick={handleToggleListen} className={`absolute bottom-2 right-2 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'}`}><MicIcon size={16} /></button></div></div>
                <div><div className="flex items-center justify-between mb-2"><label className="text-sm font-medium text-gray-300">Inspiration</label><button type="button" onClick={handleFetchSparks} disabled={isLoadingSparks} className="flex items-center gap-1.5 text-xs text-accent-start hover:text-accent-end disabled:opacity-50"> <SparklesIcon size={14}/> {isLoadingSparks ? "Fetching..." : "Trending Sparks"} </button></div>{trendingSparks.length > 0 && <div className="space-y-1.5">{trendingSparks.map((spark, i) => <button type="button" key={i} onClick={() => handleFormChange('idea', spark)} className="block w-full text-left p-2 text-xs bg-black/20 rounded-md hover:bg-black/40 text-gray-400">{spark}</button>)}</div>}</div>
                <div><label className="text-sm font-medium text-gray-300 block mb-2">Emotions to trigger?</label><div className="flex flex-wrap gap-2">{emotions.map(e => <EmotionChip key={e.key} selected={form.emotionPreset.includes(e.key)} onClick={() => handleEmotionToggle(e.key)}>{e.label}</EmotionChip>)}</div></div>
                <div><label className="text-sm font-medium text-gray-300 block mb-2">Platform</label><div className="grid grid-cols-3 sm:grid-cols-5 gap-2">{platforms.map(p => <PlatformCard key={p.key} icon={p.icon} label={p.label} selected={form.platform === p.key} onClick={() => handleFormChange('platform', p.key)} />)}</div></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><CustomSelect label="Tone & Style" options={tones.map(t => ({key: t, label: t}))} value={form.tone} onChange={v => handleFormChange('tone', v)} /><CustomSelect label="Language" options={languages} value={form.language} onChange={v => handleFormChange('language', v)} /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"><CustomToggle label="Emotion Engine™" enabled={form.emotionEngine} onChange={v => handleFormChange('emotionEngine', v)} /><CustomToggle label="Viral Signal Spike™" enabled={form.viralSpike} onChange={v => handleFormChange('viralSpike', v)} /></div>
                <button type="submit" disabled={isLoading} className="w-full h-[48px] group relative inline-flex items-center justify-center px-6 py-3 font-bold text-black transition-all duration-300 bg-gradient-to-br from-accent-start to-accent-end rounded-xl shadow-lg hover:shadow-[0_0_25px_theme(colors.accent.start/0.8),0_0_35px_theme(colors.accent.end/0.6)] transform hover:scale-105 active:scale-100 disabled:opacity-50 disabled:shadow-none disabled:hover:scale-100">{isLoading ? <GeneratingIndicator /> : editingPost ? '✨ Refine Post' : '🚀 Generate Now'}</button>
            </form>
            <AnimatePresence>
                {generatedContent.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="mt-6 pt-6 border-t border-white/10 space-y-4">
                        {generatedContent.map((variation, index) => (
                             <div key={index} className="p-4 bg-black/20 rounded-lg">
                                {typeof variation.content === 'string' ? <div className="text-gray-300 whitespace-pre-wrap leading-relaxed space-y-2" dangerouslySetInnerHTML={{ __html: sanitizeAIResponse(variation.content) }}/> : <StructuredContentRenderer content={variation.content} platform={form.platform} />}
                                <div className="flex items-center gap-2 mt-4 text-xs">
                                    <button onClick={() => handleCopy(typeof variation.content === 'string' ? variation.content : JSON.stringify(variation.content, null, 2))} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-md hover:bg-white/20 transition-colors"><CopyIcon size={14} /> Copy</button>
                                    <button onClick={() => handleSave(variation)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-md hover:bg-white/20 transition-colors"><SaveIcon size={14} /> Save</button>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
});

export default ContentGenerator;