import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, MessageSquare, GripHorizontal } from 'lucide-react';

const FocusCompanion = ({ actionCount, activeProfile, systemStats }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'VIP Intelligence Online. I am monitoring your productivity metrics. How can I assist?' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollRef = useRef(null);

    const getAiResponse = async (text) => {
        const lower = text.toLowerCase();
        const apiKey = "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";

        // Local Status/Performance Overrides (Always local for speed)
        if (lower.includes('status') || lower.includes('performance')) {
            return `System Load: CPU at ${systemStats.cpu}%, RAM at ${systemStats.mem}%. You have executed ${actionCount} actions. Efficiency is at optimal levels.`;
        }

        if (lower.includes('profile')) {
            return `Currently active profile: "${activeProfile?.name}". It contains ${activeProfile?.tiles?.length || 0} configured tiles. Shall I optimize the layout?`;
        }

        // OpenRouter Integration
        if (apiKey && apiKey.startsWith('sk-or-')) {
            try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://github.com/google-deepmind/antigravity", // Optional
                        "X-Title": "VIP Stream Deck" // Optional
                    },
                    body: JSON.stringify({
                        "model": "google/gemini-2.0-flash-exp:free", // Defaulting to a good free/cheap model
                        "messages": [
                            { "role": "system", "content": "You are the VIP Stream Deck Intelligence. Concise, professional, and productivity-focused. Acknowledge system stats if relevant." },
                            { "role": "user", "content": text }
                        ],
                    })
                });
                const data = await response.json();
                return data.choices?.[0]?.message?.content || "API connected, but no response content found.";
            } catch (error) {
                console.error("OpenRouter Error:", error);
                return "Neural link timeout. Reverting to local processors.";
            }
        }

        // Fallback: Simulate a "Google Search" hack for general knowledge
        if (text.length > 5 && !lower.includes('status') && !lower.includes('profile')) {
            return `Searching the VIP Global Database for "${text}"... Accessing top results. (Connect OpenRouter in Settings for real-time deep thoughts!)`;
        }

        const responses = [
            "VIP Intelligence Online. Monitoring flow state...",
            "Analyzing your current intent. Shall I optimize your next task?",
            "Focus peak detected. Now is the best time for high-impact work.",
            "Systems nominal. Ready for your next command, VIP."
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    };

    const handleSend = async () => {
        if (!inputText.trim() || isThinking) return;

        const currentInput = inputText;
        const newMsg = { role: 'user', text: currentInput };
        setMessages(prev => [...prev, newMsg]);
        setInputText('');
        setIsThinking(true);

        const responseText = await getAiResponse(currentInput);
        const aiMsg = { role: 'ai', text: responseText };
        setMessages(prev => [...prev, aiMsg]);
        setIsThinking(false);
    };

    // Auto-scroll
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <motion.div
            drag
            dragConstraints={{ left: -window.innerWidth + 100, right: 0, top: -window.innerHeight + 100, bottom: 0 }}
            dragElastic={0.1}
            dragMomentum={false}
            className="fixed bottom-10 right-10 flex flex-col items-end gap-3 z-[200] group cursor-move"
        >
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-80 h-[450px] glass rounded-3xl flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-blue-500/20 overflow-hidden"
                    >
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-blue-500/5">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">VIP AI CORE v3.0</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-white/20 hover:text-white transition-colors">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 custom-scroll scroll-smooth" ref={scrollRef}>
                            {messages.map((m, i) => (
                                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[11px] leading-relaxed font-medium ${m.role === 'user' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border border-white/10 text-white/80'}`}>
                                        {m.text}
                                    </div>
                                    <span className="text-[8px] text-white/10 mt-1 uppercase tracking-widest font-bold">
                                        {m.role === 'user' ? 'VIP' : 'AI'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                            {isThinking && (
                                <div className="flex flex-col items-start">
                                    <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl flex gap-1 items-center">
                                        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-white/[0.02] border-t border-white/10 flex gap-3">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Query the system or search web..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                            />
                            <button onClick={handleSend} className="w-11 h-11 flex items-center justify-center bg-blue-500 hover:bg-blue-600 rounded-xl text-white transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                                <Send size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel px-4 py-2 text-[9px] text-white/50 uppercase tracking-[0.2em] border border-blue-500/20 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.05)] mb-1 font-black"
                >
                    {actionCount > 10 ? "Efficiency peak detected" : "Global Brain Active"}
                </motion.div>
            )}

            <motion.div
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                animate={isOpen ? { scale: 0.8, opacity: 0.5, rotate: 0 } : {
                    y: [0, -10, 0],
                    filter: ["drop-shadow(0 0 15px rgba(59, 130, 246, 0.2))", "drop-shadow(0 0 35px rgba(59, 130, 246, 0.5))", "drop-shadow(0 0 15px rgba(59, 130, 246, 0.2))"]
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-16 h-16 rounded-3xl overflow-hidden border-2 border-blue-400/30 relative cursor-pointer group-hover:border-blue-400 transition-colors"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent mix-blend-overlay" />
                <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4&eyebrows=defaultNatural&eyes=squint&mouth=smile"
                    alt="AI Companion"
                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-700"
                />
            </motion.div>
        </motion.div>
    );
};

export default FocusCompanion;
