

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Founder from './components/Founder';
import WhoIsItFor from './components/WhoIsItFor';
import CTA from './components/CTA';
import Footer from './Footer';
import Background from './components/Background';
import Dashboard, { UserSettings } from './Dashboard';
import TermsPage from './components/pages/TermsPage';
import PrivacyPage from './components/pages/PrivacyPage';
import HelpPage from './components/pages/HelpPage';
import JetAcademyPage from './components/pages/JetAcademyPage';
import AppLayout from './components/layouts/AppLayout';
import JetTemplatesPage, { Template } from './components/pages/JetTemplatesPage';
import TrendsPage from './components/pages/TrendsPage';
import SettingsModal from './components/dashboard/SettingsModal';
import NicknameModal from './components/dashboard/NicknameModal';
import JetGuruPage from './components/pages/JetGuruPage';


const CursorGlow: React.FC = () => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 transition duration-300" style={{ background: `radial-gradient(600px at ${position.x}px ${position.y}px, rgba(45, 157, 255, 0.15), transparent 80%)`}}></div>
  );
}

export interface SelectedTrend {
  title: string;
  platform: string;
}

export type Page = 'landing' | 'dashboard' | 'terms' | 'privacy' | 'help' | 'academy' | 'templates' | 'trends' | 'jetguru';
export type ToastType = 'success' | 'error' | 'info' | 'milestone' | 'achievement';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

const ACHIEVEMENTS: { [key: string]: { name: string; description: string } } = {
    'first_save': { name: 'First Flight', description: 'Saved your first post.' },
    'librarian_10': { name: 'Librarian', description: 'Saved 10 posts.' },
    'trend_spotter_5': { name: 'Trend Spotter', description: 'Generated 5 posts from trends.' },
    'architect_5': { name: 'Framework Architect', description: 'Used 5 different templates.' },
    'guru_apprentice_5': { name: 'Guru\'s Apprentice', description: 'Used "Execute Refinements" 5 times.' },
    'streak_7': { name: '7-Day Streak', description: 'Maintained a 7-day creation streak.' },
    'polyglot_3': { name: 'Polyglot', description: 'Generated content in 3 different languages.' },
};


const Toast: React.FC<{ message: ToastMessage, onDismiss: (id: number) => void }> = ({ message, onDismiss }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(message.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [message.id, onDismiss]);
  
  const typeClasses = {
    success: { bg: 'bg-green-500/10', border: 'border-green-500/50', icon: '✅' },
    error: { bg: 'bg-red-500/10', border: 'border-red-500/50', icon: '🚨' },
    info: { bg: 'bg-blue-500/10', border: 'border-blue-500/50', icon: 'ℹ️' },
    milestone: { bg: 'bg-yellow-400/10', border: 'border-yellow-400/50', icon: '🥳' },
    achievement: { bg: 'bg-purple-500/10', border: 'border-purple-500/50', icon: '🏆' },
  }

  return (
    <motion.div
      layout={true}
      initial={{ opacity: 0, y: 50, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className={`relative w-full max-w-sm p-4 rounded-xl shadow-2xl border ${typeClasses[message.type].bg} ${typeClasses[message.type].border} text-white backdrop-blur-xl`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">{typeClasses[message.type].icon}</span>
        <p className="flex-1 text-sm font-medium">{message.message}</p>
        <button onClick={() => onDismiss(message.id)} className="p-1 text-gray-400 hover:text-white transition-colors">&times;</button>
      </div>
    </motion.div>
  );
};

const ToastContainer: React.FC<{ toasts: ToastMessage[], onDismiss: (id: number) => void }> = ({ toasts, onDismiss }) => (
  <div className="fixed bottom-5 right-5 z-[200] space-y-3">
    <AnimatePresence>
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast} onDismiss={onDismiss} />
      ))}
    </AnimatePresence>
  </div>
);

