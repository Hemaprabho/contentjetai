

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, Customized } from 'recharts';
import YouTubeIcon from '../icons/YouTubeIcon';
import LinkedInIcon from '../icons/LinkedInIcon';
import TwitterIcon from '../icons/TwitterIcon';
import InstagramIcon from '../icons/InstagramIcon';
import SparklesIcon from '../icons/SparklesIcon';
import { SelectedTrend } from '../../App';


interface Trend {
    title: string;
    summary: string;
}

interface Source {
    web: {
        uri: string;
        title: string;
    }
}

interface TrendData {
    trends: Trend[];
    sources: Source[];
}

interface TrendsPageProps {
    onSelectTrend: (trendData: SelectedTrend) => void;
}

const platforms = [
    { key: 'General', label: 'General', icon: SparklesIcon },
    { key: 'youtube', label: 'YouTube', icon: YouTubeIcon },
    { key: 'x', label: 'X (Twitter)', icon: TwitterIcon },
    { key: 'instagram', label: 'Instagram', icon: InstagramIcon },
    { key: 'linkedin', label: 'LinkedIn', icon: LinkedInIcon },
];

const TrendPulseMeter: React.FC<{ value: number }> = ({ value }) => {
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    const { color, emoji, glowColor } = useMemo(() => {
        if (value > 85) return { color: '#5be4ff', emoji: '🚀', glowColor: 'rgba(91, 228, 255, 0.7)' }; // Fast Rise
        if (value > 60) return { color: '#e96aff', emoji: '🔥', glowColor: 'rgba(233, 106, 255, 0.7)' }; // Medium Heat
        return { color: '#a8b2d1', emoji: '📈', glowColor: 'rgba(168, 178, 209, 0.7)' }; // Steady
    }, [value]);

    return (
        <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="absolute w-full h-full" viewBox="0 0 80 80">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <circle
                    className="text-black/20"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="40"
                    cy="40"
                />
                <motion.circle
                    strokeWidth="8"
                    stroke={color}
                    fill="transparent"
                    r={radius}
                    cx="40"
                    cy="40"
                    style={{ strokeDasharray: circumference, strokeDashoffset: offset, transformOrigin: 'center', filter: 'url(#glow)', boxShadow: `0 0 20px ${glowColor}` }}
                    rotate={-90}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </svg>
            <span className="text-3xl z-10">{emoji}</span>
        </div>
    );
};

