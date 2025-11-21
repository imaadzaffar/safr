import React from 'react';
import { useFlights } from '../../context/FlightContext';
import { Globe, Map } from 'lucide-react';

export const ViewToggle: React.FC = () => {
    const { viewMode, setViewMode } = useFlights();

    return (
        <div className="fixed top-4 right-4 bg-white rounded-full shadow-lg p-1 flex z-20">
            <button
                onClick={() => setViewMode('3D')}
                className={`p-2 rounded-full transition-colors ${viewMode === '3D' ? 'bg-navy text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                title="3D Globe"
            >
                <Globe size={20} />
            </button>
            <button
                onClick={() => setViewMode('2D')}
                className={`p-2 rounded-full transition-colors ${viewMode === '2D' ? 'bg-navy text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`}
                title="2D Map"
            >
                <Map size={20} />
            </button>
        </div>
    );
};
