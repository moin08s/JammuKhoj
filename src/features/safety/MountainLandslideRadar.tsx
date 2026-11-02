import React from 'react';
import { CloudRain, AlertTriangle, ShieldCheck, Wind, Droplets, Mountain, Eye } from 'lucide-react';

export interface MountainSectorRisk {
  id: string;
  name: string;
  riskLevel: 'critical' | 'high' | 'moderate' | 'low';
  rainfallMm: number;
  precipitationStatus: string;
  landslideIndex: string;
  advisory: string;
  roadPassable: boolean;
}

export const MOUNTAIN_SECTOR_RISKS: MountainSectorRisk[] = [
  {
    id: 'sec_nashri_ramban',
    name: 'NH-44 Nashri - Ramban Highway Sector',
    riskLevel: 'critical',
    rainfallMm: 42.5,
    precipitationStatus: 'Active Rainfall & Soil Saturation',
    landslideIndex: '92/100 (Severe Risk)',
    advisory: 'Continuous debris slide and shooting stones. Light vehicles halted by Traffic Police at Udhampur.',
    roadPassable: false,
  },
  {
    id: 'sec_khooni_nallah',
    name: 'NH-44 Khooni Nallah & Mehar Sector',
    riskLevel: 'critical',
    rainfallMm: 38.0,
    precipitationStatus: 'High-Velocity Rockfall Alert',
    landslideIndex: '88/100 (Severe Risk)',
    advisory: 'Overhead steel rockfall netting active. Heavy shooting stones reported. Total vehicular halt in force.',
    roadPassable: false,
  },
  {
    id: 'sec_panthyal_tunnel',
    name: 'NH-44 Panthyal & Seri Bypass Chute',
    riskLevel: 'high',
    rainfallMm: 24.5,
    precipitationStatus: 'Mud & Slurry Accumulation',
    landslideIndex: '72/100 (Caution)',
    advisory: 'Intermittent slide clearance underway via BRO earthmovers. One-way convoy protocol active.',
    roadPassable: true,
  },
  {
    id: 'sec_trikuta_bhawan',
    name: 'Trikuta Mountain Track (Katra - Bhawan)',
    riskLevel: 'moderate',
    rainfallMm: 12.0,
    precipitationStatus: 'Passing Mountain Mists',
    landslideIndex: '38/100 (Safe with Netting)',
    advisory: 'Rockfall netting overhead active. Himkoti battery car track open under shelter canopies.',
    roadPassable: true,
  },
  {
    id: 'sec_patnitop_batote',
    name: 'Patnitop & Batote Ridge Pass',
    riskLevel: 'high',
    rainfallMm: 28.0,
    precipitationStatus: 'Dense Fog & Low Visibility (<30m)',
    landslideIndex: '65/100 (Caution)',
    advisory: 'Drive with fog lamps at <25 km/h. Avoid night mountain passes.',
    roadPassable: true,
  },
  {
    id: 'sec_chattergalla_pass',
    name: 'Chattergalla Pass (Bani - Bhaderwah Axis)',
    riskLevel: 'moderate',
    rainfallMm: 18.0,
    precipitationStatus: 'Alpine Sleet & Frost (3,200m)',
    landslideIndex: '54/100 (Cold Wave Caution)',
    advisory: 'Chilly winds and sub-zero night temps. 4x4 or snow-chained vehicles recommended above 2,500m.',
    roadPassable: true,
  },
  {
    id: 'sec_sinthan_top',
    name: 'Sinthan Top & Margan Pass (Kishtwar Axis)',
    riskLevel: 'high',
    rainfallMm: 31.0,
    precipitationStatus: 'Sudden Squalls & Cloud Cover',
    landslideIndex: '76/100 (High Altitude Alert)',
    advisory: 'DGRE Level-2 Avalanche Caution on steep north-facing gullies. Crossing permitted 08:00 to 15:00 only.',
    roadPassable: true,
  },
  {
    id: 'sec_tawi_valley',
    name: 'Jammu City & Tawi River Basin (CWC Monitored)',
    riskLevel: 'low',
    rainfallMm: 4.5,
    precipitationStatus: 'Clear Skies / Flow Steady (14.2 ft)',
    landslideIndex: '10/100 (Nominal)',
    advisory: 'All city bridges and arterial avenues flowing normally. CWC River Gauge 9.8 ft below Alert Mark.',
    roadPassable: true,
  },
];

