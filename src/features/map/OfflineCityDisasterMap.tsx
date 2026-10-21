import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Navigation,
  PhoneCall,
  Compass,
  Building,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  WifiOff,
  Info,
  MapPin,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useCommandControlStore, DisasterHazardAlert } from '@/stores/commandControlStore';

interface OfflineCityDisasterMapProps {
  compact?: boolean;
  onOpenFullMap?: () => void;
  selectedAlert?: DisasterHazardAlert | null;
  focusTarget?: [number, number] | null;
}

// Bounding box for Jammu Division GIS Projection
const LNG_MIN = 74.20;
const LNG_MAX = 75.60;
const LAT_MIN = 32.40;
const LAT_MAX = 33.40;
const SVG_WIDTH = 1000;
const SVG_HEIGHT = 700;

export function projectCoordinates([lng, lat]: [number, number]): [number, number] {
  const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * SVG_WIDTH;
  const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * SVG_HEIGHT;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

export const OfflineCityDisasterMap: React.FC<OfflineCityDisasterMapProps> = ({
  compact = false,
  onOpenFullMap,
  selectedAlert,
  focusTarget,
}) => {
  const { activeAlerts, locations, triggerEmergencyModal } = useCommandControlStore();

  // Active hazard to highlight (either prop or first active alert)
  const currentHazard = selectedAlert || activeAlerts[0] || null;

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(compact ? 1 : 1.15);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeItem, setActiveItem] = useState<{
    type: 'hazard' | 'safe_haven' | 'hub';
    title: string;
    description: string;
    coords: [number, number];
    hotline?: string;
    capacity?: number;
    amenities?: string[];
    actionPlan?: string[];
  } | null>(null);

  // Focus on Safe Haven or Hazard
  const handleFocusPoint = (coords: [number, number], zoom = 1.6) => {
    const [px, py] = projectCoordinates(coords);
    // Center SVG view on [px, py]
    const targetX = (SVG_WIDTH / 2 - px) * (zoom - 1);
    const targetY = (SVG_HEIGHT / 2 - py) * (zoom - 1);
    setZoomLevel(zoom);
    setPanOffset({ x: targetX, y: targetY });
  };

  const handleReset = () => {
    setZoomLevel(compact ? 1 : 1.15);
    setPanOffset({ x: 0, y: 0 });
    setActiveItem(null);
  };

  // Pre-projected key geographical elements
  const nh44Route = useMemo(() => {
    const rawCoords: [number, number][] = [
      [75.12, 32.55], // Kathua/Samba border
      [75.01, 32.61], // Vijaypur
      [74.92, 32.66], // Bari Brahmana
      [74.88, 32.70], // Jammu Tawi / Bikram Chowk
      [74.90, 32.76], // Nagrota Bypass
      [74.99, 32.84], // Jhajjar Kotli
      [75.07, 32.89], // Tikri
      [75.13, 32.93], // Udhampur Junction (Safe Haven)
      [75.20, 33.05], // Samroli
      [75.23, 33.12], // Chenani Tunnel Southern Portal
      [75.242, 33.155], // Nashri Mountain Sector (LANDSLIDE HAZARD)
      [75.22, 33.18], // Peera
      [75.185, 33.195], // Chanderkote Relief Camp
      [75.16, 33.24], // Ramban Town
      [75.20, 33.32], // Ramsu / Banihal approach
    ];
    return rawCoords.map(projectCoordinates).map(([x, y]) => `${x},${y}`).join(' ');
  }, []);

  const katraYatraRoute = useMemo(() => {
    const rawCoords: [number, number][] = [
      [75.07, 32.89], // Tikri / Domel NH-44 junction
      [74.97, 32.96], // Nomain checkpost
      [74.931, 32.991], // Katra Base Camp (Safe Haven)
      [74.945, 33.003], // Baan Ganga Gate
      [74.953, 33.006], // Charan Paduka
      [74.958, 33.008], // Ardhkuwari Holy Cave
      [74.965, 33.023], // Himkoti Shelter
      [74.961, 33.018], // Sanjichhat Helipad
      [74.9525, 33.0308], // Holy Bhawan Sanctum
      [74.948, 33.036], // Bhairon Ghati
    ];
    return rawCoords.map(projectCoordinates).map(([x, y]) => `${x},${y}`).join(' ');
  }, []);

  const tawiRiver = useMemo(() => {
    const rawCoords: [number, number][] = [
      [75.28, 33.03], // Chenani source
      [75.15, 32.91], // Udhampur east
      [74.96, 32.80], // Nagrota gorge
      [74.88, 32.73], // Jammu City (under Gujjar Nagar & Tawi 4th bridge)
      [74.85, 32.70], // Bhagwati Nagar / Belicharana
      [74.75, 32.65], // Marh plains
      [74.65, 32.60], // Indo-Pak plain corridor
    ];
    return rawCoords.map(projectCoordinates).map(([x, y]) => `${x},${y}`).join(' ');
  }, []);

  // Safe Havens List
  const safeHavens = useMemo(() => {
    return [
      {
        id: 'haven_udhampur',
        name: 'Udhampur Highway Civic Yatri Niwas',
        coords: [75.132, 32.925] as [number, number],
        capacity: 4500,
        hotline: '01992-272728 / 112',
        amenities: ['Community Langar (Hot Meals)', 'Medical Triage Post', 'Rest Sheds', 'Satellite Emergency Phone'],
        description: 'Designated primary mountain relief holding center for NH-44 travelers before Nashri landslide zone.',
        actionPlan: [
          'Halt vehicle at Udhampur Highway entry gate.',
          'Report to SDRF Disaster Assistance Desk for pass & meal tokens.',
          'Do NOT attempt to bypass police barricades towards Nashri until BRO clearance is announced.',
        ],
      },
      {
        id: 'haven_katra_sports',
        name: 'SMVDSB Katra Central Spiritual Sports Complex',
        coords: [74.931, 32.991] as [number, number],
        capacity: 5000,
        hotline: '01991-232075 / 112',
        amenities: ['24x7 Medical Hospital', 'Drinking Water & Milk', 'Power Generator Backup', 'Rest Halls'],
        description: 'Primary disaster safe haven for Katra pilgrimage basin and lower track evacuees.',
        actionPlan: [
          'Descend to Katra base camp via gentle Tarakote track.',
          'Register at Central Shrine Board Control Counter.',
          'Shelter accommodation provided free of charge during weather emergencies.',
        ],
      },
      {
        id: 'haven_chanderkote',
        name: 'Chanderkote Yatri Niwas Relief Holding Camp',
        coords: [75.185, 33.195] as [number, number],
        capacity: 3500,
        hotline: '01998-266655 / 112',
        amenities: ['Heated Holding Halls', 'Emergency Trauma Center', 'BSNL Satellite Phone', 'SDRF Base'],
        description: 'Safe holding haven for traffic stranded on north side of Nashri-Peera tunnel corridor.',
        actionPlan: [
          'Park heavy/passenger vehicles in designated Chanderkote relief bays.',
          'Obtain live road clearance updates from Traffic Control Room Ramban.',
        ],
      },
      {
        id: 'haven_jammu_stadium',
        name: 'Jammu MA Stadium Civic Evacuation Concourse',
        coords: [74.858, 32.721] as [number, number],
        capacity: 10000,
        hotline: '112 / 0191-2544256',
        amenities: ['State Disaster Rapid Logistics', 'Emergency Medical Ambulances', 'Public WiFi/Satellite Link'],
        description: 'Large-scale urban civil defense evacuation and holding center in central Jammu.',
        actionPlan: [
          'Follow arterial signs from Jammu Tawi station or Dogra Chowk.',
          'Direct medical assistance and interstate transport coordination available.',
        ],
      },
    ];
  }, []);

  return (
    <div className={`relative flex flex-col bg-slate-950 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-2xl ${compact ? 'h-[250px]' : 'w-full h-full'}`}>
      {/* Top Overlay Bar */}
      <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between pointer-events-none gap-2">
        <div className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/85 backdrop-blur-md border border-emerald-500/40 text-[10px] sm:text-xs font-bold text-emerald-400 shadow-lg">
          <WifiOff className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>OFFLINE CITY & DISASTER GIS MAP</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        </div>

        {/* Zoom & Action Controls */}
        <div className="pointer-events-auto flex items-center gap-1 bg-black/85 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 3))}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/15 text-white transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 0.8))}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/15 text-white transition-colors"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/15 text-white transition-colors"
            title="Reset Map Bounds"
            aria-label="Reset Map"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          {compact && onOpenFullMap && (
            <button
              onClick={onOpenFullMap}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-colors"
              title="Open Fullscreen Offline Map"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Full Map</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Navigation Filter Bar (Non-compact) */}
      {!compact && (
        <div className="absolute top-12 left-2 z-20 flex items-center gap-1.5 flex-wrap pointer-events-auto">
          {currentHazard && (
            <button
              onClick={() => handleFocusPoint(currentHazard.coordinates, 2.0)}
              className="px-2.5 py-1 rounded-xl bg-danger/90 hover:bg-danger text-white text-[10px] sm:text-xs font-bold border border-red-400 shadow-md flex items-center gap-1 transition-transform active:scale-95"
            >
              <AlertTriangle className="w-3 h-3 text-white animate-bounce" />
              <span>Focus Landslide Hazard</span>
            </button>
          )}
          <button
            onClick={() => handleFocusPoint([75.132, 32.925], 1.8)}
            className="px-2.5 py-1 rounded-xl bg-emerald-700/90 hover:bg-emerald-700 text-white text-[10px] sm:text-xs font-bold border border-emerald-400 shadow-md flex items-center gap-1 transition-transform active:scale-95"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-200" />
            <span>Focus Udhampur Safe Haven</span>
          </button>
          <button
            onClick={() => handleFocusPoint([74.931, 32.991], 1.8)}
            className="px-2.5 py-1 rounded-xl bg-amber-700/90 hover:bg-amber-700 text-white text-[10px] sm:text-xs font-bold border border-amber-400 shadow-md flex items-center gap-1 transition-transform active:scale-95"
          >
            <span>🛕 Focus Katra / Bhawan</span>
          </button>
        </div>
      )}

      {/* SVG Map Canvas */}
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-[#070E16]">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-full transition-transform duration-300 ease-out select-none cursor-grab active:cursor-grabbing"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          {/* SVG Definitions */}
          <defs>
            {/* Grid Pattern for Tactical Precision */}
            <pattern id="tacticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#162536" strokeWidth="0.8" />
            </pattern>

            {/* Pulsing Hazard Glow */}
            <radialGradient id="hazardGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#dc2626" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#b91c1c" stopOpacity="0" />
            </radialGradient>

            {/* Safe Haven Shield Glow */}
            <radialGradient id="safeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#059669" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0" />
            </radialGradient>

            {/* Road Block Striping */}
            <pattern id="roadblockStripe" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="12" stroke="#dc2626" strokeWidth="6" />
              <line x1="6" y1="0" x2="6" y2="12" stroke="#ffffff" strokeWidth="6" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="#0A121E" />
          <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#tacticalGrid)" opacity="0.6" />

          {/* Mountain Topographical Ridge Contours (Pir Panjal & Trikuta) */}
          <g id="mountain-ridges" opacity="0.35">
            {/* Trikuta Mountain Massif */}
            <path
              d="M 460 300 Q 510 220 560 230 Q 600 270 580 320 Q 530 350 460 300 Z"
              fill="#192838"
              stroke="#2E4862"
              strokeWidth="1.5"
            />
            {/* Patnitop / Pir Panjal Ridge */}
            <path
              d="M 640 220 Q 720 120 820 150 Q 860 210 790 280 Q 700 280 640 220 Z"
              fill="#172433"
              stroke="#2E4862"
              strokeWidth="1.5"
            />
          </g>

          {/* Tawi River Course */}
          <polyline
            points={tawiRiver}
            fill="none"
            stroke="#0284C7"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.75"
          />
          {/* Tawi River Label */}
          <text x="475" y="520" fill="#38BDF8" fontSize="11" fontWeight="bold" opacity="0.8">
            River Tawi (तवी नदी)
          </text>

          {/* Primary Arterial Road: NH-44 Mountain Highway */}
          <g id="nh-44-corridor">
            {/* Base Highway Stroke */}
            <polyline
              points={nh44Route}
              fill="none"
              stroke="#334155"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={nh44Route}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Center Dashed Marker */}
            <polyline
              points={nh44Route}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              strokeLinecap="round"
            />
          </g>

          {/* Katra & Vaishno Devi Pilgrimage Corridor */}
          <g id="katra-track-corridor">
            <polyline
              points={katraYatraRoute}
              fill="none"
              stroke="#064E3B"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={katraYatraRoute}
              fill="none"
              stroke="#10B981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Secondary Arteries (Jammu-Akhnoor, Jammu-Katra link) */}
          <path
            d="M 485 486 L 386 351" // Jammu to Akhnoor
            stroke="#64748B"
            strokeWidth="3"
            strokeDasharray="4 4"
            fill="none"
          />
          <path
            d="M 485 486 L 522 286" // Jammu to Katra Direct Axis
            stroke="#64748B"
            strokeWidth="3.5"
            strokeDasharray="3 3"
            fill="none"
          />

          {/* Highway Shield Labels */}
          <g id="highway-labels">
            <rect x="585" y="380" width="55" height="20" rx="4" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
            <text x="612" y="394" fill="#F59E0B" fontSize="10" fontWeight="bold" textAnchor="middle">
              NH-44
            </text>

            <rect x="520" y="270" width="70" height="18" rx="4" fill="#064E3B" stroke="#10B981" strokeWidth="1" />
            <text x="555" y="283" fill="#D1FAE5" fontSize="9" fontWeight="bold" textAnchor="middle">
              YATRA TRACK
            </text>
          </g>

          {/* ======================================================== */}
          {/* DISASTER INCIDENT / HAZARD VISUALIZATION (LANDSLIDE)     */}
          {/* ======================================================== */}
          {currentHazard && (() => {
            const [hx, hy] = projectCoordinates(currentHazard.coordinates);
            return (
              <g
                id="hazard-zone"
                className="cursor-pointer"
                onClick={() => {
                  setActiveItem({
                    type: 'hazard',
                    title: currentHazard.title,
                    description: currentHazard.description,
                    coords: currentHazard.coordinates,
                    hotline: currentHazard.emergencyHotline,
                    actionPlan: [
                      'DO NOT APPROACH: Traffic Police barricades at Peera & Nashri portal.',
                      'Divert vehicles immediately to Udhampur Yatri Niwas (South) or Chanderkote Shelter (North).',
                      'Wait for BRO heavy machinery clearance notice on official 112 radio broadcast.',
                    ],
                  });
                }}
              >
                {/* Radiation Pulse Wave */}
                <circle cx={hx} cy={hy} r="45" fill="url(#hazardGlow)">
                  <animate attributeName="r" values="25;55;25" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.4s" repeatCount="indefinite" />
                </circle>

                {/* Road Closed Barrier Line over Highway */}
                <rect
                  x={hx - 22}
                  y={hy - 7}
                  width="44"
                  height="14"
                  rx="3"
                  fill="url(#roadblockStripe)"
                  stroke="#991B1B"
                  strokeWidth="1.5"
                />

                {/* Central Hazard Pin */}
                <circle cx={hx} cy={hy} r="14" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2.5" />
                <text x={hx} y={hy + 5} fontSize="14" textAnchor="middle" fill="#FFFFFF">
                  ⚠️
                </text>

                {/* Banner Label */}
                <rect
                  x={hx - 80}
                  y={hy - 34}
                  width="160"
                  height="22"
                  rx="5"
                  fill="#991B1B"
                  stroke="#FECACA"
                  strokeWidth="1.5"
                />
                <text x={hx} y={hy - 19} fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                  ⛔ ACTIVE LANDSLIDE BLOCKED
                </text>

                {/* Evacuation Diversion Vector Arrow (Leading South to Udhampur Safe Haven) */}
                <g id="diversion-corridor">
                  {/* Green dashed arrow line from hazard to Udhampur haven */}
                  <path
                    d={`M ${hx - 15} ${hy + 15} Q 710 260 665 330`}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                  >
                    <animate attributeName="stroke-dashoffset" values="20;0" dur="1s" repeatCount="indefinite" />
                  </path>
                  {/* Arrowhead */}
                  <polygon points="665,330 675,322 670,335" fill="#10B981" />
                  <rect x="680" y="275" width="95" height="18" rx="4" fill="#065F46" stroke="#34D399" strokeWidth="1" />
                  <text x="727" y="287" fill="#A7F3D0" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                    SAFE DIVERT AXIS ➔
                  </text>
                </g>
              </g>
            );
          })()}

          {/* ======================================================== */}
          {/* VERIFIED SAFE EVACUATION HAVENS (HOLDING SPOTS)         */}
          {/* ======================================================== */}
          {safeHavens.map((haven) => {
            const [sx, sy] = projectCoordinates(haven.coords);
            const isUdhampur = haven.id === 'haven_udhampur';
            const isKatra = haven.id === 'haven_katra_sports';

            return (
              <g
                key={haven.id}
                id={haven.id}
                className="cursor-pointer group"
                onClick={() => {
                  setActiveItem({
                    type: 'safe_haven',
                    title: haven.name,
                    description: haven.description,
                    coords: haven.coords,
                    hotline: haven.hotline,
                    capacity: haven.capacity,
                    amenities: haven.amenities,
                    actionPlan: haven.actionPlan,
                  });
                }}
              >
                {/* Glow ring */}
                <circle cx={sx} cy={sy} r="28" fill="url(#safeGlow)">
                  <animate attributeName="r" values="20;35;20" dur="3s" repeatCount="indefinite" />
                </circle>

                {/* Shield Pin */}
                <circle cx={sx} cy={sy} r="13" fill="#059669" stroke="#FFFFFF" strokeWidth="2.5" />
                <text x={sx} y={sy + 4.5} fontSize="12" textAnchor="middle" fill="#FFFFFF">
                  🛡️
                </text>

                {/* Haven Name & Capacity Badge */}
                <rect
                  x={sx - 75}
                  y={sy + 17}
                  width="150"
                  height="26"
                  rx="6"
                  fill="#064E3B"
                  stroke="#34D399"
                  strokeWidth="1.5"
                />
                <text x={sx} y={sy + 29} fill="#ECFDF5" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {haven.name.split(' ')[0]} {haven.name.split(' ')[1]} SAFE HAVEN
                </text>
                <text x={sx} y={sy + 40} fill="#6EE7B7" fontSize="8" fontWeight="bold" textAnchor="middle">
                  Capacity: {haven.capacity.toLocaleString()} Yatris • Meals & SOS
                </text>
              </g>
            );
          })}

          {/* ======================================================== */}
          {/* STRATEGIC PILGRIMAGE & URBAN HUBS                        */}
          {/* ======================================================== */}
          {/* 1. Jammu Tawi Railway Station */}
          {(() => {
            const [jx, jy] = projectCoordinates([74.8789, 32.7058]);
            return (
              <g
                className="cursor-pointer"
                onClick={() => {
                  setActiveItem({
                    type: 'hub',
                    title: 'Jammu Tawi Railway Station Terminus',
                    description: 'Major transit hub. Connecting Vande Bharat, mail expresses, and direct taxis.',
                    coords: [74.8789, 32.7058],
                    hotline: '139 / 112',
                  });
                }}
              >
                <rect x={jx - 10} y={jy - 10} width="20" height="20" rx="5" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
                <text x={jx} y={jy + 4} fontSize="11" textAnchor="middle">🚆</text>
                <text x={jx} y={jy + 22} fill="#CBD5E1" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Jammu Tawi
                </text>
              </g>
            );
          })()}

          {/* 2. Katra Base Town & Station */}
          {(() => {
            const [kx, ky] = projectCoordinates([74.931, 32.991]);
            return (
              <g
                className="cursor-pointer"
                onClick={() => {
                  setActiveItem({
                    type: 'hub',
                    title: 'Shri Mata Vaishno Devi Katra Base Town',
                    description: 'Yatra registration hub, RFID counter, and central helipad dispatch.',
                    coords: [74.931, 32.991],
                    hotline: '01991-232075',
                  });
                }}
              >
                <rect x={kx - 10} y={ky - 10} width="20" height="20" rx="5" fill="#047857" stroke="#34D399" strokeWidth="2" />
                <text x={kx} y={ky + 4} fontSize="11" textAnchor="middle">🛕</text>
                <text x={kx} y={ky - 14} fill="#6EE7B7" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  Katra Base Town
                </text>
              </g>
            );
          })()}

          {/* 3. Holy Bhawan (Sanctuary) */}
          {(() => {
            const [bx, by] = projectCoordinates([74.9525, 33.0308]);
            return (
              <g
                className="cursor-pointer"
                onClick={() => {
                  setActiveItem({
                    type: 'hub',
                    title: 'Shri Mata Vaishno Devi Holy Bhawan',
                    description: 'Sanctuary Holy Cave. Gated queue regulation active during festival surges.',
                    coords: [74.9525, 33.0308],
                    hotline: '01991-232075 / 112',
                  });
                }}
              >
                <circle cx={bx} cy={by} r="10" fill="#D97706" stroke="#FEF3C7" strokeWidth="2" />
                <text x={bx} y={by + 4} fontSize="11" textAnchor="middle">✨</text>
                <text x={bx} y={by - 14} fill="#FDE68A" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  Holy Bhawan (गुफा)
                </text>
              </g>
            );
          })()}

          {/* Compass Rose */}
          <g transform="translate(45, 630)" opacity="0.8">
            <circle cx="0" cy="0" r="22" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
            <polygon points="0,-18 5,-4 0,0 -5,-4" fill="#EF4444" />
            <polygon points="0,18 5,4 0,0 -5,4" fill="#94A3B8" />
            <text x="0" y="-22" fill="#EF4444" fontSize="9" fontWeight="bold" textAnchor="middle">N</text>
            <text x="0" y="29" fill="#94A3B8" fontSize="8" textAnchor="middle">S</text>
            <text x="25" y="3" fill="#94A3B8" fontSize="8">E</text>
            <text x="-29" y="3" fill="#94A3B8" fontSize="8">W</text>
          </g>

          {/* Scale Legend */}
          <g transform="translate(100, 645)" opacity="0.8">
            <line x1="0" y1="0" x2="60" y2="0" stroke="#FFFFFF" strokeWidth="2.5" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="60" y1="-4" x2="60" y2="4" stroke="#FFFFFF" strokeWidth="2" />
            <text x="30" y="14" fill="#E2E8F0" fontSize="9" fontWeight="bold" textAnchor="middle">
              15 Kilometers
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Detail Bottom Drawer (when clicking a Haven or Hazard) */}
      {activeItem && (
        <div className="absolute bottom-2 left-2 right-2 z-30 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3 sm:p-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-3 max-h-[48%] overflow-y-auto space-y-2.5 text-xs">
          <div className="flex items-start justify-between gap-2 border-b border-slate-700/60 pb-2">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${activeItem.type === 'hazard' ? 'bg-danger text-white' : 'bg-emerald-600 text-white'}`}>
                {activeItem.type === 'hazard' ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm leading-tight">{activeItem.title}</h4>
                <span className="text-[10px] text-slate-400 capitalize">
                  {activeItem.type === 'hazard' ? '⚠️ High-Risk Disaster Zone' : '🛡️ Verified Safe Holding Haven'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveItem(null)}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close details"
            >
              ✕
            </button>
          </div>

          <p className="text-slate-300 text-[11px] leading-relaxed">
            {activeItem.description}
          </p>

          {/* Amenities & Safe Capacity */}
          {activeItem.amenities && (
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Verified Available Amenities ({activeItem.capacity?.toLocaleString()} Person Capacity):
              </div>
              <div className="flex flex-wrap gap-1">
                {activeItem.amenities.map((item, idx) => (
                  <span key={idx} className="bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-[10px] px-2 py-0.5 rounded-md">
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Directives */}
          {activeItem.actionPlan && (
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide block">
                Offline Action Directives:
              </span>
              <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-slate-200">
                {activeItem.actionPlan.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Call & Navigation Action */}
          <div className="flex items-center gap-2 pt-1">
            {activeItem.hotline && (
              <a
                href={`tel:${activeItem.hotline.split('/')[0].trim()}`}
                className="flex-1 py-2 px-3 bg-danger hover:bg-red-700 text-white font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call Hotline ({activeItem.hotline.split('/')[0].trim()})</span>
              </a>
            )}
            <button
              onClick={() => handleFocusPoint(activeItem.coords, 2.2)}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl flex items-center gap-1 transition-colors border border-slate-600"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              <span>Center View</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
