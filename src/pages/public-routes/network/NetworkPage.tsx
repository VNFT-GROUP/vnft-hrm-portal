import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";

// Important: import leaflet CSS
import "leaflet/dist/leaflet.css";
import "./NetworkPage.css";

// Create a custom modern map pin using pure HTML/SVG
const modernPin = new L.DivIcon({
  html: `<div style="color: #F7941D; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5)); transform: translateY(-50%);">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="rgba(247, 148, 29, 0.2)" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>`,
  className: "custom-leaflet-icon",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Leaflet uses [Latitude, Longitude]
const BRANCHES = [
  { name: "TRỤ SỞ HỒ CHÍ MINH", coords: [10.8231, 106.6297] as [number, number], addr: "178/11 Nguyễn Văn Thương, Bình Thạnh, TP. HCM" },
  { name: "VĂN PHÒNG HÀ NỘI", coords: [21.0278, 105.8342] as [number, number], addr: "Tầng 6, Tòa nhà Veba, 208 Phố Xã Đàn 2, Hà Nội" },
  { name: "HOUSTON, TX", coords: [29.7604, -95.3698] as [number, number], addr: "11360 Bellaire BLVD STE 820, Houston, TX 77072" },
  { name: "LOS ANGELES, CA", coords: [34.0522, -118.2437] as [number, number], addr: "5777 W Century Blvd, Los Angeles, CA 90045" },
  { name: "NEW YORK, NY", coords: [40.7128, -74.0060] as [number, number], addr: "347 5th Ave Ste 1402, New York NY 10016" },
  { name: "VANCOUVER, BC", coords: [49.2827, -123.1207] as [number, number], addr: "#700-838 W Hastings Street Vancouver, BC" },
  { name: "CALGARY, AB", coords: [51.0447, -114.0719] as [number, number], addr: "131 Bracewood Road SW, Calgary, Alberta" },
  { name: "SHENZHEN HEADQUARTER", coords: [22.5431, 114.0579] as [number, number], addr: "Suite 5278, Novel Park, Nanshan District, Shenzhen" },
  { name: "PHNOM PENH", coords: [11.5564, 104.9282] as [number, number], addr: "#13, St.P06, Sangkat Nirouth, Phnom Penh" },
];

export default function NetworkPage() {
  const navigate = useNavigate();

  return (
    <motion.div 
      className="network-page-root"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <button className="network-back-btn" onClick={() => navigate("/login")}>
        <ChevronRight size={24} />
      </button>

      {/* FULL SCREEN MAP CONTAINER */}
      <div className="network-map-container" style={{ width: "100%", height: "100%", position: "absolute", zIndex: 1 }}>
        <MapContainer 
          center={[30, 0]} 
          zoom={3} 
          scrollWheelZoom={true} 
          style={{ width: "100%", height: "100%", background: "#111236" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {BRANCHES.map(({ name, coords, addr }) => (
            <Marker key={name} position={coords} icon={modernPin}>
              <Popup className="custom-popup">
                <strong>{name}</strong><br/>
                {addr}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="network-page-overlay">
        <h1 className="network-page-title">OUR GLOBAL<br/>NETWORK</h1>
        <p className="network-page-subtitle">Pioneering Logistics Worldwide</p>
      </div>
    </motion.div>
  );
}
