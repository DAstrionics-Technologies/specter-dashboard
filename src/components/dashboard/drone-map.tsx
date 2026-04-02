import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMap } from "react-leaflet";


interface DroneMapProps {
    lat: number | 28.662876;
    lon: number | 77.343407;
}

const droneIcon = L.divIcon({
    html: `<span class="material-symbols-outlined" style="font-size:32px;color:#4b8eff;font-variation-settings:'FILL'
    1;">navigation</span>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
})

function FollowDrone({ lat, lon }: { lat: number; lon: number }) {
    const map = useMap();
    map.setView([lat, lon]);
    return null;
}

export function DroneMap({ lat, lon }: DroneMapProps) {
    return (

        <MapContainer
            center={[lat, lon]}
            zoom={15}
            className="w-full h-full"
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[lat, lon]} icon={droneIcon} />
            <FollowDrone lat={lat} lon={lon} />
        </MapContainer>
    )

}