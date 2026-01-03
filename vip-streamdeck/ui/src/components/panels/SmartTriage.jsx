import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Clock } from 'lucide-react';

const SmartTriage = ({ schedules = [] }) => {
    const now = new Date();
    const currentTimeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

    const activeUpcomingTasks = schedules.filter(s => {
        if (s.completed) return false;
        // If endTime is specified and it's already passed, don't show here
        if (s.endTime && s.endTime < currentTimeStr) return false;
        return true;
    });

    const pendingTasks = activeUpcomingTasks.length;
    const nextTask = activeUpcomingTasks[0];

    return (
        <div className="glass-panel p-5 flex flex-col gap-4 border-l-2 border-blue-500/30">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Bell size={16} className="text-blue-400" />
                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/80">Notification Triage</h3>
                </div>
                {pendingTasks > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[8px] font-bold">
                        {pendingTasks} ACTIVE
                    </span>
                )}
            </div>

            <div className={`glass rounded-xl p-4 border transition-colors ${pendingTasks > 0 ? 'bg-blue-500/5 border-blue-500/20' : 'bg-white/5 border-white/5'}`}>
                <p className="text-[11px] text-white/70 font-medium">
                    {nextTask ? `Focus: ${nextTask.title}` : 'System Nominal'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                    {pendingTasks > 0 ? (
                        <Clock size={14} className="text-blue-400 animate-pulse" />
                    ) : (
                        <CheckCircle size={14} className="text-green-400" />
                    )}
                    <span className="text-[9px] text-white/40 uppercase tracking-wider">
                        {pendingTasks > 0 ? `${pendingTasks} tasks pending today` : 'No Pending Alerts'}
                    </span>
                </div>
            </div>

            <motion.button
                whileHover={pendingTasks > 0 ? { scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.1)' } : {}}
                className={`w-full py-2.5 rounded-xl border text-[9px] uppercase tracking-widest font-bold transition-all ${pendingTasks > 0 ? 'border-blue-500/30 text-blue-400' : 'border-white/10 text-white/10 opacity-50 cursor-default'}`}
            >
                {pendingTasks > 0 ? 'View All Tasks' : 'Log Clear'}
            </motion.button>
        </div>
    );
};

export default SmartTriage;
