import React, { useMemo, useState, useEffect, useRef } from 'react';
// @ts-ignore
import Map, { Source, Layer, type ViewStateChangeEvent } from 'react-map-gl';
// @ts-ignore
import type { CircleLayer, LineLayer, FillLayer } from 'react-map-gl';
import { useFlights } from '../../context/FlightContext';
import { airports } from '../../utils/airports';
import 'mapbox-gl/dist/mapbox-gl.css';
import { geoInterpolate } from 'd3-geo';

// Token provided by user
const MAPBOX_TOKEN = 'pk.eyJ1IjoiemFmYXJpcyIsImEiOiJjbWk4cWI5a2owZWpqMnFyMnVlemNuMzljIn0.f45xGsxe1ngVM6Yz-69ePQ';

export const GlobeView: React.FC = () => {
    const { flights } = useFlights();
    const [viewState, setViewState] = useState({
        longitude: -100,
        latitude: 40,
        zoom: 1.5,
    });
    const [animationIndex, setAnimationIndex] = useState(0);
    const requestRef = useRef<number>(0);

    // Auto-rotate globe
    useEffect(() => {
        const rotateGlobe = () => {
            setViewState((prev) => ({
                ...prev,
                longitude: prev.longitude + 0.01,
            }));
            requestRef.current = requestAnimationFrame(rotateGlobe);
        };

        requestRef.current = requestAnimationFrame(rotateGlobe);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

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
            const origin = airports.find(a => a.code === flight.origin);
            const dest = airports.find(a => a.code === flight.destination);
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


    const [countriesGeoJSON, setCountriesGeoJSON] = useState<any>(null);

    useEffect(() => {
        fetch('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(data => setCountriesGeoJSON(data));
    }, []);

    // Prepare visited countries GeoJSON
    const visitedCountriesGeoJSON = useMemo(() => {
        if (!countriesGeoJSON) return null;

        const visitedCountryCodes = new Set<string>();
        flights.forEach(f => {
            const origin = airports.find(a => a.code === f.origin);
            const dest = airports.find(a => a.code === f.destination);
            if (origin?.countryCode) visitedCountryCodes.add(origin.countryCode);
            if (dest?.countryCode) visitedCountryCodes.add(dest.countryCode);
        });

        return {
            type: 'FeatureCollection',
            features: countriesGeoJSON.features.filter((f: any) =>
                visitedCountryCodes.has(f.properties.adm0_a3) || visitedCountryCodes.has(f.properties.iso_a3)
            )
        };
    }, [flights, countriesGeoJSON]);

    const countryLayer: Omit<FillLayer, 'source'> = {
        id: 'visited-countries',
        type: 'fill',
        paint: {
            'fill-color': '#6EBE8C', // Sage
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
                {...viewState}
                onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
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

                {/* Visited Countries */}
                {visitedCountriesGeoJSON && (
                    <Source id="countries-data" type="geojson" data={visitedCountriesGeoJSON}>
                        <Layer {...countryLayer} beforeId="flights" />
                    </Source>
                )}

                {/* Flights */}
                <Source id="flights-data" type="geojson" data={animatedFlightsGeoJSON}>
                    <Layer {...flightLayer} />
                </Source>

                {/* Airports */}
                <Source id="airports-data" type="geojson" data={airportsGeoJSON}>
                    <Layer {...airportLayer} />
                </Source>

            </Map>

            <div className="absolute bottom-8 right-8 text-white text-xs opacity-50 pointer-events-none z-10">
                Powered by Mapbox
            </div>
        </div>
    );
};
