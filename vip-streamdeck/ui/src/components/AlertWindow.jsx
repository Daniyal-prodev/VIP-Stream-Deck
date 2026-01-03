import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Moon, Volume2 } from 'lucide-react';

const AlertWindow = ({ data: propData, onDismiss }) => {
    const [alert, setAlert] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const data = propData || window.alertData || {
            id: 'test-1',
            title: 'Reminder!',
            body: 'Time to drink water.',
            sound: 'alert.mp3',
            volume: 0.8
        };
        setAlert(data);
        setIsVisible(true);

        // Play loud beep if requested or by default for sticky notes
        const playBeep = async () => {
            try {
                const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
                const audioCtx = new AudioCtxClass();

                if (audioCtx.state === 'suspended') {
                    await audioCtx.resume();
                }

                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();

                oscillator.type = 'square'; // Harsh sound for "loud"
                oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note

                gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
                gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);

                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);

                oscillator.start();
                oscillator.stop(audioCtx.currentTime + 0.3);
            } catch (err) {
                console.warn("Audio Context playback failed, trying fallback:", err);
                // Fallback to simple Audio object if file might exist
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Online fallback chime
                audio.volume = 0.5;
                audio.play().catch(e => console.log("Sound fallbacks failed - usually needs user gesture first."));
            }
        };

        playBeep();
    }, [propData]);

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onDismiss) onDismiss();
            else window.close();
        }, 500);
    };

    const handleSnooze = (min) => {
        if (window.electronAPI?.snoozeAlert) {
            window.electronAPI.snoozeAlert(alert, min);
        }
        handleDismiss();
    };


    if (!alert) return null;

    const isSticky = alert.isSticky;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-[200] select-none overflow-hidden">
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                        className={`pointer-events-auto relative ${isSticky ? 'bg-yellow-300 text-black shadow-[10px_10px_30px_rgba(0,0,0,0.5)] rotate-1' : 'glass border-white/20 shadow-2xl'} w-[350px] rounded-sm p-8 flex flex-col items-center text-center gap-6`}
                        style={isSticky ? {
                            backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.4) 0%, transparent 100%)',
                            fontFamily: '"Comic Sans MS", cursive, sans-serif' // Give it that sticky note feel
                        } : {}}
                    >
                        {isSticky && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-8 bg-black/10 backdrop-blur-md rounded-t-lg border-t border-white/20" />
                        )}

                        <div className="relative">
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                                className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${isSticky ? 'bg-black/5 border-black/10 text-black' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'}`}
                            >
                                <Bell size={28} />
                            </motion.div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-ping" />
                        </div>

                        <div>
                            <h2 className={`text-xl font-black tracking-tight ${isSticky ? 'text-black' : 'text-white'}`}>{alert.title}</h2>
                            <p className={`text-sm mt-2 leading-relaxed ${isSticky ? 'text-black/60' : 'text-white/50'}`}>{alert.body}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full mt-4">
                            {!isSticky && (
                                <button
                                    onClick={() => handleSnooze(5)}
                                    className="flex items-center justify-center gap-2 py-3 px-4 glass rounded-2xl hover:glass-hover transition-all text-xs uppercase tracking-widest font-bold text-white/60 hover:text-white"
                                >
                                    <Moon size={14} />
                                    Snooze
                                </button>
                            )}
                            <button
                                onClick={handleDismiss}
                                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all text-xs uppercase tracking-widest font-black ${isSticky ? 'bg-black text-white hover:bg-black/80 w-full col-span-2' : 'bg-white/10 hover:bg-white/20 border border-white/10 text-white/80 hover:text-white'}`}
                            >
                                <X size={14} />
                                {isSticky ? 'Got it!' : 'Dismiss'}
                            </button>
                        </div>

                        {isSticky && (
                            <div className="mt-2 text-[10px] uppercase tracking-tighter font-bold text-black/30">
                                VIP Scheduler System v1.0
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AlertWindow;
