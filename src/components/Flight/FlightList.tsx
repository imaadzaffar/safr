import React from 'react';
import { useFlights } from '../../context/FlightContext';
import { Trash2 } from 'lucide-react';

export const FlightList: React.FC = () => {
    const { flights, removeFlight } = useFlights();

    if (flights.length === 0) {
        return (
            <div className="text-center p-8">
                <p className="text-white/70">no flights logged yet. add your first flight!</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            <ul>
                {flights.map((flight) => (
                    <li key={flight.id} className="p-4 border-b border-white/10 last:border-b-0 flex items-center justify-between hover:bg-white/5 transition-colors">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-xl text-white">{flight.origin}</span>
                                <span className="text-white/40">→</span>
                                <span className="font-bold text-xl text-white">{flight.destination}</span>
                            </div>
                            <div className="text-sm text-white/60 mt-1">
                                {new Date(flight.date).toLocaleDateString()} • {flight.distance} km
                            </div>
                        </div>
                        <button
                            onClick={() => removeFlight(flight.id)}
                            className="p-2 text-red-300 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                            title="Delete Flight"
                        >
                            <Trash2 className="h-5 w-5" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
