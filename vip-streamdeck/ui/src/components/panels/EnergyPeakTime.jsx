import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock } from 'lucide-react';

const EnergyPeakTime = ({ schedules = [] }) => {
    const [timeRange, setTimeRange] = useState("");

    const timeToMinutes = (t) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };

    const minutesToTime = (m) => {
        const h = Math.floor(m / 60) % 24;
        const mins = m % 60;
        return `${h.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const updatePeak = () => {
            if (schedules.length === 0) {
                const now = new Date();
                const end = new Date(now.getTime() + 120 * 60000);
                const format = (d) => d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
                setTimeRange(`${format(now)} → ${format(end)}`);
                return;
            }

            // Find the longest gap between tasks or after the last task
            const sorted = [...schedules].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
            let maxGap = 0;
            let peakStart = 0;

            const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();

            // Check gap between now and first task
            if (timeToMinutes(sorted[0].startTime) > nowMinutes) {
                maxGap = timeToMinutes(sorted[0].startTime) - nowMinutes;
                peakStart = nowMinutes;
            }

            // Check gaps between tasks
            for (let i = 0; i < sorted.length - 1; i++) {
                const gap = timeToMinutes(sorted[i + 1].startTime) - timeToMinutes(sorted[i].endTime);
                if (gap > maxGap) {
                    maxGap = gap;
                    peakStart = timeToMinutes(sorted[i].endTime);
                }
            }

            // Check gap after last task (until end of day or +4 hours)
            const lastTaskEnd = timeToMinutes(sorted[sorted.length - 1].endTime);
            if (1440 - lastTaskEnd > maxGap) {
                maxGap = 1440 - lastTaskEnd;
                peakStart = lastTaskEnd;
            }

            const peakEnd = peakStart + Math.min(maxGap, 120); // Max 2 hour peak
            setTimeRange(`${minutesToTime(peakStart)} → ${minutesToTime(peakEnd)}`);
        };

        updatePeak();
        const interval = setInterval(updatePeak, 60000);
        return () => clearInterval(interval);
    }, [schedules]);

    return (
        <div className="glass-panel p-5 flex flex-col gap-4 border-l-2 border-emerald-500/30">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Zap size={16} className="text-emerald-400" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/80">Energy Peak Time</h3>
                </div>
            </div>

            <div className="flex items-center justify-between glass bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/10">
                <div>
                    <p className="text-[9px] text-white/40 uppercase tracking-widest">Optimal Task Time</p>
                    <p className="text-sm font-bold text-emerald-400 mt-1">{timeRange || "Calculating..."}</p>
                </div>
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400"
                >
                    <Clock size={16} />
                </motion.div>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[9px] uppercase tracking-widest font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all">
                Deep Work Session
            </button>
        </div>
    );
};

export default EnergyPeakTime;
