import type { Airport } from '../types';

export const airports: Airport[] = [
    { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', countryCode: 'USA', lat: 40.6413, lon: -73.7781 },
    { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', countryCode: 'GBR', lat: 51.4700, lon: -0.4543 },
    { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', countryCode: 'ARE', lat: 25.2532, lon: 55.3657 },
    { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan', countryCode: 'JPN', lat: 35.5494, lon: 139.7798 },
    { code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', countryCode: 'AUS', lat: -33.9399, lon: 151.1753 },
    { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', countryCode: 'FRA', lat: 49.0097, lon: 2.5479 },
    { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', countryCode: 'SGP', lat: 1.3644, lon: 103.9915 },
    { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', countryCode: 'USA', lat: 33.9416, lon: -118.4085 },
    { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States', countryCode: 'USA', lat: 37.6213, lon: -122.3790 },
    { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', countryCode: 'DEU', lat: 50.0379, lon: 8.5622 },
];

export const searchAirports = (query: string): Airport[] => {
    const lowerQuery = query.toLowerCase();
    return airports.filter(
        (airport) =>
            airport.code.toLowerCase().includes(lowerQuery) ||
            airport.city.toLowerCase().includes(lowerQuery) ||
            airport.name.toLowerCase().includes(lowerQuery)
    );
};