const App: React.FC = () => {
  const [page, setPage] = React.useState<Page>('landing');
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null);
  const [selectedTrend, setSelectedTrend] = React.useState<SelectedTrend | null>(null);
  const [isSettingsOpen, setSettingsOpen] = React.useState(false);
  const [isNicknameModalOpen, setNicknameModalOpen] = React.useState(false);

  const [settings, setSettings] = React.useState<UserSettings>(() => {
    const settingsKey = 'contentjet_settings_v2';
    const saved = localStorage.getItem(settingsKey);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Quick migration for users from older versions
            if (!('jetPoints' in parsed)) {
                parsed.jetPoints = 0;
                parsed.achievements = [];
                parsed.postsSaved = 0;
                parsed.trendsUsed = 0;
                parsed.templatesUsed = 0;
                parsed.refinementsUsed = 0;
                parsed.creationStreak = parsed.creationStreak || 0;
            }
            if ('level' in parsed) { // Remove old level property
                delete parsed.level;
            }
            return parsed;
        } catch (error) {
            console.error("Corrupted settings in localStorage. Clearing.", error);
            localStorage.removeItem(settingsKey);
        }
    }
    return {
        username: 'Creator',
        email: 'creator@contentjet.ai',
        aiStyle: 'Viral',
        creationStreak: 0,
        lastPostDate: '',
        jetPoints: 0,
        achievements: [],
        postsSaved: 0,
        trendsUsed: 0,
        templatesUsed: 0,
        refinementsUsed: 0,
    };
  });

  React.useEffect(() => {
    if (page === 'dashboard') {
      try {
        const saved = localStorage.getItem('contentjet_settings_v2');
        if (!saved || JSON.parse(saved).username === 'Creator') {
          const timer = setTimeout(() => {
            setNicknameModalOpen(true);
          }, 500);
          return () => clearTimeout(timer);
        }
      } catch (error) {
          console.error("Failed to check for nickname modal:", error);
      }
    }
  }, [page]);

  React.useEffect(() => {
    try {
        localStorage.setItem('contentjet_settings_v2', JSON.stringify(settings));
    } catch (error) {
        console.error("Failed to save settings to localStorage:", error);
    }
  }, [settings]);


  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    setToasts(prev => [...prev, { id: Date.now(), message, type }]);
  }, []);

  const addPoints = useCallback((amount: number, type: 'generate' | 'save' | 'refine' | 'template' | 'trend' | 'streak') => {
    setSettings(prev => {
        const newSettings = { ...prev };

        // 1. Add points
        newSettings.jetPoints += amount;

        // 2. Update counters for achievements
        if (type === 'save') newSettings.postsSaved += 1;
        if (type === 'refine') newSettings.refinementsUsed += 1;
        if (type === 'template') newSettings.templatesUsed += 1;
        if (type === 'trend') newSettings.trendsUsed += 1;

        // 3. Check for Achievements
        const newAchievements = [...newSettings.achievements];
        const unlockedAnAchievement = (id: string, name: string) => {
            if (!newAchievements.includes(id)) {
                newAchievements.push(id);
                showToast(`Achievement Unlocked: ${name}!`, 'achievement');
            }
        };

        if (newSettings.postsSaved >= 1) unlockedAnAchievement('first_save', ACHIEVEMENTS['first_save'].name);
        if (newSettings.postsSaved >= 10) unlockedAnAchievement('librarian_10', ACHIEVEMENTS['librarian_10'].name);
        if (newSettings.refinementsUsed >= 5) unlockedAnAchievement('guru_apprentice_5', ACHIEVEMENTS['guru_apprentice_5'].name);
        if (newSettings.templatesUsed >= 5) unlockedAnAchievement('architect_5', ACHIEVEMENTS['architect_5'].name);
        if (newSettings.trendsUsed >= 5) unlockedAnAchievement('trend_spotter_5', ACHIEVEMENTS['trend_spotter_5'].name);
        if (newSettings.creationStreak >= 7) unlockedAnAchievement('streak_7', ACHIEVEMENTS['streak_7'].name);

        newSettings.achievements = newAchievements;
        
        return newSettings;
    });
  }, [showToast]);

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const navigateTo = (pageName: Page) => {
    setPage(pageName);
    window.scrollTo(0, 0);
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    navigateTo('dashboard');
  };

  const handleTemplateUsed = () => {
    addPoints(15, 'template');
    setSelectedTemplate(null);
  }
  
  const handleSelectTrend = (trendData: SelectedTrend) => {
    setSelectedTrend(trendData);
    navigateTo('dashboard');
  };
  
  const handleTrendUsed = () => {
    addPoints(20, 'trend');
    setSelectedTrend(null);
  };

  React.useEffect(() => {
    const appPages: Page[] = ['dashboard', 'templates', 'trends', 'academy', 'jetguru'];
    if (appPages.includes(page)) {
      document.body.classList.add('dashboard-bg');
      document.body.classList.remove('bg-[#05050A]');
    } else {
      document.body.classList.remove('dashboard-bg');
      document.body.classList.add('bg-[#05050A]');
    }
  }, [page]);
  
  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    showToast("Settings saved!", 'success');
    setSettingsOpen(false);
  };

  const handleSaveNickname = (nickname: string) => {
    setSettings(prev => ({ ...prev, username: nickname }));
    showToast(`Welcome, ${nickname}! Your callsign is set.`, 'success');
    setNicknameModalOpen(false);
  }
  
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href')?.substring(1);
    if(targetId) {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderPage = () => {
    const appPages: Page[] = ['dashboard', 'templates', 'trends', 'academy', 'terms', 'privacy', 'help', 'jetguru'];
    if (appPages.includes(page)) {
      let content;
      switch (page) {
        case 'dashboard':
          content = <Dashboard 
            showToast={showToast} 
            selectedTemplate={selectedTemplate}
            onTemplateUsed={handleTemplateUsed}
            selectedTrend={selectedTrend}
            onTrendUsed={handleTrendUsed}
            settings={settings}
            onSettingsChange={setSettings}
            addPoints={addPoints}
          />;
          break;
        case 'templates':
          content = <JetTemplatesPage onSelectTemplate={handleSelectTemplate} />;
          break;
        case 'trends':
          content = <TrendsPage onSelectTrend={handleSelectTrend} />;
          break;
        case 'academy':
          content = <JetAcademyPage />;
          break;
        case 'jetguru':
            content = <JetGuruPage showToast={showToast} settings={settings} />;
            break;
        case 'terms':
          content = <TermsPage />;
          break;
        case 'privacy':
          content = <PrivacyPage />;
          break;
        case 'help':
          content = <HelpPage onNavigate={navigateTo} />;
          break;
        default:
          content = null;
      }
      return <AppLayout currentPage={page} onNavigate={navigateTo} onOpenSettings={() => setSettingsOpen(true)}>{content}</AppLayout>;
    }

    return (
      <>
        <Header onNavigate={navigateTo} onLinkClick={handleLinkClick} />
        <main>
          <Hero onNavigate={() => navigateTo('dashboard')} onLinkClick={handleLinkClick}/>
          <Features />
          <HowItWorks />
          <Testimonials />
          <Founder />
          <WhoIsItFor />
          <CTA onNavigate={() => navigateTo('dashboard')} />
        </main>
        <Footer onNavigate={navigateTo}/>
      </>
    );
  };

  return (
    <>
      <CursorGlow />
      <Background />
      <div className="relative z-10">
        {renderPage()}
      </div>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        settings={settings} 
        onSettingsChange={handleSaveSettings}
        achievementsData={ACHIEVEMENTS} 
      />
      <NicknameModal 
        isOpen={isNicknameModalOpen}
        onSave={handleSaveNickname}
      />
    </>
  );
}

export default App;
