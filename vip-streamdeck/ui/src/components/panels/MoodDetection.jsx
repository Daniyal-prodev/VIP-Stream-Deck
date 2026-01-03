import React from 'react';
import { motion } from 'framer-motion';
import { Smile, Target, Zap, Coffee } from 'lucide-react';

const MoodDetection = ({ systemStats }) => {
    // Derive "mood" from system load if available, else default
    const load = systemStats?.cpu || 0;

    let moodState = "Relaxed";
    let moodColor = "text-blue-400";
    let moodIcon = Coffee;
    let moodBorder = "border-blue-500/30";
    let bgPulse = "";

    if (load > 70) {
        moodState = "Intense / Gaming";
        moodColor = "text-red-400";
        moodIcon = Zap;
        moodBorder = "border-red-500/30";
        bgPulse = "animate-pulse";
    } else if (load > 30) {
        moodState = "Focused";
        moodColor = "text-pink-400";
        moodIcon = Target;
        moodBorder = "border-pink-500/30";
    }

    const Icon = moodIcon;

    return (
        <div className={`glass-panel p-5 flex flex-col gap-4 border-r-2 ${moodBorder} text-right transition-colors duration-1000`}>
            <div className="flex flex-row-reverse justify-between items-center">
                <div className="flex flex-row-reverse items-center gap-2">
                    <Smile size={16} className={moodColor} />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/80">System Mood</h3>
                </div>
            </div>

            <div className="flex flex-row-reverse items-center gap-4">
                <div className="relative">
                    <div className={`w-12 h-12 rounded-xl overflow-hidden glass border ${moodBorder} flex items-center justify-center`}>
                        <Icon size={24} className={`${moodColor} opacity-80`} />
                    </div>
                    <div className={`absolute -bottom-1 -left-1 w-3 h-3 rounded-full ${load > 70 ? 'bg-red-500' : load > 30 ? 'bg-pink-500' : 'bg-blue-500'} border-2 border-premium-bg ${bgPulse}`} />
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] text-white/40 uppercase tracking-widest">Current State</span>
                        <Target size={12} className={moodColor} />
                    </div>
                    <p className="text-xs font-bold text-white/90">{moodState}</p>
                </div>
            </div>

            <div className="flex flex-wrap flex-row-reverse gap-2 mt-1">
                {['CPU Linked', 'Adaptive', 'Live'].map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg glass bg-white/5 border border-white/5 text-[8px] uppercase tracking-widest text-white/40">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default MoodDetection;
