import React, { useState, useMemo, useEffect } from 'react';
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
  HeartPulse,
  Flame,
  Radio,
  Siren,
} from 'lucide-react';
import { useCommandControlStore, DisasterHazardAlert } from '@/stores/commandControlStore';

interface OfflineCityDisasterMapProps {
  compact?: boolean;
  onOpenFullMap?: () => void;
  selectedAlert?: DisasterHazardAlert | null;
  focusTarget?: [number, number] | null;
  activeFilterOverride?: 'all' | 'hospitals' | 'safe_havens' | 'police' | 'hazards';
}

// Bounding box for Jammu Division GIS Projection
const LNG_MIN = 74.20;
const LNG_MAX = 75.60;
const LAT_MIN = 32.40;
const LAT_MAX = 33.40;
const SVG_WIDTH = 1000;
const SVG_HEIGHT = 700;

export function projectCoordinates([lng, lat]: [number, number]): [number, number] {
  // Guard against undefined or NaN coordinates and clamp within bounding box
  const safeLng = typeof lng === 'number' && !isNaN(lng) ? lng : (LNG_MIN + LNG_MAX) / 2;
  const safeLat = typeof lat === 'number' && !isNaN(lat) ? lat : (LAT_MIN + LAT_MAX) / 2;

  const clampedLng = Math.min(Math.max(safeLng, LNG_MIN), LNG_MAX);
  const clampedLat = Math.min(Math.max(safeLat, LAT_MIN), LAT_MAX);

  const x = ((clampedLng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * SVG_WIDTH;
  const y = ((LAT_MAX - clampedLat) / (LAT_MAX - LAT_MIN)) * SVG_HEIGHT;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

export type SafetyLocationKind = 'hospital' | 'safe_haven' | 'police' | 'hazard' | 'transit_anchor';

export interface EmergencySafetyPoint {
  id: string;
  name: string;
  kind: SafetyLocationKind;
  coordinates: [number, number];
  hotline: string;
  capacity?: number;
  facilities: string[];
  description: string;
  actionDirectives: string[];
  badgeText?: string;
}

// COMPLETE DIRECTORY OF HOSPITALS, SAFE HAVENS, POLICE STATIONS & DISASTER SITES
export const OFFLINE_EMERGENCY_RESOURCES: EmergencySafetyPoint[] = [
  // ==========================================
  // 1. HOSPITALS & EMERGENCY MEDICAL CENTERS
  // ==========================================
  {
    id: 'hosp_gmch_jammu',
    name: 'Govt Medical College & Hospital (GMCH) Jammu',
    kind: 'hospital',
    coordinates: [74.8510, 32.7395],
    hotline: '0191-2584290',
    facilities: ['24/7 Emergency Casualty', 'Level-1 Trauma Center', 'Blood Bank', 'Advanced ICU', 'Oxygen Plant', 'Ambulance Fleet'],
    description: 'Premier tertiary hospital in Jammu Division with round-the-clock emergency surgical and resuscitation suites.',
    actionDirectives: [
      'For severe injury or cardiac emergencies, head to Emergency Block via Bakshi Nagar gate.',
      'Dial 108 for free dedicated state ambulance dispatch.',
    ],
    badgeText: 'Level-1 Trauma Hub',
  },
  {
    id: 'hosp_smvdsb_kakryal',
    name: 'SMVDSB Superspeciality Hospital, Kakryal (Katra)',
    kind: 'hospital',
    coordinates: [74.9350, 32.9650],
    hotline: '01991-285634',
    facilities: ['Cardiac ICU', 'Helipad Evacuation', '24/7 Trauma Surgery', 'CT/MRI Scan', 'Disaster Triage Bay'],
    description: 'World-class superspeciality hospital established by the Shrine Board for yatra pilgrims and regional emergencies.',
    actionDirectives: [
      'Helipad equipped for immediate air-evacuation of critically injured pilgrims from Bhawan or Sanjichhat.',
      'Emergency casualty open 24 hours with dedicated trauma team.',
    ],
    badgeText: 'Shrine Superspeciality',
  },
  {
    id: 'hosp_chc_katra',
    name: 'Community Health Centre (CHC) Katra',
    kind: 'hospital',
    coordinates: [74.9320, 32.9920],
    hotline: '01991-232044',
    facilities: ['24/7 Pilgrim Emergency', 'Dehydration & Oxygen Therapy', 'Minor Surgical Bay', 'First Aid Center'],
    description: 'Central Katra emergency hospital located at base town, providing urgent medical care for arriving pilgrims.',
    actionDirectives: [
      'Located near Katra Main Chowk; provides immediate altitude sickness and exhaustion treatment.',
    ],
    badgeText: 'Katra Base Hospital',
  },
  {
    id: 'hosp_dh_udhampur',
    name: 'District Hospital Udhampur (NH-44 Highway Trauma)',
    kind: 'hospital',
    coordinates: [75.1380, 32.9280],
    hotline: '01992-270222',
    facilities: ['Highway Accident Trauma Unit', 'Blood Storage Bay', 'Emergency Surgery', '24/7 Casualty'],
    description: 'Critical NH-44 highway emergency receiving hospital for mountain travelers and accident response.',
    actionDirectives: [
      'Primary medical stop for travelers diverted from NH-44 landslides.',
    ],
    badgeText: 'Highway Trauma Center',
  },
  {
    id: 'hosp_dh_ramban',
    name: 'District Hospital Ramban & Chanderkote Emergency Unit',
    kind: 'hospital',
    coordinates: [75.1850, 33.1950],
    hotline: '01998-266655',
    facilities: ['Mountain Triage Post', 'Oxygen Concentrators', 'SDRF Medical Link', 'Heated Emergency Bays'],
    description: 'Northern mountain emergency hospital catering to travelers halted near the Nashri-Peera tunnel corridor.',
    actionDirectives: [
      'Emergency medical triage for stranded vehicles on the north side of the landslide zone.',
    ],
    badgeText: 'Mountain Emergency Unit',
  },
  {
    id: 'hosp_sanjichhat_post',
    name: 'Sanjichhat Emergency Medical Outpost & Helipad',
    kind: 'hospital',
    coordinates: [74.9610, 33.0180],
    hotline: '01991-232075',
    facilities: ['High-Altitude Oxygen Parlour', 'Cardiac Defibrillators', 'Air Ambulance Helipad', 'Doctor on 24x7 Duty'],
    description: 'High-altitude medical station (6,200 ft) on Vaishno Devi track specialized in altitude sickness and cardiac care.',
    actionDirectives: [
      'Direct airlift available to Kakryal Superspeciality for critical mountain medical emergencies.',
    ],
    badgeText: 'High-Altitude Helipad',
  },
  {
    id: 'hosp_bhawan_dispensary',
    name: 'Shri Mata Vaishno Devi Bhawan Emergency Dispensary',
    kind: 'hospital',
    coordinates: [74.9525, 33.0308],
    hotline: '01991-232075',
    facilities: ['Emergency ICU Beds', 'Continuous Oxygen Cylinders', 'Cardiac Care Support', 'Free Medicines'],
    description: 'Direct medical clinic at the Holy Cave Sanctum providing round-the-clock emergency assistance.',
    actionDirectives: [
      'Located at Gate 3 adjacent to Mano Kamna Bhawan for immediate pilgrim emergency response.',
    ],
    badgeText: 'Holy Cave Emergency',
  },

  // ==========================================
  // 2. SAFE HOLDING HAVENS & EVACUATION CENTERS
  // ==========================================
  {
    id: 'haven_udhampur',
    name: 'Udhampur Highway Civic Yatri Niwas Relief Haven',
    kind: 'safe_haven',
    coordinates: [75.1320, 32.9250],
    capacity: 4500,
    hotline: '01992-272728',
    facilities: ['Free Community Langar (Hot Meals)', 'Heated Dormitories', 'Medical Triage Post', 'BSNL Satellite Phone', 'Heavy Vehicle Parking'],
    description: 'Designated primary mountain relief holding center for NH-44 travelers before Nashri landslide zone.',
    actionDirectives: [
      'Halt vehicle at Udhampur Highway entry gate.',
      'Obtain free meal tokens and resting bay registration from SDRF desk.',
      'Do not attempt highway transit until official all-clear is broadcast.',
    ],
    badgeText: 'Capacity: 4,500 Yatris',
  },
  {
    id: 'haven_katra_sports',
    name: 'SMVDSB Katra Central Spiritual Sports Complex',
    kind: 'safe_haven',
    coordinates: [74.9310, 32.9910],
    capacity: 5000,
    hotline: '01991-232075',
    facilities: ['24x7 Medical Station', 'Drinking Water & Milk', 'Power Generator Backup', 'Emergency Sleeping Mats', 'Public Address System'],
    description: 'Primary disaster safe haven for Katra pilgrimage basin and lower track evacuees during weather emergencies.',
    actionDirectives: [
      'Descend via gentle Tarakote track to Katra sports complex shelter.',
      'Shelter and meals provided free of charge by Shrine Board.',
    ],
    badgeText: 'Capacity: 5,000 Yatris',
  },
  {
    id: 'haven_chanderkote',
    name: 'Chanderkote Yatri Niwas Relief Holding Camp',
    kind: 'safe_haven',
    coordinates: [75.1850, 33.1950],
    capacity: 3500,
    hotline: '01998-266655',
    facilities: ['Heated Holding Halls', 'Emergency Trauma Center', 'BSNL Satellite Phone', 'SDRF Mountain Unit', 'Sanitation Facilities'],
    description: 'Safe holding haven for traffic stranded on north side of Nashri-Peera tunnel mountain corridor.',
    actionDirectives: [
      'Park in designated relief bays; register with Ramban Civil Administration.',
    ],
    badgeText: 'Capacity: 3,500 Yatris',
  },
  {
    id: 'haven_jammu_stadium',
    name: 'Jammu MA Stadium Civic Evacuation Concourse',
    kind: 'safe_haven',
    coordinates: [74.8580, 32.7210],
    capacity: 10000,
    hotline: '112 / 0191-2544256',
    facilities: ['State Disaster Rapid Logistics', 'Emergency Medical Ambulances', 'Public WiFi/Satellite Link', 'Food Distribution Bays'],
    description: 'Large-scale urban civil defense evacuation and holding center in central Jammu.',
    actionDirectives: [
      'Follow arterial signs from Jammu Tawi station or Dogra Chowk for direct sheltering and transport coordination.',
    ],
    badgeText: 'Capacity: 10,000 Yatris',
  },
  {
    id: 'haven_mano_kamna',
    name: 'Mano Kamna Bhawan Safe Hall & Helipad Terrace',
    kind: 'safe_haven',
    coordinates: [74.9550, 33.0290],
    capacity: 2000,
    hotline: '01991-232075',
    facilities: ['Reinforced Rockfall Netting', 'Emergency Langar', 'Oxygen Support', 'Thermal Blankets'],
    description: 'Reinforced shelter hall at Holy Bhawan sanctuary for pilgrim protection during extreme weather or mountain rockfalls.',
    actionDirectives: [
      'Follow Gate 3 ramp towards Mano Kamna Bhawan. Emergency shelter and warm water operational.',
    ],
    badgeText: 'Capacity: 2,000 Yatris',
  },

  // ==========================================
  // 3. POLICE STATIONS, PCR & SDRF POSTS
  // ==========================================
  {
    id: 'pol_pcr_jammu',
    name: 'Police Control Room (PCR) Jammu HQ',
    kind: 'police',
    coordinates: [74.8620, 32.7280],
    hotline: '112 / 0191-2542000',
    facilities: ['National ERSS 112 Command', '24/7 Wireless Dispatch', 'Ambulance / Fire Coordinator Desk'],
    description: 'Apex police emergency and distress coordination center for Jammu Division.',
    actionDirectives: [
      'Dial 112 for immediate police, medical, or fire response across Jammu Division.',
    ],
    badgeText: 'ERSS 112 Command',
  },
  {
    id: 'pol_katra_hq',
    name: 'Katra Yatra Police Headquarters',
    kind: 'police',
    coordinates: [74.9340, 32.9880],
    hotline: '01991-232010',
    facilities: ['Pilgrim Missing Persons Cell', 'Yatra Security HQ', 'SDRF Track Patrol Base'],
    description: 'Central police station coordinating safety and security across all Vaishno Devi pilgrimage tracks.',
    actionDirectives: [
      'Report track incidents, lost family members, or crowd emergencies directly at Katra Police Station.',
    ],
    badgeText: 'Yatra Police HQ',
  },
  {
    id: 'pol_sdrf_peera',
    name: 'SDRF 2nd Bn Mountain Rescue Post (Peera/Nashri)',
    kind: 'police',
    coordinates: [75.2200, 33.1750],
    hotline: '0191-2452222',
    facilities: ['Heavy Hydraulic Cutters', 'Search & Rescue Canines', 'Mountain Rappelling Gear', 'Satellite Transceivers'],
    description: 'State Disaster Response Force specialized mountain rescue unit stationed along the hazardous landslide sector.',
    actionDirectives: [
      'Specialized rescue teams deployable within 5 minutes of rockfall or vehicle distress calls.',
    ],
    badgeText: 'SDRF Mountain Rescue',
  },
  {
    id: 'pol_traffic_ramban',
    name: 'NH-44 Traffic Police Control Room (Ramban)',
    kind: 'police',
    coordinates: [75.1650, 33.2420],
    hotline: '01998-266686',
    facilities: ['Live Highway Status Broadcast', 'BRO Heavy Crane Dispatch', 'Roadblock Enforcers'],
    description: 'Highway traffic police operational headquarters regulating vehicle convoys across the Chenani-Nashri-Banihal axis.',
    actionDirectives: [
      'Listen to live highway advisory radio on 112 before approaching mountain tunnels.',
    ],
    badgeText: 'Traffic Police HQ',
  },

  // ==========================================
  // 4. TRANSIT EVACUATION ANCHORS
  // ==========================================
  {
    id: 'transit_jammu_tawi',
    name: 'Jammu Tawi Railway Station Evacuation Concourse',
    kind: 'transit_anchor',
    coordinates: [74.8789, 32.7058],
    hotline: '139 / 112',
    facilities: ['Emergency Special Trains', 'Railway Medical Center', 'Waiting Halls', 'Interstate Taxi Stand'],
    description: 'Major railway transit terminus for mass evacuation and onward passenger relocation.',
    actionDirectives: [
      'Report to Platform 1 station master office for emergency yatra trains and status updates.',
    ],
    badgeText: 'Transit Terminus',
  },
  {
    id: 'transit_katra_station',
    name: 'Shri Mata Vaishno Devi Katra Station Concourse',
    kind: 'transit_anchor',
    coordinates: [74.9310, 32.9910],
    hotline: '139 / 01991-232075',
    facilities: ['Vande Bharat Express Terminal', 'Yatra Registration Slip Gate', 'Luggage Cloakroom', 'Sheltered Concourse'],
    description: 'Katra railway station concourse providing direct rail connection south to Jammu, Punjab, and Delhi.',
    actionDirectives: [
      'In case of track closure, rest in station waiting halls until onward trains depart.',
    ],
    badgeText: 'Katra Rail Anchor',
  },
];

export const OfflineCityDisasterMap: React.FC<OfflineCityDisasterMapProps> = ({
  compact = false,
  onOpenFullMap,
  selectedAlert,
  focusTarget,
  activeFilterOverride = 'all',
}) => {
  const { activeAlerts, triggerEmergencyModal } = useCommandControlStore();

  const currentHazard = selectedAlert || activeAlerts[0] || null;

  const [activeFilter, setActiveFilter] = useState<'all' | 'hospitals' | 'safe_havens' | 'police' | 'hazards'>(
    activeFilterOverride
  );

  // Sync prop override if supplied
  useEffect(() => {
    if (activeFilterOverride) setActiveFilter(activeFilterOverride);
  }, [activeFilterOverride]);

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(compact ? 1 : 1.15);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeItem, setActiveItem] = useState<EmergencySafetyPoint | null>(null);

  // Focus on coordinate point
  const handleFocusPoint = (coords: [number, number], zoom = 1.8) => {
    const [px, py] = projectCoordinates(coords);
    const targetX = (SVG_WIDTH / 2 - px) * (zoom - 1);
    const targetY = (SVG_HEIGHT / 2 - py) * (zoom - 1);
    setZoomLevel(zoom);
    setPanOffset({ x: targetX, y: targetY });
  };

  // Auto-focus target coordinate if provided via props/navigation
  useEffect(() => {
    if (focusTarget && Array.isArray(focusTarget) && focusTarget.length === 2) {
      handleFocusPoint(focusTarget, 1.85);
    }
  }, [focusTarget]);

  const handleReset = () => {
    setZoomLevel(compact ? 1 : 1.15);
    setPanOffset({ x: 0, y: 0 });
    setActiveItem(null);
  };

  // Filtered Safety Points: STRICTLY HOSPITALS & SAFETY LOCATIONS
  const filteredSafetyPoints = useMemo(() => {
    return OFFLINE_EMERGENCY_RESOURCES.filter((pt) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'hospitals') return pt.kind === 'hospital';
      if (activeFilter === 'safe_havens') return pt.kind === 'safe_haven';
      if (activeFilter === 'police') return pt.kind === 'police';
      if (activeFilter === 'hazards') return false; // Handled separately
      return true;
    });
  }, [activeFilter]);

  // Highway & Topo Paths
  const nh44Route = useMemo(() => {
    const rawCoords: [number, number][] = [
      [75.12, 32.55], // Samba
      [75.01, 32.61], // Vijaypur
      [74.92, 32.66], // Bari Brahmana
      [74.88, 32.70], // Jammu Tawi
      [74.90, 32.76], // Nagrota Bypass
      [74.99, 32.84], // Jhajjar Kotli
      [75.07, 32.89], // Tikri
      [75.138, 32.928], // Udhampur (District Hospital & Safe Haven)
      [75.20, 33.05], // Samroli
      [75.23, 33.12], // Chenani Tunnel South
      [75.242, 33.155], // Nashri Sector (LANDSLIDE HAZARD)
      [75.22, 33.175], // Peera (SDRF Post)
      [75.185, 33.195], // Chanderkote Relief Camp & Hospital
      [75.165, 33.242], // Ramban Traffic HQ
      [75.20, 33.32], // Banihal approach
    ];
    return rawCoords.map(projectCoordinates).map(([x, y]) => `${x},${y}`).join(' ');
  }, []);

  const katraYatraRoute = useMemo(() => {
    const rawCoords: [number, number][] = [
      [75.07, 32.89], // Tikri NH-44 junction
      [74.97, 32.96], // Nomain checkpost
      [74.935, 32.965], // Kakryal Superspeciality Hospital
      [74.931, 32.991], // Katra Base Camp (Sports Complex Haven & CHC Hospital)
      [74.945, 33.003], // Baan Ganga
      [74.958, 33.008], // Ardhkuwari
      [74.961, 33.018], // Sanjichhat High-Altitude Hospital & Helipad
      [74.9525, 33.0308], // Bhawan Emergency Dispensary
      [74.955, 33.029], // Mano Kamna Bhawan Safe Hall
    ];
    return rawCoords.map(projectCoordinates).map(([x, y]) => `${x},${y}`).join(' ');
  }, []);

  const tawiRiver = useMemo(() => {
    const rawCoords: [number, number][] = [
      [75.28, 33.03],
      [75.15, 32.91],
      [74.96, 32.80],
      [74.88, 32.73],
      [74.85, 32.70],
      [74.75, 32.65],
    ];
    return rawCoords.map(projectCoordinates).map(([x, y]) => `${x},${y}`).join(' ');
  }, []);

  return (
    <div className={`relative flex flex-col bg-slate-950 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-2xl ${compact ? 'h-[250px]' : 'w-full h-full'}`}>
      {/* Top Header Bar */}
      <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between pointer-events-none gap-2">
        <div className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/90 backdrop-blur-md border border-red-500/40 text-[10px] sm:text-xs font-bold text-red-400 shadow-lg">
          <WifiOff className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>OFFLINE EMERGENCY & HOSPITALS MAP</span>
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse ml-0.5" />
        </div>

        {/* Zoom & Action Controls */}
        <div className="pointer-events-auto flex items-center gap-1 bg-black/90 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.35, 3.2))}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/15 text-white transition-colors"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.35, 0.75))}
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
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] transition-colors"
              title="Open Fullscreen Offline Map"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Full Screen</span>
            </button>
          )}
        </div>
      </div>

      {/* Safety Categories Filter Bar (Non-compact) */}
      {!compact && (
        <div className="absolute top-12 left-2 right-2 z-20 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pointer-events-auto">
          {[
            { id: 'all' as const, label: `🚨 All Safety (${OFFLINE_EMERGENCY_RESOURCES.length})` },
            { id: 'hospitals' as const, label: '🏥 Hospitals & Trauma (7)' },
            { id: 'safe_havens' as const, label: '🛡️ Safe Havens (5)' },
            { id: 'police' as const, label: '👮 Police & SDRF (4)' },
            { id: 'hazards' as const, label: '⚠️ Active Hazard (1)' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold whitespace-nowrap shadow-md border transition-all shrink-0 ${
                activeFilter === chip.id
                  ? 'bg-red-600 text-white border-red-400 ring-2 ring-red-400/30'
                  : 'bg-black/85 backdrop-blur-md text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      )}

      {/* SVG Tactical Emergency Canvas */}
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-[#060B12]">
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full h-full transition-transform duration-300 ease-out select-none cursor-grab active:cursor-grabbing"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
        >
          {/* Definitions */}
          <defs>
            <pattern id="emergencyGrid" width="35" height="35" patternUnits="userSpaceOnUse">
              <path d="M 35 0 L 0 0 0 35" fill="none" stroke="#101D2C" strokeWidth="0.8" />
            </pattern>

            <radialGradient id="hospitalRedGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
              <stop offset="65%" stopColor="#dc2626" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#991b1b" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="havenGreenGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
              <stop offset="65%" stopColor="#059669" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="policeBlueGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.85" />
              <stop offset="65%" stopColor="#2563eb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
            </radialGradient>

            <pattern id="roadblockHazardPattern" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#dc2626" strokeWidth="5" />
              <line x1="5" y1="0" x2="5" y2="10" stroke="#ffffff" strokeWidth="5" />
            </pattern>
          </defs>

          {/* Grid background */}
          <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="#060C14" />
          <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#emergencyGrid)" opacity="0.7" />

          {/* Topographical Mountain Contours (Subtle Background Context) */}
          <g id="mountain-ridges" opacity="0.3">
            <path
              d="M 460 300 Q 510 220 560 230 Q 600 270 580 320 Q 530 350 460 300 Z"
              fill="#132130"
              stroke="#233B54"
              strokeWidth="1.5"
            />
            <path
              d="M 640 220 Q 720 120 820 150 Q 860 210 790 280 Q 700 280 640 220 Z"
              fill="#111D2A"
              stroke="#233B54"
              strokeWidth="1.5"
            />
          </g>

          {/* Tawi River Course */}
          <polyline
            points={tawiRiver}
            fill="none"
            stroke="#0369A1"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          />

          {/* Primary Highway: NH-44 Evacuation Arterial */}
          <g id="nh-44-corridor">
            <polyline
              points={nh44Route}
              fill="none"
              stroke="#1E293B"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={nh44Route}
              fill="none"
              stroke="#D97706"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={nh44Route}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.2"
              strokeDasharray="5 7"
              strokeLinecap="round"
            />
          </g>

          {/* Katra & Vaishno Devi Pilgrimage Corridor */}
          <g id="katra-track-corridor">
            <polyline
              points={katraYatraRoute}
              fill="none"
              stroke="#064E3B"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={katraYatraRoute}
              fill="none"
              stroke="#059669"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Highway Shield Labels */}
          <g id="highway-labels">
            <rect x="585" y="380" width="55" height="18" rx="4" fill="#0F172A" stroke="#D97706" strokeWidth="1.5" />
            <text x="612" y="393" fill="#FBBF24" fontSize="9.5" fontWeight="bold" textAnchor="middle">
              NH-44
            </text>

            <rect x="525" y="270" width="70" height="18" rx="4" fill="#064E3B" stroke="#34D399" strokeWidth="1" />
            <text x="560" y="283" fill="#D1FAE5" fontSize="8.5" fontWeight="bold" textAnchor="middle">
              YATRA TRACK
            </text>
          </g>

          {/* ======================================================== */}
          {/* ACTIVE HAZARD ROADBLOCK & DIVERSION VECTOR               */}
          {/* ======================================================== */}
          {(activeFilter === 'all' || activeFilter === 'hazards') && currentHazard && (() => {
            const [hx, hy] = projectCoordinates(currentHazard.coordinates);
            return (
              <g
                id="hazard-zone"
                className="cursor-pointer"
                onClick={() => {
                  setActiveItem({
                    id: currentHazard.id,
                    name: currentHazard.title,
                    kind: 'hazard',
                    coordinates: currentHazard.coordinates,
                    hotline: currentHazard.emergencyHotline,
                    facilities: ['Active Landslide Zone', 'Continuous Shooting Stones', 'Road Traffic Blocked'],
                    description: currentHazard.description,
                    actionDirectives: [
                      'DO NOT PROCEED TOWARD NASHRI TUNNEL: Debris blocking road in both directions.',
                      'Divert vehicles immediately to Udhampur Yatri Niwas (South) or Chanderkote Shelter (North).',
                      'Wait for BRO heavy machinery clearance broadcast on 112.',
                    ],
                    badgeText: '⛔ ROAD CLOSED',
                  });
                }}
              >
                {/* Radiation Pulse Wave */}
                <circle cx={hx} cy={hy} r="45" fill="url(#hospitalRedGlow)">
                  <animate attributeName="r" values="24;56;24" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.85;0.2;0.85" dur="2.4s" repeatCount="indefinite" />
                </circle>

                {/* Road Closed Barrier Line over Highway */}
                <rect
                  x={hx - 24}
                  y={hy - 8}
                  width="48"
                  height="16"
                  rx="3"
                  fill="url(#roadblockHazardPattern)"
                  stroke="#991B1B"
                  strokeWidth="2"
                />

                {/* Central Hazard Pin */}
                <circle cx={hx} cy={hy} r="14" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2.5" />
                <text x={hx} y={hy + 5} fontSize="14" textAnchor="middle" fill="#FFFFFF">
                  ⚠️
                </text>

                {/* Roadblock Banner */}
                <rect
                  x={hx - 85}
                  y={hy - 34}
                  width="170"
                  height="22"
                  rx="5"
                  fill="#991B1B"
                  stroke="#FECACA"
                  strokeWidth="1.5"
                />
                <text x={hx} y={hy - 19} fill="#FFFFFF" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                  ⛔ LANDSLIDE ROAD CLOSED
                </text>

                {/* Evacuation Diversion Vector Arrow (Leading South to Udhampur Safe Haven) */}
                <g id="diversion-corridor">
                  <path
                    d={`M ${hx - 15} ${hy + 15} Q 710 260 665 330`}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                  >
                    <animate attributeName="stroke-dashoffset" values="20;0" dur="1s" repeatCount="indefinite" />
                  </path>
                  <polygon points="665,330 675,322 670,335" fill="#10B981" />
                  <rect x="680" y="275" width="105" height="18" rx="4" fill="#065F46" stroke="#34D399" strokeWidth="1" />
                  <text x="732" y="287" fill="#A7F3D0" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                    SAFE EVACUATION ➔
                  </text>
                </g>
              </g>
            );
          })()}

          {/* ======================================================== */}
          {/* EXCLUSIVELY HOSPITALS, SAFE HAVENS & POLICE RESCUE POSTS */}
          {/* ======================================================== */}
          {filteredSafetyPoints.map((spot) => {
            const [px, py] = projectCoordinates(spot.coordinates);
            const isHospital = spot.kind === 'hospital';
            const isSafeHaven = spot.kind === 'safe_haven';
            const isPolice = spot.kind === 'police';
            const isTransit = spot.kind === 'transit_anchor';

            const glowGradient = isHospital
              ? 'url(#hospitalRedGlow)'
              : isSafeHaven
              ? 'url(#havenGreenGlow)'
              : isPolice
              ? 'url(#policeBlueGlow)'
              : undefined;

            const pinBg = isHospital
              ? '#DC2626'
              : isSafeHaven
              ? '#059669'
              : isPolice
              ? '#2563EB'
              : '#334155';

            const pinIcon = isHospital
              ? '🏥'
              : isSafeHaven
              ? '🛡️'
              : isPolice
              ? '👮'
              : '🚆';

            return (
              <g
                key={spot.id}
                id={spot.id}
                className="cursor-pointer group"
                onClick={() => setActiveItem(spot)}
              >
                {/* Glow ring */}
                {glowGradient && (
                  <circle cx={px} cy={py} r="26" fill={glowGradient}>
                    <animate attributeName="r" values="18;32;18" dur="3s" repeatCount="indefinite" />
                  </circle>
                )}

                {/* Central Pin */}
                <circle cx={px} cy={py} r="13" fill={pinBg} stroke="#FFFFFF" strokeWidth="2.5" />
                <text x={px} y={py + 4.5} fontSize="12" textAnchor="middle" fill="#FFFFFF">
                  {pinIcon}
                </text>

                {/* Badge Label */}
                <rect
                  x={px - 65}
                  y={py + 17}
                  width="130"
                  height="22"
                  rx="5"
                  fill={isHospital ? '#450A0A' : isSafeHaven ? '#064E3B' : isPolice ? '#172554' : '#1E293B'}
                  stroke={isHospital ? '#F87171' : isSafeHaven ? '#34D399' : isPolice ? '#60A5FA' : '#94A3B8'}
                  strokeWidth="1.2"
                />
                <text
                  x={px}
                  y={py + 31}
                  fill="#FFFFFF"
                  fontSize="8.5"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {spot.name.length > 20 ? spot.name.slice(0, 19) + '…' : spot.name}
                </text>
              </g>
            );
          })}

          {/* Compass & Legend */}
          <g transform="translate(45, 630)" opacity="0.85">
            <circle cx="0" cy="0" r="22" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
            <polygon points="0,-18 5,-4 0,0 -5,-4" fill="#EF4444" />
            <polygon points="0,18 5,4 0,0 -5,4" fill="#94A3B8" />
            <text x="0" y="-22" fill="#EF4444" fontSize="9" fontWeight="bold" textAnchor="middle">N</text>
            <text x="0" y="29" fill="#94A3B8" fontSize="8" textAnchor="middle">S</text>
            <text x="25" y="3" fill="#94A3B8" fontSize="8">E</text>
            <text x="-29" y="3" fill="#94A3B8" fontSize="8">W</text>
          </g>

          <g transform="translate(100, 645)" opacity="0.85">
            <line x1="0" y1="0" x2="60" y2="0" stroke="#FFFFFF" strokeWidth="2.5" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="60" y1="-4" x2="60" y2="4" stroke="#FFFFFF" strokeWidth="2" />
            <text x="30" y="14" fill="#E2E8F0" fontSize="9" fontWeight="bold" textAnchor="middle">
              15 Kilometers
            </text>
          </g>
        </svg>
      </div>

      {/* Interactive Detail Bottom Drawer for Selected Hospital or Safety Point */}
      {activeItem && (
        <div className="absolute bottom-2 left-2 right-2 z-30 bg-slate-900/98 backdrop-blur-md border border-slate-700 p-3 sm:p-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-3 max-h-[50%] overflow-y-auto space-y-2.5 text-xs">
          <div className="flex items-start justify-between gap-2 border-b border-slate-700/60 pb-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  activeItem.kind === 'hospital'
                    ? 'bg-red-600 text-white'
                    : activeItem.kind === 'safe_haven'
                    ? 'bg-emerald-600 text-white'
                    : activeItem.kind === 'police'
                    ? 'bg-blue-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {activeItem.kind === 'hospital' ? (
                  <HeartPulse className="w-4 h-4" />
                ) : activeItem.kind === 'safe_haven' ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : activeItem.kind === 'police' ? (
                  <Siren className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm leading-tight">{activeItem.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.2 rounded-full uppercase ${
                      activeItem.kind === 'hospital'
                        ? 'bg-red-950 text-red-300 border border-red-500/40'
                        : activeItem.kind === 'safe_haven'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : activeItem.kind === 'police'
                        ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                        : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {activeItem.kind === 'hospital'
                      ? '🏥 Emergency Hospital'
                      : activeItem.kind === 'safe_haven'
                      ? '🛡️ Safe Evacuation Haven'
                      : activeItem.kind === 'police'
                      ? '👮 Police & SDRF Post'
                      : '⚠️ Hazard Zone'}
                  </span>
                  {activeItem.capacity && (
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">
                      Cap: {activeItem.capacity.toLocaleString()} Yatris
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveItem(null)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close details"
            >
              ✕
            </button>
          </div>

          <p className="text-slate-300 text-[11px] leading-relaxed">
            {activeItem.description}
          </p>

          {/* Emergency Facilities Available */}
          {activeItem.facilities && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Verified Emergency Facilities:
              </span>
              <div className="flex flex-wrap gap-1">
                {activeItem.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className={`text-[10px] px-2 py-0.5 rounded-md border ${
                      activeItem.kind === 'hospital'
                        ? 'bg-red-950/60 border-red-500/30 text-red-200'
                        : 'bg-emerald-950/60 border-emerald-500/30 text-emerald-200'
                    }`}
                  >
                    ✓ {fac}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Offline Action Directives */}
          {activeItem.actionDirectives && (
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide block">
                Offline Evacuation Directives:
              </span>
              <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-slate-200">
                {activeItem.actionDirectives.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Immediate Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <a
              href={`tel:${activeItem.hotline.split('/')[0].trim()}`}
              className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
              <span>Call Helpline ({activeItem.hotline.split('/')[0].trim()})</span>
            </a>
            <button
              onClick={() => handleFocusPoint(activeItem.coordinates, 2.2)}
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
