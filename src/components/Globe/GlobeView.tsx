import React, { useMemo, useState, useEffect, useRef } from 'react';
// @ts-ignore
import Map, { Source, Layer, type ViewStateChangeEvent } from 'react-map-gl';
// @ts-ignore
import type { CircleLayer, LineLayer, FillLayer } from 'react-map-gl';
import { useFlights } from '../../context/FlightContext';
import { getAirports, findAirportByCode } from '../../utils/airports';
import 'mapbox-gl/dist/mapbox-gl.css';
import { geoInterpolate } from 'd3-geo';

// Token provided by user
const MAPBOX_TOKEN = 'pk.eyJ1IjoiemFmYXJpcyIsImEiOiJjbWk4cWI5a2owZWpqMnFyMnVlemNuMzljIn0.f45xGsxe1ngVM6Yz-69ePQ';

// Convert ISO 3166-1 alpha-3 to alpha-2 for flag display
const alpha3ToAlpha2: Record<string, string> = {
    'USA': 'us', 'GBR': 'gb', 'CAN': 'ca', 'AUS': 'au', 'DEU': 'de', 'FRA': 'fr',
    'ESP': 'es', 'ITA': 'it', 'JPN': 'jp', 'CHN': 'cn', 'IND': 'in', 'BRA': 'br',
    'MEX': 'mx', 'RUS': 'ru', 'NLD': 'nl', 'CHE': 'ch', 'AUT': 'at', 'BEL': 'be',
    'DNK': 'dk', 'FIN': 'fi', 'IRL': 'ie', 'NOR': 'no', 'POL': 'pl', 'SWE': 'se',
    'CZE': 'cz', 'HUN': 'hu', 'ROU': 'ro', 'PRT': 'pt', 'GRC': 'gr', 'ISL': 'is',
    'LUX': 'lu', 'MLT': 'mt', 'HRV': 'hr', 'SVN': 'si', 'SVK': 'sk', 'BGR': 'bg',
    'SRB': 'rs', 'BIH': 'ba', 'ALB': 'al', 'MKD': 'mk', 'MNE': 'me', 'EST': 'ee',
    'LVA': 'lv', 'LTU': 'lt', 'UKR': 'ua', 'BLR': 'by', 'MDA': 'md', 'CYP': 'cy',
    'SGP': 'sg', 'KOR': 'kr', 'THA': 'th', 'IDN': 'id', 'MYS': 'my', 'PHL': 'ph',
    'VNM': 'vn', 'TUR': 'tr', 'ISR': 'il', 'PAK': 'pk', 'BGD': 'bd', 'LKA': 'lk',
    'TWN': 'tw', 'HKG': 'hk', 'MAC': 'mo', 'MNG': 'mn', 'NPL': 'np', 'KHM': 'kh',
    'LAO': 'la', 'MMR': 'mm', 'BRN': 'bn', 'MDV': 'mv', 'BTN': 'bt', 'KAZ': 'kz',
    'UZB': 'uz', 'TKM': 'tm', 'KGZ': 'kg', 'TJK': 'tj', 'AFG': 'af', 'ARM': 'am',
    'AZE': 'az', 'GEO': 'ge', 'ARE': 'ae', 'SAU': 'sa', 'QAT': 'qa', 'KWT': 'kw',
    'BHR': 'bh', 'OMN': 'om', 'JOR': 'jo', 'LBN': 'lb', 'IRQ': 'iq', 'IRN': 'ir',
    'SYR': 'sy', 'YEM': 'ye', 'ZAF': 'za', 'EGY': 'eg', 'MAR': 'ma', 'KEN': 'ke',
    'NGA': 'ng', 'ETH': 'et', 'GHA': 'gh', 'TZA': 'tz', 'UGA': 'ug', 'DZA': 'dz',
    'TUN': 'tn', 'LBY': 'ly', 'SDN': 'sd', 'SEN': 'sn', 'CIV': 'ci', 'CMR': 'cm',
    'ZWE': 'zw', 'ZMB': 'zm', 'MOZ': 'mz', 'BWA': 'bw', 'NAM': 'na', 'MUS': 'mu',
    'SYC': 'sc', 'RWA': 'rw', 'AGO': 'ao', 'MDG': 'mg', 'ARG': 'ar', 'CHL': 'cl',
    'COL': 'co', 'PER': 'pe', 'VEN': 've', 'ECU': 'ec', 'BOL': 'bo', 'PRY': 'py',
    'URY': 'uy', 'CRI': 'cr', 'PAN': 'pa', 'GTM': 'gt', 'HND': 'hn', 'NIC': 'ni',
    'SLV': 'sv', 'CUB': 'cu', 'DOM': 'do', 'JAM': 'jm', 'TTO': 'tt', 'BHS': 'bs',
    'BRB': 'bb', 'HTI': 'ht', 'BLZ': 'bz', 'GUY': 'gy', 'SUR': 'sr', 'NZL': 'nz',
    'FJI': 'fj', 'PNG': 'pg', 'SLB': 'sb', 'VUT': 'vu', 'WSM': 'ws', 'TON': 'to',
    'PLW': 'pw', 'FSM': 'fm', 'MHL': 'mh', 'KIR': 'ki', 'NRU': 'nr', 'TUV': 'tv'
};

