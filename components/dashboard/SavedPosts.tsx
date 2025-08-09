import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CopyIcon from '../icons/CopyIcon';
import DeleteIcon from '../icons/DeleteIcon';
import RewriteIcon from '../icons/RewriteIcon';
import { SavedPost } from '../../Dashboard';
import { ToastType } from '../../App';

const platformLabelMap = {
    'youtube': 'YouTube Shorts',
    'linkedin': 'LinkedIn',
    'x': 'X (Twitter)',
    'instagram': 'Instagram',
    'blog': 'Blog'
};

const filterButtons = [ { key: 'All', label: 'All' }, { key: 'instagram', label: 'Instagram' }, { key: 'x', label: 'X (Twitter)' }, { key: 'linkedin', label: 'LinkedIn' }, { key: 'youtube', label: 'YouTube' }, { key: 'blog', label: 'Blog' }, ];

const SavedPosts: React.FC<{ posts: SavedPost[], onDelete: (id: number) => void, onRefine: (post: SavedPost) => void, showToast: (message: string, type?: ToastType) => void }> = ({ posts, onDelete, onRefine, showToast }) => {
    const [filter, setFilter] = React.useState('All');
    const [expandedPostId, setExpandedPostId] = React.useState<number | null>(null);

    const filteredPosts = posts.filter(p => filter === 'All' || p.platform === filter);
    
    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        showToast("Post copied to clipboard!", "success");
    }

    const toggleExpand = (id: number) => {
        setExpandedPostId(expandedPostId === id ? null : id);
    }

    return (
        <section id="saved-posts" className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h2 className="font-sora text-2xl font-bold text-white">🗃️ My Content Library</h2>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-400">Filter by:</span>
                     {filterButtons.map(p => ( <button key={p.key} onClick={() => setFilter(p.key)} className={`px-3 py-1 text-xs rounded-full transition-transform transform active:scale-95 ${filter === p.key ? 'bg-accent-start text-black font-semibold' : 'bg-white/10 text-gray-300'}`}> {p.label} </button> ))}
                </div>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                <AnimatePresence>
                    {filteredPosts.length > 0 ? filteredPosts.map(post => (
                        <motion.div key={post.id} layout={true} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }} className="p-4 bg-black/20 rounded-lg">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <span className="text-xs font-bold text-accent-start bg-accent-start/10 px-2 py-0.5 rounded-full">{platformLabelMap[post.platform] || post.platform}</span>
                                    <p className="mt-2 text-sm text-gray-300 whitespace-pre-wrap">{post.text}</p>
                                    <p className="mt-2 text-xs text-gray-500">Last updated: {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                                <div className="flex-shrink-0 flex items-center gap-1">
                                    <button onClick={() => onRefine(post)} aria-label="Refine post" className="p-2 rounded-full hover:bg-white/10 transition-colors"><RewriteIcon size={16} /></button>
                                    <button onClick={() => handleCopy(post.text)} aria-label="Copy post text" className="p-2 rounded-full hover:bg-white/10 transition-colors"><CopyIcon size={16} /></button>
                                    <button onClick={() => onDelete(post.id)} aria-label="Delete post" className="p-2 rounded-full hover:bg-white/10 text-red-400 hover:text-red-500 transition-colors"><DeleteIcon size={16} /></button>
                                </div>
                            </div>
                            {post.versionHistory && post.versionHistory.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-white/10">
                                    <button onClick={() => toggleExpand(post.id)} className="text-xs text-gray-400 hover:text-white">
                                        Version History ({post.versionHistory.length}) {expandedPostId === post.id ? '▲' : '▼'}
                                    </button>
                                    <AnimatePresence>
                                    {expandedPostId === post.id && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3 mt-2 pl-4 border-l-2 border-white/10">
                                            {post.versionHistory.slice().reverse().map((version, index) => (
                                                <div key={index} className="text-xs p-2 bg-black/30 rounded-md">
                                                     <p className="text-gray-500 mb-1">Version from {new Date(version.date).toLocaleString()}</p>
                                                     <p className="text-gray-400 whitespace-pre-wrap">{version.text}</p>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>
                    )) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 py-8 px-4">
                            <p className="font-semibold text-lg">Your library is waiting!</p>
                            <p>Let's create your first viral post to save here. 🚀</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default SavedPosts;