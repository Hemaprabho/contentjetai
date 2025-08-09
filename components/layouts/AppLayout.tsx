
import React from 'react';
import { Page } from '../../App';
import DashboardHeader from '../dashboard/DashboardHeader';

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenSettings: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, currentPage, onNavigate, onOpenSettings }) => {
  return (
    <div className="min-h-screen animate-fade-in">
      <DashboardHeader 
        currentPage={currentPage} 
        onNavigate={onNavigate}
        onOpenSettings={onOpenSettings} 
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
