import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plane, BarChart2, Plus } from 'lucide-react';
import { FlightList } from '../Flight/FlightList';
import { StatsOverview } from '../Dashboard/StatsOverview';
import { FlightInput } from '../Flight/FlightInput';

export const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [activeTab, setActiveTab] = useState<'flights' | 'stats' | 'add'>('flights');

    return (
        <div
            className={`fixed top-0 left-0 h-full bg-white shadow-2xl transition-all duration-300 z-20 flex flex-col ${isOpen ? 'w-96' : 'w-16'
                }`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-3 top-6 bg-white rounded-full p-1 shadow-md border border-gray-200 hover:bg-gray-50 z-30"
            >
                {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            {/* Header / Tabs */}
            <div className="flex flex-col h-full">
                <div className="p-4 border-b flex items-center justify-between bg-navy text-white">
                    {isOpen ? (
                        <h1 className="text-xl font-heading">Safr</h1>
                    ) : (
                        <span className="font-heading text-xl">S</span>
                    )}
                </div>

                {/* Navigation Icons (Always visible) */}
                <div className={`flex ${isOpen ? 'border-b' : 'flex-col border-r h-full'} bg-gray-50`}>
                    <button
                        onClick={() => { setActiveTab('flights'); setIsOpen(true); }}
                        className={`p-4 flex items-center gap-3 hover:bg-white transition-colors ${activeTab === 'flights' ? 'text-navy bg-white border-b-2 border-navy' : 'text-gray-500'}`}
                        title="Flights"
                    >
                        <Plane size={20} />
                        {isOpen && <span className="font-bold text-sm">Flights</span>}
                    </button>
                    <button
                        onClick={() => { setActiveTab('add'); setIsOpen(true); }}
                        className={`p-4 flex items-center gap-3 hover:bg-white transition-colors ${activeTab === 'add' ? 'text-navy bg-white border-b-2 border-navy' : 'text-gray-500'}`}
                        title="Add Flight"
                    >
                        <Plus size={20} />
                        {isOpen && <span className="font-bold text-sm">Add</span>}
                    </button>
                    <button
                        onClick={() => { setActiveTab('stats'); setIsOpen(true); }}
                        className={`p-4 flex items-center gap-3 hover:bg-white transition-colors ${activeTab === 'stats' ? 'text-navy bg-white border-b-2 border-navy' : 'text-gray-500'}`}
                        title="Statistics"
                    >
                        <BarChart2 size={20} />
                        {isOpen && <span className="font-bold text-sm">Stats</span>}
                    </button>
                </div>

                {/* Content Area */}
                {isOpen && (
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        {activeTab === 'flights' && <FlightList />}
                        {activeTab === 'add' && <FlightInput />}
                        {activeTab === 'stats' && <StatsOverview />}
                    </div>
                )}
            </div>
        </div>
    );
};
