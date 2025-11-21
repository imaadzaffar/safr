import React, { useMemo, useState } from 'react';
import Map, { Source, Layer, type ViewStateChangeEvent } from 'react-map-gl';
import type { CircleLayer, LineLayer } from 'react-map-gl';
import { useFlights } from '../../context/FlightContext';
import { airports } from '../../utils/airports';
import 'mapbox-gl/dist/mapbox-gl.css';

// Token provided by user
const MAPBOX_TOKEN = 'pk.eyJ1IjoiemFmYXJpcyIsImEiOiJjbWk4cWI5a2owZWpqMnFyMnVlemNuMzljIn0.f45xGsxe1ngVM6Yz-69ePQ';

export const GlobeView: React.FC = () => {
    const { flights } = useFlights();
    const [viewState, setViewState] = useState({
        longitude: -100,
        latitude: 40,
        zoom: 1.5,
    });

    // Prepare flight paths (Great Circle arcs are handled automatically by Mapbox globe projection)
    const flightsGeoJSON = useMemo(() => {
        const features = flights.map(flight => {
            const origin = airports.find(a => a.code === flight.origin);
            const dest = airports.find(a => a.code === flight.destination);
            if (!origin || !dest) return null;

            return {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [origin.lon, origin.lat],
                        [dest.lon, dest.lat]
                    ]
                },
                properties: {
                    id: flight.id
                }
            };
        }).filter(Boolean);

        return {
            type: 'FeatureCollection',
            features: features as any[]
        };
    }, [flights]);

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
            'line-opacity': 0.8
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
                mapStyle="mapbox://styles/mapbox/navigation-night-v1"
                mapboxAccessToken={MAPBOX_TOKEN}
                projection={{ name: 'globe' }}
                fog={{
                    range: [0.5, 10],
                    color: '#242B4B', // Navy-ish atmosphere
                    'high-color': '#1E1B4B',
                    'space-color': '#0B0B15', // Dark space
                    'star-intensity': 0.6
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

                {/* Flights */}
                <Source id="flights-data" type="geojson" data={flightsGeoJSON}>
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