const getAlpha2Code = (alpha3Code: string | undefined): string | undefined => {
    if (!alpha3Code) return undefined;
    return alpha3ToAlpha2[alpha3Code.toUpperCase()];
};

export const GlobeView: React.FC = () => {
    const { flights } = useFlights();
    const [viewState, setViewState] = useState({
        longitude: -100,
        latitude: 40,
        zoom: window.innerWidth < 768 ? 0.8 : 1.5, // Lower zoom for mobile
    });
    const [animationIndex, setAnimationIndex] = useState(0);
    const requestRef = useRef<number>(0);
    const [selectedCountry, setSelectedCountry] = useState<{ name: string; code: string; x: number; y: number } | null>(null);
    const mapRef = useRef<any>(null);
    const [isPaused, setIsPaused] = useState(false);
    const inactivityTimerRef = useRef<number | null>(null);
    const [airportsLoaded, setAirportsLoaded] = useState(false);

    // Handle user interaction - pause rotation and set cooldown timer
    const handleUserInteraction = () => {
        setIsPaused(true);

        // Clear existing timer
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }

        // Set new timer to resume after 3 seconds of inactivity
        inactivityTimerRef.current = setTimeout(() => {
            setIsPaused(false);
        }, 10000);
    };

    // Check if airports are loaded
    useEffect(() => {
        const checkAirports = () => {
            const airports = getAirports();
            if (airports.length > 0 && !airportsLoaded) {
                setAirportsLoaded(true);
            }
        };

        // Check immediately
        checkAirports();

        // Check periodically until loaded
        const interval = setInterval(checkAirports, 100);

        return () => clearInterval(interval);
    }, [airportsLoaded]);

    // Auto-rotate globe
    useEffect(() => {
        const rotateGlobe = () => {
            if (!isPaused) {
                setViewState((prev) => ({
                    ...prev,
                    longitude: prev.longitude + 0.01,
                }));
            }
            requestRef.current = requestAnimationFrame(rotateGlobe);
        };

        requestRef.current = requestAnimationFrame(rotateGlobe);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isPaused]);

    // Animate flight paths
    // We'll use a simple counter to simulate "flow" along the lines
    useEffect(() => {
        const animate = () => {
            setAnimationIndex((prev) => (prev + 1) % 6000); // Use a large common multiple or just a large number
        };
        const interval = setInterval(animate, 16); // ~60fps
        return () => clearInterval(interval);
    }, []);

    // Prepare airport points
    const airportsGeoJSON = useMemo(() => {
        const airports = getAirports();
        const uniqueAirports = new Set<string>();
        flights.forEach(f => {
            uniqueAirports.add(f.origin);
            uniqueAirports.add(f.destination);
        });

        const features = airports.filter(a => uniqueAirports.has(a.code)).map(a => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [a.lon, a.lat]
            },
            properties: {
                code: a.code,
                city: a.city
            }
        }));

        return {
            type: 'FeatureCollection',
            features
        };
    }, [flights]);

    // To achieve the "shooting" effect efficiently in Mapbox without updating GeoJSON every frame:
    // We can use 'line-gradient' but that requires the source to have 'lineMetrics: true'.
    // And we can't easily animate the gradient stops in React-Map-GL without causing re-renders.

    // Alternative: Use a simple opacity animation or just static lines for now if performance is a concern.
    // BUT the user specifically asked for "animations like github".
    // GitHub's lines grow.

    // Let's try a "Line growing" effect by updating the GeoJSON data.
    // We need a separate useEffect for the data update to avoid re-rendering the whole map component?
    // No, in React-Map-GL, updating the `data` prop of Source is the way.

    const animatedFlightsGeoJSON = useMemo(() => {
        const features = flights.map((flight, index) => {
            const origin = findAirportByCode(flight.origin);
            const dest = findAirportByCode(flight.destination);
            if (!origin || !dest) return null;

            const interpolate = geoInterpolate(
                [origin.lon, origin.lat],
                [dest.lon, dest.lat]
            );

            // Offset animation by index so they don't all start at once
            const offset = index * 50;
            const cycle = 200; // frames per flight
            const currentFrame = (animationIndex + offset) % cycle;

            // Let's make it grow from 0 to 1, then disappear
            const drawProgress = currentFrame < 150 ? currentFrame / 150 : 1;

            if (drawProgress === 0) return null;

            const path = [];
            const steps = Math.ceil(drawProgress * 50);
            for (let i = 0; i <= steps; i++) {
                path.push(interpolate(i / 50));
            }

            return {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: path
                },
                properties: {
                    id: flight.id,
                    opacity: currentFrame > 150 ? 1 - ((currentFrame - 150) / 50) : 1 // Fade out at end
                }
            };
        }).filter(Boolean);

        return {
            type: 'FeatureCollection',
            features: features as any[]
        };
    }, [flights, animationIndex]);

    // Get list of visited country codes
    const visitedCountryCodes = useMemo(() => {
        if (!airportsLoaded) return [];

        const codes = new Set<string>();
        flights.forEach(f => {
            const origin = findAirportByCode(f.origin);
            const dest = findAirportByCode(f.destination);
            if (origin?.countryCode) codes.add(origin.countryCode);
            if (dest?.countryCode) codes.add(dest.countryCode);
        });
        return Array.from(codes);
    }, [flights, airportsLoaded]);

    // Country fill layer - colors visited countries using Mapbox boundaries
    const visitedCountriesLayer: Omit<FillLayer, 'source'> = {
        id: 'visited-countries-fill',
        type: 'fill',
        'source-layer': 'country_boundaries',
        paint: {
            'fill-color': [
                'case',
                ['in', ['get', 'iso_3166_1_alpha_3'], ['literal', visitedCountryCodes]],
                '#6EBE8C', // Sage for visited countries
                'transparent' // Transparent for non-visited
            ],
            'fill-opacity': 0.2
        }
    };

    const flightLayer: Omit<LineLayer, 'source'> = {
        id: 'flights',
        type: 'line',
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        },
        paint: {
            'line-color': '#C89664', // Tan
            'line-width': 2,
            'line-opacity': ['get', 'opacity'] // Use data-driven opacity
        }
    };

    const airportLayer: Omit<CircleLayer, 'source'> = {
        id: 'airports',
        type: 'circle',
        paint: {
            'circle-radius': 4,
            'circle-color': '#6EBE8C', // Sage
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
        }
    };

    return (
        <div className="absolute inset-0 w-full h-full bg-black">
            <Map
                ref={mapRef}
                {...viewState}
                onMove={(evt: ViewStateChangeEvent) => {
                    setViewState(evt.viewState);
                    handleUserInteraction();
                }}
                onClick={(e: any) => {
                    handleUserInteraction();

                    // Query all features at the click point
                    const map = mapRef.current?.getMap();
                    if (map) {
                        const features = map.queryRenderedFeatures(e.point);

                        // Look for country features in the base map
                        const countryFeature = features.find((f: any) =>
                            f.sourceLayer === 'country_label' ||
                            f.layer?.id?.includes('country') ||
                            f.properties?.name ||
                            f.properties?.name_en
                        );

                        if (countryFeature) {
                            const countryName = countryFeature.properties.name_en ||
                                countryFeature.properties.name ||
                                countryFeature.properties.admin ||
                                countryFeature.properties.name_long;
                            const countryCodeAlpha3 = countryFeature.properties.iso_3166_1_alpha_3 ||
                                countryFeature.properties.iso_3166_1;

                            if (countryName) {
                                setSelectedCountry({
                                    name: countryName,
                                    code: getAlpha2Code(countryCodeAlpha3) || countryCodeAlpha3?.toLowerCase(),
                                    x: e.point.x,
                                    y: e.point.y
                                });
                            }
                        } else {
                            // Fallback to our custom layers
                            const features = e.features;
                            if (features && features.length > 0) {
                                const feature = features[0];
                                if (feature.layer.id === 'visited-countries') {
                                    const countryName = feature.properties.name || feature.properties.admin || feature.properties.name_long;
                                    const countryCode = feature.properties.iso_a2 || feature.properties.adm0_a3;
                                    setSelectedCountry({
                                        name: countryName,
                                        code: countryCode,
                                        x: e.point.x,
                                        y: e.point.y
                                    });
                                }
                            }
                        }
                    }
                }}
                onWheel={handleUserInteraction}
                onDrag={handleUserInteraction}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
                projection={{ name: 'globe' }}
                fog={{
                    range: [0.5, 10],
                    color: '#0a0a1e', // Deep dark blue atmosphere
                    'high-color': '#050510', // Almost black high atmosphere
                    'space-color': '#000000', // Pure black space
                    'star-intensity': 0.4, // Subtle stars
                    'horizon-blend': 0.05
                }}
                terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
            >
                {/* Terrain Source (Optional, for 3D mountains) */}
                <Source
                    id="mapbox-dem"
                    type="raster-dem"
                    url="mapbox://mapbox.mapbox-terrain-dem-v1"
                    tileSize={512}
                    maxzoom={14}
                />

                {/* Mapbox Country Boundaries */}
                <Source
                    id="country-boundaries"
                    type="vector"
                    url="mapbox://mapbox.country-boundaries-v1"
                >
                    <Layer {...visitedCountriesLayer} beforeId="admin-1-boundary" />
                </Source>

                {/* Flights */}
                <Source id="flights-data" type="geojson" data={animatedFlightsGeoJSON}>
                    <Layer {...flightLayer} />
                </Source>

                {/* Airports */}
                <Source id="airports-data" type="geojson" data={airportsGeoJSON}>
                    <Layer {...airportLayer} />
                </Source>

            </Map>

            {/* Country Popup */}
            {selectedCountry && (
                <>
                    {/* Backdrop to close popup */}
                    <div
                        className="absolute inset-0 z-30"
                        onClick={() => setSelectedCountry(null)}
                    />

                    {/* Popup */}
                    <div
                        className="absolute z-40 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl p-4 pointer-events-auto"
                        style={{
                            left: `${selectedCountry.x}px`,
                            top: `${selectedCountry.y}px`,
                            transform: 'translate(-50%, -120%)'
                        }}
                    >
                        <div className="flex items-center gap-3">
                            {selectedCountry.code && (
                                <img
                                    src={`https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png`}
                                    alt={`${selectedCountry.name} flag`}
                                    className="w-12 h-8 object-cover rounded shadow-md"
                                    onError={(e) => {
                                        // Hide flag if it fails to load
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            )}
                            <div>
                                <h3 className="text-white font-bold text-lg">{selectedCountry.name}</h3>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="absolute bottom-8 right-8 text-white text-xs opacity-50 pointer-events-none z-10">
                Powered by Mapbox
            </div>
        </div>
    );
};
