import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Flight } from '../types';

interface FlightContextType {
    flights: Flight[];
    addFlight: (flight: Flight) => void;
    removeFlight: (id: string) => void;
    updateFlight: (flight: Flight) => void;
    viewMode: '2D' | '3D';
    setViewMode: (mode: '2D' | '3D') => void;
}

const FlightContext = createContext<FlightContextType | undefined>(undefined);

export const FlightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [flights, setFlights] = useState<Flight[]>(() => {
        const stored = localStorage.getItem('safr_flights');
        return stored ? JSON.parse(stored) : [];
    });
    const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');

    useEffect(() => {
        localStorage.setItem('safr_flights', JSON.stringify(flights));
    }, [flights]);

    const addFlight = (flight: Flight) => {
        setFlights((prev) => [flight, ...prev]);
    };

    const removeFlight = (id: string) => {
        setFlights((prev) => prev.filter((f) => f.id !== id));
    };

    const updateFlight = (flight: Flight) => {
        setFlights((prev) => prev.map((f) => (f.id === flight.id ? flight : f)));
    };

    return (
        <FlightContext.Provider value={{ flights, addFlight, removeFlight, updateFlight, viewMode, setViewMode }}>
            {children}
        </FlightContext.Provider>
    );
};

export const useFlights = () => {
    const context = useContext(FlightContext);
    if (!context) {
        throw new Error('useFlights must be used within a FlightProvider');
    }
    return context;
};
