import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Globe, Laptop, Type, Palette, Hash, Settings } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const TileEditor = ({ tile, onClose, onSave, onDelete }) => {
    const [name, setName] = useState(tile?.name || '');
    const [icon, setIcon] = useState(tile?.icon || 'HelpCircle');
    const [color, setColor] = useState(tile?.color || 'text-white');
    const [actionType, setActionType] = useState(tile?.actions?.[0]?.type || 'url');
    const [actionValue, setActionValue] = useState(tile?.actions?.[0]?.value || '');

    const handleSave = () => {
        const updatedTile = {
            ...tile,
            id: tile?.id || Date.now().toString(),
            name,
            icon,
            color,
            actions: [
                {
                    type: actionType,
                    value: actionValue
                }
            ]
        };
        onSave(updatedTile);
    };

    const colors = [
        'text-white', 'text-blue-400', 'text-red-500', 'text-green-500',
        'text-yellow-400', 'text-purple-400', 'text-cyan-400', 'text-pink-500'
    ];

    const icons = ['Globe', 'Youtube', 'Facebook', 'Music', 'MessageSquare', 'Terminal', 'Chrome', 'Github', 'Settings', 'Maximize2', 'Monitor'];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md glass rounded-3xl overflow-hidden shadow-3xl border border-white/10"
            >
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Settings size={18} />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-white">Customize Button</h2>
                    </div>
                    <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 flex flex-col gap-6">
                    {/* Name Input */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                            <Type size={12} /> Button Label
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. My Website"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>

                    {/* Action Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                                <Globe size={12} /> Action Type
                            </label>
                            <select
                                value={actionType}
                                onChange={(e) => setActionType(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 appearance-none"
                            >
                                <option value="url" className="bg-[#0f0f13]">Website (URL)</option>
                                <option value="app" className="bg-[#0f0f13]">Application</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                                <Hash size={12} /> Value
                            </label>
                            <input
                                type="text"
                                value={actionValue}
                                onChange={(e) => setActionValue(e.target.value)}
                                placeholder={actionType === 'url' ? 'https://...' : 'chrome, calc...'}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50"
                            />
                        </div>
                    </div>

                    {/* Icon Selection */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                            <Palette size={12} /> Icon & Theme
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {icons.map(ic => {
                                const IconComp = LucideIcons[ic] || LucideIcons.HelpCircle;
                                return (
                                    <button
                                        key={ic}
                                        onClick={() => setIcon(ic)}
                                        className={`p-2.5 rounded-xl border transition-all ${icon === ic ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-white/20 hover:text-white/50'}`}
                                    >
                                        <IconComp size={18} />
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {colors.map(c => {
                                const colorStyles = {
                                    'text-white': '#ffffff',
                                    'text-blue-400': '#60a5fa',
                                    'text-red-500': '#ef4444',
                                    'text-green-500': '#22c55e',
                                    'text-yellow-400': '#fbbf24',
                                    'text-purple-400': '#c084fc',
                                    'text-cyan-400': '#22d3ee',
                                    'text-pink-500': '#ec4899'
                                };
                                return (
                                    <button
                                        key={c}
                                        onClick={() => setColor(c)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        style={{ backgroundColor: colorStyles[c] || '#fff' }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white/[0.02] border-t border-white/10 flex gap-4">
                    {tile && (
                        <button
                            onClick={onDelete}
                            className="flex-1 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Trash2 size={14} /> Remove
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="flex-[2] px-4 py-3 rounded-xl bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
                    >
                        <Save size={14} /> {tile ? 'Save Changes' : 'Create Button'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default TileEditor;
