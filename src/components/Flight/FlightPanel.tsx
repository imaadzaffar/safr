import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import { FlightList } from './FlightList';
import { FlightInput } from './FlightInput';

export const FlightPanel: React.FC = () => {
    const [isAdding, setIsAdding] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="absolute top-24 left-6 w-80 z-20 flex flex-col gap-4 pointer-events-none">
            {/* Main Panel */}
            <div className={`bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 pointer-events-auto flex flex-col ${isExpanded ? 'max-h-[70vh]' : 'max-h-16'}`}>

                {/* Header */}
                <div
                    className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer bg-white/50"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <h2 className="font-heading font-bold text-navy text-lg">
                        {isAdding ? 'Add Flight' : 'Your Flights'}
                    </h2>
                    <div className="flex items-center gap-2">
                        {!isAdding && isExpanded && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsAdding(true);
                                }}
                                className="p-1.5 bg-navy text-white rounded-full hover:bg-navy/90 transition-colors"
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
                                className="p-1.5 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                        {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
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
