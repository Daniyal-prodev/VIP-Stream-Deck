import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import {
    Monitor,
    Mail,
    Settings,
    Volume2,
    Clock,
    ChevronDown,
    ChevronRight,
    HelpCircle,
    Bell,
    Activity,
    Minimize2,
    Plus,
    Edit2,
    ArrowLeft,
    Coffee,
    Zap,
    FileText,
    Calendar,
    Video,
    Play,
    Brain,
    Eye,
    Smartphone,
    Laptop,
    Tablet,
    Mic,
    Heart,
    CheckCircle,
    RefreshCw,
    AlertTriangle,
    Battery,
    Workflow
} from 'lucide-react';

// DnD Kit Imports
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Component/Panel Imports
import AlertWindow from './components/AlertWindow';
import MiniDeck from './components/MiniDeck';
import TileEditor from './components/TileEditor';
import SettingsModal from './components/SettingsModal';

// Productivity button definitions
const productivityButtons = [
    { id: 'email', name: 'Email Workflow', icon: Mail, color: 'blue' },
    { id: 'focus', name: 'Focus Mode', icon: CheckCircle, color: 'blue' },
    { id: 'break', name: 'Quick Break', icon: Coffee, color: 'orange' },
    { id: 'renner', name: 'Quick Renner', icon: Zap, color: 'orange' },
    { id: 'report', name: 'Weekly Report', icon: FileText, color: 'blue' },
    { id: 'schedule', name: 'Mood Schedule', icon: Calendar, color: 'purple' },
    { id: 'stream', name: 'Start Stream', icon: Play, color: 'blue' },
    { id: 'smart', name: 'Smart Schedule', icon: Brain, color: 'cyan' },
    { id: 'webinar1', name: 'Start Webinar', icon: Video, color: 'blue' },
    { id: 'webinar2', name: 'Start Webinar', icon: Video, color: 'blue' },
];

// New Panel Components for VIP Productivity Deck Theme
const SmartNotificationTriage = () => (
    <div className="side-panel">
        <div className="side-panel-header">
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <Bell size={12} className="text-green-400" />
            </div>
            <span className="side-panel-title">Smart Notification Triage</span>
        </div>
        <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-xs text-white/70">Important Alert Only</span>
                <div className="ml-auto w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <AlertTriangle size={10} className="text-yellow-400" />
                </div>
            </div>
            <div className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <span className="text-xs text-blue-400">4 Notifications Filtered</span>
            </div>
        </div>
    </div>
);

const AIConflictResolverPanel = () => (
    <div className="side-panel">
        <div className="side-panel-header">
            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                <AlertTriangle size={12} className="text-orange-400" />
            </div>
            <span className="side-panel-title">AI Conflict Resolver</span>
            <ChevronDown size={14} className="text-white/40 ml-auto" />
        </div>
        <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-xs text-white/70">Schedule Conflict Detected</span>
                <ChevronRight size={14} className="text-white/40 ml-auto" />
            </div>
            <div className="flex gap-2">
                <button className="btn-primary flex-1">Reschedule</button>
                <button className="btn-orange flex-1">Auto-Resolve</button>
            </div>
        </div>
    </div>
);

const EnergyPeakTimePanel = () => (
    <div className="side-panel">
        <div className="side-panel-header">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Battery size={12} className="text-cyan-400" />
            </div>
            <span className="side-panel-title">Energy Peak Time</span>
        </div>
        <div className="space-y-2">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-xs text-white/70">Optimal Productivity Now:</span>
                <span className="text-xs text-cyan-400 font-medium">Now</span>
                <ChevronRight size={14} className="text-cyan-400" />
            </div>
            <div className="px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <span className="text-xs text-green-400">Suggestions Ready</span>
            </div>
        </div>
    </div>
);

const WorkflowAutomationPanel = () => (
    <div className="side-panel">
        <div className="side-panel-header">
            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Settings size={12} className="text-purple-400" />
            </div>
            <span className="side-panel-title">Workflow Automation</span>
        </div>
        <div className="space-y-2">
            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <span className="text-xs text-white/70">Multi-Step Task Sequences</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Play size={14} className="text-orange-400" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Brain size={14} className="text-blue-400" />
                </div>
                <span className="text-[10px] text-white/50 ml-1">AI Profiles</span>
            </div>
        </div>
    </div>
);

