import React from 'react';
import TwitterIcon from './components/icons/TwitterIcon';
import LinkedInIcon from './components/icons/LinkedInIcon';
import GitHubIcon from './components/icons/GitHubIcon';
import YouTubeIcon from './components/icons/YouTubeIcon';
import { Page } from './App';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex space-x-6 text-sm text-gray-400">
            <button onClick={() => onNavigate('academy')} className="bg-transparent border-none p-0 cursor-pointer hover:text-white transition-colors">JetAcademy</button>
            <button onClick={() => onNavigate('terms')} className="bg-transparent border-none p-0 cursor-pointer hover:text-white transition-colors">Terms</button>
            <button onClick={() => onNavigate('privacy')} className="bg-transparent border-none p-0 cursor-pointer hover:text-white transition-colors">Privacy</button>
            <button onClick={() => onNavigate('help')} className="bg-transparent border-none p-0 cursor-pointer hover:text-white transition-colors">Help</button>
          </div>
          <div className="flex space-x-5">
            <a href="https://twitter.com/hemaprabho" target="_blank" rel="noopener noreferrer" aria-label="Follow on Twitter" className="text-gray-400 hover:text-accent-start transition-all duration-300 transform hover:scale-125"><TwitterIcon /></a>
            <a href="https://linkedin.com/in/hemaprabho-bhattacharyya-5497742b8" target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn" className="text-gray-400 hover:text-accent-start transition-all duration-300 transform hover:scale-125"><LinkedInIcon /></a>
            <a href="https://github.com/hemaprabho" target="_blank" rel="noopener noreferrer" aria-label="View on GitHub" className="text-gray-400 hover:text-accent-start transition-all duration-300 transform hover:scale-125"><GitHubIcon /></a>
            <a href="https://youtube.com/@hemaprabho" target="_blank" rel="noopener noreferrer" aria-label="Subscribe on YouTube" className="text-gray-400 hover:text-accent-start transition-all duration-300 transform hover:scale-125"><YouTubeIcon /></a>
          </div>
          <p className="text-sm text-gray-500 text-center md:text-right">
            © 2025 ContentJet AI — All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;