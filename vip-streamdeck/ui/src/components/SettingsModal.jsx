import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Volume2, Shield, Monitor, Keyboard, Zap, Palette, Trash2, Key } from 'lucide-react';

const SettingsModal = ({ onClose, profile, onUpdateProfile, globalVolume, onUpdateVolume }) => {
    const [activeTab, setActiveTab] = useState('general');
    const [profileName, setProfileName] = useState(profile?.name || '');

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
        { id: 'advanced', label: 'Advanced', icon: Zap },
    ];

    const [appSettings, setAppSettings] = useState(profile?.settings || {
        autoStart: false,
        hardwareAccel: true,
        theme: 'cyber',
        accentColor: '#3b82f6',
        transparency: 0.8,
        shortcuts: {
            toggleFocus: 'Ctrl+F',
            openSettings: 'Ctrl+S',
            miniDeck: 'Ctrl+M'
        },
        openRouterKey: ''
    });

    const handleSave = () => {
        onUpdateProfile({
            ...profile,
            name: profileName,
            settings: appSettings
        });
        onClose();
    };

    const updateSetting = (key, value) => {
        setAppSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-[850px] h-[600px] glass-panel border border-white/10 flex overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
                {/* Sidebar */}
                <div className="w-60 border-r border-white/5 bg-white/[0.02] p-8 flex flex-col gap-3">
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                            <Settings size={20} />
                        </div>
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">System</h2>
                    </div>

                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-black transition-all ${activeTab === tab.id ? 'bg-blue-500 text-white shadow-[0_10px_20px_rgba(59,130,246,0.3)] scale-[1.02]' : 'text-white/20 hover:bg-white/5 hover:text-white/50'}`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}

                    <div className="mt-auto p-5 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/5 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <p className="text-[8px] text-blue-400 uppercase tracking-widest font-black mb-2 flex items-center gap-2">
                            <Zap size={10} /> VIP ACCESS
                        </p>
                        <p className="text-[10px] text-white/60 font-medium leading-relaxed">Early Beta v3.0. Build 429. All modules active.</p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col min-w-0 bg-black/20">
                    <div className="p-10 pb-6 flex justify-between items-center bg-white/[0.01] border-b border-white/5">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-2xl font-black text-white tracking-tight capitalize">{activeTab}</h3>
                            <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Configure your VIP workspace experience</p>
                        </div>
                        <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-white/5 text-white/20 hover:text-white transition-all">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 custom-scroll space-y-10">
                        {activeTab === 'general' && (
                            <div className="flex flex-col gap-10">
                                <section className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/30 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" /> Identity
                                    </label>
                                    <input
                                        type="text"
                                        value={profileName}
                                        onChange={(e) => setProfileName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-all shadow-inner"
                                        placeholder="Enter profile name..."
                                    />
                                </section>

                                <section className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/30 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" /> Audio Core
                                    </label>
                                    <div className="flex items-center gap-8 glass bg-white/5 p-8 rounded-3xl border border-white/5 shadow-xl">
                                        <div className={`p-4 rounded-2xl transition-all ${globalVolume > 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-500'}`}>
                                            <Volume2 size={24} />
                                        </div>
                                        <div className="flex-1 flex flex-col gap-4">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Master Level</span>
                                                <span className="text-xl font-mono font-black text-white tracking-wider">{Math.round(globalVolume * 100)}%</span>
                                            </div>
                                            <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.01"
                                                    value={globalVolume}
                                                    onChange={(e) => onUpdateVolume(parseFloat(e.target.value))}
                                                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                                />
                                                <motion.div
                                                    animate={{ width: `${globalVolume * 100}%` }}
                                                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="grid grid-cols-2 gap-6">
                                    <button
                                        onClick={() => updateSetting('autoStart', !appSettings.autoStart)}
                                        className={`glass bg-white/5 p-8 rounded-3xl border transition-all flex flex-col gap-4 items-start text-left group ${appSettings.autoStart ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/5'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${appSettings.autoStart ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40' : 'bg-white/5 text-white/20'}`}>
                                            <Shield size={20} />
                                        </div>
                                        <div>
                                            <span className={`text-[11px] font-black uppercase tracking-widest block mb-1 ${appSettings.autoStart ? 'text-white' : 'text-white/40'}`}>Auto-Start</span>
                                            <p className="text-[9px] text-white/20 leading-relaxed uppercase font-bold">Launch app on boot</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => updateSetting('hardwareAccel', !appSettings.hardwareAccel)}
                                        className={`glass bg-white/5 p-8 rounded-3xl border transition-all flex flex-col gap-4 items-start text-left group ${appSettings.hardwareAccel ? 'border-purple-500/50 bg-purple-500/5' : 'border-white/5'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${appSettings.hardwareAccel ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/40' : 'bg-white/5 text-white/20'}`}>
                                            <Monitor size={20} />
                                        </div>
                                        <div>
                                            <span className={`text-[11px] font-black uppercase tracking-widest block mb-1 ${appSettings.hardwareAccel ? 'text-white' : 'text-white/40'}`}>GPU Boost</span>
                                            <p className="text-[9px] text-white/20 leading-relaxed uppercase font-bold">Hardware Acceleration</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'appearance' && (
                            <div className="flex flex-col gap-10">
                                <section className="space-y-6">
                                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/30 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" /> Design System
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['cyber', 'minimal', 'vibrant'].map(theme => (
                                            <button
                                                key={theme}
                                                onClick={() => updateSetting('theme', theme)}
                                                className={`p-6 rounded-2xl border transition-all text-left flex flex-col gap-3 ${appSettings.theme === theme ? 'bg-blue-500 border-blue-400 text-white shadow-xl scale-[1.02]' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                                            >
                                                <Palette size={18} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{theme}</span>
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/30 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500" /> Accent Color
                                    </label>
                                    <div className="flex flex-wrap gap-4">
                                        {['#3b82f6', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'].map(color => (
                                            <button
                                                key={color}
                                                onClick={() => updateSetting('accentColor', color)}
                                                className={`w-12 h-12 rounded-2xl border-2 transition-all shadow-inner ${appSettings.accentColor === color ? 'border-white scale-110 shadow-[0_10px_20px_rgba(255,255,255,0.2)]' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-white/30 flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" /> Glass Opacity
                                        </label>
                                        <span className="text-xs font-mono text-white/40">{Math.round(appSettings.transparency * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1"
                                        step="0.05"
                                        value={appSettings.transparency}
                                        onChange={(e) => updateSetting('transparency', parseFloat(e.target.value))}
                                        className="w-full accent-blue-500 bg-white/5 rounded-full h-2 appearance-none cursor-pointer"
                                    />
                                </section>
                            </div>
                        )}

                        {activeTab === 'shortcuts' && (
                            <div className="flex flex-col gap-6">
                                <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 mb-4">
                                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-loose">
                                        Global shortcuts allow you to control the deck even when it's minimized.
                                    </p>
                                </div>

                                {Object.entries(appSettings.shortcuts).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] text-white/60 font-black uppercase tracking-widest capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                            <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Global Action</span>
                                        </div>
                                        <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-blue-400 font-mono text-sm group-hover:bg-blue-500 group-hover:text-white transition-all shadow-xl">
                                            {value}
                                        </button>
                                    </div>
                                ))}

                                <button className="mt-6 flex items-center justify-center gap-3 p-6 rounded-3xl border border-dashed border-white/10 text-white/20 hover:text-white/40 hover:bg-white/[0.02] transition-all group">
                                    <Plus size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Global Binding</span>
                                </button>
                            </div>
                        )}

                        {activeTab === 'advanced' && (
                            <div className="flex flex-col gap-8">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-8 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center">
                                                <Trash2 size={24} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h4 className="text-sm font-black text-white uppercase tracking-widest">Reset Profile</h4>
                                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Danger: This will delete all your tiles and schedules.</p>
                                            </div>
                                        </div>
                                        <button className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                                            Erase Profile Data
                                        </button>
                                    </div>

                                    <div className="p-8 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-500 flex items-center justify-center">
                                                <Zap size={24} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <h4 className="text-sm font-black text-white uppercase tracking-widest">Cache Management</h4>
                                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Clear temporary application files to free up memory.</p>
                                            </div>
                                        </div>
                                        <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
                                            Clear System Cache
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-10 bg-white/[0.02] border-t border-white/5 flex gap-6">
                        <button
                            onClick={onClose}
                            className="flex-1 py-5 rounded-2xl text-[10px] uppercase tracking-[.3em] font-black text-white/30 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Abandon
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-[2] py-5 rounded-3xl bg-blue-500 text-white text-[10px] uppercase tracking-[.3em] font-black shadow-[0_20px_40px_rgba(59,130,246,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            Sync Parameters
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SettingsModal;
