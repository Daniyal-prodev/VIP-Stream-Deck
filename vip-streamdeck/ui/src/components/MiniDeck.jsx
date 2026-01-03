import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';

const MiniDeck = ({ activeProfile, executeAction }) => {
    if (!activeProfile || !activeProfile.tiles) return null;

    // Show first 4 tiles or specifically marked favorites
    const miniTiles = activeProfile.tiles.slice(0, 4);

    return (
        <div className="w-full h-full bg-black/90 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden flex items-center justify-center p-2 draggable">
            <div className="grid grid-cols-4 gap-2 w-full">
                {miniTiles.map(tile => {
                    const Icon = LucideIcons[tile.icon] || HelpCircle;
                    const isImage = tile.icon && (tile.icon.includes('.') || tile.icon.startsWith('http'));

                    return (
                        <button
                            key={tile.id}
                            onClick={() => executeAction && tile.actions.forEach(a => executeAction(a))}
                            className="aspect-square rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group relative no-drag cursor-pointer"
                        >
                            <div className={`text-white/70 group-hover:text-white transition-transform group-hover:scale-110 ${tile.color}`}>
                                {isImage ? (
                                    <img src={tile.icon} alt={tile.name} className="w-5 h-5 object-contain" />
                                ) : (
                                    <Icon size={20} />
                                )}
                            </div>
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export default MiniDeck;
