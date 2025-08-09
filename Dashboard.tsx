

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import WelcomeHeader from './components/dashboard/WelcomeHeader';
import ContentGenerator, { ContentGeneratorHandles } from './components/dashboard/ContentGenerator';
import SavedPosts from './components/dashboard/SavedPosts';
import PerformanceInsights from './components/dashboard/PerformanceInsights';
import BulkGenerator from './components/dashboard/BulkGenerator';
import { ToastType, SelectedTrend } from './App';
import { Template } from './components/pages/JetTemplatesPage';

export interface SavedPost {
    id: number;
    platform: string;
    tone: string;
    emotionPreset: string[];
    idea: string;
    text: string;
    date: string;
    versionHistory: { text: string; date: string }[];
}

export interface GuruData {
    viralScore: number;
    emotionalAccuracy: number;
    platformOptimization: number;
    readability: number;
    shareability: number;
    quotableLine: string;
    suggestions: string[];
    howToPost: string;
}

export interface UserSettings {
    username: string;
    email: string;
    aiStyle: string;
    lastPostDate?: string;
    creationStreak: number;
    jetPoints: number;
    achievements: string[];
    // Achievement counters
    postsSaved: number;
    trendsUsed: number;
    templatesUsed: number;
    refinementsUsed: number;
    mostUsedPlatform?: string;
    mostUsedTone?: string;
}

interface DashboardProps {
    showToast: (message: string, type?: ToastType) => void;
    selectedTemplate: Template | null;
    onTemplateUsed: () => void;
    selectedTrend: SelectedTrend | null;
    onTrendUsed: () => void;
    settings: UserSettings;
    onSettingsChange: (settings: UserSettings) => void;
    addPoints: (amount: number, type: 'generate' | 'save' | 'refine' | 'template' | 'trend' | 'streak') => void;
}

type DashboardTab = 'single' | 'bulk';

const MILESTONES = [10, 25, 50, 100, 200];

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' }
  }
};

