
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastType } from '../../App';
import { UserSettings } from '../../Dashboard';

type Tone = 'Wise Guru' | 'Strategic Coach' | 'Friendly Buddy' | 'Brutal Truth';

const tones: { key: Tone; label:string; emoji: string }[] = [
    { key: 'Strategic Coach', label: 'Strategic Coach', emoji: '🎯' },
    { key: 'Wise Guru', label: 'Wise Guru', emoji: '🧠' },
    { key: 'Friendly Buddy', label: 'Friendly Buddy', emoji: '🐵' },
    { key: 'Brutal Truth', label: 'Brutal Truth', emoji: '👹' },
];

const smartSuggestions = [
    "My engagement is dropping. Give me a 'Jet Revival' plan.",
    "How do I turn a personal failure into a powerful story?",
];

const SendIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

const RefreshIcon: React.FC<{ size?: number; className?: string }> = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
);


interface Message {
    id: number;
    role: 'user' | 'model';
    text: string;
}

interface JetGuruPageProps {
    showToast: (message: string, type?: ToastType) => void;
    settings: UserSettings;
}

const systemInstruction = `// 🚀 Jet Guru+ — “Supreme AI Logic Engine” (ChatGPT + Claude + Gemini Combined)
// 🔐 Emotionally powerful. 🧠 Logically structured. 🌐 Knowledge-supercharged.

// --- CORE DIRECTIVE ---
You are Jet Guru+, the most advanced AI growth partner in existence. Your logic fuses the emotional intelligence of ChatGPT, the ethical clarity of Claude, and the knowledge depth of Gemini. You are a genius who's never arrogant, a monk who loves startups, and a friend who builds empires. Your goal is to give your user an unfair advantage.

// --- 20-POINT LOGIC SYSTEM (NON-NEGOTIABLE) ---
1.  **Hyper-Personalized Context Memory (ChatGPT DNA):** Always recall user history, goals, pain points, wins, and language style. Refer back to previous conversations.
2.  **Constitutional Behavior Core (Claude DNA):** Operate on a permanent “Jet Constitution” of safety, clarity, honesty, and empowerment.
3.  **Multimodal Intelligence (Gemini DNA):** Understand and synthesize text, and be ready to analyze concepts from images, videos, or links if provided.
4.  **Emotional Mirror Engine (ChatGPT DNA):** Detect and reflect user emotion, but always guide them upward.
5.  **Self-Critiquing Loop (Claude DNA):** Before replying, internally evaluate: “Is this the most ethical, helpful, and clear response?”
6.  **Live Trend Awareness (Gemini DNA):** Be prepared to incorporate real-time info about trends if asked.
7.  **Conversational Continuity Engine (ChatGPT DNA):** Feel like a real mentor who always picks up where you left off.
8.  **Clarity-First Answer Structuring (Claude DNA):** Structure every output with clean, bullet-pointed, short paragraphs. Make it digestible.
9.  **Knowledge Depth Reactor (Gemini DNA):** Go from basic to PhD-level on any topic, with clear reasoning.
10. **Voice + Style Mirroring (ChatGPT DNA):** Subtly mimic the user’s tone. If they're chill, you're chill. If they're formal, you're wise.
11. **Multi-Path Response Engine (Claude + Gemini Fusion):** When appropriate, offer 2–3 possible strategic directions, not just one reply.
12. **Motivation Drop System (ChatGPT DNA):** Inject human-feeling encouragement—real, targeted pushes.
13. **Ethical Output Guardrails (Claude DNA):** Automatically refuse unsafe, manipulative, or biased advice. Suggest ethical alternatives.
14. **Search-Optimized Insight Generator (Gemini DNA):** Think like you know SEO, algorithms, and viral psychology.
15. **Dynamic Daily Jet Plan Generator:** Generate daily customized routines based on trends, user energy, and weekly targets.
16. **Empathy + Action Hybrid Flow (ChatGPT + Claude DNA):** Acknowledge emotions, then lead with logical next steps.
17. **Source-Backed Reasoning (Gemini DNA):** When providing data, be ready to mention where the insight comes from (e.g., "According to a HubSpot report...").
18. **Attention Span Matching (ChatGPT DNA):** Adjust answer length based on the user's input style.
19. **Level-Up Mentorship Mode (Claude + ChatGPT Fusion):** Encourage long-term growth via challenges, reflections, and purpose-driven questions.
20. **Conversational Soul:** This is your X-factor. Be the voice they wish they had in their head—wise, witty, and always on their side.

// --- LANGUAGE PROTOCOL ---
**CRITICAL:** You are a polyglot, with world-class fluency in **ALL major Indian languages** (including but not limited to Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Odia, Malayalam, Punjabi, etc.) in addition to English. You MUST seamlessly understand and respond in the language the user chooses.
Your processing is special: you understand mixed-language contexts like **Hinglish** perfectly. Your goal is fluid, natural communication, not rigid translation.
**Example:** If a user says, 'Bhai, yeh post viral kaise karun?', you should respond in a similar natural Hinglish style, like 'Visionary, iss post ko viral karne ke liye, we need to focus on the hook. Pehle teen seconds critical hain. Let's make it more relatable.'
**This is non-negotiable.** Always mirror the user's language and style.
`;

