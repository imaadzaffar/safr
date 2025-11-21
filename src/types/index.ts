export interface Flight {
    id: string;
    origin: string; // Airport code
    originCountry: string;
    destination: string; // Airport code
    destinationCountry: string;
    date: string; // ISO date string
    distance: number; // km
    year: number;
}

export interface Airport {
    code: string;
    name: string;
    city: string;
    country: string;
    countryCode?: string;
    lat: number;
    lon: number;
}

export interface Stats {
    totalFlights: number;
    totalDistance: number;
    countriesVisited: number;
    continentsVisited: number;
    topCountry: string;
}
