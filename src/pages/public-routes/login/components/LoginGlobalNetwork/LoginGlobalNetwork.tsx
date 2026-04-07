import React, { useState } from "react";
import { ChevronLeft, MapPin, X } from "lucide-react";
import "./LoginGlobalNetwork.css";

const BRANCHES = [
  {
    country: "Việt Nam",
    flag: "🇻🇳",
    offices: [
      { name: "TRỤ SỞ HỒ CHÍ MINH", address: "178/11 Nguyễn Văn Thương, P. Thạnh Mỹ Tây, Bình Thạnh, TP. HCM" },
      { name: "VĂN PHÒNG HÀ NỘI", address: "Tầng 6, Tòa nhà Veba, 208 Phố Xã Đàn 2, P. Đống Đa, Hà Nội" },
    ]
  },
  {
    country: "USA",
    flag: "🇺🇸",
    offices: [
      { name: "HOUSTON, TX", address: "11360 Bellaire BLVD STE 820, Houston, TX 77072" },
      { name: "LOS ANGELES, CA", address: "5777 W Century Blvd 1125 - 2130 Los Angeles, CA 90045" },
      { name: "FOUNTAIN VALLEY, CA", address: "10840 Warner Ave #102A, Fountain Valley, CA 92708" },
      { name: "NEW YORK, NY", address: "347 5th Ave Ste 1402 - 658 New York NY 10016" }
    ]
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    offices: [
      { name: "VANCOUVER", address: "#700-838 W Hastings Street Vancouver, BC V6C 0A6" },
      { name: "CALGARY", address: "131 Bracewood Road SW, Calgary, Alberta T2W 3B9" }
    ]
  },
  {
    country: "China",
    flag: "🇨🇳",
    offices: [
      { name: "SHENZHEN HEADQUARTER", address: "Suite 5278, 5th Floor, Tower 2, Novel Park No.4078 Dongbin Road, Nanshan District, Shenzhen" }
    ]
  },
  {
    country: "Cambodia",
    flag: "🇰🇭",
    offices: [
      { name: "PHNOM PENH", address: "#13, St.P06, Phum Boeng Chhuk, Sangkat Nirouth, Khan Chbar Ampov, Phnom Penh" }
    ]
  }
];