const MoodDetectionPanel = () => (
    <div className="side-panel">
        <div className="side-panel-header">
            <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center">
                <Heart size={12} className="text-pink-400" />
            </div>
            <span className="side-panel-title">Mood Detection</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
            {/* Face Avatar */}
            <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center overflow-hidden">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffd5c8] to-[#f5c4b8] relative">
                        {/* Hair */}
                        <div className="absolute -top-1 -left-0.5 -right-0.5 h-5 bg-gradient-to-br from-blue-800 to-blue-600 rounded-t-full" />
                        {/* Eyes */}
                        <div className="absolute top-4 left-1.5 w-1.5 h-1.5 bg-blue-900 rounded-full" />
                        <div className="absolute top-4 right-1.5 w-1.5 h-1.5 bg-blue-900 rounded-full" />
                        {/* Smile */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-2 h-1 border-b-2 border-pink-400 rounded-b-full" />
                    </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-deck-dark" />
            </div>
            <div className="flex-1">
                <div className="text-xs text-white/70">Mood:</div>
                <div className="text-sm font-medium text-white">Focused</div>
            </div>
            <div className="flex flex-col gap-1">
                <span className="badge badge-purple text-[8px]">Attention</span>
                <span className="badge badge-blue text-[8px]">UI Adapting</span>
            </div>
        </div>
    </div>
);

const CrossDeviceSyncPanel = () => (
    <div className="side-panel">
        <div className="side-panel-header">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                <RefreshCw size={12} className="text-blue-400" />
            </div>
            <span className="side-panel-title">Cross-Device Sync</span>
        </div>
        <div className="flex items-center justify-center gap-4 py-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Monitor size={18} className="text-blue-400" />
            </div>
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Tablet size={18} className="text-green-400" />
            </div>
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Laptop size={18} className="text-purple-400" />
            </div>
        </div>
        <div className="text-center text-[10px] text-white/50">All Devices Connected</div>
    </div>
);

const VoiceInteractionPanel = () => (
    <div className="side-panel">
        <div className="side-panel-header">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Mic size={12} className="text-cyan-400" />
            </div>
            <span className="side-panel-title">Voice Interaction</span>
        </div>
        <div className="flex gap-3">
            {/* AI Avatar Character */}
            <div className="relative flex-shrink-0">
                <div className="ai-avatar-glow" />
                <div className="w-16 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex flex-col items-center justify-end overflow-hidden relative z-10 pb-1">
                    {/* Avatar Face */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffd5c8] to-[#f5c4b8] relative mb-1">
                        {/* Hair */}
                        <div className="absolute -top-2 -left-1 -right-1 h-8 bg-gradient-to-br from-blue-800 to-blue-600 rounded-t-full" />
                        <div className="absolute top-4 left-1 w-2 h-4 bg-gradient-to-b from-blue-700 to-blue-500 rounded-b-full" />
                        <div className="absolute top-4 right-1 w-2 h-4 bg-gradient-to-b from-blue-700 to-blue-500 rounded-b-full" />
                        {/* Eyes */}
                        <div className="absolute top-5 left-2 w-2 h-2 bg-blue-900 rounded-full" />
                        <div className="absolute top-5 right-2 w-2 h-2 bg-blue-900 rounded-full" />
                        {/* Smile */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-1.5 border-b-2 border-pink-400 rounded-b-full" />
                    </div>
                    {/* Headset */}
                    <div className="absolute top-6 -right-0.5 w-3 h-3 bg-cyan-400 rounded-full flex items-center justify-center">
                        <Mic size={6} className="text-white" />
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-2">
                <div className="text-xs text-cyan-400 animate-pulse">Listening...</div>
                <div className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30">
                    <span className="text-[10px] text-purple-400">Schedule Meeting</span>
                </div>
                <div className="text-[10px] text-white/50">How can I assist you today?</div>
            </div>
        </div>
    </div>
);

const PredictiveTaskDeck = () => (
    <div className="side-panel flex-1">
        <div className="side-panel-header">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Brain size={12} className="text-blue-400" />
            </div>
            <span className="side-panel-title">Predictive Task Deck</span>
        </div>
        <div className="flex items-center gap-2">
            <CheckCircle size={14} className="text-blue-400" />
            <span className="text-xs text-white/70">AI-Powered Button Reordering</span>
        </div>
    </div>
);

const FocusEnhancementPanel = () => (
    <div className="side-panel flex-1">
        <div className="side-panel-header">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <Eye size={12} className="text-cyan-400" />
            </div>
            <span className="side-panel-title">Focus Enhancement</span>
        </div>
        <div className="flex items-center gap-2">
            <Mail size={14} className="text-purple-400" />
            <span className="text-xs text-white/70">Distraction Blocking & Ambient Sound</span>
        </div>
    </div>
);

const InvacySchedulingPanel = () => (
    <div className="side-panel flex-1">
        <div className="side-panel-header">
            <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center">
                <Calendar size={12} className="text-pink-400" />
            </div>
            <span className="side-panel-title">Invacy Scheduling</span>
        </div>
        <div className="flex items-center gap-2">
            <Heart size={14} className="text-pink-400" />
            <span className="text-xs text-white/70">AI-Pos Coneder Butternice Beterims</span>
        </div>
    </div>
);

const AdvancedSchedulingPanel = () => (
    <div className="side-panel flex-1">
        <div className="side-panel-header">
            <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <Heart size={12} className="text-red-400" />
            </div>
            <span className="side-panel-title">Advanced Scheduling</span>
        </div>
        <div className="flex items-center gap-2">
            <Heart size={14} className="text-red-400" />
            <span className="text-xs text-white/70">Priority & Context-Aware Alerts</span>
        </div>
    </div>
);

const ProductivityButton = ({ button, onClick }) => {
    const Icon = button.icon;
    const colorClasses = {
        blue: 'text-blue-400 border-blue-500/30 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]',
        orange: 'text-orange-400 border-orange-500/30 hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]',
        purple: 'text-purple-400 border-purple-500/30 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]',
        cyan: 'text-cyan-400 border-cyan-500/30 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`productivity-btn ${colorClasses[button.color] || colorClasses.blue}`}
        >
            <Icon size={24} strokeWidth={1.5} />
            <span className="text-[10px] text-white/70 font-medium text-center leading-tight">
                {button.name}
            </span>
        </motion.button>
    );
};

const SortableTile = ({ tile, volume, onEnterFolder, onUiAction }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: tile.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const Icon = LucideIcons[tile.icon] || HelpCircle;
    const isImage = tile.icon && (tile.icon.includes('.') || tile.icon.startsWith('http'));

    const [countdown, setCountdown] = useState(null);

    useEffect(() => {
        let interval;
        if (tile.actions) {
            const timerAction = tile.actions.find(a => a.type === 'timer');
            if (timerAction && timerAction.endTime) {
                interval = setInterval(() => {
                    const now = Date.now();
                    const diff = Math.max(0, Math.ceil((timerAction.endTime - now) / 1000));
                    if (diff === 0) setCountdown(null);
                    else {
                        const mins = Math.floor(diff / 60);
                        const secs = diff % 60;
                        setCountdown(`${mins}:${secs.toString().padStart(2, '0')}`);
                    }
                }, 1000);
            }
        }
        return () => clearInterval(interval);
    }, [tile.actions]);

    const handleClick = async () => {
        if (tile.type === 'folder') {
            onEnterFolder();
            return;
        }

        if (tile.actions && Array.isArray(tile.actions)) {
            for (const action of tile.actions) {
                if (action.type === 'ui') {
                    onUiAction(action);
                    continue;
                }
                if (action.type === 'sound') {
                    try {
                        const audio = new Audio(action.value);
                        audio.volume = volume;
                        await audio.play();
                    } catch (err) {
                        console.error("Failed to play sound:", err);
                    }
                    continue;
                }

                const actionWithVolume = action.type === 'sound' ? { ...action, volume } : action;
                if (actionWithVolume.type === 'log') {
                    console.log(actionWithVolume.value);
                } else {
                    await window.electronAPI.executeAction(actionWithVolume);
                }
            }
        }
    };

    const getBorderColor = () => {
        if (tile.urgency === 'high') return 'border-red-500/50';
        if (tile.urgency === 'medium') return 'border-orange-500/40';
        return 'border-blue-500/20';
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <motion.div
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleClick}
                className={`productivity-btn relative group cursor-pointer ${getBorderColor()}`}
            >
                <div className="tile-glow" />

                {countdown && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-orange-500/80 text-[9px] font-bold text-white">
                        {countdown}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${tile.color || 'text-blue-400'} transition-all duration-300 group-hover:scale-110`}
                >
                    {isImage ? (
                        <img src={tile.icon} alt={tile.name} className="w-8 h-8 object-contain" />
                    ) : (
                        <Icon size={28} strokeWidth={1.5} />
                    )}
                </motion.div>
                <span className="text-[10px] text-white/70 font-medium text-center leading-tight group-hover:text-white transition-colors">
                    {tile.name}
                </span>
                {tile.hotkey && (
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[8px] font-mono text-white/30">{tile.hotkey.split('+').pop()}</span>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const SortableSidebarItem = ({ id, children, isCollapsed, onToggle }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group">
            <div className="flex items-center gap-2 mb-2 px-1 relative z-10">
                <div {...attributes} {...listeners} className="p-1 rounded hover:bg-white/5 cursor-grab active:cursor-grabbing text-white/10 hover:text-white/30 transition-colors">
                    <LucideIcons.GripVertical size={12} />
                </div>
                <button
                    onClick={onToggle}
                    className="flex-1 text-left text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white/40 transition-colors"
                >
                    {id.replace(/([A-Z])/g, ' $1').trim()}
                </button>
                <div className="h-[1px] flex-1 bg-white/5" />
            </div>
            <motion.div
                initial={false}
                animate={{
                    height: isCollapsed ? 0 : 'auto',
                    opacity: isCollapsed ? 0 : 1
                }}
                className="overflow-hidden"
            >
                {children}
            </motion.div>
        </div>
    );
};

function App() {
    const [profiles, setProfiles] = useState([]);
    const [activeProfile, setActiveProfile] = useState(null);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [isAlertMode, setIsAlertMode] = useState(false);
    const [navigationStack, setNavigationStack] = useState([]); // Array of folder objects
    const [isHyperFocus, setIsHyperFocus] = useState(false);
    const [systemStats, setSystemStats] = useState({ cpu: 0, mem: 0 });
    const [actionCount, setActionCount] = useState(0);

    const [initStatus, setInitStatus] = useState("Waking up...");
    const [schedules, setSchedules] = useState([]);
    const [activeAlert, setActiveAlert] = useState(null);

    const [leftSidebarOrder, setLeftSidebarOrder] = useState(['SmartTriage', 'AIConflictResolver', 'EnergyPeakTime']);
    const [rightSidebarOrder, setRightSidebarOrder] = useState(['MoodDetection', 'SchedulePanel', 'NetworkStatus', 'GamificationRewards', 'VoiceCommand']);
    const [collapsedPanels, setCollapsedPanels] = useState({});

    const [editingTile, setEditingTile] = useState(null);
    const [isAddingTile, setIsAddingTile] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

    const togglePanel = (id) => setCollapsedPanels(prev => ({ ...prev, [id]: !prev[id] }));

    const [audioUnlocked, setAudioUnlocked] = useState(false);

    const unlockAudio = () => {
        if (!audioUnlocked) {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            if (context.state === 'suspended') {
                context.resume();
            }
            // Play a tiny silent buffer
            const buffer = context.createBuffer(1, 1, 22050);
            const source = context.createBufferSource();
            source.buffer = buffer;
            source.connect(context.destination);
            source.start(0);
            setAudioUnlocked(true);
            console.log("VIP Audio System Unlocked");
        }
    };

    const [countdown, setCountdown] = useState("--:--");
    const [nextTaskName, setNextTaskName] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const currentTimeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

            const upcoming = schedules
                .filter(s => !s.completed && s.startTime > currentTimeStr)
                .sort((a, b) => a.startTime.localeCompare(b.startTime))[0];

            if (upcoming) {
                setNextTaskName(upcoming.title);
                const [targetH, targetM] = upcoming.startTime.split(':').map(Number);
                const targetDate = new Date();
                targetDate.setHours(targetH, targetM, 0, 0);

                const diff = targetDate - now;
                if (diff > 0) {
                    const mins = Math.floor(diff / 60000);
                    const secs = Math.floor((diff % 60000) / 1000);
                    setCountdown(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
                } else {
                    setCountdown("00:00");
                }
            } else {
                setNextTaskName("");
                setCountdown("--:--");
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [schedules]);

    const handleUpdateSchedule = (updated) => {
        setSchedules(prev => prev.map(s => s.id === updated.id ? updated : s));
    };

    const handleSidebarDragEnd = (event, type) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const setOrder = type === 'left' ? setLeftSidebarOrder : setRightSidebarOrder;
            setOrder((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    useEffect(() => {
        // Schedule checking interval for persistent alerts
        const checkSchedules = () => {
            const now = new Date();
            const nowStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

            const active = schedules.find(s => {
                if (s.completed || dismissedAlerts.has(s.id)) return false;
                // Check if now is within [startTime, endTime)
                return s.startTime <= nowStr && nowStr < s.endTime;
            });

            if (active) {
                if (!activeAlert || activeAlert.id !== active.id) {
                    triggerStickyNote(active);
                }
            } else if (activeAlert) {
                // Auto-clear when time expires
                setActiveAlert(null);
            }
        };

        const interval = setInterval(checkSchedules, 5000);
        return () => clearInterval(interval);
    }, [schedules, activeAlert, dismissedAlerts]);

    const triggerStickyNote = (item) => {
        const alertData = {
            id: item.id,
            title: item.title,
            body: `Ongoing Focus: ${item.startTime} - ${item.endTime}`,
            sound: 'alert.mp3',
            volume: 1.0,
            isSticky: true
        };
        setActiveAlert(alertData);
    };

    const handleDismissAlert = (alertId) => {
        setActiveAlert(null);
        if (alertId) {
            setDismissedAlerts(prev => new Set([...prev, alertId]));
        }
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            if (window.electronAPI?.getSystemStats) {
                const stats = await window.electronAPI.getSystemStats();
                setSystemStats(stats);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Helper to increment count for non-UI actions
    const incrementActionCount = () => setActionCount(prev => prev + 1);

    useEffect(() => {
        // Mock electronAPI for browser development
        if (!window.electronAPI) {
            console.log("Injecting Mock electronAPI for browser testing");
            window.electronAPI = {
                getProfiles: async () => ['default', 'work'],
                loadProfile: async (name) => {
                    // Return mock profile data for browser testing
                    return {
                        name: name,
                        tiles: [
                            { id: 'tile-1', name: 'Email', icon: 'Mail', actions: [{ type: 'log', value: 'Email clicked' }] },
                            { id: 'tile-2', name: 'Focus', icon: 'Eye', actions: [{ type: 'log', value: 'Focus clicked' }] },
                            { id: 'tile-3', name: 'Break', icon: 'Coffee', actions: [{ type: 'log', value: 'Break clicked' }] },
                            { id: 'tile-4', name: 'Tasks', icon: 'CheckCircle', actions: [{ type: 'log', value: 'Tasks clicked' }] },
                            { id: 'tile-5', name: 'Calendar', icon: 'Calendar', actions: [{ type: 'log', value: 'Calendar clicked' }] },
                            { id: 'tile-6', name: 'Notes', icon: 'FileText', actions: [{ type: 'log', value: 'Notes clicked' }] },
                            { id: 'tile-7', name: 'Stream', icon: 'Play', actions: [{ type: 'log', value: 'Stream clicked' }] },
                            { id: 'tile-8', name: 'Schedule', icon: 'Brain', actions: [{ type: 'log', value: 'Schedule clicked' }] },
                        ],
                        schedules: []
                    };
                },
                executeAction: async (action) => {
                    console.log("Mock Execute Action:", action);
                    return { success: true };
                },
                getSystemStats: async () => ({
                    cpu: Math.floor(Math.random() * 30) + 10,
                    mem: Math.floor(Math.random() * 40) + 20
                }),
                onTriggerTile: () => { },
                onContextChanged: () => { }
            };
        }

        const params = new URLSearchParams(window.location.search);

        // Mini Mode Check
        const mode = params.get('mode');

        const alertData = params.get('alert');
        if (alertData) {
            window.alertData = JSON.parse(decodeURIComponent(alertData));
            setIsAlertMode(true);
            return;
        }

        const applyProfileData = (profile) => {
            if (!profile) return;
            setActiveProfile(profile);
            if (profile.schedules) setSchedules(profile.schedules);
            if (profile.leftSidebarOrder) setLeftSidebarOrder(profile.leftSidebarOrder);
            if (profile.rightSidebarOrder) setRightSidebarOrder(profile.rightSidebarOrder);
            if (profile.collapsedPanels) setCollapsedPanels(profile.collapsedPanels);
        };

        const initProfiles = async () => {
            setInitStatus("Connecting to System...");
            const timeout = setTimeout(() => {
                if (!activeProfile && !mode) {
                    setInitStatus("Initialization is taking longer than expected...");
                    console.warn("Profile initialization is taking longer than expected...");
                }
            }, 5000);

            try {
                if (!window.electronAPI) {
                    setInitStatus("Error: electronAPI not found");
                    console.error("electronAPI not found in window! Check preload script.");
                    return;
                }
                setInitStatus("Checking Profiles...");
                const names = await window.electronAPI.getProfiles();
                setProfiles(names);
                if (names.length > 0) {
                    setInitStatus(`Loading Profile: ${names[0]}...`);
                    const profile = await window.electronAPI.loadProfile(names[0]);
                    if (profile && profile.tiles) {
                        setInitStatus("Success! Rendering Dashboard...");
                        applyProfileData(profile);
                    } else {
                        setInitStatus("Error: Profile data missing tiles");
                    }
                } else {
                    setInitStatus("No profiles found");
                }

                if (window.electronAPI.onTriggerTile) {
                    window.electronAPI.onTriggerTile((tileId) => {
                        console.log("Global Hotkey Triggered Tile:", tileId);
                    });
                }

            } catch (err) {
                setInitStatus(`Error: ${err.message}`);
                console.error("Failed to initialize profiles:", err);
            } finally {
                clearTimeout(timeout);
            }
        };

        if (mode !== 'mini') {
            initProfiles();
        } else {
            const loadMini = async () => {
                try {
                    const names = await window.electronAPI.getProfiles();
                    if (names.length > 0) {
                        const profile = await window.electronAPI.loadProfile(names[0]);
                        applyProfileData(profile);
                    }
                } catch (e) { console.error(e); }
            }
            loadMini();
        }
    }, []);

    const getCurrentTiles = () => {
        if (navigationStack.length === 0) {
            return activeProfile ? activeProfile.tiles : [];
        }
        const currentFolder = navigationStack[navigationStack.length - 1];
        return currentFolder.children || [];
    };

    const currentTiles = getCurrentTiles();

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = currentTiles.findIndex(t => t.id === active.id);
            const newIndex = currentTiles.findIndex(t => t.id === over.id);
            const newTiles = arrayMove(currentTiles, oldIndex, newIndex);

            // Update the state based on where we are
            if (navigationStack.length === 0) {
                setActiveProfile({ ...activeProfile, tiles: newTiles });
            } else {
                const newStack = [...navigationStack];
                newStack[newStack.length - 1].children = newTiles;
                setNavigationStack(newStack);
            }
        }
    };

    const enterFolder = (folderTile) => {
        setNavigationStack([...navigationStack, folderTile]);
    };

    const navigateUp = () => {
        setNavigationStack(navigationStack.slice(0, -1));
    };

    const switchProfile = async (name) => {
        try {
            const profile = await window.electronAPI.loadProfile(name);
            applyProfileData(profile); // Use helper to apply all state
            setIsProfileMenuOpen(false);
        } catch (err) {
            console.error("Failed to switch profile:", err);
        }
    };

    const handleUiAction = (action) => {
        setActionCount(prev => prev + 1);
        if (action.action === 'toggleHyperFocus') {
            setIsHyperFocus(prev => !prev);
        }
    };

    const saveProfileData = async (profile, currentSchedules, currentLeft, currentRight, currentCollapsed) => {
        if (!profile || !profile.name || !window.electronAPI.saveProfile) return;

        const fullData = {
            ...profile,
            schedules: currentSchedules,
            leftSidebarOrder: currentLeft,
            rightSidebarOrder: currentRight,
            collapsedPanels: currentCollapsed
        };

        await window.electronAPI.saveProfile({
            name: fullData.name,
            data: fullData
        });
    };

    // Auto-save effect for all persistent data
    useEffect(() => {
        if (activeProfile) {
            const timer = setTimeout(() => {
                saveProfileData(activeProfile, schedules, leftSidebarOrder, rightSidebarOrder, collapsedPanels);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [activeProfile, schedules, leftSidebarOrder, rightSidebarOrder, collapsedPanels]);

    const handleSaveTile = async (tileData) => {
        const updatedProfile = JSON.parse(JSON.stringify(activeProfile));

        const updateRecursive = (tiles) => {
            const index = tiles.findIndex(t => t.id === tileData.id);
            if (index > -1) {
                tiles[index] = tileData;
                return true;
            }
            for (let t of tiles) {
                if (t.type === 'folder' && t.children) {
                    if (updateRecursive(t.children)) return true;
                }
            }
            return false;
        };

        const exists = updateRecursive(updatedProfile.tiles);

        if (!exists) {
            if (navigationStack.length === 0) {
                updatedProfile.tiles.push(tileData);
            } else {
                const currentFolder = navigationStack[navigationStack.length - 1];
                const addToFolder = (tiles) => {
                    for (let t of tiles) {
                        if (t.id === currentFolder.id) {
                            if (!t.children) t.children = [];
                            t.children.push(tileData);
                            return true;
                        }
                        if (t.type === 'folder' && t.children) {
                            if (addToFolder(t.children)) return true;
                        }
                    }
                    return false;
                };
                addToFolder(updatedProfile.tiles);
            }
        }

        setActiveProfile(updatedProfile);
        setEditingTile(null);
        setIsAddingTile(false);
    };

    const handleDeleteTile = async (tileId) => {
        const updatedProfile = JSON.parse(JSON.stringify(activeProfile));

        const deleteRecursive = (tiles) => {
            const index = tiles.findIndex(t => t.id === tileId);
            if (index > -1) {
                tiles.splice(index, 1);
                return true;
            }
            for (let t of tiles) {
                if (t.type === 'folder' && t.children) {
                    if (deleteRecursive(t.children)) return true;
                }
            }
            return false;
        };

        deleteRecursive(updatedProfile.tiles);
        setActiveProfile(updatedProfile);
        setEditingTile(null);
    };

    // Check for Mini Mode Render
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'mini') {
        const executeAction = (action) => window.electronAPI.executeAction(action);
        return <MiniDeck activeProfile={activeProfile || { tiles: [], name: 'Loading...' }} executeAction={executeAction} />;
    }

    if (isAlertMode) return <AlertWindow />;

    if (!activeProfile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 relative">
                <div className="starfield" />
                <div className="ambient-glow ambient-glow-blue w-[600px] h-[600px] top-0 left-1/4" />
                <div className="ambient-glow ambient-glow-orange w-[400px] h-[400px] bottom-0 right-1/4" />
                <div className="relative z-10">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Monitor size={20} className="text-blue-500 animate-pulse" />
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2 relative z-10">
                    <div className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-bold">VIP Productivity Deck</div>
                    <div className="text-blue-400/60 text-[9px] uppercase tracking-widest animate-pulse">{initStatus}</div>
                </div>
                {!window.electronAPI && (
                    <div className="mt-8 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl relative z-10">
                        <div className="text-red-500 text-[8px] uppercase tracking-widest font-black flex items-center gap-2">
                            <AlertTriangle size={12} /> Warning: System Bridge Offline
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div onClick={unlockAudio} className="h-screen w-screen flex flex-col overflow-hidden relative">
            {/* Starfield Background */}
            <div className="starfield" />
            
            {/* Ambient Glow Effects */}
            <div className="ambient-glow ambient-glow-blue w-[600px] h-[600px] -top-40 left-1/4" />
            <div className="ambient-glow ambient-glow-orange w-[400px] h-[400px] -bottom-20 right-1/3" />
            <div className="ambient-glow ambient-glow-blue w-[300px] h-[300px] top-1/2 -right-20" />

            {/* Header */}
            <header className="relative z-10 px-8 py-4 flex flex-col items-center">
                <h1 className="text-4xl font-bold tracking-wide">
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        VIP Productivity Deck
                    </span>
                </h1>
                <p className="text-white/50 text-sm tracking-widest mt-1">Enterprise-Level Productivity Redefined</p>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex gap-4 px-4 pb-4 relative z-10 overflow-hidden">
                {/* Left Sidebar */}
                <aside className="w-64 flex flex-col gap-3 overflow-y-auto custom-scroll">
                    <SmartNotificationTriage />
                    <AIConflictResolverPanel />
                    <EnergyPeakTimePanel />
                    {/* Workflow Automation at bottom left */}
                    <div className="mt-auto">
                        <WorkflowAutomationPanel />
                    </div>
                </aside>

                {/* Center Content */}
                <main className="flex-1 flex flex-col gap-4 min-w-0">
                    {/* Main Grid Panel */}
                    <div className="flex-1 glass-panel p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-orange-500/5 pointer-events-none" />
                        
                        {/* Profile Selector & Controls */}
                        <div className="flex justify-between items-center mb-4 relative z-10">
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="glass px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
                                >
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                    {activeProfile.name}
                                    <ChevronDown size={14} className={`transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isProfileMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 mt-2 w-48 glass-panel p-1 z-50"
                                        >
                                            {profiles.map(name => (
                                                <button
                                                    key={name}
                                                    onClick={() => switchProfile(name)}
                                                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${activeProfile.name.toLowerCase() === name.toLowerCase() ? 'bg-blue-500/20 text-blue-400' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}
                                                >
                                                    {name}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditMode(!isEditMode)}
                                    className={`p-2 rounded-lg transition-all ${isEditMode ? 'bg-blue-500 text-white' : 'glass text-white/40 hover:text-white'}`}
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => setIsSettingsOpen(true)}
                                    className="p-2 rounded-lg glass text-white/40 hover:text-white transition-all"
                                >
                                    <Settings size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Navigation */}
                        {navigationStack.length > 0 && (
                            <button
                                onClick={navigateUp}
                                className="mb-4 px-3 py-1.5 rounded-lg glass text-sm text-blue-400 hover:text-white flex items-center gap-2"
                            >
                                <ArrowLeft size={14} /> Back
                            </button>
                        )}

                        {/* Productivity Grid - Always show productivity buttons with timer */}
                        <div className="grid grid-cols-4 gap-3 relative z-10">
                            {/* Row 1: Email Workflow, Focus Mode, Quick Break, Quick Renner */}
                            {productivityButtons.slice(0, 4).map(btn => (
                                <ProductivityButton key={btn.id} button={btn} onClick={() => console.log(btn.name)} />
                            ))}
                            
                            {/* Row 2: Weekly Report, Timer (spans 2), Mood Schedule */}
                            <ProductivityButton button={productivityButtons[4]} onClick={() => {}} />
                            
                            {/* Timer Display - Center of grid */}
                            <div className="col-span-2 timer-display">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <Clock size={18} className="text-blue-400" />
                                    <span className="text-xs text-white/60">Next Task in</span>
                                </div>
                                <div className="text-4xl font-bold text-white tracking-wider">{countdown === '--:--' ? '05:32' : countdown}</div>
                            </div>
                            
                            <ProductivityButton button={productivityButtons[5]} onClick={() => {}} />
                            
                            {/* Row 3: Start Stream, Smart Schedule, Start Webinar, Start Webinar */}
                            {productivityButtons.slice(6).map(btn => (
                                <ProductivityButton key={btn.id} button={btn} onClick={() => console.log(btn.name)} />
                            ))}
                        </div>
                    </div>

                    {/* Bottom Panels - 2x2 Grid Layout */}
                    <div className="grid grid-cols-2 gap-3">
                        <PredictiveTaskDeck />
                        <FocusEnhancementPanel />
                        <InvacySchedulingPanel />
                        <AdvancedSchedulingPanel />
                    </div>
                </main>

                {/* Right Sidebar */}
                <aside className="w-72 flex flex-col gap-3 overflow-y-auto custom-scroll">
                    <MoodDetectionPanel />
                    <CrossDeviceSyncPanel />
                    <VoiceInteractionPanel />
                    
                    {/* System Stats */}
                    <div className="side-panel mt-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <Activity size={14} className="text-blue-400" />
                            <span className="text-xs text-white/70">System Status</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-white/50">CPU</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ width: `${systemStats.cpu}%` }}
                                            className={`h-full ${systemStats.cpu > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                                        />
                                    </div>
                                    <span className="text-[10px] text-white/50 w-8">{systemStats.cpu}%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] text-white/50">Memory</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ width: `${systemStats.mem}%` }}
                                            className={`h-full ${systemStats.mem > 80 ? 'bg-red-500' : 'bg-purple-500'}`}
                                        />
                                    </div>
                                    <span className="text-[10px] text-white/50 w-8">{systemStats.mem}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Footer */}
            <footer className="relative z-10 px-8 py-2 flex justify-between items-center border-t border-white/5">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] text-white/30">Build v2.0.0</span>
                    <button
                        onClick={() => window.electronAPI.openMiniMode()}
                        className="text-[10px] text-blue-400/50 hover:text-blue-400 flex items-center gap-1"
                    >
                        <Minimize2 size={10} /> Mini Mode
                    </button>
                </div>
                <div className="flex items-center gap-4">
                    <Volume2 size={14} className="text-white/30" />
                    <div className="w-24 h-1 bg-white/10 rounded-full relative">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <motion.div
                            animate={{ width: `${volume * 100}%` }}
                            className="h-full bg-blue-500 rounded-full"
                        />
                    </div>
                </div>
            </footer>

            {/* STICKY NOTE / ALERT OVERLAY */}
            <AnimatePresence>
                {activeAlert && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
                        <div className="pointer-events-auto">
                            <AlertWindow
                                data={activeAlert}
                                onDismiss={() => handleDismissAlert(activeAlert.id)}
                            />
                        </div>
                    </div>
                )}
            </AnimatePresence>
            {(editingTile || isAddingTile) && (
                <TileEditor
                    tile={editingTile}
                    onClose={() => {
                        setEditingTile(null);
                        setIsAddingTile(false);
                    }}
                    onSave={handleSaveTile}
                    onDelete={() => handleDeleteTile(editingTile?.id)}
                />
            )}
            {/* SETTINGS MODAL */}
            {isSettingsOpen && (
                <SettingsModal
                    onClose={() => setIsSettingsOpen(false)}
                    profile={activeProfile}
                    onUpdateProfile={setActiveProfile}
                    globalVolume={volume}
                    onUpdateVolume={setVolume}
                />
            )}
        </div>
    );
}

export default App;
