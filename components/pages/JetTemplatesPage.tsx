import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import YouTubeIcon from '../icons/YouTubeIcon';
import LinkedInIcon from '../icons/LinkedInIcon';
import TwitterIcon from '../icons/TwitterIcon';
import InstagramIcon from '../icons/InstagramIcon';
import BlogIcon from '../icons/BlogIcon';
import SparklesIcon from '../icons/SparklesIcon';

export interface Template {
    platform: 'LinkedIn' | 'X (Twitter)' | 'Instagram' | 'YouTube' | 'Blog';
    title: string;
    description: string;
    content: string;
    tone: string;
    emotionPreset: string[];
}

const templates: Template[] = [
  // LinkedIn Templates
  {
    platform: 'LinkedIn',
    title: 'The Contrarian’s Gambit',
    description: 'Invalidate a common belief to create instant psychological tension. This formula is designed for authority and debate.',
    content: `Everyone thinks you need [Common Belief] to succeed in [Industry/Topic].\n\nThey're wrong.\n\nFor years, I followed this advice. The result? Burnout and zero progress.\n\nThen I discovered a simple truth: [Your Contrarian Truth].\n\nThe moment I applied it, everything changed.\n→ [Result 1, e.g., "My revenue doubled in 30 days."]\n→ [Result 2, e.g., "I got 2 hours of my day back."]\n→ [Result 3, e.g., "I finally felt in control."]\n\nStop trying to [Common Action]. Start [Your Recommended Action].\n\nWhat's a piece of "common wisdom" you've learned to ignore?`,
    tone: 'Viral',
    emotionPreset: ['controversy', 'curiosity'],
  },
  {
    platform: 'LinkedIn',
    title: 'The "Vulnerable Win" Arc',
    description: 'Builds deep trust by architecting a story of struggle before revealing a success. Uses the peak-end rule to make the win more memorable.',
    content: `It was [Month/Year], and I was ready to quit.\n\nI was facing [Describe a difficult situation or struggle in detail]. I felt [Specific Negative Emotion]. My confidence was shattered.\n\nMost people in this situation would [Common, but unhelpful reaction].\n\nBut I did something different. I decided to [One Specific, Counter-intuitive Action I Took].\n\nIt wasn't easy. I failed multiple times. But every day, I focused on [Describe the small, daily process].\n\nAnd last week, it finally happened: [The Big Win / Accomplishment].\n\nThe biggest lesson? Your biggest struggles are the gateway to your biggest breakthroughs.\n\nDon't give up. You're closer than you think.`,
    tone: 'Relatable',
    emotionPreset: ['empathy', 'motivation'],
  },
  {
    platform: 'LinkedIn',
    title: 'The Data-Backed Insight',
    description: 'Establish ultimate authority by presenting a unique insight supported by data, a survey, or an experiment you ran.',
    content: `I analyzed [Number] of [Data Points, e.g., "startup landing pages"].\n\nThe results shocked me.\n\n[Percentage]% of them make the same critical mistake: [The Common Mistake].\n\nBut the top 1% all do this one thing differently: [The Uncommon Solution].\n\nHere's the 3-step breakdown of how they do it:\n1. [Step 1 with detail]\n2. [Step 2 with detail]\n3. [Step 3 with detail]\n\nLesson: Stop guessing. Start using data.\n\nWhat's the most surprising data point you've seen recently?`,
    tone: 'Professional',
    emotionPreset: ['surprise', 'curiosity'],
  },
  {
    platform: 'LinkedIn',
    title: 'The Quick Tip Carousel',
    description: 'A highly skimmable and shareable format that teaches something valuable in a few short steps.',
    content: `How to [Achieve Desired Outcome] in 5 minutes.\n\nA quick guide for busy professionals:\n\n1. The Problem: Start by defining the common pain point. Don't waste time.\n\n2. The Mistake: Point out the wrong way most people try to solve it.\n\n3. The Fix: Provide your simple, actionable solution. Make it sound easy.\n\n4. The Tool: Recommend one tool or resource that simplifies the process.\n\n5. The Next Step: End with a question to drive engagement.\n\nWhat's your favorite productivity hack?`,
    tone: 'Professional',
    emotionPreset: ['motivation', 'curiosity'],
  },
  
  // X (Twitter) Templates
  {
    platform: 'X (Twitter)',
    title: 'The High-Signal Thread Hook',
    description: 'A proven formula to kick off a viral thread by creating a knowledge gap and promising high-value information.',
    content: `I'm about to teach you 10 years of [Skill/Topic] in the next 2 minutes.\n\nSteal my entire framework... 🧵`,
    tone: 'Viral',
    emotionPreset: ['fomo', 'curiosity'],
  },
  {
    platform: 'X (Twitter)',
    title: 'The "Unfair Advantage" Listicle',
    description: 'Leverages authority bias by curating "secret" resources, making readers feel like they are gaining an edge.',
    content: `99% of people in [Your Industry] are using the wrong tools.\n\nHere are 5 AI tools that feel like an unfair advantage:\n\n1. [Tool 1] - [What it does in a "secret" way]\n2. [Tool 2] - [What it does in a "secret" way]\n3. [Tool 3] - [What it does in a "secret" way]\n4. [Tool 4] - [What it does in a "secret" way]\n5. [Tool 5] - [What it does in a "secret" way]\n\nBookmark this. Your productivity will thank you.`,
    tone: 'Viral',
    emotionPreset: ['fomo', 'surprise'],
  },
  {
    platform: 'X (Twitter)',
    title: 'The "Mistake I Made" Hook',
    description: 'Vulnerability builds trust faster than anything. Share a failure and the lesson learned.',
    content: `I lost $[Amount] making this one mistake in [Area/Industry].\n\nSo you don't have to:\n\n[Explain mistake simply]\n\nThe lesson: [Your key takeaway]\n\nA painful lesson, but a valuable one.`,
    tone: 'Relatable',
    emotionPreset: ['empathy', 'surprise'],
  },
    {
    platform: 'X (Twitter)',
    title: 'The Problem/Agitate/Solve Hook',
    description: 'A classic copywriting formula that grabs attention by twisting the knife on a pain point before offering the solution.',
    content: `Problem: You want to [Goal], but you're struggling with [Pain Point].\n\nIt's frustrating. You feel like you're [Negative Feeling].\n\nSolution: A simple 3-step system.\n\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]\n\nWorks every time.`,
    tone: 'Witty',
    emotionPreset: ['motivation', 'empathy'],
  },

  // Instagram Templates
  {
    platform: 'Instagram',
    title: 'The "Save This" Listicle Reel',
    description: 'A highly shareable and save-able format for a Reel. The caption is as important as the video.',
    content: `Don't make these 3 [Topic] mistakes! ❌\n\nI see so many people struggling with [Pain Point]. It usually comes down to these three things:\n\n1️⃣ **[Mistake 1]:** Instead, you should [Solution 1]. This small change makes a huge difference because [Reason].\n\n2️⃣ **[Mistake 2]:** A better way is to [Solution 2]. This works so well for [Specific benefit].\n\n3️⃣ **[Mistake 3]:** The pro move is to [Solution 3]. You'll see [Positive outcome] almost immediately.\n\nDid any of these surprise you? Let me know in the comments!\n\nDon't forget to SAVE this post for later! ❤️\n\n#[YourNiche] #[TopicHashtag] #[ValueHashtag]`,
    tone: 'Viral',
    emotionPreset: ['surprise', 'motivation'],
  },
  {
    platform: 'Instagram',
    title: 'The "Open Loop" Carousel',
    description: 'A caption structure that creates an "open loop," forcing users to swipe through your carousel to get the answer.',
    content: `This is the #1 mistake I see creators make. ⬇️\n\n(Don't let it be you).\n\nSWIPE to see the mistake... and the fix. 👉\n\nIt's so easy to fall into the trap of [Common Misconception]. But the hard truth is, [Surprising Truth].\n\nThis is what the top 1% do instead:\n✅ [Tip 1 - The "Why"]\n✅ [Tip 2 - The "How"]\n✅ [Tip 3 - The "What Now"]\n\nWas this helpful? Save this post for your next brilliant idea & share it with another creator. ❤️\n\n#Hashtag1 #Hashtag2`,
    tone: 'Relatable',
    emotionPreset: ['curiosity', 'fomo'],
  },
  {
    platform: 'Instagram',
    title: 'The Relatable "This or That"',
    description: 'A simple but highly engaging format that gets your audience commenting and sharing their own preferences.',
    content: `It's time to settle the great debate. 👇\n\nWhen it comes to [Your Topic], are you Team A or Team B?\n\n🅰️ **[Option A]:** [Brief, compelling description of Option A]. People who choose this are usually [Personality Trait].\n\n🅱️ **[Option B]:** [Brief, compelling description of Option B]. This is the go-to for people who value [Different Value].\n\nThere's no wrong answer, but I'm team [Your Team] all the way. 😉\n\nWhat about you? Vote in the comments! ⬇️\n\n#[ThisOrThat] #[YourNiche] #[CommunityBuilding]`,
    tone: 'Witty',
    emotionPreset: ['humor', 'curiosity'],
  },
   {
    platform: 'Instagram',
    title: 'The "Behind The Scenes" Story',
    description: 'Build connection by showing the unpolished reality behind your success or creative process.',
    content: `A lot of you see the finished [Product/Result], but you don't see the messy middle.\n\nHere’s what it *really* looked like creating [Project Name]:\n\n chaotic desks\n endless coffee cups\n moments of self-doubt\n and one big breakthrough.\n\nIt's not always glamorous, but it's always worth it.\n\nWhat's one "messy middle" moment you're proud of? Share below!\n\n#[BehindTheScenes] #[CreatorLife] #[TheProcess]`,
    tone: 'Relatable',
    emotionPreset: ['empathy', 'love'],
  },

  // YouTube Templates
  {
    platform: 'YouTube',
    title: 'The SEO-Optimized Description',
    description: 'A structure for your video description that pleases both the algorithm and human viewers.',
    content: `► In this video, I reveal how to [Video's Main Goal/Promise]. If you've ever struggled with [Pain Point 1] or [Pain Point 2], this video is your solution.\n\n[Optional: Briefly summarize the top 3 things they will learn]\n\n✅ [Your Main Call-to-Action, e.g., "Get my free guide here: LINK"]\n\nCHAPTERS:\n00:00 - The Big Problem You're Facing\n01:30 - Why Most Solutions Fail\n03:45 - My 3-Step Solution\n07:15 - The #1 Mistake to Avoid\n09:00 - Your Action Plan\n\n// MORE RESOURCES\n- [Link to related video or blog post]\n- [Link to a tool you mentioned]\n\n// LET'S CONNECT\n- Instagram: [Your Handle]\n- Twitter: [Your Handle]\n\n#Keyword1 #Keyword2 #Keyword3`,
    tone: 'Professional',
    emotionPreset: ['curiosity', 'motivation'],
  },
  {
    platform: 'YouTube',
    title: 'The "Open Loop" Script Hook',
    description: 'The first 15 seconds of your video script, designed to create an inescapable open loop and maximize viewer retention.',
    content: `In the next 5 minutes, I'm going to show you a method that [Achieves Incredible Result]. But this method comes with a warning: if you do step 3 wrong, it can actually [Negative Consequence]. Stick with me, and I'll show you exactly how to do it right.`,
    tone: 'Viral',
    emotionPreset: ['fomo', 'curiosity'],
  },
  {
    platform: 'YouTube',
    title: 'Community Tab Engagement Poll',
    description: 'A simple poll to spark conversation and gather audience data on your Community Tab.',
    content: `QUICK QUESTION for my next video...\n\nWhat are you struggling with MOST right now when it comes to [Your Niche]?\n\nA) [Common Problem 1]\nB) [Common Problem 2]\nC) [Common Problem 3]\nD) Something else (tell me in the comments!)\n\nYour feedback directly helps me create better content for you! 🙏`,
    tone: 'Relatable',
    emotionPreset: ['curiosity', 'love'],
  },

  // Blog Templates
  {
    platform: 'Blog',
    title: 'The "Ultimate Guide" Intro',
    description: 'The introduction for a pillar content piece that establishes authority and hooks the reader for a long article.',
    content: `If you've ever wondered how to [Achieve Major Goal], you're in the right place.\n\nThis isn't just another blog post. This is the last guide you'll ever need to read on [Your Topic].\n\nMost articles on this topic will tell you to just "[Oversimplified Advice]". That's terrible advice, and it's why so many people fail.\n\nIn this comprehensive guide, we'll go deeper. We'll cover:\n- The hidden psychology behind [Topic].\n- A step-by-step framework you can implement today.\n- The exact tools and templates used by the pros.\n\nLet's get started.`,
    tone: 'Professional',
    emotionPreset: ['curiosity', 'motivation'],
  },
  {
    platform: 'Blog',
    title: 'The "Problem, Agitate, Solve" Intro',
    description: 'A classic copywriting formula to hook the reader by deeply connecting with their pain point before offering the solution.',
    content: `Let's be honest: [Stating the reader's problem] is incredibly frustrating.\n\nYou've probably tried [Common Solution 1] and [Common Solution 2], only to end up feeling [Negative Emotion] and no closer to your goal.\n\nIt can feel like you're stuck in a loop, watching everyone else succeed while you're left behind.\n\nWhat if I told you there's a different way? A simple, counter-intuitive approach that can help you [Achieve Desired Outcome] faster than you ever thought possible.\n\nIn this post, I'll break down that exact system.`,
    tone: 'Relatable',
    emotionPreset: ['empathy', 'motivation'],
  },
  {
    platform: 'Blog',
    title: 'The "Mistakes to Avoid" Listicole Intro',
    description: 'An introduction that uses loss aversion to create an immediate need to read the rest of the article.',
    content: `Everyone wants to succeed at [Your Topic]. But the road to success is paved with costly mistakes.\n\nAfter working with hundreds of [Your Target Audience], I've seen every mistake in the book. And a few of them are absolutely devastating, capable of setting you back months or even years.\n\nIn this article, I’m pulling back the curtain on the 7 most common (and dangerous) mistakes people make when trying to [Achieve Goal].\n\nAvoiding just one of these could be the difference between failure and a massive breakthrough. Let's make sure you're on the right side of that equation.`,
    tone: 'Viral',
    emotionPreset: ['fomo', 'surprise'],
  },
];

