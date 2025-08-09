
import React from 'react';
import CloseIcon from '../icons/CloseIcon';
import { UserSettings } from '../../Dashboard';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: UserSettings;
    onSettingsChange: (newSettings: UserSettings) => void;
    achievementsData: { [key: string]: { name: string; description: string } };
}

const AchievementBadge: React.FC<{ id: string; name: string; description: string; unlocked: boolean }> = ({ id, name, description, unlocked }) => {
    const iconMap: { [key: string]: string } = {
        'first_save': '✈️',
        'librarian_10': '📚',
        'trend_spotter_5': '📈',
        'architect_5': '🏛️',
        'guru_apprentice_5': '🧙‍♂️',
        'streak_7': '🔥',
        'polyglot_3': '🌐',
    };
    const icon = iconMap[id] || '🏆';

    return (
        <div className={`relative group p-4 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-300 ${unlocked ? 'bg-black/40 border border-accent-start/50' : 'bg-black/20 border border-white/10 opacity-50'}`}>
            <span className="text-4xl">{icon}</span>
            <p className="mt-2 text-xs font-bold text-white">{name}</p>
            {unlocked && <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black/50"></div>}
            <div className="absolute bottom-full mb-2 w-max max-w-xs p-2 text-xs text-center bg-gray-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {description}
            </div>
        </div>
    );
};


const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSettingsChange, achievementsData }) => {
    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        onSettingsChange({
            ...settings,
            [e.target.name]: e.target.value,
        });
    };

    const handleClearData = () => {
        if (window.confirm("Are you sure you want to delete all your data? This action is irreversible and will remove all saved posts and settings.")) {
            try {
                localStorage.removeItem('contentjet_saved_posts');
                localStorage.removeItem('contentjet_settings_v2');
                window.location.reload();
            } catch (error) {
                console.error("Failed to clear data from localStorage:", error);
                alert("Could not clear data. Your browser settings might be blocking access to local storage.");
            }
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
            <div className="relative p-8 bg-[#0A0A10] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors" aria-label="Close settings">
                    <CloseIcon />
                </button>
                <h2 className="font-sora text-2xl font-bold text-white mb-6">Settings & Account</h2>
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-400 block mb-2" htmlFor="username">Nickname</label>
                        <input id="username" name="username" type="text" value={settings.username} onChange={handleChange} className="w-full p-2 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-start" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-400 block mb-2" htmlFor="email">Email</label>
                        <input id="email" name="email" type="email" value={settings.email} onChange={handleChange} className="w-full p-2 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-start" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-400 block mb-2" htmlFor="aiStyle">AI Tone Preference</label>
                        <select id="aiStyle" name="aiStyle" value={settings.aiStyle} onChange={handleChange} className="w-full p-2 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-accent-start appearance-none">
                            <option>Viral</option>
                            <option>Relatable</option>
                            <option>Professional</option>
                            <option>Witty</option>
                            <option>Minimalist</option>
                            <option>Deep</option>
                        </select>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <h3 className="text-lg font-sora font-semibold text-white mb-3">Achievements</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {Object.entries(achievementsData).map(([id, data]) => (
                                <AchievementBadge key={id} id={id} {...data} unlocked={settings.achievements.includes(id)} />
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <h3 className="text-lg font-sora font-semibold text-white mb-3">Data & Privacy</h3>
                         <button onClick={handleClearData} className="w-full py-2 bg-red-900/50 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-900 hover:border-red-500 transition-colors">Clear All My Data</button>
                         <p className="text-xs text-gray-500 mt-2">Permanently delete all saved posts and settings from your browser.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;