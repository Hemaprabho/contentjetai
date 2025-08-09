import React, { useState, useEffect, ReactNode } from 'react';

type CheckStatus = 'checking' | 'success' | 'error';
type ErrorType = 'network' | 'assets' | 'compatibility' | 'fonts';

const PreflightCheckUI: React.FC<{ status: CheckStatus; errorType: ErrorType | null; children: ReactNode }> = ({ status, errorType, children }) => {
    
    const copyDebugInfo = () => {
        const debugInfo = `
User Agent: ${navigator.userAgent}
Detected Error: ${errorType}
Screen: ${window.innerWidth}x${window.innerHeight}
        `;
        navigator.clipboard.writeText(debugInfo.trim());
        alert('Debug information copied to clipboard.');
    };
    
    const resetApp = () => {
        try {
            localStorage.clear();
            sessionStorage.clear();
        } catch (e) {
            console.error("Failed to clear storage", e);
        }
        window.location.reload();
    };

    const errorMessages = {
        network: {
            title: "Network Connection Issue",
            description: "We couldn't connect to our servers. Please check your internet connection and try again. Ad-blockers or firewalls might also be blocking access."
        },
        assets: {
            title: "Critical Assets Failed to Load",
            description: "The application's core files couldn't be loaded. This can be caused by a slow or unstable network. The UI may appear broken or incomplete."
        },
        fonts: {
            title: "Font Loading Failed",
            description: "The fonts required for the UI could not be loaded, which can result in invisible or broken text. This is often due to network issues or ad-blockers."
        },
        compatibility: {
            title: "Browser Incompatibility",
            description: "Your browser may be outdated or missing features required to run this application. Please try updating your browser or using a modern one like Chrome or Firefox."
        }
    };

    if (status === 'checking') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#05050A] text-white p-4 font-inter">
                <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-accent-start"></div>
                <p className="mt-4 font-sora text-xl">Performing pre-flight checks...</p>
                <p className="text-gray-400">Verifying connectivity and assets.</p>
            </div>
        );
    }

    if (status === 'error' && errorType) {
        const { title, description } = errorMessages[errorType];
        return (
             <div className="flex items-center justify-center min-h-screen bg-[#05050A] text-white p-4 font-inter">
                <div className="text-center max-w-2xl p-8 bg-black/30 backdrop-blur-lg border border-yellow-500/50 rounded-2xl">
                    <div className="text-5xl mb-4">🚦</div>
                    <h1 className="font-sora text-3xl font-bold text-yellow-400 mb-2">{title}</h1>
                    <p className="text-gray-300 mb-6">{description}</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-accent-start text-black font-bold rounded-lg hover:brightness-110 transition">
                            Refresh Page
                        </button>
                        <button onClick={resetApp} className="px-6 py-2 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 font-bold rounded-lg hover:bg-yellow-500/30 transition">
                            Reset & Refresh
                        </button>
                    </div>
                     <button onClick={copyDebugInfo} className="text-accent-start hover:underline mt-4 text-xs">Copy Debug Info</button>
                </div>
            </div>
        );
    }
    
    return <>{children}</>;
};


const PreflightCheck: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [status, setStatus] = useState<CheckStatus>('checking');
    const [errorType, setErrorType] = useState<ErrorType | null>(null);

    useEffect(() => {
        const runChecks = async () => {
            // 1. Compatibility Check (loosened for preview environments)
            // The check for importmap support was removed as it caused false positives in sandboxed preview windows.
            // The app's ability to load React is a better indicator of compatibility.
            if (typeof Promise === 'undefined') {
                setStatus('error');
                setErrorType('compatibility');
                return;
            }

            // 2. Network Check
            try {
                // Fetch a small, non-essential file to test connectivity.
                await fetch('/favicon.png', { cache: 'no-store' });
            } catch (err) {
                setStatus('error');
                setErrorType('network');
                return;
            }

            // 3. Critical Assets Check (tailwind)
            if (typeof (window as any).tailwind === 'undefined') {
                 setStatus('error');
                 setErrorType('assets');
                 return;
            }

            // 4. Font Loading Check
            try {
                await document.fonts.load('1em Sora');
                await document.fonts.load('1em Inter');
            } catch (err) {
                console.warn('Font loading check failed, but continuing.', err);
                // Not making this a hard failure, but it's a potential issue.
                // It might show the UI with fallback fonts which is better than nothing.
                // Could be enhanced to show a non-blocking warning.
            }
            
            // All checks passed
            setStatus('success');
        };

        const timer = setTimeout(() => {
            runChecks();
        }, 500); // Give assets a moment to load before checking

        return () => clearTimeout(timer);
    }, []);

    return <PreflightCheckUI status={status} errorType={errorType}>{children}</PreflightCheckUI>;
};

export default PreflightCheck;