

import React from 'react';

interface NicknameModalProps {
    isOpen: boolean;
    onSave: (nickname: string) => void;
}

const NicknameModal: React.FC<NicknameModalProps> = ({ isOpen, onSave }) => {
    const [nickname, setNickname] = React.useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (nickname.trim()) {
            onSave(nickname.trim());
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true">
            <div className="relative p-8 bg-[#0A0A10] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md m-4 text-center">
                <h2 className="font-sora text-3xl font-bold text-white mb-2">Welcome to the Cockpit!</h2>
                <p className="text-gray-400 mb-6">What's your creator callsign? We'll use this to personalize your experience.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="sr-only" htmlFor="nickname-input">Creator Nickname</label>
                        <input
                            id="nickname-input"
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="w-full text-center p-3 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-start"
                            placeholder="e.g., Captain Content"
                            required
                            autoFocus
                        />
                    </div>
                    <button type="submit" className="w-full group relative inline-flex items-center justify-center px-6 py-3 font-bold text-black transition-all duration-300 bg-gradient-to-br from-accent-start to-accent-end rounded-xl shadow-lg shadow-accent-start/30 hover:shadow-accent-end/40 transform hover:scale-105 active:scale-100 disabled:opacity-50 disabled:scale-100">
                        🚀 Let's Fly!
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NicknameModal;
