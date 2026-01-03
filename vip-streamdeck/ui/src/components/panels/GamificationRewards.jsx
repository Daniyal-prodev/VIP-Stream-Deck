import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap } from 'lucide-react';

const GamificationRewards = ({ actionCount = 0 }) => {
    // Calculate XP based on actions (10 XP per action)
    const xp = actionCount * 10;
    const nextLevel = Math.ceil((xp + 1) / 500) * 500;
    const progress = (xp % 500) / 500 * 100;
    const level = Math.floor(xp / 500) + 1;

    return (
        <div className="glass-panel p-5 flex flex-col gap-4 border-b-2 border-purple-500/30">
            <div className="flex items-center gap-2">
                <Trophy size={16} className="text-purple-400" />
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/80">Productivity Level {level}</h3>
            </div>

            <div className="flex items-center gap-4 py-2">
                <div className="text-2xl font-black text-white tracking-tighter">
                    +{xp} <span className="text-purple-400">XP</span>
                </div>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-500"
                    />
                </div>
            </div>

            <div className="flex gap-2">
                <button className="flex-1 py-2 px-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[8px] uppercase tracking-tighter font-bold text-purple-300 flex items-center justify-center gap-2 cursor-default">
                    <Zap size={10} /> {actionCount} Actions
                </button>
                <div className="flex-1 py-2 px-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-[8px] uppercase tracking-tighter font-bold text-pink-300 flex items-center justify-center gap-2">
                    <Star size={10} /> Next: {nextLevel}
                </div>
            </div>
        </div>
    );
};

export default GamificationRewards;
