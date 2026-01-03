import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ChevronRight, Check } from 'lucide-react';

const AIConflictResolver = ({ schedules = [], onUpdateSchedule }) => {
    const [ignoredIds, setIgnoredIds] = React.useState(new Set());

    const timeToMinutes = (t) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };

    const minutesToTime = (m) => {
        const h = Math.floor(m / 60);
        const mins = m % 60;
        return `${h.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const conflicts = useMemo(() => {
        const sorted = [...schedules].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
        const found = [];
        for (let i = 0; i < sorted.length - 1; i++) {
            const current = sorted[i];
            const next = sorted[i + 1];
            if (timeToMinutes(next.startTime) < timeToMinutes(current.endTime) && !ignoredIds.has(next.id)) {
                found.push({ a: current, b: next });
            }
        }
        return found;
    }, [schedules, ignoredIds]);

    const handleAutoFix = () => {
        if (conflicts.length > 0) {
            const { a, b } = conflicts[0];
            const buffer = 5; // 5 minute buffer
            const newStartMinutes = timeToMinutes(a.endTime) + buffer;
            const duration = timeToMinutes(b.endTime) - timeToMinutes(b.startTime);

            const updatedB = {
                ...b,
                startTime: minutesToTime(newStartMinutes),
                endTime: minutesToTime(newStartMinutes + duration)
            };

            onUpdateSchedule(updatedB);
        }
    };

    const handleIgnore = () => {
        if (conflicts.length > 0) {
            setIgnoredIds(prev => new Set([...prev, conflicts[0].b.id]));
        }
    };

    return (
        <div className={`glass-panel p-5 flex flex-col gap-4 border-l-2 transition-colors ${conflicts.length > 0 ? 'border-orange-500/50' : 'border-emerald-500/30'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${conflicts.length > 0 ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {conflicts.length > 0 ? <AlertCircle size={16} /> : <Check size={16} />}
                    </div>
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/80">AI Conflict Resolver</h3>
                </div>
                {conflicts.length > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-400 text-[8px] font-bold animate-pulse">
                        {conflicts.length} ISSUES
                    </span>
                )}
            </div>

            <AnimatePresence mode="wait">
                {conflicts.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex flex-col gap-3"
                    >
                        <div className="glass bg-white/5 p-3 rounded-xl border border-white/5 flex flex-col gap-1">
                            <span className="text-[10px] text-white/70 font-bold uppercase tracking-tighter">Conflict: {conflicts[0].a.title} & {conflicts[0].b.title}</span>
                            <span className="text-[9px] text-white/30">Overlap detected in daily routine.</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={handleIgnore}
                                className="py-2.5 rounded-xl bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest font-bold text-white/40 hover:text-white/70 transition-colors"
                            >
                                Ignore
                            </button>
                            <button
                                onClick={handleAutoFix}
                                className="py-2.5 rounded-xl bg-orange-500/20 border border-orange-500/30 text-[9px] uppercase tracking-widest font-bold text-orange-400 hover:bg-orange-500/30 transition-all shadow-[0_0_15px_rgba(249,115,22,0.1)]"
                            >
                                Auto-Fix
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-4 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/5 rounded-2xl"
                    >
                        <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold">All Schedules Optimal</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AIConflictResolver;
