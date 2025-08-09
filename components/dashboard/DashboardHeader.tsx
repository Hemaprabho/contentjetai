

import React, { useState } from 'react';
import MenuIcon from '../icons/MenuIcon';
import CloseIcon from '../icons/CloseIcon';
import SettingsIcon from '../icons/SettingsIcon';
import { Page } from '../../App';

interface DashboardHeaderProps {
    onNavigate: (page: Page) => void;
    onOpenSettings: () => void;
    currentPage: Page;
}

const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode; isActive: boolean; }> = ({ onClick, children, isActive }) => (
    <button onClick={onClick} className={`relative px-1 py-2 text-sm font-medium transition-colors duration-300 group cursor-pointer bg-transparent border-none ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
        {children}
        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent-start to-accent-end transition-transform origin-center duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
    </button>
);

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onNavigate, onOpenSettings, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigateAndClose = (page: Page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };
  
  const handleSettingsAndClose = () => {
    onOpenSettings();
    setIsMenuOpen(false);
  }

  const navItems: { page: Page; label: string }[] = [
      { page: 'dashboard', label: 'Dashboard' },
      { page: 'jetguru', label: 'JetGuru™' },
      { page: 'templates', label: 'Jet Templates' },
      { page: 'trends', label: 'Trends' },
      { page: 'academy', label: 'JetAcademy' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20 border-b border-white/10 backdrop-blur-xl bg-black/30 rounded-b-2xl px-6">
          <div className="flex items-center space-x-2">
             <button onClick={() => onNavigate('landing')} className="cursor-pointer" aria-label="Go to homepage">
                <h1 className="font-sora text-2xl font-bold bg-gradient-to-r from-accent-start to-accent-end bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: '200% auto' }}>
                  ContentJet AI
                </h1>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(item => (
                <NavLink key={item.page} onClick={() => onNavigate(item.page)} isActive={currentPage === item.page}>
                    {item.label}
                </NavLink>
            ))}
             <button onClick={onOpenSettings} className="text-gray-400 hover:text-white transition-colors" aria-label="Open settings">
                <SettingsIcon />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2" aria-label="Toggle menu">
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#05050A]/95 backdrop-blur-xl border-b border-white/10 animate-fade-in">
          <div className="flex flex-col items-center space-y-6 px-4 py-8">
            {navItems.map(item => (
                 <button key={item.page} onClick={() => handleNavigateAndClose(item.page)} className="text-gray-300 hover:text-white transition-colors duration-300 text-lg">
                    {item.label}
                </button>
            ))}
            <button onClick={handleSettingsAndClose} className="text-gray-300 hover:text-white transition-colors duration-300 text-lg">
                Settings
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
