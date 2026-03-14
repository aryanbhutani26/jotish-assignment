import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Employee } from '../types';
import { CITY_COORDS } from '../constants/cityCoords';

// Fix Leaflet default marker icon broken by bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface CityMapProps {
  employees: Employee[];
}

function CityMap({ employees }: CityMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize map centered on India
    const map = L.map(containerRef.current).setView([20.5937, 78.9629], 5);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Collect unique cities from employees
    const uniqueCities = [...new Set(employees.map((e) => e.city).filter(Boolean))];

    for (const city of uniqueCities) {
      const coords = CITY_COORDS[city];
      if (!coords) continue; // skip cities not in lookup — no crash
      L.marker(coords).addTo(map).bindPopup(city);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [employees]);

  return (
    <div
      ref={containerRef}
      style={{ height: '400px', width: '100%' }}
      aria-label="City map showing employee locations"
    />
  );
}

export default CityMap;