const Dashboard: React.FC<DashboardProps> = ({ showToast, selectedTemplate, onTemplateUsed, selectedTrend, onTrendUsed, settings, onSettingsChange, addPoints }) => {
    const [activeTab, setActiveTab] = React.useState<DashboardTab>('single');
    
    const [savedPosts, setSavedPosts] = React.useState<SavedPost[]>(() => {
        const postsKey = 'contentjet_saved_posts';
        const saved = localStorage.getItem(postsKey);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (error) {
                console.error("Corrupted saved posts in localStorage. Clearing.", error);
                localStorage.removeItem(postsKey);
            }
        }
        return [];
    });
    
    const [guruData, setGuruData] = React.useState<GuruData | null>(null);
    const [contentForAnalysis, setContentForAnalysis] = React.useState<string | null>(null);
    const generatorRef = React.useRef<ContentGeneratorHandles>(null);
    const [editingPost, setEditingPost] = React.useState<SavedPost | null>(null);
    
    React.useEffect(() => {
        if (selectedTemplate || selectedTrend) {
            setActiveTab('single');
            const generatorElement = document.getElementById('content-generator');
            if (generatorElement) {
                generatorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [selectedTemplate, selectedTrend]);
    
    React.useEffect(() => {
        try {
            localStorage.setItem('contentjet_saved_posts', JSON.stringify(savedPosts));
        } catch (error) {
            console.error("Failed to save posts to localStorage:", error);
        }
    }, [savedPosts]);
    
    const handleNewGuruData = (data: GuruData | null) => {
        setGuruData(data);
    };

    const handleSavePost = (postData: { text: string; platform: string; tone: string; emotionPreset: string[]; idea: string; }) => {
        if (editingPost) {
            setSavedPosts(prev => prev.map(p => {
                if (p.id === editingPost.id) {
                    const updatedHistory = [...p.versionHistory, { text: p.text, date: p.date }];
                    return { ...p, ...postData, date: new Date().toISOString(), versionHistory: updatedHistory };
                }
                return p;
            }));
            showToast("Post refined and saved!", "success");
            addPoints(50, 'refine'); // Points for refining an existing post
            setEditingPost(null);
        } else {
            const newPost: SavedPost = {
                id: Date.now(),
                ...postData,
                date: new Date().toISOString(),
                versionHistory: []
            };
            
            const previousPostCount = savedPosts.length;
            setSavedPosts(prev => [newPost, ...prev]);
            addPoints(25, 'save');

            const newPostCount = previousPostCount + 1;
            if (MILESTONES.includes(newPostCount)) {
                showToast(`🥳 You just created your ${newPostCount}th post! Keep up the amazing work!`, 'milestone');
            }

            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            
            const newStreak = settings.lastPostDate !== today
                    ? (settings.lastPostDate === yesterday ? (settings.creationStreak || 0) + 1 : 1)
                    : (settings.creationStreak || 1);

            if (newStreak > settings.creationStreak) {
                addPoints(newStreak * 10, 'streak');
                if (newStreak > 1) {
                    showToast(`🔥 ${newStreak}-day creation streak! You're on fire!`, 'milestone');
                }
            }

            onSettingsChange({
                ...settings,
                lastPostDate: today,
                creationStreak: newStreak,
            });

            showToast("Post saved to your library!", "success");
        }
    };
    
    const handleDeletePost = (id: number) => {
        setSavedPosts(posts => posts.filter(p => p.id !== id));
        showToast("Post deleted.", "info");
    };

    const handleRefinePost = (post: SavedPost) => {
        setEditingPost(post);
        setActiveTab('single');
        const generatorElement = document.getElementById('content-generator');
        if (generatorElement) {
            generatorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        showToast("Editing mode activated. Let's refine this post!", 'info');
    }
    
    const handleRefine = () => {
        if(generatorRef.current && contentForAnalysis && guruData) {
            addPoints(50, 'refine');
            generatorRef.current.triggerRefine(contentForAnalysis, guruData.suggestions);
            showToast("Auto-Refining post based on AI suggestions...", "info");
        }
    };
    
    const postsThisWeekCount = savedPosts.filter(p => {
        const postDate = new Date(p.date);
        const today = new Date();
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(today.getDate() - 7);
        return postDate >= oneWeekAgo;
    }).length;

    return (
        <div className="space-y-16">
            <WelcomeHeader 
                settings={settings}
                postsThisWeekCount={postsThisWeekCount}
            />
            
            <div className="flex justify-center border-b border-white/10 mb-8">
                <button onClick={() => setActiveTab('single')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'single' ? 'text-white border-b-2 border-accent-start' : 'text-gray-400 hover:text-white'}`}>Single Post</button>
                <button onClick={() => setActiveTab('bulk')} className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'bulk' ? 'text-white border-b-2 border-accent-start' : 'text-gray-400 hover:text-white'}`}>Bulk Generator</button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'single' ? (
                        <div className="space-y-12">
                            <motion.div
                                id="content-generator-wrapper"
                                variants={sectionVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.1 }}
                            >
                                <ContentGenerator 
                                    ref={generatorRef}
                                    onSavePost={handleSavePost}
                                    onNewGuruData={handleNewGuruData}
                                    onContentForAnalysis={setContentForAnalysis}
                                    settings={settings}
                                    onSettingsChange={onSettingsChange}
                                    showToast={showToast}
                                    editingPost={editingPost}
                                    onClearEditing={() => setEditingPost(null)}
                                    selectedTemplate={selectedTemplate}
                                    onTemplateUsed={onTemplateUsed}
                                    selectedTrend={selectedTrend}
                                    onTrendUsed={onTrendUsed}
                                    addPoints={addPoints}
                                />
                            </motion.div>
                            
                             <AnimatePresence>
                                {guruData && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -50 }}
                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                    >
                                        <PerformanceInsights 
                                            guruData={guruData} 
                                            onRefine={handleRefine}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>
                    ) : (
                        <BulkGenerator showToast={showToast} />
                    )}
                </motion.div>
            </AnimatePresence>
            
            <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
            >
                <SavedPosts 
                    posts={savedPosts} 
                    onDelete={handleDeletePost} 
                    onRefine={handleRefinePost}
                    showToast={showToast} 
                />
            </motion.div>
        </div>
    );
};

export default Dashboard;