export const TAWI_RIVER_HYDROLOGY = {
  currentStageFt: 14.2,
  alertLevelFt: 24.0,
  dangerLevelFt: 28.0,
  status: 'SAFE',
  monitoringAgency: 'Central Water Commission (CWC)',
};

export const MountainLandslideRadar: React.FC = () => {
  return (
    <div className="p-4 bg-surface border border-border rounded-2xl shadow-sm space-y-3 text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
            <Mountain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-ink flex items-center gap-1.5">
              <span>Mountain Weather & Landslide Vulnerability Radar</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            </h3>
            <p className="text-[11px] text-stone">
              Monitored in real-time by Border Roads Organisation (BRO) and J&K Traffic Police.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface-subtle border border-border text-stone shrink-0">
          Updated: Live Feed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {MOUNTAIN_SECTOR_RISKS.map((sector) => {
          let badgeColor = 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
          if (sector.riskLevel === 'critical') badgeColor = 'bg-danger/15 text-danger border-danger/40 animate-pulse';
          else if (sector.riskLevel === 'high') badgeColor = 'bg-amber-500/15 text-amber-700 border-amber-500/40';
          else if (sector.riskLevel === 'moderate') badgeColor = 'bg-blue-500/15 text-blue-700 border-blue-500/40';

          return (
            <div
              key={sector.id}
              className={`p-3 rounded-xl border space-y-1.5 transition-all ${
                sector.riskLevel === 'critical' ? 'bg-danger/5 border-danger/30' : 'bg-surface-subtle border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-xs text-ink">{sector.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-stone mt-0.5">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-500" />
                      {sector.rainfallMm} mm
                    </span>
                    <span>•</span>
                    <span>{sector.precipitationStatus}</span>
                  </div>
                </div>

                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase ${badgeColor}`}>
                  {sector.riskLevel}
                </span>
              </div>

              <p className="text-[11px] text-stone leading-relaxed bg-surface p-2 rounded-lg border border-border/60">
                {sector.advisory}
              </p>

              <div className="flex items-center justify-between text-[10px] pt-1">
                <span className="font-mono text-stone">Index: {sector.landslideIndex}</span>
                <span className={`font-bold ${sector.roadPassable ? 'text-emerald-600' : 'text-danger'}`}>
                  {sector.roadPassable ? '✓ Passable with Caution' : '✕ Blocked by Traffic Police'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Central Water Commission (CWC) Tawi River Hydrology & Flood Gauge */}
      <div className="p-3 bg-card border border-border rounded-xl space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
          <div className="flex items-center gap-1.5 font-bold text-ink">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Central Water Commission (CWC) Tawi Hydrology Station</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 self-start sm:self-auto">
            Current Stage: 14.2 ft (SAFE / 9.8 ft below alert)
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
          <div className="p-1.5 bg-surface rounded-lg border border-border">
            <span className="text-stone block text-[9px]">Live Water Gauge:</span>
            <strong className="text-ink font-bold text-xs">14.2 ft</strong>
          </div>
          <div className="p-1.5 bg-surface rounded-lg border border-amber-500/30">
            <span className="text-amber-700 dark:text-amber-400 block font-semibold text-[9px]">CWC Alert Mark:</span>
            <strong className="text-amber-700 dark:text-amber-400 font-bold text-xs">24.0 ft</strong>
          </div>
          <div className="p-1.5 bg-surface rounded-lg border border-red-500/30">
            <span className="text-red-700 dark:text-red-400 block font-semibold text-[9px]">CWC Danger Mark:</span>
            <strong className="text-red-700 dark:text-red-400 font-bold text-xs">28.0 ft</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
