import React from 'react';
import { motion } from 'framer-motion';
import { Box, Layers, Play } from 'lucide-react';

const AugmentedRealityView = () => {
    return (
        <div className="glass-panel p-5 flex flex-col gap-4 border-r-2 border-cyan-400/30 text-right">
            <div className="flex flex-row-reverse items-center gap-2">
                <Box size={16} className="text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/80">Augmented Reality View</h3>
            </div>

            <div className="relative group overflow-hidden rounded-2xl border border-white/10 aspect-video glass">
                <img
                    src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=300"
                    alt="AR Preview"
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div className="flex gap-2">
                        <div className="px-2 py-1 rounded bg-orange-500/80 text-[8px] font-bold text-white flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" /> Reminder
                        </div>
                        <div className="px-2 py-1 rounded bg-blue-500/80 text-[8px] font-bold text-white flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-white animate-pulse" /> Start Stream
                        </div>
                    </div>
                    <div className="w-16 h-8 border-2 border-white/20 rounded-lg flex items-center justify-center opacity-40">
                        <Layers size={14} className="text-white" />
                    </div>
                </div>
            </div>

            <div className="flex flex-row-reverse gap-3 items-center">
                <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Glasses Connected</span>
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_cyan]" />
            </div>
        </div>
    );
};

export default AugmentedRealityView;
