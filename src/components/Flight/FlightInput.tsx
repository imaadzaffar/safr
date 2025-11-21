import React, { useState } from 'react';
import { useFlights } from '../../context/FlightContext';
import { searchAirports } from '../../utils/airports';
import type { Airport } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { Calendar, MapPin, Plus } from 'lucide-react';
import { calculateDistance } from '../../utils/distance';

interface FlightInputProps {
    onCancel?: () => void;
    onSuccess?: () => void;
}

export const FlightInput: React.FC<FlightInputProps> = ({ onCancel, onSuccess }) => {
    const { addFlight } = useFlights();
    const [originQuery, setOriginQuery] = useState('');
    const [destinationQuery, setDestinationQuery] = useState('');
    const [origin, setOrigin] = useState<Airport | null>(null);
    const [destination, setDestination] = useState<Airport | null>(null);
    const [date, setDate] = useState('');
    const [showOriginResults, setShowOriginResults] = useState(false);
    const [showDestResults, setShowDestResults] = useState(false);

    const originResults = searchAirports(originQuery);
    const destResults = searchAirports(destinationQuery);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (origin && destination && date) {
            // Calculate distance using Haversine formula
            const distance = calculateDistance(
                origin.lat,
                origin.lon,
                destination.lat,
                destination.lon
            );

            addFlight({
                id: uuidv4(),
                origin: origin.code,
                originCountry: origin.country,
                destination: destination.code,
                destinationCountry: destination.country,
                date,
                distance,
                year: new Date(date).getFullYear(),
            });

            // Reset form
            setOrigin(null);
            setDestination(null);
            setOriginQuery('');
            setDestinationQuery('');
            setDate('');
            if (onSuccess) onSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Origin */}
            <div className="relative">
                <label className="block text-sm font-bold mb-2 text-white/90">
                    origin
                </label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                    <input
                        type="text"
                        value={originQuery}
                        onChange={(e) => {
                            setOriginQuery(e.target.value);
                            setShowOriginResults(true);
                            if (!e.target.value) setOrigin(null);
                        }}
                        placeholder="JFK, LHR, etc."
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/40"
                    />
                </div>
                {showOriginResults && originQuery && (
                    <ul className="absolute z-10 w-full mt-1 bg-navy/95 backdrop-blur-md border border-white/20 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {originResults.map((airport) => (
                            <li
                                key={airport.code}
                                onClick={() => {
                                    setOrigin(airport);
                                    setOriginQuery(`${airport.city} (${airport.code})`);
                                    setShowOriginResults(false);
                                }}
                                className="px-4 py-2 hover:bg-white/10 cursor-pointer text-white"
                            >
                                <span className="font-bold">{airport.code}</span> - {airport.city}, {airport.country}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Destination */}
            <div className="relative">
                <label className="block text-sm font-bold mb-2 text-white/90">
                    destination
                </label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                    <input
                        type="text"
                        value={destinationQuery}
                        onChange={(e) => {
                            setDestinationQuery(e.target.value);
                            setShowDestResults(true);
                            if (!e.target.value) setDestination(null);
                        }}
                        placeholder="JFK, LHR, etc."
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/40"
                    />
                </div>
                {showDestResults && destinationQuery && (
                    <ul className="absolute z-10 w-full mt-1 bg-navy/95 backdrop-blur-md border border-white/20 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {destResults.map((airport) => (
                            <li
                                key={airport.code}
                                onClick={() => {
                                    setDestination(airport);
                                    setDestinationQuery(`${airport.city} (${airport.code})`);
                                    setShowDestResults(false);
                                }}
                                className="px-4 py-2 hover:bg-white/10 cursor-pointer text-white"
                            >
                                <span className="font-bold">{airport.code}</span> - {airport.city}, {airport.country}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Date */}
            <div>
                <label className="block text-sm font-bold mb-2 text-white/90">
                    date
                </label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-white/30 text-white"
                    />
                </div>
            </div>

            <div className="flex gap-2 mt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-white/10 text-white py-3 rounded-lg font-bold hover:bg-white/20 transition-colors border border-white/20"
                    >
                        cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={!origin || !destination || !date}
                    className="flex-1 bg-white/20 text-white py-3 rounded-lg font-bold hover:bg-white/30 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 border border-white/20"
                >
                    <Plus size={18} />
                    add flight
                </button>
            </div>
        </form>
    );
};
