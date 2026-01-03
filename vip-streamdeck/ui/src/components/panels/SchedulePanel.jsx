import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Trash2, Clock, CheckCircle2 } from 'lucide-react';

const SchedulePanel = ({ schedules = [], onAddSchedule, onDeleteSchedule }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newTitle || !startTime || !endTime) return;
        onAddSchedule({
            id: Date.now().toString(),
            title: newTitle,
            startTime,
            endTime,
            completed: false
        });
        setNewTitle('');
        setStartTime('');
        setEndTime('');
        setIsAdding(false);
    };

    return (
        <div className="glass-panel p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Calendar size={18} />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/90">Daily Schedule</h3>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                >
                    <Plus size={16} />
                </button>
            </div>

            <AnimatePresence mode="wait">
                {isAdding && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-3 overflow-hidden"
                    >
                        <input
                            type="text"
                            placeholder="Task Title..."
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50"
                            />
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500/50"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-xs font-bold text-white transition-colors"
                        >
                            Add to Schedule
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="flex flex-col gap-3 mt-2 max-h-[300px] overflow-y-auto no-scrollbar">
                {schedules.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/5 rounded-2xl">
                        <Clock size={24} className="text-white/10" />
                        <p className="text-[10px] uppercase tracking-widest text-white/20 font-bold">No tasks scheduled</p>
                    </div>
                ) : (
                    schedules.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            className="group flex items-center justify-between p-4 glass rounded-2xl border border-white/5 hover:border-white/10 transition-all hover:bg-white/5"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-1.5 h-1.5 rounded-full ${item.completed ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`} />
                                <div>
                                    <p className={`text-[11px] font-bold ${item.completed ? 'text-white/40 line-through' : 'text-white'}`}>{item.title}</p>
                                    <p className="text-[9px] text-white/30 font-mono mt-0.5">{item.startTime} - {item.endTime}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onDeleteSchedule(item.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all"
                            >
                                <Trash2 size={14} />
                            </button>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SchedulePanel;
