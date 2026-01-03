import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import {
    Monitor,
    Music,
    MessageSquare,
    Settings,
    Cpu,
    Terminal,
    Layout,
    Volume2,
    Clock,
    Chrome,
    Github,
    Youtube,
    ChevronDown,
    HelpCircle,
    Bell,
    Activity,
    Maximize2,
    Minimize2
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
    verticalListSortingStrategy,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Component/Panel Imports
import AlertWindow from './components/AlertWindow';
import FocusCompanion from './components/FocusCompanion';
import SmartTriage from './components/panels/SmartTriage';
import AIConflictResolver from './components/panels/AIConflictResolver';
import EnergyPeakTime from './components/panels/EnergyPeakTime';
import MoodDetection from './components/panels/MoodDetection';
import GamificationRewards from './components/panels/GamificationRewards';
import VoiceCommand from './components/panels/VoiceCommand';
import NetworkStatus from './components/panels/NetworkStatus';
import MiniDeck from './components/MiniDeck';
import SchedulePanel from './components/panels/SchedulePanel';
import TileEditor from './components/TileEditor';
import SettingsModal from './components/SettingsModal';
import { Plus, Edit2 } from 'lucide-react';

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

    // Check if countdown is active for this tile
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

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClick}
                className={`tile relative glass group cursor-pointer aspect-square rounded-3xl flex flex-col items-center justify-center gap-3 transition-colors hover:glass-hover overflow-hidden border shadow-2xl ${tile.urgency === 'high' ? 'border-red-500/50 shadow-red-900/20' : tile.urgency === 'medium' ? 'border-orange-500/40' : 'border-white/5'}`}
            >
                <div className={`tile-glow ${tile.urgency === 'high' ? 'opacity-100 bg-red-500/30 animate-pulse' : tile.urgency === 'medium' ? 'opacity-70 bg-orange-500/20' : ''}`} />

                {countdown && (
                    <div className="absolute top-3 right-3 px-1.5 py-0.5 rounded-md bg-blue-500/80 text-[8px] font-bold text-white uppercase tracking-tighter">
                        {countdown}
                    </div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${tile.urgency === 'high' ? 'text-red-400' : tile.urgency === 'medium' ? 'text-orange-400' : tile.color || 'text-white/60'} transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_currentColor]`}
                >
                    {isImage ? (
                        <img src={tile.icon} alt={tile.name} className="w-10 h-10 object-contain shadow-2xl" />
                    ) : (
                        <Icon size={32} strokeWidth={1.5} />
                    )}
                </motion.div>
                <div className="flex flex-col items-center gap-1">
                    <span className={`text-[9px] uppercase tracking-[0.2em] font-black group-hover:text-white transition-colors ${tile.urgency === 'high' ? 'text-red-400 animate-pulse' : 'text-white/40'}`}>
                        {tile.name}
                    </span>
                    {tile.hotkey && (
                        <div className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[7px] font-mono text-white/30 uppercase">{tile.hotkey.split('+').pop()}</span>
                        </div>
                    )}
                </div>
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
                    const response = await fetch(`/profiles/${name}.json`);
                    return await response.json();
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
            <div className="min-h-screen bg-[#030305] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Monitor size={20} className="text-blue-500 animate-pulse" />
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="text-white/40 uppercase tracking-[0.4em] text-[10px] font-bold">VIP Interface Initializing</div>
                    <div className="text-blue-400/60 text-[9px] uppercase tracking-widest animate-pulse">{initStatus}</div>
                </div>
                {!window.electronAPI && (
                    <div className="mt-8 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <div className="text-red-500 text-[8px] uppercase tracking-widest font-black flex items-center gap-2">
                            <LucideIcons.AlertTriangle size={12} /> Warning: System Bridge Offline
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            onClick={unlockAudio}
            style={{
                '--accent-color': activeProfile?.settings?.accentColor || '#3b82f6',
                '--glass-bg': `rgba(255, 255, 255, ${activeProfile?.settings?.transparency / 10 || 0.03})`,
                '--glass-border': `rgba(255, 255, 255, ${(activeProfile?.settings?.transparency / 10) * 2 || 0.08})`,
            }}
            className="h-screen w-screen p-6 flex gap-6 overflow-hidden bg-premium-bg relative"
        >
            {/* Background Decorative Blur */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

            {/* LEFT SIDEBAR */}
            <AnimatePresence>
                {!isHyperFocus && (
                    <motion.aside
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0, width: 280 }}
                        exit={{ opacity: 0, x: -50, width: 0 }}
                        className="flex flex-col gap-6 shrink-0 h-full overflow-y-auto pr-2 custom-scroll"
                    >
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(e) => handleSidebarDragEnd(e, 'left')}
                        >
                            <SortableContext items={leftSidebarOrder} strategy={verticalListSortingStrategy}>
                                {leftSidebarOrder.map(id => (
                                    <SortableSidebarItem
                                        key={id}
                                        id={id}
                                        isCollapsed={collapsedPanels[id]}
                                        onToggle={() => togglePanel(id)}
                                    >
                                        {id === 'SmartTriage' && <SmartTriage schedules={schedules} />}
                                        {id === 'AIConflictResolver' && (
                                            <AIConflictResolver
                                                schedules={schedules}
                                                onUpdateSchedule={handleUpdateSchedule}
                                            />
                                        )}
                                        {id === 'EnergyPeakTime' && <EnergyPeakTime schedules={schedules} />}
                                    </SortableSidebarItem>
                                ))}
                            </SortableContext>
                        </DndContext>

                        <div className="glass-panel p-5 mt-auto border-l-2 border-white/10 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                    <Activity size={16} className="text-white/40" />
                                </div>
                                <div>
                                    <p className="text-[9px] text-white/30 uppercase tracking-widest">System Load</p>
                                    <p className="text-[11px] font-bold text-white/80">OPTIMAL</p>
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* MAIN CENTER SECTION */}
            <main className="flex-1 flex flex-col gap-6 min-w-0 transition-all duration-500">
                <header className="flex justify-between items-center glass-panel px-8 py-5 shrink-0 border-t-2 border-white/10">
                    <div className="flex items-center gap-8">
                        <div>
                            <h1 className="text-2xl font-black tracking-tighter text-white">
                                VIP <span className="text-white/40">Stream Deck</span>
                            </h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-[9px] text-white/20 tracking-[0.4em] uppercase">Productivity Reimagined</p>
                                <div className="px-1.5 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-[8px] font-bold text-blue-400 uppercase tracking-wider">
                                    Context: {activeProfile?.name || 'Default'}
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="glass-panel px-4 py-2 flex items-center gap-3 hover:glass-hover transition-all text-[10px] uppercase tracking-widest font-bold text-blue-400 group"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                {activeProfile.name}
                                <ChevronDown size={14} className={`transition-transform duration-500 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isProfileMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="absolute top-full left-0 mt-3 w-56 glass-panel overflow-hidden z-50 p-1 border border-white/10 shadow-3xl shadow-black"
                                    >
                                        {profiles.map(name => (
                                            <button
                                                key={name}
                                                onClick={() => switchProfile(name)}
                                                className={`w-full text-left px-5 py-3.5 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all ${activeProfile.name.toLowerCase() === name.toLowerCase() ? 'bg-blue-500/10 text-blue-400' : 'text-white/30 hover:bg-white/5 hover:text-white'}`}
                                            >
                                                {name}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            <span className="text-[9px] text-green-500/80 font-mono font-bold tracking-widest uppercase">Sync Active</span>
                        </div>
                        <button
                            onClick={() => setIsEditMode(!isEditMode)}
                            className={`p-2 rounded-lg transition-all ${isEditMode ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'glass-panel text-white/20 hover:text-white'}`}
                        >
                            <Edit2 size={18} />
                        </button>
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2 rounded-lg glass-panel hover:glass-hover transition-all text-white/20 hover:text-white"
                        >
                            <Settings size={18} />
                        </button>
                    </div>
                </header>

                {/* Central Dashboard Area */}
                <div className="h-fit max-h-[40%] min-h-[200px] glass-panel p-8 relative overflow-hidden flex flex-col shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                    <div className="flex justify-between items-center mb-8 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                <Clock size={16} />
                            </div>
                            <div>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest leading-none">
                                    {nextTaskName ? `Next Task: ${nextTaskName}` : 'No Upcoming Tasks'}
                                </p>
                                <p className="text-xl font-black text-white tracking-tighter mt-1">{countdown}</p>
                            </div>
                        </div>
                    </div>
                    {navigationStack.length > 0 && (
                        <button
                            onClick={navigateUp}
                            className="glass-panel px-4 py-2 text-[9px] uppercase tracking-widest font-bold text-blue-400 hover:text-white flex items-center gap-2"
                        >
                            <LucideIcons.ArrowLeft size={12} /> Back to {navigationStack.length === 1 ? 'Main' : 'Previous'}
                        </button>
                    )}
                    <button
                        onClick={() => setIsHyperFocus(!isHyperFocus)}
                        className={`glass-panel px-4 py-2 text-[9px] uppercase tracking-widest font-bold flex items-center gap-2 transition-all ${isHyperFocus ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'text-white/40 hover:text-white/70'}`}
                    >
                        <Maximize2 size={12} /> {isHyperFocus ? 'Exit Focus' : 'Hyper Focus'}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={currentTiles}
                            strategy={rectSortingStrategy}
                        >
                            <div className="grid grid-cols-4 md:grid-cols-5 gap-6">
                                {currentTiles.map((tile) => (
                                    <div key={tile.id} className="relative group">
                                        <SortableTile
                                            tile={tile}
                                            volume={volume}
                                            onEnterFolder={() => enterFolder(tile)}
                                            onUiAction={handleUiAction}
                                        />
                                        {isEditMode && (
                                            <button
                                                onClick={() => setEditingTile(tile)}
                                                className="absolute -top-2 -right-2 p-2 bg-blue-500 text-white rounded-full shadow-lg z-20 hover:bg-blue-600 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Edit2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {/* ADD NEW TILE BUTTON */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsAddingTile(true)}
                                    className="relative glass group cursor-pointer aspect-square rounded-3xl flex flex-col items-center justify-center gap-3 border border-white/5 border-dashed hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all">
                                        <Plus size={24} />
                                    </div>
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-white/20 group-hover:text-white/60">Add Button</span>
                                </motion.div>
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>

                {/* FOOTER */}
                <footer className="glass-panel px-8 py-5 flex justify-between items-center shrink-0 border-b-2 border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="text-[9px] text-white/20 tracking-[0.4em] uppercase font-bold">
                            Build v2.0.0 <span className="text-white/10 ml-2">VIP TRANSFORMATION</span>
                        </div>
                        <button
                            onClick={() => window.electronAPI.openMiniMode()}
                            className="text-[9px] text-blue-400/50 hover:text-blue-400 uppercase tracking-widest border border-blue-400/20 px-2 py-1 rounded hover:bg-blue-400/10 transition-colors flex items-center gap-1"
                        >
                            <Minimize2 size={10} /> Mini
                        </button>
                    </div>

                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-4">
                            <Volume2 size={16} className="text-white/30" />
                            <div className="w-32 h-1 bg-white/5 rounded-full relative group cursor-pointer">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                />
                                <motion.div
                                    initial={false}
                                    animate={{ width: `${volume * 100}%` }}
                                    className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                                />
                            </div>
                        </div>

                        <div className="flex gap-8">
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] text-white/20 uppercase tracking-[0.2em] mb-1">Processor</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ width: `${systemStats.cpu}%` }}
                                            className={`h-full ${systemStats.cpu > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                                        />
                                    </div>
                                    <span className="text-[9px] font-mono text-white/40">{systemStats.cpu}%</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] text-white/20 uppercase tracking-[0.2em] mb-1">Memory</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            animate={{ width: `${systemStats.mem}%` }}
                                            className={`h-full ${systemStats.mem > 80 ? 'bg-red-500' : 'bg-pink-500'}`}
                                        />
                                    </div>
                                    <span className="text-[9px] font-mono text-white/40">{systemStats.mem}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>

            {/* RIGHT SIDEBAR */}
            <AnimatePresence>
                {!isHyperFocus && (
                    <motion.aside
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0, width: 300 }}
                        exit={{ opacity: 0, x: 50, width: 0 }}
                        className="flex flex-col gap-6 shrink-0 h-full overflow-y-auto pr-2 custom-scroll"
                    >
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(e) => handleSidebarDragEnd(e, 'right')}
                        >
                            <SortableContext items={rightSidebarOrder} strategy={verticalListSortingStrategy}>
                                {rightSidebarOrder.map(id => (
                                    <SortableSidebarItem
                                        key={id}
                                        id={id}
                                        isCollapsed={collapsedPanels[id]}
                                        onToggle={() => togglePanel(id)}
                                    >
                                        {id === 'MoodDetection' && <MoodDetection systemStats={systemStats} />}
                                        {id === 'SchedulePanel' && (
                                            <SchedulePanel
                                                schedules={schedules}
                                                onAddSchedule={(s) => setSchedules([...schedules, s])}
                                                onDeleteSchedule={(id) => setSchedules(schedules.filter(s => s.id !== id))}
                                            />
                                        )}
                                        {id === 'NetworkStatus' && <NetworkStatus />}
                                        {id === 'GamificationRewards' && <GamificationRewards actionCount={actionCount} />}
                                        {id === 'VoiceCommand' && <VoiceCommand />}
                                    </SortableSidebarItem>
                                ))}
                            </SortableContext>
                        </DndContext>

                        <div className="glass-panel p-6 mt-auto border-r-2 border-white/10 shrink-0">
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-4 text-right">Device Ecosystem</p>
                            <div className="flex justify-end gap-3 text-white/40">
                                <div className="p-2.5 rounded-xl glass hover:text-white transition-colors cursor-pointer">
                                    <LucideIcons.Smartphone size={16} />
                                </div>
                                <div className="p-2.5 rounded-xl glass hover:text-white transition-colors cursor-pointer">
                                    <LucideIcons.Laptop size={16} />
                                </div>
                                <div className="p-2.5 rounded-xl glass hover:text-white transition-colors cursor-pointer">
                                    <LucideIcons.Tablet size={16} />
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* AI COMPANION */}
            <FocusCompanion
                actionCount={actionCount}
                activeProfile={activeProfile}
                systemStats={systemStats}
            />

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
