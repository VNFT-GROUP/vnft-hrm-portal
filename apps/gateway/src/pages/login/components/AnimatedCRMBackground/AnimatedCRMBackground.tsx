import "./AnimatedCRMBackground.css";

/* ── Reusable SVG pieces ── */
const DeliveryVan = ({ color = "#6366f1", cab = "#4f46e5", flipped = false, opacity = 0.75 }) => (
  <svg width="52" height="26" viewBox="0 0 70 34" opacity={opacity} style={{ transform: flipped ? "scaleX(-1)" : "none" }}>
    {/* Van body / cargo box */}
    <rect x="2" y="6" width="42" height="22" rx="1" fill={color} />
    {/* Stripes on cargo */}
    {[8, 14, 20, 26, 32].map(x => (
      <rect key={x} x={x} y="6" width="1.5" height="22" fill="#fff" opacity="0.12" />
    ))}
    {/* Cab */}
    <path d="M46 16 L50 20 V28 H44 V16 H46 Z" fill={cab} />
    {/* Windshield */}
    <rect x="44" y="18" width="4" height="4" rx="0.5" fill="#bae6fd" opacity="0.85" />
    {/* UnderFrame */}
    <rect x="2" y="28" width="48" height="2" fill="#1e293b" />
    {/* Wheels */}
    {[12, 22, 48].map(cx => (
      <g key={cx}>
        <circle cx={cx} cy="30" r="4.5" fill="#0f172a" />
        <circle cx={cx} cy="30" r="1.8" fill="#94a3b8" />
      </g>
    ))}
  </svg>
);

const CargoShip = ({ main = "#1d4ed8", accent = "#6366f1", opacity = 0.8 }) => (
  <svg width="70" height="36" viewBox="0 0 90 46" opacity={opacity}>
    {/* Hull */}
    <path d="M4 30 L10 40 H76 L88 30 Z" fill="#1e3a5f" />
    <path d="M8 36 H76 L72 40 H12 Z" fill="#94a3b8" opacity="0.2" />
    {/* Deck */}
    <rect x="14" y="18" width="65" height="14" rx="1" fill={main} />
    {/* Bridge */}
    <rect x="18" y="8" width="18" height="12" rx="1" fill="#2563eb" />
    <rect x="20" y="10" width="6" height="4" rx="0.5" fill="#bae6fd" />
    <rect x="27" y="10" width="6" height="4" rx="0.5" fill="#bae6fd" />
    {/* Chimney */}
    <rect x="28" y="3" width="5" height="8" rx="1" fill="#374151" />
    {/* Containers */}
    {[
      { x: 38, y: 10, c: "#ef4444" },
      { x: 48, y: 10, c: "#eab308" },
      { x: 58, y: 10, c: accent },
      { x: 68, y: 10, c: "#22c55e" },
      { x: 38, y: 18, c: "#0891b2" },
      { x: 48, y: 18, c: "#ef4444" },
      { x: 58, y: 18, c: "#eab308" },
      { x: 68, y: 18, c: accent },
    ].map((b, i) => (
      <g key={i}>
        <rect x={b.x} y={b.y} width="9" height="7" rx="0.5" fill={b.c} />
        <rect x={b.x + 2} y={b.y} width="1" height="7" fill="#fff" opacity="0.15" />
        <rect x={b.x + 4} y={b.y} width="1" height="7" fill="#fff" opacity="0.15" />
        <rect x={b.x + 6} y={b.y} width="1" height="7" fill="#fff" opacity="0.15" />
      </g>
    ))}
  </svg>
);

