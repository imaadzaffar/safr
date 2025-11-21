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
        <div className="absolute top-0 left-0 w-full p-3 md:p-6 z-20 flex flex-col md:flex-row justify-between items-start gap-3 md:gap-0 pointer-events-none">
            {/* Logo */}
            <div className="text-white px-4 md:px-5 py-2 rounded-full flex items-center gap-3 shadow-lg">
                <h1 className="text-white text-2xl md:text-3xl font-heading font-bold">safr</h1>
            </div>

            {/* Stats Strip */}
            <div className="flex flex-wrap gap-2 md:gap-4 pointer-events-auto w-full md:w-auto">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-3 md:px-5 py-2 rounded-full flex items-center gap-2 md:gap-3 shadow-lg">
                    <Globe size={14} className="text-sage md:w-4 md:h-4" />
                    <div className="flex flex-col leading-tight">
                        <span className="text-[9px] md:text-[10px] uppercase tracking-wider opacity-70">countries</span>
                        <span className="font-bold font-heading text-sm md:text-base">{stats.countries}</span>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-3 md:px-5 py-2 rounded-full flex items-center gap-2 md:gap-3 shadow-lg">
                    <Plane size={14} className="text-tan md:w-4 md:h-4" />
                    <div className="flex flex-col leading-tight">
                        <span className="text-[9px] md:text-[10px] uppercase tracking-wider opacity-70">flights</span>
                        <span className="font-bold font-heading text-sm md:text-base">{stats.flights}</span>
                    </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-3 md:px-5 py-2 rounded-full flex items-center gap-2 md:gap-3 shadow-lg">
                    <Navigation size={14} className="text-blue-400 md:w-4 md:h-4" />
                    <div className="flex flex-col leading-tight">
                        <span className="text-[9px] md:text-[10px] uppercase tracking-wider opacity-70">distance</span>
                        <span className="font-bold font-heading text-sm md:text-base">{stats.distance.toLocaleString()} km</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
