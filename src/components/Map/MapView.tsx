import React from 'react';
import { useFlights } from '../../context/FlightContext';
import { airports } from '../../utils/airports';

export const MapView: React.FC = () => {
    const { flights } = useFlights();

    // Simple 2D map using SVG for MVP
    // In a real app, we'd use d3-geo or Leaflet
    // For now, we'll project lat/lon to x/y on a static map image or simple SVG

    const width = 1000;
    const height = 500;

    const getPoint = (lat: number, lon: number) => {
        const x = (lon + 180) * (width / 360);
        const y = (height / 2) - (width * Math.log(Math.tan((Math.PI / 4) + (lat * Math.PI / 180) / 2)) / (2 * Math.PI));
        return { x, y: Math.max(0, Math.min(height, y)) }; // Clamp y
    };

    return (
        <div className="w-full h-full bg-[#D9E8F5] relative overflow-hidden flex items-center justify-center">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" style={{ background: '#D9E8F5' }}>
                {/* World Map Placeholder - simplified for MVP */}
                <rect x="0" y="0" width={width} height={height} fill="#D9E8F5" />

                {/* We would render countries here with GeoJSON */}
                <text x="50%" y="50%" textAnchor="middle" fill="#6B8FAD" fontSize="20">2D Map View (Placeholder)</text>

                {/* Flights */}
                {flights.map((flight) => {
                    const origin = airports.find(a => a.code === flight.origin);
                    const dest = airports.find(a => a.code === flight.destination);

                    if (!origin || !dest) return null;

                    const start = getPoint(origin.lat, origin.lon);
                    const end = getPoint(dest.lat, dest.lon);

                    return (
                        <g key={flight.id}>
                            <line
                                x1={start.x}
                                y1={start.y}
                                x2={end.x}
                                y2={end.y}
                                stroke="#C89664"
                                strokeWidth="2"
                                strokeOpacity="0.6"
                            />
                            <circle cx={start.x} cy={start.y} r="3" fill="#1E1B4B" />
                            <circle cx={end.x} cy={end.y} r="3" fill="#1E1B4B" />
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