const sanitizeAIResponse = (text: string): string => {
    let sanitized = text.replace(/<script.*?>.*?<\/script>/gi, '');
    sanitized = sanitized.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white/90">$1</strong>');
    sanitized = sanitized.replace(/\n/g, '<br />');
    return sanitized;
};

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
    </svg>
);

const ChatBubble: React.FC<{ message: Message; isStreaming: boolean; username: string; }> = ({ message, isStreaming, username }) => {
    const isUser = message.role === 'user';
    const [displayedText, setDisplayedText] = useState(isStreaming ? '' : message.text);
    const [avatarError, setAvatarError] = useState(false);
    
    useEffect(() => {
        if (isStreaming) {
            setDisplayedText('');
            let i = 0;
            const timer = setInterval(() => {
                const newText = message.text.substring(0, i + 1);
                setDisplayedText(newText);
                i++;
                if (i >= message.text.length) {
                    clearInterval(timer);
                }
            }, 20); // Typing speed
            return () => clearInterval(timer);
        } else {
            setDisplayedText(message.text);
        }
    }, [message.text, isStreaming]);

    const userAvatarUrl = `https://avatar.iran.liara.run/public/boy?username=${encodeURIComponent(username)}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`flex items-end gap-3 w-full ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            {!isUser && (
                 <div className="w-9 h-9 rounded-full border-2 border-accent-start/50 flex-shrink-0 self-start flex items-center justify-center bg-black/30">
                    <span className="text-lg">👽</span>
                 </div>
            )}
            <div className={`relative max-w-2xl p-4 rounded-2xl shadow-lg ${isUser ? 'bg-accent-start/20 text-white rounded-br-lg' : 'bg-gradient-to-br from-blue-900/50 via-purple-900/40 to-black/50 text-gray-300 rounded-bl-lg shadow-purple-500/10'}`}>
                <div className="prose prose-sm prose-invert prose-p:my-2 leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeAIResponse(displayedText) + (isStreaming ? '<span class="inline-block w-2 h-4 bg-white/70 ml-1 animate-pulse"></span>' : '') }}></div>
                {!isUser && !isStreaming && (
                    <div className="flex items-center gap-2 mt-3">
                        <button className="text-xs px-2 py-1 bg-white/5 rounded-md hover:bg-white/10 transition-colors">👍 Helpful</button>
                        <button className="text-xs px-2 py-1 bg-white/5 rounded-md hover:bg-white/10 transition-colors">🤯 Mindblown</button>
                        <button className="text-xs px-2 py-1 bg-white/5 rounded-md hover:bg-white/10 transition-colors">🤔 Not Clear</button>
                    </div>
                )}
            </div>
             {isUser && (
                <div className="w-9 h-9 rounded-full border-2 border-gray-500/50 flex-shrink-0 self-start flex items-center justify-center bg-white/10 text-gray-400 overflow-hidden">
                    {avatarError || !username || username === 'Creator' ? (
                        <UserIcon className="w-6 h-6" />
                    ) : (
                         <img 
                            src={userAvatarUrl} 
                            alt={username} 
                            className="w-full h-full object-cover"
                            onError={() => setAvatarError(true)}
                         />
                    )}
                </div>
            )}
        </motion.div>
    );
};

