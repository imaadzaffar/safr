import React, { useMemo } from 'react';
import { useFlights } from '../../context/FlightContext';
import { Globe, Navigation, Plane } from 'lucide-react';

const StatsCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
        <div className={`p-3 rounded-full ${color} text-white`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-bold uppercase">{title}</p>
            <p className="text-2xl font-heading text-navy">{value}</p>
        </div>
    </div>
);

export const StatsOverview: React.FC = () => {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
                title="Countries Visited"
                value={stats.countries}
                icon={<Globe className="h-6 w-6" />}
                color="bg-sage"
            />
            <StatsCard
                title="Total Flights"
                value={stats.flights}
                icon={<Plane className="h-6 w-6" />}
                color="bg-navy"
            />
            <StatsCard
                title="Distance (km)"
                value={stats.distance.toLocaleString()}
                icon={<Navigation className="h-6 w-6" />}
                color="bg-tan"
            />
        </div>
    );
};
