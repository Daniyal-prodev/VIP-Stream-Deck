import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Activity } from 'lucide-react';

const NetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [speed, setSpeed] = useState("Unknown");

    useEffect(() => {
        const handleStatusChange = () => {
            setIsOnline(navigator.onLine);
        };

        window.addEventListener('online', handleStatusChange);
        window.addEventListener('offline', handleStatusChange);

        if (navigator.connection) {
            setSpeed(navigator.connection.effectiveType || "Unknown");
        }

        return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
        };
    }, []);

    return (
        <div className="glass-panel p-5 flex flex-col gap-4 border-r-2 border-cyan-400/30 text-right">
            <div className="flex flex-row-reverse items-center gap-2">
                <Activity size={16} className="text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/80">Network Status</h3>
            </div>

            <div className={`relative overflow-hidden rounded-2xl border ${isOnline ? 'border-green-500/30' : 'border-red-500/30'} aspect-video glass flex items-center justify-center`}>
                {isOnline ? (
                    <Wifi size={48} className="text-green-500 animate-pulse" />
                ) : (
                    <WifiOff size={48} className="text-red-500" />
                )}
            </div>

            <div className="flex flex-col items-end gap-1">
                <span className={`text-[12px] font-bold ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                    {isOnline ? "CONNECTED" : "OFFLINE"}
                </span>
                <span className="text-[9px] text-white/40 uppercase tracking-widest">{speed.toUpperCase()} CONNECTION</span>
            </div>

            <div className="flex flex-row-reverse gap-3 items-center">
                <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Latency</span>
                <span className="text-[9px] font-mono text-cyan-400">
                    {isOnline ? "~24ms" : "--"}
                </span>
            </div>
        </div>
    );
};

export default NetworkStatus;
