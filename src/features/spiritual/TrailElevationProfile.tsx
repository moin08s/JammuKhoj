import React, { useState } from 'react';
import { Mountain, HeartPulse, Activity, AlertTriangle, BatteryCharging, Info, MapPin } from 'lucide-react';

export interface TrailWaypoint {
  id: string;
  name: string;
  hindiName: string;
  distanceKm: number;
  elevationMeters: number;
  gradientPercent: number;
  amenities: ('medical' | 'battery_car' | 'water' | 'food' | 'rest')[];
  cardiacWarning?: boolean;
  notes: string;
}

export const KATRA_BHAWAN_WAYPOINTS: TrailWaypoint[] = [
  {
    id: 'wp_katra',
    name: 'Katra Base Camp (Yatra Parchi Counter)',
    hindiName: 'कटड़ा बेस कैंप (पंजीकरण काउंटर)',
    distanceKm: 0.0,
    elevationMeters: 750,
    gradientPercent: 4.5,
    amenities: ['medical', 'water', 'food', 'rest'],
    notes: 'Mandatory RFID card pickup, luggage cloakrooms, and pre-trek medical checks.',
  },
  {
    id: 'wp_banganga',
    name: 'Ban Ganga Gate & Shrines',
    hindiName: 'बाणगंगा प्रवेश द्वार',
    distanceKm: 2.2,
    elevationMeters: 850,
    gradientPercent: 5.2,
    amenities: ['water', 'food', 'rest'],
    notes: 'Security baggage check. First sacred bath point where Mata quenched Lakkhanveer’s thirst.',
  },
  {
    id: 'wp_charanpaduka',
    name: 'Charan Paduka Holy Shrine',
    hindiName: 'चरण पादुका',
    distanceKm: 4.0,
    elevationMeters: 1020,
    gradientPercent: 8.5,
    amenities: ['water', 'medical', 'rest'],
    notes: 'Sacred footprint of the Divine Mother on rock. Gentle paved gradient.',
  },
  {
    id: 'wp_ardhkuwari',
    name: 'Ardhkuwari Junction & Garbhjoon Cave',
    hindiName: 'अर्धकुंवारी मंदिर एवं गर्भजून गुफा',
    distanceKm: 6.2,
    elevationMeters: 1420,
    gradientPercent: 10.5,
    amenities: ['medical', 'battery_car', 'water', 'food', 'rest'],
    notes: 'Midway point. Electronic token callout for Garbhjoon. Battery car terminal for seniors starts here.',
  },
  {
    id: 'wp_himkoti',
    name: 'Himkoti Battery Car Viewpoint',
    hindiName: 'हिमकोटी व्यू पॉइंट',
    distanceKm: 8.8,
    elevationMeters: 1250,
    gradientPercent: 3.2,
    amenities: ['battery_car', 'water', 'food', 'rest'],
    notes: 'Alternate modern flatter route. Overlooks deep Trikuta gorges with bio-toilets and vegetarian restaurants.',
  },
  {
    id: 'wp_sanjichhat',
    name: 'Sanjichhat High-Altitude Ridge & Helipad',
    hindiName: 'सांझीछत रिज एवं हेलीपैड',
    distanceKm: 9.5,
    elevationMeters: 1920,
    gradientPercent: 14.2,
    amenities: ['medical', 'water', 'food', 'rest'],
    cardiacWarning: true,
    notes: 'Steepest ascent via traditional Hathimatha track. 24x7 Emergency Hospital with oxygen and ICU.',
  },
  {
    id: 'wp_bhawan',
    name: 'Shri Mata Vaishno Devi Bhawan',
    hindiName: 'माँ वैष्णो देवी मुख्य पवित्र भवन',
    distanceKm: 12.8,
    elevationMeters: 1580,
    gradientPercent: 6.0,
    amenities: ['medical', 'water', 'food', 'rest'],
    notes: 'Sacred Sanctum Sanctorum (Pindies). Free shoe lockers, blanket counters, and divine prasad bhandar.',
  },
  {
    id: 'wp_bhairon',
    name: 'Bhairon Ghati Shrine (via Cable Car Ropeway)',
    hindiName: 'भैरों घाटी मंदिर',
    distanceKm: 14.5,
    elevationMeters: 2010,
    gradientPercent: 15.0,
    amenities: ['water', 'food', 'rest'],
    cardiacWarning: true,
    notes: 'Highest peak of the circuit. Yatris strongly advised to take the 5-minute ropeway (₹100 return).',
  },
];

export const TRAIL_ELEVATION_WAYPOINTS = KATRA_BHAWAN_WAYPOINTS;

