import React from 'react';
import { CloudSun, Thermometer, Wind, ShieldAlert, Sparkles, MapPin } from 'lucide-react';

interface ClimateZone {
  region: string;
  altitude: string;
  summerTemp: string;
  winterTemp: string;
  currentAdvisory: string;
  clothingAdvice: string;
}

const CLIMATE_ZONES: ClimateZone[] = [
  {
    region: 'Jammu Plains & City (Old City, Bahu, Tawi River)',
    altitude: '1,070 ft (327 m)',
    summerTemp: '30°C – 42°C (Warm)',
    winterTemp: '7°C – 20°C (Pleasant/Mild)',
    currentAdvisory: 'October brings clear sunny skies with breezy evenings. Ideal travel window for heritage walks and temple darshans.',
    clothingAdvice: 'Breathable cottons for daytime; light layer for late night.'
  },
  {
    region: 'Katra Base Camp & Trikuta Holy Hills (Vaishno Devi)',
    altitude: '2,800 ft – 5,200 ft (850 m – 1,585 m)',
    summerTemp: '22°C – 34°C',
    winterTemp: '2°C – 14°C (Cold nights)',
    currentAdvisory: 'Night temperatures at Holy Bhawan drop significantly compared to Katra base camp. Occasional mountain fog in early morning.',
    clothingAdvice: 'Comfortable trek shoes with rubber grip, warm shawl or fleece jacket for evening and sanctum queue.'
  },
  {
    region: 'Patnitop, Sanasar & Bhaderwah Highlands',
    altitude: '6,640 ft – 7,500 ft (2,024 m – 2,286 m)',
    summerTemp: '16°C – 26°C (Cool & Alpine)',
    winterTemp: '-3°C – 10°C (Frequent Snow)',
    currentAdvisory: 'Crisp alpine breeze. Evening mist blankets pine meadows by 5:30 PM. Roads are clear and open.',
    clothingAdvice: 'Heavy woollens, thermals, windbreaker jacket, and walking poles for nature trails.'
  }
];

export const WeatherAndAltitudeAdvisory: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center">
            <CloudSun className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-ink text-sm">Altitude & Weather Advisory</h3>
            <p className="text-[11px] text-slate-500">Seasonal guidelines from Jammu plains to Pir Panjal snowline</p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
          Autumn 2026 Season
        </span>
      </div>

      <div className="space-y-2.5">
        {CLIMATE_ZONES.map((zone, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <div>
                <h4 className="font-serif font-bold text-ink text-sm flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{zone.region}</span>
                </h4>
                <span className="text-[11px] text-slate-500">Altitude: {zone.altitude}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-white border border-slate-100">
                <span className="text-slate-500 block">Summer:</span>
                <span className="font-semibold text-slate-800">{zone.summerTemp}</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-100">
                <span className="text-slate-500 block">Winter:</span>
                <span className="font-semibold text-slate-800">{zone.winterTemp}</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-950 space-y-1">
              <div><strong>Advisory:</strong> {zone.currentAdvisory}</div>
              <div><strong>Recommended Packing:</strong> {zone.clothingAdvice}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