const platformMap = {
  'LinkedIn': { icon: LinkedInIcon, color: 'hover:border-blue-400' },
  'X (Twitter)': { icon: TwitterIcon, color: 'hover:border-gray-400' },
  'Instagram': { icon: InstagramIcon, color: 'hover:border-pink-500' },
  'YouTube': { icon: YouTubeIcon, color: 'hover:border-red-500' },
  'Blog': { icon: BlogIcon, color: 'hover:border-green-400' },
};


interface JetTemplatesPageProps {
  onSelectTemplate: (template: Template) => void;
}

const TemplateCard: React.FC<{ template: Template; onSelect: () => void }> = ({ template, onSelect }) => {
  const PlatformIcon = platformMap[template.platform].icon;
  const hoverColor = platformMap[template.platform].color;
  
  return (
    <motion.div 
        layout={true}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="group relative flex flex-col p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg transition-all duration-300 hover:bg-white/10 hover:shadow-2xl"
    >
        <div className="flex-grow">
            <h3 className="font-sora text-xl font-bold text-white">{template.title}</h3>
            <p className="mt-2 text-sm text-gray-400 leading-relaxed">{template.description}</p>
        </div>
        <div className="mt-6 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-accent-start bg-accent-start/10 px-2 py-1 rounded-full">{template.tone}</span>
                <span className="font-bold text-xs text-gray-300 bg-white/5 px-2 py-1 rounded-full capitalize">{template.emotionPreset[0]}</span>
            </div>
             <button 
                onClick={onSelect}
                className="group/button relative inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-black transition-all duration-300 bg-gradient-to-br from-accent-start to-accent-end rounded-lg shadow-md hover:shadow-lg hover:shadow-accent-start/50 transform hover:-translate-y-0.5 active:translate-y-0"
             >
               Use Template
            </button>
        </div>
    </motion.div>
  )
}

