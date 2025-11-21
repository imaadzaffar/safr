import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useFlights } from '../../context/FlightContext';
import { airports } from '../../utils/airports';

// Helper to convert lat/lon to 3D position
const getPosition = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
};

const FlightPath: React.FC<{ start: THREE.Vector3; end: THREE.Vector3 }> = ({ start, end }) => {
    const curve = useMemo(() => {
        // Calculate midpoint for the arc
        const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(start.length() + 0.5);
        return new THREE.QuadraticBezierCurve3(start, mid, end);
    }, [start, end]);

    const points = useMemo(() => curve.getPoints(50), [curve]);

    return (
        <Line points={points} color="#C89664" lineWidth={2} transparent opacity={0.8} />
    );
};

const Earth: React.FC = () => {
    return (
        <Sphere args={[2, 64, 64]}>
            <meshStandardMaterial color="#1E1B4B" roughness={0.7} metalness={0.1} />
        </Sphere>
    );
};

export const GlobeView: React.FC = () => {
    const { flights } = useFlights();

    // Create a lookup for airports
    const airportMap = useMemo(() => {
        return airports.reduce((acc, airport) => {
            acc[airport.code] = airport;
            return acc;
        }, {} as Record<string, typeof airports[0]>);
    }, []);

    return (
        <div className="h-[500px] w-full bg-black rounded-lg overflow-hidden shadow-xl relative">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <Earth />

                {flights.map((flight) => {
                    const origin = airportMap[flight.origin];
                    const dest = airportMap[flight.destination];

                    if (!origin || !dest) return null;

                    const startPos = getPosition(origin.lat, origin.lon, 2);
                    const endPos = getPosition(dest.lat, dest.lon, 2);

                    return (
                        <FlightPath key={flight.id} start={startPos} end={endPos} />
                    );
                })}

                <OrbitControls enablePan={false} minDistance={3} maxDistance={10} autoRotate autoRotateSpeed={0.5} />
            </Canvas>

            <div className="absolute bottom-4 left-4 text-white text-xs opacity-50 pointer-events-none">
                Drag to rotate • Scroll to zoom
            </div>
        </div>
    );
};
