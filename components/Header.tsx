

import React, { useState } from 'react';
import MenuIcon from './icons/MenuIcon';
import CloseIcon from './icons/CloseIcon';
import { Page } from '../App';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onLinkClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkAndCloseMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onLinkClick(e);
    setIsMenuOpen(false);
  };
  
  const handleNavigateAndCloseMenu = (page: Page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-20 border-b border-white/10 backdrop-blur-xl bg-black/30 rounded-b-2xl px-6">
          <div className="flex items-center space-x-2">
            <button onClick={() => onNavigate('landing')} className="cursor-pointer" aria-label="Go to homepage">
                <h1 className="font-sora text-2xl font-bold bg-gradient-to-r from-accent-start to-accent-end bg-clip-text text-transparent animate-gradient" style={{ backgroundSize: '200% auto' }}>
                  ContentJet AI
                </h1>
            </button>
            <span className="bg-gradient-to-r from-accent-start to-accent-end text-black font-bold text-xs px-2 py-0.5 rounded-full">
              BETA
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" onClick={onLinkClick} className="text-sm text-gray-300 hover:text-white transition-colors duration-300">Features</a>
            <button onClick={() => onNavigate('templates')} className="text-sm text-gray-300 hover:text-white transition-colors duration-300">Templates</button>
            <button onClick={() => onNavigate('trends')} className="text-sm text-gray-300 hover:text-white transition-colors duration-300">Trends</button>
            <button onClick={() => onNavigate('terms')} className="text-sm text-gray-300 hover:text-white transition-colors duration-300">Terms</button>
            <button onClick={() => onNavigate('privacy')} className="text-sm text-gray-300 hover:text-white transition-colors duration-300">Privacy</button>
            <button onClick={() => onNavigate('help')} className="text-sm text-gray-300 hover:text-white transition-colors duration-300">Help</button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="group relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-medium text-white transition-all duration-300 bg-[#1A1A1A] rounded-lg shadow-lg hover:shadow-accent-start/50"
            >
              <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-300 ease-out bg-gradient-to-br from-accent-start to-accent-end group-hover:w-full group-hover:h-full"></span>
              <span className="relative text-sm">🚀 Launch App</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2" aria-label="Toggle menu">
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#05050A]/95 backdrop-blur-xl border-b border-white/10 animate-fade-in">
          <div className="flex flex-col items-center space-y-6 px-4 py-8">
            <a href="#features" onClick={handleLinkAndCloseMenu} className="text-gray-300 hover:text-white transition-colors duration-300 text-lg">Features</a>
            <button onClick={() => handleNavigateAndCloseMenu('templates')} className="text-gray-300 hover:text-white transition-colors duration-300 text-lg">Templates</button>
            <button onClick={() => handleNavigateAndCloseMenu('trends')} className="text-gray-300 hover:text-white transition-colors duration-300 text-lg">Trends</button>
            <button onClick={() => handleNavigateAndCloseMenu('help')} className="text-gray-300 hover:text-white transition-colors duration-300 text-lg">Help</button>
            <button onClick={() => handleNavigateAndCloseMenu('terms')} className="text-gray-300 hover:text-white transition-colors duration-300 text-lg">Terms</button>
            <button onClick={() => handleNavigateAndCloseMenu('privacy')} className="text-gray-300 hover:text-white transition-colors duration-300 text-lg">Privacy</button>
            <button onClick={() => handleNavigateAndCloseMenu('dashboard')} className="text-gray-300 hover:text-white transition-colors duration-300 text-lg">Dashboard</button>
            <button
              onClick={() => handleNavigateAndCloseMenu('dashboard')}
              className="mt-4 w-full max-w-xs group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium text-white transition-all duration-300 bg-[#1A1A1A] rounded-lg shadow-lg hover:shadow-accent-start/50"
            >
              <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-300 ease-out bg-gradient-to-br from-accent-start to-accent-end group-hover:w-full group-hover:h-full"></span>
              <span className="relative">🚀 Launch App</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