const JetTemplatesPage: React.FC<JetTemplatesPageProps> = ({ onSelectTemplate }) => {
    const platforms = ['LinkedIn', 'X (Twitter)', 'Instagram', 'YouTube', 'Blog'];
    const [activePlatform, setActivePlatform] = React.useState(platforms[0]);

    const filteredTemplates = templates.filter(t => t.platform === activePlatform);

    return (
        <div className="animate-fade-in">
             <div className="text-center">
                <h1 className="font-sora text-4xl md:text-5xl font-extrabold text-white">🚀 Jet Templates Arsenal</h1>
                <p className="mt-3 max-w-2xl mx-auto text-gray-400">Stop guessing. Start winning. These are not just 'templates'; they are battle-tested, psychologically-driven frameworks engineered for virality. Select a framework, and the Jet Engine™ will instantly reconfigure to match its DNA.</p>
            </div>

            <div className="flex justify-center flex-wrap gap-2 my-10 sticky top-20 z-20 py-2 bg-[#0f0c29]/50 backdrop-blur-md rounded-xl">
                {platforms.map(p => (
                    <button 
                        key={p} 
                        onClick={() => setActivePlatform(p)}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 transform active:scale-95 ${activePlatform === p ? 'bg-accent-start text-black shadow-lg shadow-accent-start/50' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
                    >
                        {p}
                    </button>
                ))}
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                 <AnimatePresence mode="wait">
                    {filteredTemplates.map((template) => (
                        <TemplateCard key={template.title + template.platform} template={template} onSelect={() => onSelectTemplate(template)} />
                    ))}
                 </AnimatePresence>
            </div>
            
             {filteredTemplates.length === 0 && (
                 <div className="text-center py-20 text-gray-500">
                    <p className="font-sora text-2xl">Coming Soon!</p>
                    <p>Our engineers are crafting new viral frameworks for {activePlatform}.</p>
                </div>
            )}
        </div>
    );
};

export default JetTemplatesPage;