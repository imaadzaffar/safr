import React, { useState } from 'react';
import { useFlights } from '../../context/FlightContext';
import { searchAirports } from '../../utils/airports';
import type { Airport } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { Calendar, MapPin } from 'lucide-react';

export const FlightInput: React.FC = () => {
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
            // Calculate distance (Haversine) - simplified for now
            const distance = 0; // TODO: Implement distance calc

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
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-heading text-navy mb-4">Add Flight</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Origin</label>
                    <div className="flex items-center border rounded-md p-2 focus-within:ring-2 ring-navy">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <input
                            type="text"
                            value={originQuery}
                            onChange={(e) => {
                                setOriginQuery(e.target.value);
                                setShowOriginResults(true);
                                if (!e.target.value) setOrigin(null);
                            }}
                            placeholder="City or Airport Code"
                            className="w-full outline-none"
                        />
                    </div>
                    {showOriginResults && originQuery && (
                        <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
                            {originResults.map((airport) => (
                                <li
                                    key={airport.code}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setOrigin(airport);
                                        setOriginQuery(`${airport.city} (${airport.code})`);
                                        setShowOriginResults(false);
                                    }}
                                >
                                    <div className="font-bold">{airport.code}</div>
                                    <div className="text-sm text-gray-600">{airport.city}, {airport.country}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="relative">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Destination</label>
                    <div className="flex items-center border rounded-md p-2 focus-within:ring-2 ring-navy">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <input
                            type="text"
                            value={destinationQuery}
                            onChange={(e) => {
                                setDestinationQuery(e.target.value);
                                setShowDestResults(true);
                                if (!e.target.value) setDestination(null);
                            }}
                            placeholder="City or Airport Code"
                            className="w-full outline-none"
                        />
                    </div>
                    {showDestResults && destinationQuery && (
                        <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 shadow-lg max-h-60 overflow-auto">
                            {destResults.map((airport) => (
                                <li
                                    key={airport.code}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setDestination(airport);
                                        setDestinationQuery(`${airport.city} (${airport.code})`);
                                        setShowDestResults(false);
                                    }}
                                >
                                    <div className="font-bold">{airport.code}</div>
                                    <div className="text-sm text-gray-600">{airport.city}, {airport.country}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                    <div className="flex items-center border rounded-md p-2 focus-within:ring-2 ring-navy">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full outline-none"
                        />
                    </div>
                </div>
            </div>
            <button
                type="submit"
                disabled={!origin || !destination || !date}
                className="mt-4 w-full bg-navy text-white py-2 rounded-md font-bold hover:bg-opacity-90 disabled:opacity-50 transition-colors"
            >
                Log Flight
            </button>
        </form>
    );
};
