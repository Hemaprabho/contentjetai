
import React from 'react';

const TwitterIcon: React.FC<{ size?: number; className?: string; }> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9s-1.8-1.5-3.3-2.1c-.6 2.5-2.5 4.5-5 4.5s-4.4-2-5-4.5c-1.5.6-3.3 2.1-3.3 2.1s1.7-3.5 3.3-4.9c-1.3-1.3-2-3.4-2-3.4s2.1.7 3.8 2.1c1.2-2.1 3.2-3.5 5.2-3.5 2 0 4 1.4 5.2 3.5z"></path>
  </svg>
);

export default TwitterIcon;