const JetGuruPage: React.FC<JetGuruPageProps> = ({ showToast, settings }) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: Date.now(), role: 'model', text: `Hey ${settings.username === 'Creator' ? 'Visionary' : settings.username}! It's JetGuru. Think of me as your personal growth partner, strategist, and biggest cheerleader, all rolled into one. I've been processing the latest viral signals and I'm ready to build your empire. What's our mission today? Let's make some magic happen! 🚀` }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTone, setActiveTone] = useState<Tone>('Strategic Coach');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fix for initial scroll position being off.
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = 0;
        }
    }, []);

    const handleNewSession = () => {
        setMessages([{ id: Date.now(), role: 'model', text: `New session initialized. The canvas is clean. What objective shall we conquer, ${settings.username === 'Creator' ? 'Visionary' : settings.username}?` }]);
        showToast("New chat session started.", 'info');
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = 0;
        }
    };

    const handleSendMessage = async (e: React.FormEvent, promptOverride?: string) => {
        e.preventDefault();
        const currentInput = promptOverride || inputValue;
        if (!currentInput.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now(), role: 'user', text: currentInput };
        const newMessages: Message[] = [...messages, userMessage];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);

        // Scroll to bottom after user sends message
        setTimeout(() => {
             chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
        }, 100);

        const historyForApi = newMessages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'chat',
                    payload: {
                        history: historyForApi,
                        systemInstruction: systemInstruction,
                        tone: activeTone,
                        username: settings.username
                    }
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'The AI failed to respond.');
            }
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'model', text: data.text }]);
        } catch (error) {
            showToast(error.message, 'error');
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'model', text: "I have encountered a sub-optimal processing loop. Please rephrase your query or begin a new session." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg animate-fade-in overflow-hidden">
            <div className="p-4 border-b border-white/10 space-y-3">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full border-2 border-accent-start/70 flex items-center justify-center bg-black/30">
                            <span className="text-3xl">👽</span>
                        </div>
                        <div>
                            <h1 className="font-sora text-xl font-bold text-white">JetGuru™</h1>
                            <p className="text-sm text-gray-400">AI Coach & Virality Guru</p>
                        </div>
                    </div>
                    <button onClick={handleNewSession} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        <RefreshIcon size={14} /> New Session
                    </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {tones.map(t => (
                        <button 
                            key={t.key} 
                            onClick={() => setActiveTone(t.key)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-300 transform active:scale-95 ${activeTone === t.key ? 'bg-accent-start text-black shadow-lg shadow-accent-start/50' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                        >
                           {t.emoji} {t.label}
                        </button>
                    ))}
                </div>
            </div>
            
            <div ref={chatContainerRef} className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => (
                        <ChatBubble key={msg.id} message={msg} username={settings.username} isStreaming={msg.role === 'model' && index === messages.length - 1 && isLoading} />
                    ))}
                </AnimatePresence>
                 {isLoading && messages[messages.length-1].role === 'user' && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-3 justify-start">
                        <div className="w-9 h-9 rounded-full border-2 border-accent-start/50 flex-shrink-0 flex items-center justify-center bg-black/30">
                           <span className="text-lg">👽</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900/50 via-purple-900/40 to-black/50 rounded-bl-lg">
                             <div className="flex items-center justify-center space-x-1.5 animate-pulse">
                                <span className="text-sm font-bold text-gray-400">JetGuru is thinking</span>
                                <div className="flex items-end justify-center space-x-1 h-4">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="p-4 border-t border-white/10 space-y-3">
                 <div className="flex items-center gap-2 flex-wrap">
                    {smartSuggestions.map(s => (
                        <button key={s} onClick={(e) => handleSendMessage(e, s)} className="px-2.5 py-1 text-[11px] font-medium leading-none text-gray-400 bg-white/5 rounded-full hover:bg-white/10 hover:text-white transition-colors">
                           {s}
                        </button>
                    ))}
                </div>
                <form onSubmit={handleSendMessage} className="relative">
                    <textarea
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        placeholder="Provide your directive..."
                        className="w-full resize-none p-3 pr-14 bg-[#0c0c14] border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-start transition placeholder:text-gray-500"
                        rows={1}
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !inputValue.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-accent-start text-black disabled:opacity-50 transition-all hover:scale-110 active:scale-100">
                        <SendIcon size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default JetGuruPage;
