import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, List } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { m  } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useTranslation } from "react-i18next";

function MapFlyTo({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 6, {
        duration: 1.5,
      });
    }
  }, [coords, map]);
  
  return null;
}

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
  const { t } = useTranslation();
  const [activeLocation, setActiveLocation] = useState<[number, number] | null>(null);

  return (
    <m.div 
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
          minZoom={2}
          maxZoom={10}
          scrollWheelZoom={true} 
          style={{ width: "100%", height: "100%", background: "#f8fafc" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <MapFlyTo coords={activeLocation} />
          {BRANCHES.map(({ name, coords, addr }) => (
            <Marker key={name} position={coords} icon={modernPin}>
              <Popup className="custom-popup-light">
                <strong>{name}</strong><br/>
                {addr}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Bottom Center VNFT Banner */}
      <div className="vnft-bottom-banner">
        <span>{t('network.globalNetworkBanner')}</span>
      </div>

      {/* Slide-out Sheet for Branch Locations */}
      <Sheet>
        <SheetTrigger className="network-open-sheet-btn">
          <List size={20} />
          <span>{t('network.branchListBtn')}</span>
        </SheetTrigger>
        <SheetContent side="right" className="w-[400px] sm:w-[450px] p-0 border-l border-slate-200 bg-white/95 backdrop-blur-xl flex flex-col z-2000">
          <SheetHeader className="p-6 border-b border-slate-100 shrink-0">
            <SheetTitle className="text-[#1E2062] font-bold text-xl text-left tracking-wide">
              {t('network.globalOffices')}
            </SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            {BRANCHES.map((branch) => (
              <div 
                key={branch.name} 
                className="branch-card-light shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setActiveLocation(branch.coords)}
              >
                <div className="branch-name">{branch.name}</div>
                <div className="branch-addr">{branch.addr}</div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </m.div>
  );
}
