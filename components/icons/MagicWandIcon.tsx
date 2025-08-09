import React from 'react';

const MagicWandIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 4V2" />
        <path d="M15 22v-2" />
        <path d="M12.243 5.515l1.242-1.243" />
        <path d="M19.743 19.985l1.242-1.243" />
        <path d="M4 15H2" />
        <path d="M22 15h-2" />
        <path d="M5.515 12.243l-1.243 1.242" />
        <path d="M19.985 4.257l-1.243 1.242" />
        <path d="m22 2-2.5 2.5" />
        <path d="M3.5 3.5 12 12" />
        <path d="M2 22l2.5-2.5" />
        <path d="M12 12 20.5 20.5" />
    </svg>
);

export default MagicWandIcon;