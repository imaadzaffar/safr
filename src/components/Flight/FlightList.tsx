import React from 'react';
import { useFlights } from '../../context/FlightContext';
import { Trash2 } from 'lucide-react';

export const FlightList: React.FC = () => {
    const { flights, removeFlight } = useFlights();

    if (flights.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">No flights logged yet. Add your first flight above!</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
                <h3 className="font-heading text-lg text-navy">Recent Flights</h3>
            </div>
            <ul>
                {flights.map((flight) => (
                    <li key={flight.id} className="p-4 border-b last:border-b-0 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-xl text-navy">{flight.origin}</span>
                                <span className="text-gray-400">→</span>
                                <span className="font-bold text-xl text-navy">{flight.destination}</span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                {new Date(flight.date).toLocaleDateString()} • {flight.distance} km
                            </div>
                        </div>
                        <button
                            onClick={() => removeFlight(flight.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
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
