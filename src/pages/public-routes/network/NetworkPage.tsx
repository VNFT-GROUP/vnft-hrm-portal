import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, MapPin } from "lucide-react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { motion } from "framer-motion";
import "./NetworkPage.css";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const BRANCHES = [
  { name: "TRỤ SỞ HỒ CHÍ MINH", coordinates: [106.6297, 10.8231] as [number, number] },
  { name: "VĂN PHÒNG HÀ NỘI", coordinates: [105.8342, 21.0278] as [number, number] },
  { name: "HOUSTON, TX", coordinates: [-95.3698, 29.7604] as [number, number] },
  { name: "LOS ANGELES, CA", coordinates: [-118.2437, 34.0522] as [number, number] },
  { name: "NEW YORK, NY", coordinates: [-74.0060, 40.7128] as [number, number] },
  { name: "VANCOUVER, BC", coordinates: [-123.1207, 49.2827] as [number, number] },
  { name: "CALGARY, AB", coordinates: [-114.0719, 51.0447] as [number, number] },
  { name: "SHENZHEN HEADQUARTER", coordinates: [114.0579, 22.5431] as [number, number] },
  { name: "PHNOM PENH", coordinates: [104.9282, 11.5564] as [number, number] },
];

export default function NetworkPage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <motion.div 
      className="network-page-root"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Navigator Back to Login */}
      <button className="network-back-btn" onClick={() => navigate("/login")}>
        <ChevronRight size={24} />
      </button>

      {/* Map Content */}
      <div className="network-map-container">
        <ComposableMap 
          projection="geoMercator" 
          projectionConfig={{ scale: 130 }}
          width={800} 
          height={400}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography 
                  key={geo.rsmKey} 
                  geography={geo} 
                  fill="rgba(255, 255, 255, 0.08)"
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "rgba(255, 255, 255, 0.15)" },
                    pressed: { outline: "none" }
                  }}
                />
              ))
            }
          </Geographies>

          {BRANCHES.map(({ name, coordinates }) => (
            <Marker 
              key={name} 
              coordinates={coordinates}
              onMouseEnter={() => setHovered(name)}
              onMouseLeave={() => setHovered(null)}
            >
              <g
                fill="none"
                stroke="#F7941D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(-12, -24)"
              >
                <circle cx="12" cy="10" r="3" />
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" fill="rgba(247, 148, 29, 0.2)" />
              </g>
              {hovered === name && (
                <text
                  textAnchor="middle"
                  y={-30}
                  style={{ fill: "#FFFFFF", fontSize: "10px", fontWeight: "bold", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}
                >
                  {name}
                </text>
              )}
            </Marker>
          ))}
        </ComposableMap>
      </div>

      {/* Elegant Overlay Label */}
      <div className="network-page-overlay">
        <h1 className="network-page-title">OUR GLOBAL<br/>NETWORK</h1>
        <p className="network-page-subtitle">Pioneering Logistics Worldwide</p>
      </div>
    </motion.div>
  );
}
