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
    id: 'sec_tawi_valley',
    name: 'Jammu City & Tawi River Basin',
    riskLevel: 'low',
    rainfallMm: 4.5,
    precipitationStatus: 'Clear Skies / Gentle Breeze',
    landslideIndex: '10/100 (Nominal)',
    advisory: 'All city bridges and arterial avenues flowing normally with unrestricted transit.',
    roadPassable: true,
  },
];

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
    </div>
  );
};
