import type { Airport } from '../types';

// Cache for airports data
let airportsCache: Airport[] | null = null;
let loadingPromise: Promise<Airport[]> | null = null;

/**
 * Fetch airports from OpenFlights database
 * This is a comprehensive database of ~7000+ airports worldwide
 */
export const loadAirports = async (): Promise<Airport[]> => {
    // Return cached data if available
    if (airportsCache) {
        return airportsCache;
    }

    // Return existing promise if already loading
    if (loadingPromise) {
        return loadingPromise;
    }

    // Start loading
    loadingPromise = (async () => {
        try {
            // Using OpenFlights airport database (public domain)
            const response = await fetch('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat');
            const text = await response.text();

            // Parse CSV data
            const lines = text.trim().split('\n');
            const airports: Airport[] = [];

            for (const line of lines) {
                // OpenFlights format: ID,Name,City,Country,IATA,ICAO,Lat,Lon,...
                const parts = line.split(',').map(p => p.replace(/^"|"$/g, ''));

                const iataCode = parts[4];
                const name = parts[1];
                const city = parts[2];
                const country = parts[3];
                const lat = parseFloat(parts[6]);
                const lon = parseFloat(parts[7]);

                // Only include airports with valid IATA codes (3 letters)
                if (iataCode && iataCode.length === 3 && !isNaN(lat) && !isNaN(lon)) {
                    // Map country names to ISO 3166-1 alpha-3 codes (simplified mapping)
                    const countryCode = getCountryCode(country);

                    airports.push({
                        code: iataCode,
                        name,
                        city,
                        country,
                        countryCode,
                        lat,
                        lon
                    });
                }
            }

            airportsCache = airports;
            return airports;
        } catch (error) {
            console.error('Failed to load airports:', error);
            // Fallback to minimal dataset
            return getFallbackAirports();
        }
    })();

    return loadingPromise;
};

/**
 * Get airports synchronously (returns cached data or empty array)
 */
export const getAirports = (): Airport[] => {
    return airportsCache || [];
};

/**
 * Search airports by query
 */
export const searchAirports = (query: string): Airport[] => {
    const airports = getAirports();
    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();
    return airports
        .filter(
            (airport) =>
                airport.code.toLowerCase().includes(lowerQuery) ||
                airport.city.toLowerCase().includes(lowerQuery) ||
                airport.name.toLowerCase().includes(lowerQuery) ||
                airport.country.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 50); // Limit results to 50 for performance
};

/**
 * Find airport by IATA code
 */
export const findAirportByCode = (code: string): Airport | undefined => {
    const airports = getAirports();
    return airports.find(a => a.code.toUpperCase() === code.toUpperCase());
};

/**
 * Simplified country name to ISO 3166-1 alpha-3 code mapping
 */
const getCountryCode = (countryName: string): string => {
    const mapping: Record<string, string> = {
        'United States': 'USA',
        'United Kingdom': 'GBR',
        'Canada': 'CAN',
        'Australia': 'AUS',
        'Germany': 'DEU',
        'France': 'FRA',
        'Spain': 'ESP',
        'Italy': 'ITA',
        'Japan': 'JPN',
        'China': 'CHN',
        'India': 'IND',
        'Brazil': 'BRA',
        'Mexico': 'MEX',
        'Netherlands': 'NLD',
        'Switzerland': 'CHE',
        'Singapore': 'SGP',
        'United Arab Emirates': 'ARE',
        'South Korea': 'KOR',
        'Thailand': 'THA',
        'Indonesia': 'IDN',
        'Malaysia': 'MYS',
        'Philippines': 'PHL',
        'Vietnam': 'VNM',
        'Turkey': 'TUR',
        'Russia': 'RUS',
        'South Africa': 'ZAF',
        'Egypt': 'EGY',
        'Argentina': 'ARG',
        'Chile': 'CHL',
        'Colombia': 'COL',
        'Peru': 'PER',
        'Portugal': 'PRT',
        'Greece': 'GRC',
        'Austria': 'AUT',
        'Belgium': 'BEL',
        'Denmark': 'DNK',
        'Finland': 'FIN',
        'Ireland': 'IRL',
        'Norway': 'NOR',
        'Poland': 'POL',
        'Sweden': 'SWE',
        'Czech Republic': 'CZE',
        'Hungary': 'HUN',
        'Romania': 'ROU',
        'New Zealand': 'NZL',
        'Israel': 'ISR',
        'Saudi Arabia': 'SAU',
        'Qatar': 'QAT',
        'Kuwait': 'KWT',
        'Bahrain': 'BHR',
        'Oman': 'OMN',
        'Morocco': 'MAR',
        'Kenya': 'KEN',
        'Nigeria': 'NGA',
        'Pakistan': 'PAK',
        'Bangladesh': 'BGD',
        'Sri Lanka': 'LKA',
    };

    return mapping[countryName] || countryName.substring(0, 3).toUpperCase();
};

/**
 * Fallback airports in case API fails
 */
const getFallbackAirports = (): Airport[] => {
    return [
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
        { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', countryCode: 'NLD', lat: 52.3105, lon: 4.7683 },
        { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago', country: 'United States', countryCode: 'USA', lat: 41.9742, lon: -87.9073 },
    ];
};

// Export for backward compatibility
export const airports = getAirports();
