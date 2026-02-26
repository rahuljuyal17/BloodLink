import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

// Custom Donor Icon (Ambulance/Blood Drop style)
const donorIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1152/1152912.png', // Blood drop icon
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
});

const hospitalIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/4332/4332938.png', // Hospital icon
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [0, -35],
});

// Component to refocus map when donor moves
const RecenterMap = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.setView(position, 15);
        }
    }, [position, map]);
    return null;
};

const LiveMap = ({ donorLocation, hospitalLocation, hospitalName }) => {
    const defaultCenter = hospitalLocation || [28.6139, 77.2090]; // Delhi as fallback

    return (
        <div className="h-[400px] w-full rounded-[32px] overflow-hidden border-4 border-white shadow-2xl relative">
            <MapContainer
                center={defaultCenter}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Hospital Marker */}
                {hospitalLocation && (
                    <Marker position={hospitalLocation} icon={hospitalIcon}>
                        <Popup>
                            <strong>{hospitalName}</strong><br />
                            Patient's Location
                        </Popup>
                    </Marker>
                )}

                {/* Donor Marker */}
                {donorLocation && (
                    <Marker position={donorLocation} icon={donorIcon}>
                        <Popup>
                            <strong>Donor</strong><br />
                            Moving towards hospital...
                        </Popup>
                        <RecenterMap position={donorLocation} />
                    </Marker>
                )}
            </MapContainer>

            <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Live Tracking Active</span>
            </div>
        </div>
    );
};

export default LiveMap;
