import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { FlightList } from './FlightList';
import { FlightInput } from './FlightInput';

export const FlightPanel: React.FC = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="absolute md:top-24 bottom-0 md:bottom-auto left-0 md:left-auto md:right-6 w-full md:w-80 z-20 flex flex-col gap-4 pointer-events-none">
            {/* Main Panel */}
            <div className={`bg-white/10 backdrop-blur-xl border border-white/10 rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 pointer-events-auto flex flex-col ${isExpanded ? 'max-h-[70vh]' : 'max-h-16'}`}>

                {/* Header */}
                <div
                    className="p-4 border-b border-white/10 flex items-center justify-between cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <h2 className="font-heading font-bold text-white text-lg">
                        {isAdding ? 'add flight' : 'your flights'}
                    </h2>
                    <div className="flex items-center gap-2">
                        {!isAdding && isExpanded && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsAdding(true);
                                }}
                                className="p-1.5 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        )}
                        {isAdding && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsAdding(false);
                                }}
                                className="p-1.5 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                        {isExpanded ? <ChevronUp size={18} className="text-white/70" /> : <ChevronDown size={18} className="text-white/70" />}
                    </div>
                </div>

                {/* Content */}
                <div className={`flex-1 overflow-y-auto custom-scrollbar transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                    {isAdding ? (
                        <div className="p-4">
                            <FlightInput onCancel={() => setIsAdding(false)} onSuccess={() => setIsAdding(false)} />
                        </div>
                    ) : (
                        <div className="p-0">
                            <FlightList />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
