import React, { useMemo } from 'react';
import { useFlights } from '../../context/FlightContext';
import { Globe, Plane, Navigation } from 'lucide-react';

export const TopBar: React.FC = () => {
    const { flights } = useFlights();

    const stats = useMemo(() => {
        const uniqueCountries = new Set<string>();
        let totalDistance = 0;

        flights.forEach((flight) => {
            uniqueCountries.add(flight.destinationCountry);
            uniqueCountries.add(flight.originCountry);
            totalDistance += flight.distance;
        });

        return {
            countries: uniqueCountries.size,
            flights: flights.length,
            distance: totalDistance,
        };
    }, [flights]);

    return (
        <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-start pointer-events-none">
            {/* Logo */}
            <div className="bg-navy/80 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg pointer-events-auto">
                <h1 className="text-xl font-heading font-bold">Safr</h1>
            </div>

            {/* Stats Strip */}
            <div className="flex gap-4 pointer-events-auto">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-5 py-2 rounded-full flex items-center gap-3 shadow-lg">
                    <Globe size={16} className="text-sage" />
                    <div className="flex flex-col leading-tight">
                        <span className="text-[10px] uppercase tracking-wider opacity-70">Countries</span>
                        <span className="font-bold font-heading">{stats.countries}</span>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-5 py-2 rounded-full flex items-center gap-3 shadow-lg">
                    <Plane size={16} className="text-tan" />
                    <div className="flex flex-col leading-tight">
                        <span className="text-[10px] uppercase tracking-wider opacity-70">Flights</span>
                        <span className="font-bold font-heading">{stats.flights}</span>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-5 py-2 rounded-full flex items-center gap-3 shadow-lg">
                    <Navigation size={16} className="text-blue-400" />
                    <div className="flex flex-col leading-tight">
                        <span className="text-[10px] uppercase tracking-wider opacity-70">Distance</span>
                        <span className="font-bold font-heading">{stats.distance.toLocaleString()} km</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