// World Map Dots Graphic
const WorldMapGraphic = () => (
  <svg 
    className="full-map-svg" 
    viewBox="0 0 1000 500" 
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <g opacity="0.6">
      <circle cx="200" cy="150" r="1.5" /><circle cx="210" cy="150" r="1.5" /><circle cx="220" cy="150" r="1.5" /><circle cx="230" cy="150" r="1.5" /><circle cx="240" cy="150" r="1.5" /><circle cx="205" cy="160" r="1.5" /><circle cx="215" cy="160" r="1.5" /><circle cx="225" cy="160" r="1.5" /><circle cx="235" cy="160" r="1.5" /><circle cx="245" cy="160" r="1.5" /><circle cx="255" cy="160" r="1.5" /><circle cx="190" cy="170" r="1.5" /><circle cx="200" cy="170" r="1.5" /><circle cx="210" cy="170" r="1.5" /><circle cx="220" cy="170" r="1.5" /><circle cx="230" cy="170" r="1.5" /><circle cx="240" cy="170" r="1.5" /><circle cx="250" cy="170" r="1.5" /><circle cx="260" cy="170" r="1.5" /><circle cx="185" cy="180" r="1.5" /><circle cx="195" cy="180" r="1.5" /><circle cx="205" cy="180" r="1.5" /><circle cx="215" cy="180" r="1.5" /><circle cx="225" cy="180" r="1.5" /><circle cx="235" cy="180" r="1.5" /><circle cx="245" cy="180" r="1.5" /><circle cx="255" cy="180" r="1.5" /><circle cx="265" cy="180" r="1.5" /><circle cx="275" cy="180" r="1.5" /><circle cx="180" cy="190" r="1.5" /><circle cx="190" cy="190" r="1.5" /><circle cx="200" cy="190" r="1.5" /><circle cx="210" cy="190" r="1.5" /><circle cx="220" cy="190" r="1.5" /><circle cx="230" cy="190" r="1.5" /><circle cx="240" cy="190" r="1.5" /><circle cx="250" cy="190" r="1.5" /><circle cx="260" cy="190" r="1.5" /><circle cx="270" cy="190" r="1.5" /><circle cx="280" cy="190" r="1.5" /><circle cx="290" cy="190" r="1.5" />
      {/* South America */}
      <circle cx="260" cy="280" r="1.5" /><circle cx="270" cy="280" r="1.5" /><circle cx="255" cy="290" r="1.5" /><circle cx="265" cy="290" r="1.5" /><circle cx="275" cy="290" r="1.5" /><circle cx="260" cy="300" r="1.5" /><circle cx="270" cy="300" r="1.5" /><circle cx="280" cy="300" r="1.5" /><circle cx="290" cy="300" r="1.5" /><circle cx="265" cy="310" r="1.5" /><circle cx="275" cy="310" r="1.5" /><circle cx="285" cy="310" r="1.5" /><circle cx="295" cy="310" r="1.5" /><circle cx="270" cy="320" r="1.5" /><circle cx="280" cy="320" r="1.5" /><circle cx="290" cy="320" r="1.5" /><circle cx="300" cy="320" r="1.5" /><circle cx="275" cy="330" r="1.5" /><circle cx="285" cy="330" r="1.5" /><circle cx="295" cy="330" r="1.5" /><circle cx="280" cy="340" r="1.5" /><circle cx="290" cy="340" r="1.5" /><circle cx="285" cy="350" r="1.5" /><circle cx="295" cy="350" r="1.5" /><circle cx="290" cy="360" r="1.5" /><circle cx="295" cy="370" r="1.5" />
      {/* Europe / Africa */}
      <circle cx="480" cy="120" r="1.5" /><circle cx="490" cy="120" r="1.5" /><circle cx="500" cy="120" r="1.5" /><circle cx="475" cy="130" r="1.5" /><circle cx="485" cy="130" r="1.5" /><circle cx="495" cy="130" r="1.5" /><circle cx="505" cy="130" r="1.5" /><circle cx="515" cy="130" r="1.5" /><circle cx="460" cy="140" r="1.5" /><circle cx="470" cy="140" r="1.5" /><circle cx="480" cy="140" r="1.5" /><circle cx="490" cy="140" r="1.5" /><circle cx="500" cy="140" r="1.5" /><circle cx="510" cy="140" r="1.5" /><circle cx="520" cy="140" r="1.5" /><circle cx="465" cy="150" r="1.5" /><circle cx="475" cy="150" r="1.5" /><circle cx="485" cy="150" r="1.5" /><circle cx="495" cy="150" r="1.5" /><circle cx="505" cy="150" r="1.5" /><circle cx="515" cy="150" r="1.5" /><circle cx="470" cy="160" r="1.5" /><circle cx="480" cy="160" r="1.5" /><circle cx="490" cy="160" r="1.5" /><circle cx="500" cy="160" r="1.5" />
      <circle cx="450" cy="200" r="1.5" /><circle cx="460" cy="200" r="1.5" /><circle cx="470" cy="200" r="1.5" /><circle cx="480" cy="200" r="1.5" /><circle cx="490" cy="200" r="1.5" /><circle cx="445" cy="210" r="1.5" /><circle cx="455" cy="210" r="1.5" /><circle cx="465" cy="210" r="1.5" /><circle cx="475" cy="210" r="1.5" /><circle cx="485" cy="210" r="1.5" /><circle cx="495" cy="210" r="1.5" /><circle cx="505" cy="210" r="1.5" /><circle cx="440" cy="220" r="1.5" /><circle cx="450" cy="220" r="1.5" /><circle cx="460" cy="220" r="1.5" /><circle cx="470" cy="220" r="1.5" /><circle cx="480" cy="220" r="1.5" /><circle cx="490" cy="220" r="1.5" /><circle cx="500" cy="220" r="1.5" /><circle cx="510" cy="220" r="1.5" /><circle cx="520" cy="220" r="1.5" /><circle cx="445" cy="230" r="1.5" /><circle cx="455" cy="230" r="1.5" /><circle cx="465" cy="230" r="1.5" /><circle cx="475" cy="230" r="1.5" /><circle cx="485" cy="230" r="1.5" /><circle cx="495" cy="230" r="1.5" /><circle cx="505" cy="230" r="1.5" /><circle cx="515" cy="230" r="1.5" /><circle cx="450" cy="240" r="1.5" /><circle cx="460" cy="240" r="1.5" /><circle cx="470" cy="240" r="1.5" /><circle cx="480" cy="240" r="1.5" /><circle cx="490" cy="240" r="1.5" /><circle cx="500" cy="240" r="1.5" /><circle cx="510" cy="240" r="1.5" /><circle cx="465" cy="250" r="1.5" /><circle cx="475" cy="250" r="1.5" /><circle cx="485" cy="250" r="1.5" /><circle cx="495" cy="250" r="1.5" /><circle cx="505" cy="250" r="1.5" /><circle cx="480" cy="260" r="1.5" /><circle cx="490" cy="260" r="1.5" /><circle cx="500" cy="260" r="1.5" /><circle cx="495" cy="270" r="1.5" /><circle cx="505" cy="270" r="1.5" />
      {/* Asia */}
      <circle cx="600" cy="120" r="1.5" /><circle cx="610" cy="120" r="1.5" /><circle cx="620" cy="120" r="1.5" /><circle cx="630" cy="120" r="1.5" /><circle cx="640" cy="120" r="1.5" /><circle cx="585" cy="130" r="1.5" /><circle cx="595" cy="130" r="1.5" /><circle cx="605" cy="130" r="1.5" /><circle cx="615" cy="130" r="1.5" /><circle cx="625" cy="130" r="1.5" /><circle cx="635" cy="130" r="1.5" /><circle cx="645" cy="130" r="1.5" /><circle cx="655" cy="130" r="1.5" /><circle cx="580" cy="140" r="1.5" /><circle cx="590" cy="140" r="1.5" /><circle cx="600" cy="140" r="1.5" /><circle cx="610" cy="140" r="1.5" /><circle cx="620" cy="140" r="1.5" /><circle cx="630" cy="140" r="1.5" /><circle cx="640" cy="140" r="1.5" /><circle cx="650" cy="140" r="1.5" /><circle cx="660" cy="140" r="1.5" /><circle cx="670" cy="140" r="1.5" /><circle cx="595" cy="150" r="1.5" /><circle cx="605" cy="150" r="1.5" /><circle cx="615" cy="150" r="1.5" /><circle cx="625" cy="150" r="1.5" /><circle cx="635" cy="150" r="1.5" /><circle cx="645" cy="150" r="1.5" /><circle cx="655" cy="150" r="1.5" /><circle cx="665" cy="150" r="1.5" /><circle cx="675" cy="150" r="1.5" /><circle cx="685" cy="150" r="1.5" /><circle cx="600" cy="160" r="1.5" /><circle cx="610" cy="160" r="1.5" /><circle cx="620" cy="160" r="1.5" /><circle cx="630" cy="160" r="1.5" /><circle cx="640" cy="160" r="1.5" /><circle cx="650" cy="160" r="1.5" /><circle cx="660" cy="160" r="1.5" /><circle cx="670" cy="160" r="1.5" /><circle cx="680" cy="160" r="1.5" /><circle cx="690" cy="160" r="1.5" /><circle cx="700" cy="160" r="1.5" />
      <circle cx="625" cy="170" r="1.5" /><circle cx="635" cy="170" r="1.5" /><circle cx="645" cy="170" r="1.5" /><circle cx="655" cy="170" r="1.5" /><circle cx="665" cy="170" r="1.5" /><circle cx="675" cy="170" r="1.5" /><circle cx="685" cy="170" r="1.5" /><circle cx="695" cy="170" r="1.5" /><circle cx="705" cy="170" r="1.5" /><circle cx="715" cy="170" r="1.5" /><circle cx="725" cy="170" r="1.5" />
      <circle cx="640" cy="180" r="1.5" /><circle cx="650" cy="180" r="1.5" /><circle cx="660" cy="180" r="1.5" /><circle cx="670" cy="180" r="1.5" /><circle cx="680" cy="180" r="1.5" /><circle cx="690" cy="180" r="1.5" /><circle cx="700" cy="180" r="1.5" /><circle cx="710" cy="180" r="1.5" /><circle cx="720" cy="180" r="1.5" /><circle cx="730" cy="180" r="1.5" /><circle cx="740" cy="180" r="1.5" />
      <circle cx="655" cy="190" r="1.5" /><circle cx="665" cy="190" r="1.5" /><circle cx="675" cy="190" r="1.5" /><circle cx="685" cy="190" r="1.5" /><circle cx="695" cy="190" r="1.5" /><circle cx="705" cy="190" r="1.5" /><circle cx="715" cy="190" r="1.5" /><circle cx="725" cy="190" r="1.5" /><circle cx="735" cy="190" r="1.5" />
      <circle cx="660" cy="200" r="1.5" /><circle cx="670" cy="200" r="1.5" /><circle cx="680" cy="200" r="1.5" /><circle cx="690" cy="200" r="1.5" /><circle cx="700" cy="200" r="1.5" /><circle cx="710" cy="200" r="1.5" /><circle cx="720" cy="200" r="1.5" />
      {/* Australia / Oceania */}
      <circle cx="790" cy="300" r="1.5" /><circle cx="800" cy="300" r="1.5" /><circle cx="785" cy="310" r="1.5" /><circle cx="795" cy="310" r="1.5" /><circle cx="805" cy="310" r="1.5" /><circle cx="815" cy="310" r="1.5" /><circle cx="780" cy="320" r="1.5" /><circle cx="790" cy="320" r="1.5" /><circle cx="800" cy="320" r="1.5" /><circle cx="810" cy="320" r="1.5" /><circle cx="820" cy="320" r="1.5" /><circle cx="830" cy="320" r="1.5" /><circle cx="785" cy="330" r="1.5" /><circle cx="795" cy="330" r="1.5" /><circle cx="805" cy="330" r="1.5" /><circle cx="815" cy="330" r="1.5" /><circle cx="825" cy="330" r="1.5" /><circle cx="835" cy="330" r="1.5" /><circle cx="790" cy="340" r="1.5" /><circle cx="800" cy="340" r="1.5" /><circle cx="810" cy="340" r="1.5" /><circle cx="820" cy="340" r="1.5" />
    </g>
    <path d="M 230 170 Q 300 80 470 140 T 680 160 Q 690 200 700 200 T 730 180" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
    <path d="M 230 170 Q 250 250 280 300" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
    <path d="M 680 160 Q 750 250 800 320" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="4 4" />
  </svg>
);