export default function AnimatedCRMBackground() {
  return (
    <div className="crm-animated-bg">
      <div className="crm-bg-overlay" />

      {/* ── REAL SUN with spinning rays ── */}
      <div className="crm-sun">
        <div className="crm-sun-circle" />
        <svg className="crm-sun-rays" viewBox="0 0 84 84" fill="none">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 42 + 29 * Math.cos(angle);
            const y1 = 42 + 29 * Math.sin(angle);
            const x2 = 42 + 39 * Math.cos(angle);
            const y2 = 42 + 39 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />;
          })}
        </svg>
      </div>

      {/* ── MOON (crescent) ── */}
      <div className="crm-moon">
        <svg width="44" height="44" viewBox="0 0 44 44">
          {/* full circle */}
          <circle cx="22" cy="22" r="16" fill="#fef9c3" />
          {/* mask circle to create crescent */}
          <circle cx="30" cy="17" r="14" fill="#bfdbfe" />
          {/* stars around moon */}
          {[[6,8],[4,28],[36,30],[40,10],[32,40]].map(([sx,sy],i) => (
            <circle key={i} cx={sx} cy={sy} r="1.5" fill="#fde68a" opacity="0.8" />
          ))}
        </svg>
      </div>

      {/* ── MOUNTAIN RANGES (behind buildings) ── */}
      <div className="crm-mountains">
        <svg className="crm-mountains-svg" viewBox="0 0 1200 200" preserveAspectRatio="none">
          {/* Far mountains — light blue-grey */}
          <path d="M0,200 L0,130 L80,60 L160,110 L260,40 L360,90 L440,30 L530,80 L620,50 L700,100 L790,20 L880,70 L960,45 L1050,85 L1140,35 L1200,70 L1200,200 Z"
            fill="rgba(147,197,253,0.18)" />
          {/* Mid mountains — slightly darker */}
          <path d="M0,200 L0,155 L100,90 L200,135 L310,70 L400,120 L500,75 L600,115 L700,60 L800,105 L900,80 L1000,125 L1100,65 L1200,100 L1200,200 Z"
            fill="rgba(99,102,241,0.10)" />
          {/* Snow caps */}
          <path d="M80,60 L95,75 L65,75 Z" fill="rgba(255,255,255,0.5)" />
          <path d="M260,40 L278,60 L242,60 Z" fill="rgba(255,255,255,0.5)" />
          <path d="M440,30 L458,50 L422,50 Z" fill="rgba(255,255,255,0.5)" />
          <path d="M620,50 L636,68 L604,68 Z" fill="rgba(255,255,255,0.5)" />
          <path d="M790,20 L808,42 L772,42 Z" fill="rgba(255,255,255,0.5)" />
          <path d="M960,45 L975,62 L945,62 Z" fill="rgba(255,255,255,0.5)" />
          <path d="M1140,35 L1156,55 L1124,55 Z" fill="rgba(255,255,255,0.5)" />
        </svg>
      </div>

      {/* ── KITE ── */}
      <div className="crm-kite-wrap">
        <svg width="50" height="90" viewBox="0 0 50 90">
          {/* Kite diamond */}
          <path d="M25,2 L46,30 L25,58 L4,30 Z" fill="#6366f1" opacity="0.85" />
          {/* Kite panels */}
          <path d="M25,2 L46,30 L25,30 Z" fill="#818cf8" opacity="0.9" />
          <path d="M4,30 L25,30 L25,58 Z" fill="#4f46e5" opacity="0.9" />
          {/* Cross spars */}
          <line x1="4" y1="30" x2="46" y2="30" stroke="white" strokeWidth="1" opacity="0.5" />
          <line x1="25" y1="2" x2="25" y2="58" stroke="white" strokeWidth="1" opacity="0.5" />
          {/* Tail */}
          <path className="crm-kite-string"
            d="M25,58 Q20,65 28,72 Q22,79 25,90"
            fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
          {/* Bow decorations on tail */}
          <circle cx="26" cy="66" r="2" fill="#f97316" opacity="0.6" />
          <circle cx="24" cy="78" r="2" fill="#6366f1" opacity="0.6" />
          {/* String going down-left (kite holder offscreen) */}
          <line x1="25" y1="30" x2="-80" y2="160" stroke="#94a3b8" strokeWidth="0.8" opacity="0.5" strokeDasharray="4 3" />
        </svg>
      </div>

      {/* ── CLOUDS ── */}
      <div className="crm-clouds-wrapper">
        <div className="crm-cloud crm-cloud-big">
          <svg width="210" height="56" viewBox="0 0 24 24" preserveAspectRatio="none" fill="white" opacity="0.8">
            <path d="M17.5 19C19.99 19 22 16.99 22 14.5C22 12.22 20.31 10.34 18.12 10.04C17.65 6.64 14.74 4 11.5 4C8.58 4 6.1 5.92 5.31 8.52C2.87 8.78 1 10.84 1 13.5C1 16.54 3.46 19 6.5 19H17.5Z" />
          </svg>
        </div>
        <div className="crm-cloud crm-cloud-med">
          <svg width="155" height="42" viewBox="0 0 24 24" preserveAspectRatio="none" fill="white" opacity="0.65">
            <path d="M17.5 19C19.99 19 22 16.99 22 14.5C22 12.22 20.31 10.34 18.12 10.04C17.65 6.64 14.74 4 11.5 4C8.58 4 6.1 5.92 5.31 8.52C2.87 8.78 1 10.84 1 13.5C1 16.54 3.46 19 6.5 19H17.5Z" />
          </svg>
        </div>
        <div className="crm-cloud crm-cloud-small">
          <svg width="110" height="30" viewBox="0 0 24 24" preserveAspectRatio="none" fill="white" opacity="0.7">
            <path d="M17.5 19C19.99 19 22 16.99 22 14.5C22 12.22 20.31 10.34 18.12 10.04C17.65 6.64 14.74 4 11.5 4C8.58 4 6.1 5.92 5.31 8.52C2.87 8.78 1 10.84 1 13.5C1 16.54 3.46 19 6.5 19H17.5Z" />
          </svg>
        </div>
      </div>

      {/* ── SEAGULL FLOCK ── */}
      <div className="crm-birds">
        <svg width="110" height="44" viewBox="0 0 110 44" fill="none" stroke="#64748b" strokeWidth="1.2">
          <path d="M8 22 Q13 14 18 22 Q23 14 28 22" className="crm-gull d1" />
          <path d="M22 34 Q27 26 32 34 Q37 26 42 34" className="crm-gull d2" />
          <path d="M42 12 Q47 4 52 12 Q57 4 62 12" className="crm-gull d3" />
          <path d="M58 28 Q63 20 68 28 Q73 20 78 28" className="crm-gull" />
        </svg>
      </div>

      {/* ── OFFICE BUILDINGS — left cluster (5 buildings) ── */}
      <div className="crm-office-building">
        {/* Tallest */}
        <div className="crm-building">
          <div className="crm-antenna" />
          <div className="crm-building-body" style={{ width: 55, height: 160 }}>
            <div className="crm-office-sign">CRM HQ</div>
            {[24,40,56,72,88,104,120].map((top, row) =>
              [6,20,34].map((left, col) => (
                <div key={`${row}-${col}`}
                  className={`crm-win-light ${(row+col)%3===0?'on':(row+col)%3===1?'on2':'on3'}`}
                  style={{ top, left, position:'absolute' }} />
              ))
            )}
          </div>
        </div>
        {/* Mid-tall */}
        <div className="crm-building">
          <div className="crm-antenna" />
          <div className="crm-building-body" style={{ width: 42, height: 120 }}>
            {[18,34,50,66,82].map((top, row) =>
              [6,20].map((left, col) => (
                <div key={`${row}-${col}`}
                  className={`crm-win-light ${(row+col)%2===0?'on2':'on3'}`}
                  style={{ top, left, position:'absolute' }} />
              ))
            )}
          </div>
        </div>
        {/* Short */}
        <div className="crm-building">
          <div className="crm-building-body" style={{ width: 36, height: 80, background:'rgba(79,70,229,0.12)', borderColor:'rgba(79,70,229,0.25)' }}>
            {[16,32,48].map((top, r) =>
              [5,18].map((left, c) => (
                <div key={`${r}-${c}`} className={`crm-win-light ${r%2===0?'on':'on3'}`}
                  style={{ top, left, position:'absolute' }} />
              ))
            )}
          </div>
        </div>
        {/* Narrow tower */}
        <div className="crm-building">
          <div className="crm-antenna" />
          <div className="crm-building-body" style={{ width: 28, height: 140, background:'rgba(14,116,144,0.12)', borderColor:'rgba(14,116,144,0.25)' }}>
            {[20,36,52,68,84,100].map((top, r) =>
              [4,14].map((left, c) => (
                <div key={`${r}-${c}`} className={`crm-win-light ${r%3===0?'on2':'on'}`}
                  style={{ top, left, position:'absolute', width:5 }} />
              ))
            )}
          </div>
        </div>
        {/* Squat wide */}
        <div className="crm-building">
          <div className="crm-building-body" style={{ width: 50, height: 60, background:'rgba(139,92,246,0.1)', borderColor:'rgba(139,92,246,0.2)' }}>
            {[12,28].map((top, r) =>
              [6,20,34].map((left, c) => (
                <div key={`${r}-${c}`} className={`crm-win-light ${(r+c)%2===0?'on':'on3'}`}
                  style={{ top, left, position:'absolute' }} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── CENTRE CLUSTER (mid-scene, 3 buildings) ── */}
      <div className="crm-building-cluster-mid">
        <div className="crm-building">
          <div className="crm-building-body" style={{ width: 38, height: 90, background:'rgba(16,185,129,0.1)', borderColor:'rgba(16,185,129,0.2)' }}>
            {[14,30,46,62].map((top, r) =>
              [5,18].map((left, c) => (
                <div key={`${r}-${c}`} className={`crm-win-light ${r%2===0?'on3':'on'}`}
                  style={{ top, left, position:'absolute' }} />
              ))
            )}
          </div>
        </div>
        <div className="crm-building">
          <div className="crm-antenna" />
          <div className="crm-building-body" style={{ width: 44, height: 130, background:'rgba(99,102,241,0.11)', borderColor:'rgba(99,102,241,0.22)' }}>
            <div className="crm-office-sign">SALES</div>
            {[26,42,58,74,90,106].map((top, r) =>
              [6,19,32].map((left, c) => (
                <div key={`${r}-${c}`} className={`crm-win-light ${(r*2+c)%3===0?'on':'on2'}`}
                  style={{ top, left, position:'absolute', width:5 }} />
              ))
            )}
          </div>
        </div>
        <div className="crm-building">
          <div className="crm-building-body" style={{ width: 32, height: 70, background:'rgba(245,158,11,0.09)', borderColor:'rgba(245,158,11,0.2)' }}>
            {[14,30,46].map((top, r) =>
              [5,16].map((left, c) => (
                <div key={`${r}-${c}`} className={`crm-win-light ${r%2===0?'on2':'on3'}`}
                  style={{ top, left, position:'absolute' }} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT CLUSTER — port-side warehouses ── */}
      <div className="crm-building-cluster-right">
        {/* Warehouse low-rise */}
        <div className="crm-building">
          <div className="crm-building-body" style={{ width: 65, height: 55, background:'rgba(71,85,105,0.12)', borderColor:'rgba(71,85,105,0.22)', borderRadius:'3px 3px 0 0' }}>
            <div className="crm-office-sign" style={{ background:'rgba(249,115,22,0.8)' }}>PORT OPS</div>
            {[16,30].map((top, r) =>
              [6,22,38,52].map((left, c) => (
                <div key={`${r}-${c}`} className={`crm-win-light ${(r+c)%2===0?'on2':'on'}`}
                  style={{ top, left, position:'absolute' }} />
              ))
            )}
          </div>
        </div>
        {/* Control tower */}
        <div className="crm-building">
          <div className="crm-antenna" />
          <div className="crm-building-body" style={{ width: 30, height: 115, background:'rgba(14,116,144,0.13)', borderColor:'rgba(14,116,144,0.25)' }}>
            {[22,38,54,70,86].map((top, r) =>
              [4,16].map((left, c) => (
                <div key={`${r}-${c}`} className={`crm-win-light ${r%3===0?'on':'on2'}`}
                  style={{ top, left, position:'absolute', width:5 }} />
              ))
            )}
          </div>
        </div>
        {/* Short annex */}
        <div className="crm-building">
          <div className="crm-building-body" style={{ width: 40, height: 45, background:'rgba(71,85,105,0.1)', borderColor:'rgba(71,85,105,0.2)' }}>
            {[12].map((top, r) =>
              [6,18,30].map((left, c) => (
                <div key={`${r}-${c}`} className={`crm-win-light on3`}
                  style={{ top, left, position:'absolute' }} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── ROAD (no workers, no packets) ── */}
      <div className="crm-road">
        <div className="crm-road-line" />
      </div>

      {/* ── DOCK / PORT ── */}
      <div className="crm-dock">
        <div className="crm-dock-surface" />
        {/* Pillars */}
        {[10, 22, 34, 46, 58, 70, 82, 92].map(p => (
          <div key={p} className="crm-dock-pillar" style={{ left: `${p}%` }} />
        ))}

        {/* Trucks running ON the dock surface (surface top = bottom:76px in dock) */}
        <div className="crm-truck right" style={{ bottom: 76, transform: 'scale(1.1)', zIndex: 3 }}>
          <DeliveryVan color="#6366f1" cab="#4f46e5" opacity={0.8} />
        </div>
        <div className="crm-truck right2" style={{ bottom: 76, transform: 'scale(1.1)', zIndex: 3 }}>
          <DeliveryVan color="#0891b2" cab="#0e7490" opacity={0.7} />
        </div>
        <div className="crm-truck left" style={{ bottom: 76, transform: 'scale(1.1)', zIndex: 3 }}>
          <DeliveryVan color="#8b5cf6" cab="#7c3aed" flipped opacity={0.65} />
        </div>

        {/* ── CONTAINER YARD — SVG ── */}
        <svg
          style={{ position: 'absolute', bottom: 76, right: '16%', zIndex: 3, overflow: 'visible' }}
          width="160" height="80" viewBox="0 0 160 80"
        >
          <defs>
            <linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444"/><stop offset="100%" stopColor="#b91c1c"/></linearGradient>
            <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#eab308"/><stop offset="100%" stopColor="#a16207"/></linearGradient>
            <linearGradient id="cg3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#4338ca"/></linearGradient>
            <linearGradient id="cg4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e"/><stop offset="100%" stopColor="#15803d"/></linearGradient>
            <linearGradient id="cg5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0891b2"/><stop offset="100%" stopColor="#0e7490"/></linearGradient>
            <linearGradient id="cg6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#c2410c"/></linearGradient>
          </defs>
          <ellipse cx="80" cy="79" rx="78" ry="4" fill="rgba(0,0,0,0.1)" />
          {[
            { x:0,   y:48, fill:'url(#cg1)' },
            { x:52,  y:48, fill:'url(#cg5)' },
            { x:104, y:48, fill:'url(#cg3)' },
          ].map((c,i) => (
            <g key={`r1-${i}`}>
              <rect x={c.x} y={c.y} width={46} height={28} rx="1" fill={c.fill}/>
              <rect x={c.x} y={c.y} width={46} height={6} fill="rgba(255,255,255,0.18)"/>
              {[10,18,26,34].map(rx => <rect key={rx} x={c.x+rx} y={c.y} width="2" height={28} fill="rgba(0,0,0,0.12)"/>)}
              <rect x={c.x} y={c.y+13} width={46} height="2" fill="rgba(0,0,0,0.1)"/>
            </g>
          ))}
          {[
            { x:2,  y:22, fill:'url(#cg2)' },
            { x:82, y:22, fill:'url(#cg4)' },
          ].map((c,i) => (
            <g key={`r2-${i}`}>
              <rect x={c.x} y={c.y} width={46} height={28} rx="1" fill={c.fill}/>
              <rect x={c.x} y={c.y} width={46} height={6} fill="rgba(255,255,255,0.18)"/>
              {[10,18,26,34].map(rx => <rect key={rx} x={c.x+rx} y={c.y} width="2" height={28} fill="rgba(0,0,0,0.12)"/>)}
              <rect x={c.x} y={c.y+13} width={46} height="2" fill="rgba(0,0,0,0.1)"/>
            </g>
          ))}
          <rect x={28} y={0} width={46} height={24} rx="1" fill="url(#cg6)"/>
          <rect x={28} y={0} width={46} height={5} fill="rgba(255,255,255,0.18)"/>
          {[10,18,26,34].map(rx => <rect key={rx} x={28+rx} y={0} width="2" height={24} fill="rgba(0,0,0,0.12)"/>)}
          <rect x={28} y={11} width={46} height="2" fill="rgba(0,0,0,0.1)"/>
        </svg>
      </div>

      {/* ── GANTRY CRANE — SVG ── */}
      <svg
        style={{ position: 'absolute', bottom: 74, right: '5%', zIndex: 4, overflow: 'visible' }}
        width="160" height="200" viewBox="0 0 160 200"
      >
        <defs>
          <linearGradient id="craneGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fb923c"/>
            <stop offset="100%" stopColor="#f97316"/>
          </linearGradient>
          <style>{`
            @keyframes trolley-move {0%,100%{transform:translateX(0)}50%{transform:translateX(-65px)}}
            @keyframes hook-lift   {0%,100%{transform:translateY(0)}50%{transform:translateY(-38px)}}
            .crm-trolley{animation:trolley-move 5s ease-in-out infinite}
            .crm-hook   {animation:hook-lift    5s ease-in-out infinite}
          `}</style>
        </defs>

        {/* Leg left */}
        <rect x={26} y={88} width={9} height={112} rx="2" fill="url(#craneGrad)" opacity="0.9"/>
        {/* Leg right */}
        <rect x={124} y={88} width={9} height={112} rx="2" fill="url(#craneGrad)" opacity="0.9"/>
        {/* Leg bracings */}
        <line x1={35} y1={110} x2={124} y2={155} stroke="#fb923c" strokeWidth="2.5" opacity="0.45"/>
        <line x1={35} y1={155} x2={124} y2={110} stroke="#fb923c" strokeWidth="2.5" opacity="0.45"/>
        {/* Feet */}
        <rect x={18} y={196} width={26} height={6} rx="2" fill="#ea580c"/>
        <rect x={116} y={196} width={26} height={6} rx="2" fill="#ea580c"/>

        {/* Main boom */}
        <rect x={0} y={80} width={160} height={10} rx="3" fill="url(#craneGrad)"/>
        {[0,18,36,54,72,90,108,126].map(bx => (
          <line key={bx} x1={bx+2} y1={80} x2={bx+12} y2={90} stroke="#ea580c" strokeWidth="1.5" opacity="0.35"/>
        ))}

        {/* Rear mast */}
        <rect x={119} y={0} width={8} height={90} rx="2" fill="#ea580c" opacity="0.85"/>
        <rect x={112} y={0} width={22} height={6} rx="2" fill="#c2410c"/>
        {/* Stay cables */}
        <line x1={123} y1={6} x2={32} y2={80} stroke="#94a3b8" strokeWidth="1.2" opacity="0.4"/>
        <line x1={123} y1={6} x2={132} y2={80} stroke="#94a3b8" strokeWidth="1.2" opacity="0.4"/>
        {/* Counterweight */}
        <rect x={112} y={55} width={30} height={20} rx="3" fill="#334155" opacity="0.85"/>
        <rect x={114} y={57} width={26} height={4} rx="1" fill="#475569" opacity="0.5"/>

        {/* Operator cabin */}
        <rect x={48} y={65} width={22} height={17} rx="2" fill="#1e3a5f"/>
        <rect x={50} y={67} width={8} height={7} rx="1" fill="#bae6fd" opacity="0.85"/>
        <rect x={61} y={67} width={7} height={7} rx="1" fill="#bae6fd" opacity="0.85"/>

        {/* Trolley + hook */}
        <g className="crm-trolley">
          <rect x={88} y={87} width={22} height={9} rx="2" fill="#334155"/>
          <circle cx={92} cy={87} r="3.5" fill="#1e293b"/>
          <circle cx={106} cy={87} r="3.5" fill="#1e293b"/>
          <line x1={99} y1={96} x2={99} y2={145} stroke="#94a3b8" strokeWidth="1.5"/>
          <g className="crm-hook">
            <rect x={83} y={145} width={32} height={5} rx="1" fill="#475569"/>
            <rect x={80} y={150} width={38} height={22} rx="1" fill="#6366f1"/>
            <rect x={80} y={150} width={38} height={6} fill="#818cf8" opacity="0.5"/>
            {[6,12,20,28,34].map(rx => (
              <rect key={rx} x={80+rx} y={150} width="2" height={22} fill="rgba(0,0,0,0.15)"/>
            ))}
          </g>
        </g>
      </svg>

      {/* ── SHIPS ── */}
      <div className="crm-ship">
        <CargoShip main="#1d4ed8" accent="#6366f1" opacity={0.82} />
      </div>
      <div className="crm-ship s2">
        <CargoShip main="#0e7490" accent="#f97316" opacity={0.65} />
      </div>

      {/* ── OCEAN ── */}
      <div className="crm-ocean">
        <svg className="crm-waves" viewBox="0 0 520 28" preserveAspectRatio="none">
          <path className="crm-wave"
            d="M0 14 Q13 8 26 14 T52 14 T78 14 T104 14 T130 14 T156 14 T182 14 T208 14 T234 14 T260 14 T286 14 T312 14 T338 14 T364 14 T390 14 T416 14 T442 14 T468 14 T494 14 T520 14 V28 H0 Z"
            fill="#6366f1" opacity="0.12" />
          <path className="crm-wave w2"
            d="M0 18 Q13 12 26 18 T52 18 T78 18 T104 18 T130 18 T156 18 T182 18 T208 18 T234 18 T260 18 T286 18 T312 18 T338 18 T364 18 T390 18 T416 18 T442 18 T468 18 T494 18 T520 18 V28 H0 Z"
            fill="#38bdf8" opacity="0.1" />
        </svg>
      </div>
    </div>
  );
}