export const TrailElevationProfile: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<TrailWaypoint>(KATRA_BHAWAN_WAYPOINTS[3]); // Default Ardhkuwari
  const [activeTrail] = useState<'katra_bhawan' | 'himkoti'>('katra_bhawan');

  // SVG coordinate dimensions
  const svgWidth = 720;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingY = 30;

  const minElevation = 600;
  const maxElevation = 2100;
  const maxDistance = 15.0;

  const getX = (distKm: number) => paddingX + (distKm / maxDistance) * (svgWidth - 2 * paddingX);
  const getY = (elevM: number) => svgHeight - paddingY - ((elevM - minElevation) / (maxElevation - minElevation)) * (svgHeight - 2 * paddingY);

  const polylinePoints = KATRA_BHAWAN_WAYPOINTS.map(wp => `${getX(wp.distanceKm)},${getY(wp.elevationMeters)}`).join(' ');
  const areaPoints = `${getX(0)},${svgHeight - paddingY} ` + polylinePoints + ` ${getX(KATRA_BHAWAN_WAYPOINTS[KATRA_BHAWAN_WAYPOINTS.length - 1].distanceKm)},${svgHeight - paddingY}`;

  return (
    <div className="bg-card border border-border rounded-3xl p-4 sm:p-5 shadow-xs space-y-4 text-ink">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Mountain size={20} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
                SchweizMobil Alpine Benchmark
              </span>
              <span className="text-xs text-stone font-medium">12.8 km Sacred Circuit</span>
            </div>
            <h3 className="font-heading font-black text-base text-ink">
              Interactive Trail Incline & Elevation Profile
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
            <HeartPulse size={13} className="text-red-500" />
            <span>Cardiac Alert &gt;12% Grade</span>
          </span>
        </div>
      </div>

      {/* SVG Mountain Elevation Profile Graph */}
      <div className="w-full overflow-x-auto bg-surface/70 rounded-2xl p-2.5 border border-border relative select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[580px] overflow-visible"
        >
          <defs>
            <linearGradient id="elevationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#059669" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="steepSlopeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[800, 1200, 1600, 2000].map(elev => (
            <g key={elev}>
              <line
                x1={paddingX}
                y1={getY(elev)}
                x2={svgWidth - paddingX}
                y2={getY(elev)}
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 6}
                y={getY(elev) + 3}
                fill="currentColor"
                opacity="0.45"
                fontSize="9"
                textAnchor="end"
                fontFamily="monospace"
              >
                {elev}m
              </text>
            </g>
          ))}

          {/* Filled Elevation Area */}
          <polygon points={areaPoints} fill="url(#elevationGradient)" />

          {/* Trail Contour Polyline */}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#10B981"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Steep Section Highlighter (Hathimatha to Sanjichhat) */}
          <line
            x1={getX(6.2)}
            y1={getY(1420)}
            x2={getX(9.5)}
            y2={getY(1920)}
            stroke="#EF4444"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Waypoint Interactive Circles */}
          {KATRA_BHAWAN_WAYPOINTS.map(wp => {
            const cx = getX(wp.distanceKm);
            const cy = getY(wp.elevationMeters);
            const isSelected = selectedPoint.id === wp.id;
            const isSteep = (wp.cardiacWarning || wp.gradientPercent >= 12);

            return (
              <g
                key={wp.id}
                onClick={() => setSelectedPoint(wp)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                {isSelected && (
                  <circle cx={cx} cy={cy} r="14" fill={isSteep ? '#EF4444' : '#10B981'} opacity="0.3" className="animate-ping" />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? '8' : '5'}
                  fill={isSteep ? '#EF4444' : '#10B981'}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
                {/* Distance label on x-axis */}
                <text
                  x={cx}
                  y={svgHeight - 10}
                  fill="currentColor"
                  opacity="0.65"
                  fontSize="8.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {wp.distanceKm}km
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-stone">
          <span>Katra Base (750m)</span>
          <span className="text-red-500 font-bold">⚠️ Hathimatha (14.2% Grade)</span>
          <span>Bhairon Ghati (2,010m)</span>
        </div>
      </div>

      {/* Selected Waypoint Detail Card */}
      <div className="p-4 rounded-2xl bg-surface border border-border space-y-2.5 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                Waypoint {KATRA_BHAWAN_WAYPOINTS.findIndex(w => w.id === selectedPoint.id) + 1} of {KATRA_BHAWAN_WAYPOINTS.length}
              </span>
              <span className="text-xs font-mono font-bold text-stone">
                {selectedPoint.distanceKm} km from Katra
              </span>
            </div>
            <h4 className="font-heading font-black text-base text-ink mt-1">
              {selectedPoint.name}
            </h4>
            <span className="text-xs text-stone">{selectedPoint.hindiName}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <div className="text-lg font-mono font-black text-ink">{selectedPoint.elevationMeters} m</div>
              <span className="text-[10px] text-stone">Altitude above sea level</span>
            </div>
            <div className={`px-2.5 py-1 rounded-xl text-center font-bold text-xs ${
              selectedPoint.cardiacWarning
                ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
            }`}>
              <div>{selectedPoint.gradientPercent}%</div>
              <span className="text-[9px] uppercase font-mono block">Incline</span>
            </div>
          </div>
        </div>

        {selectedPoint.cardiacWarning && (
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-800 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0 text-red-500" />
            <div>
              <strong>Cardiac & Elderly Advisory:</strong> High slope steepness. Yatris with hypertension, heart ailments, or respiratory conditions are strongly advised to switch to Battery Cars or Ponies.
            </div>
          </div>
        )}

        <p className="text-xs text-stone leading-relaxed">
          {selectedPoint.notes}
        </p>

        {/* Available Amenities Strip */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border/70 text-[11px]">
          <span className="text-stone font-semibold text-[10px] uppercase mr-1">On-Site Facilities:</span>
          {selectedPoint.amenities.map(a => (
            <span
              key={a}
              className="px-2 py-0.5 rounded-full bg-card border border-border font-medium text-ink flex items-center gap-1"
            >
              {a === 'medical' && '🏥 24x7 Medical Dispensary'}
              {a === 'battery_car' && '🔋 Electric Battery Car Station'}
              {a === 'water' && '💧 Pure Filtered Water'}
              {a === 'food' && '🍲 Shrine Board Bhojanalaya'}
              {a === 'rest' && '🪑 Covered Seating Shed'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