const TrendChart: React.FC<{ velocity: number }> = ({ velocity }) => {
    const data = useMemo(() => {
        const points = [];
        let lastScore = 50 + (Math.random() - 0.5) * 20;
        const timestamps = [-24, -20, -16, -12, -8, -4, 0];

        for (const time of timestamps) {
            let newScore = lastScore + (Math.random() - 0.5) * 15;
            if (time >= -8) {
                const trendFactor = (velocity - 50) / 7;
                newScore += trendFactor * Math.abs(time / 4) * (Math.random() * 0.5 + 0.5);
            }
            newScore = Math.max(10, Math.min(95, newScore));
            points.push({ time: `${time === 0 ? 'Now' : time + 'h'}`, score: Math.round(newScore) });
            lastScore = newScore;
        }
        return points;
    }, [velocity]);
    
    const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string; }) => {
        if (active && payload && payload.length) {
            const currentIndex = data.findIndex(d => d.time === label);
            const prevScore = currentIndex > 0 ? data[currentIndex - 1].score : payload[0].value;
            const change = payload[0].value - prevScore;
            const changePercent = prevScore !== 0 ? ((change / prevScore) * 100).toFixed(0) : 0;

            return (
                <div className="p-3 bg-black/70 backdrop-blur-sm border border-white/20 rounded-lg text-sm shadow-lg">
                    <p className="label text-gray-400">{`Time: ${label}`}</p>
                    <p className="intro text-white font-bold">{`Trend Score: ${payload[0].value}`}</p>
                    <p className={`text-xs font-semibold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {change >= 0 ? '▲' : '▼'} {Math.abs(change)} ({changePercent}%)
                    </p>
                </div>
            );
        }
        return null;
    };
    
    const PulsingDot = (props) => {
        const { cx, cy, payload } = props;
        const lastDataPoint = data[data.length - 1];
        if (payload.time === lastDataPoint.time) {
            return (
                <g>
                    <circle cx={cx} cy={cy} r="9" fill="url(#lineGradient)" fillOpacity="0.3" className="animate-pulse" />
                    <circle cx={cx} cy={cy} r="4" fill="#fff" stroke="url(#lineGradient)" strokeWidth={2} />
                </g>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={150}>
            <LineChart data={data} margin={{ top: 15, right: 30, left: 0, bottom: 5 }}>
                <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#5be4ff" />
                        <stop offset="100%" stopColor="#e96aff" />
                    </linearGradient>
                     <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5be4ff" stopOpacity={0.4}/>
                        <stop offset="100%" stopColor="#e96aff" stopOpacity={0.05}/>
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 11 }} dy={10} />
                <YAxis dataKey="score" axisLine={false} tickLine={false} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Area type="monotone" dataKey="score" stroke="none" fill="url(#areaGradient)" />
                <Line type="monotone" dataKey="score" stroke="url(#lineGradient)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} style={{ filter: 'url(#glow)' }} />
                <Customized component={<PulsingDot />} />
            </LineChart>
        </ResponsiveContainer>
    );
};


const TrendCard: React.FC<{ trend: Trend; velocity: number; platform: {key: string, label: string, icon: React.FC<any>}; sources: Source[], onGenerate: () => void }> = ({ trend, velocity, platform, sources, onGenerate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const PlatformIcon = platform.icon;

    return (
        <motion.div
            layout={true}
            transition={{ duration: 0.4, type: "spring" }}
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-2xl bg-gradient-to-br from-white/10 to-transparent transition-all duration-300 hover:from-accent-start hover:to-accent-end cursor-pointer"
            whileHover={{ y: -5, scale: 1.02 }}
        >
            <div className="bg-[#0A0A10] rounded-[15px] p-6 space-y-4">
                <motion.div layout="position" className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <PlatformIcon className="text-gray-400 w-5 h-5" />
                            <span className="text-sm font-semibold text-gray-400">{platform.label}</span>
                        </div>
                        <h3 className="font-sora text-xl font-bold text-white">{trend.title}</h3>
                    </div>
                    <TrendPulseMeter value={velocity} />
                </motion.div>

                <AnimatePresence>
                    {isOpen && (
                         <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                         >
                            <p className="mt-2 text-sm text-gray-300 leading-relaxed">{trend.summary}</p>
                            
                            <div className="my-4">
                                <p className="text-xs font-semibold text-gray-300 mb-1">24H Trend Velocity</p>
                                <div className="bg-black/30 rounded-lg">
                                    <TrendChart velocity={velocity} />
                                </div>
                            </div>
                            
                            {sources.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-300 mb-2">Top Sources</p>
                                    <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                                    {sources.slice(0, 3).map((source, index) => (
                                        source.web?.uri && <a href={source.web.uri} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} key={index} className="block text-xs text-gray-500 hover:text-accent-start truncate transition-colors bg-black/20 px-2 py-1 rounded-md">🔗 {source.web.title || new URL(source.web.uri).hostname}</a>
                                    ))}
                                    </div>
                                </div>
                            )}

                             <motion.button 
                                onClick={(e) => { e.stopPropagation(); onGenerate(); }}
                                className="w-full mt-6 group relative inline-flex items-center justify-center px-6 py-2.5 font-bold text-black transition-all duration-300 bg-gradient-to-br from-accent-start to-accent-end rounded-xl shadow-lg shadow-accent-start/30 hover:shadow-accent-end/40 transform hover:scale-105 active:scale-100"
                            >
                                ✨ Generate Post with This Trend
                            </motion.button>
                         </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const TrendsPage: React.FC<TrendsPageProps> = ({ onSelectTrend }) => {
    const [activePlatform, setActivePlatform] = useState('General');
    const [trendsData, setTrendsData] = useState<TrendData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const fetchTrends = async () => {
            setIsLoading(true);
            setError(null);
            setTrendsData(null);
            try {
                const response = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'trends_analyzer', payload: { platform: activePlatform } }),
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch trends.');
                }
                setTrendsData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrends();
    }, [activePlatform, refreshKey]);
    
    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    }

    return (
        <div className="animate-fade-in">
             <div className="text-center">
                <h1 className="font-sora text-4xl md:text-5xl font-extrabold text-white">📈 JetTrends</h1>
                <p className="mt-3 max-w-2xl mx-auto text-gray-400">Your live market analyzer. We use Google's real-time search data to give you a strategic edge, turning viral waves into your content opportunities.</p>
            </div>

            <div className="sticky top-20 z-20 py-2 my-10 bg-[#0f0c29]/50 backdrop-blur-md rounded-xl flex flex-col sm:flex-row items-center justify-center gap-4">
                 <div className="flex justify-center flex-wrap gap-2">
                    {platforms.map(p => {
                        const Icon = p.icon;
                        return (
                            <button 
                                key={p.key} 
                                onClick={() => setActivePlatform(p.key)}
                                className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 transform active:scale-95 ${activePlatform === p.key ? 'bg-accent-start text-black shadow-lg shadow-accent-start/50' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                            >
                                <Icon size={16} />
                                <span>{p.label}</span>
                            </button>
                        )
                    })}
                </div>
                <button onClick={handleRefresh} disabled={isLoading} className="text-xs text-gray-400 hover:text-white disabled:opacity-50 flex items-center gap-1.5">
                    <svg className={isLoading ? 'animate-spin' : ''} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L20.5 10"/></svg>
                    {isLoading ? 'Analyzing...' : 'Refresh'}
                </button>
            </div>

            <div>
                {isLoading && (
                    <div className="text-center py-10">
                        <div className="inline-block w-8 h-8 border-4 border-dashed rounded-full animate-spin border-accent-start"></div>
                        <p className="mt-4 text-gray-400">Analyzing live trends for {activePlatform}...</p>
                    </div>
                )}
                {error && <p className="text-center text-red-400">Error: {error}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                    {trendsData?.trends.map((trend, index) => {
                        const platform = platforms.find(p => p.key === activePlatform) || platforms[0];
                        return(
                            <TrendCard 
                                key={trend.title + index} 
                                trend={trend} 
                                velocity={95 - (index * 10)} 
                                platform={platform}
                                sources={trendsData.sources}
                                onGenerate={() => onSelectTrend({ title: trend.title, platform: platform.key })}
                            />
                        )
                    })}
                    </AnimatePresence>
                </div>

                {trendsData && trendsData.trends.length === 0 && !isLoading && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="font-sora text-2xl">Analysis Complete</p>
                        <p>No major trends detected for "{activePlatform}" at this moment. Try refreshing or a different platform.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrendsPage;
