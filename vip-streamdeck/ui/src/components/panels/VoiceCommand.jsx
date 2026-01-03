import React, { useState, useEffect } from 'react';
import { Mic, Radio, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

const VoiceCommand = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const rec = new SpeechRecognition();
            rec.continuous = false;
            rec.interimResults = false;
            rec.lang = 'en-US';

            rec.onstart = () => setIsListening(true);
            rec.onend = () => setIsListening(false);
            rec.onresult = (event) => {
                const text = event.results[0][0].transcript;
                setTranscript(text);
                console.log("Voice Command:", text);
                // Here we would dispatch action if it matches
            };

            setRecognition(rec);
        }
    }, []);

    const toggleListening = () => {
        if (!recognition) return;
        if (isListening) recognition.stop();
        else {
            setTranscript("Listening...");
            recognition.start();
        }
    };

    return (
        <div className="glass-panel p-5 flex flex-col gap-4 border-r-2 border-cyan-500/30 text-right">
            <div className="flex flex-row-reverse items-center gap-2">
                <div className="relative cursor-pointer" onClick={toggleListening}>
                    {isListening ? (
                        <>
                            <Mic size={16} className="text-cyan-400" />
                            <motion.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-0 bg-cyan-400/50 rounded-full"
                            />
                        </>
                    ) : (
                        <MicOff size={16} className="text-white/20" />
                    )}
                </div>
                <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/80">Voice Command</h3>
            </div>

            <div className={`glass ${isListening ? 'bg-cyan-500/5 border-cyan-500/10' : 'bg-white/5 border-white/5'} rounded-xl p-3 border flex flex-row-reverse items-center justify-between transition-colors`}>
                <div className="flex flex-col items-end">
                    <p className="text-[9px] text-white/40 uppercase tracking-widest">{isListening ? "Status" : "Idle"}</p>
                    <p className={`text-[11px] font-bold ${isListening ? "text-cyan-400 italic" : "text-white/50"}`}>
                        {transcript || "Tap Mic to Speak"}
                    </p>
                </div>
                <Radio size={14} className={isListening ? "text-cyan-500/40" : "text-white/10"} />
            </div>

            {isListening ? (
                <div className="flex flex-row-reverse gap-4 items-center justify-start mt-1 px-1">
                    {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8].map((val, i) => (
                        <motion.div
                            key={i}
                            animate={{ height: [`${val * 10}px`, `${(1 - val) * 15}px`, `${val * 10}px`] }}
                            transition={{ repeat: Infinity, duration: 1 + val, ease: "easeInOut" }}
                            className="w-1 bg-cyan-400/30 rounded-full"
                        />
                    ))}
                </div>
            ) : (
                <div className="h-4 mt-1" />
            )}
        </div>
    );
};

export default VoiceCommand;