export default function LoginGlobalNetwork() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Arrow Button on the right edge */}
      <button 
        className={`network-toggle-arrow ${isOpen ? "hidden" : ""}`}
        onClick={() => setIsOpen(true)}
        title="View Global Network"
      >
        <span className="arrow-text">OUR NETWORK</span>
        <ChevronLeft className="arrow-icon" size={24} />
      </button>

      {/* Slide-over Full Panel */}
      <div className={`network-slide-panel ${isOpen ? "open" : ""}`}>
        <button className="network-close-btn" onClick={() => setIsOpen(false)}>
          <X size={28} />
        </button>

        <WorldMapGraphic />

        <div className="network-content-wrapper">
          <div className="network-header">
            <h2 className="network-title">GLOBAL NETWORK</h2>
            <p className="network-subtitle">Worldwide Logistics Coverage</p>
          </div>

          <div className="network-branches-grid">
            {BRANCHES.map((region, idx) => (
              <div key={`${region.country}-${idx}`} className="branch-card">
                <div className="branch-header">
                  <span className="branch-flag">{region.flag}</span>
                  <span className="branch-country">{region.country}</span>
                </div>
                <div className="office-list">
                  {region.offices.map((office, oIdx) => (
                    <div key={oIdx} className="office-item">
                      <MapPin size={18} className="office-pin" />
                      <div className="office-details">
                        <div className="office-name">{office.name}</div>
                        <div className="office-addr">{office.address}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
