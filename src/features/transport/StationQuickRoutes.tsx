import React, { useState } from 'react';
import { Train, Plane, ArrowRight, Clock, BadgeIndianRupee, MapPin } from 'lucide-react';

interface QuickRoute {
  origin: 'station' | 'airport';
  destination: string;
  duration: string;
  modes: {
    mode: string;
    fare: string;
    time: string;
    recommended?: boolean;
  }[];
  tips: string;
}

const QUICK_ROUTES: QuickRoute[] = [
  {
    origin: 'station',
    destination: 'Katra (Vaishno Devi Base)',
    duration: '45-50 km',
    modes: [
      { mode: 'Local DMU Express Train', fare: '₹35 - ₹55', time: '1h 35m', recommended: true },
      { mode: 'Direct AC/Deluxe Bus (JKSRTC)', fare: '₹75 - ₹120', time: '1h 40m' },
      { mode: 'Prepaid Taxi (Booth inside platform)', fare: '₹1500 - ₹1800', time: '1h 10m' }
    ],
    tips: 'Local DMU trains depart every 2 hours from Jammu Tawi directly to Shri Mata Vaishno Devi Katra (SVDK) station.'
  },
  {
    origin: 'station',
    destination: 'Raghunath Bazaar (Old City)',
    duration: '4.2 km',
    modes: [
      { mode: 'Matador Route 1 (Station ➔ City)', fare: '₹10', time: '15m', recommended: true },
      { mode: 'Shared Auto / E-Rickshaw', fare: '₹20', time: '12m' },
      { mode: 'Reserved Auto-rickshaw', fare: '₹80 - ₹100', time: '10m' }
    ],
    tips: 'Catch Matador Route 1 directly from the station exit road. Drop right at Raghunath Chowk.'
  },
  {
    origin: 'station',
    destination: 'Jammu Airport (Satwari)',
    duration: '6.5 km',
    modes: [
      { mode: 'Reserved Auto', fare: '₹120 - ₹150', time: '20m' },
      { mode: 'Prepaid Taxi', fare: '₹300 - ₹350', time: '15m', recommended: true }
    ],
    tips: 'Allow at least 150 minutes before your domestic flight departure for Jammu airport security screening.'
  },
  {
    origin: 'airport',
    destination: 'Jammu Tawi Railway Station',
    duration: '6.5 km',
    modes: [
      { mode: 'Prepaid Taxi (Airport Counter)', fare: '₹300 - ₹350', time: '15m', recommended: true },
      { mode: 'Auto-rickshaw (Main Gate)', fare: '₹120 - ₹150', time: '20m' }
    ],
    tips: 'Prepaid taxi counter is located right next to the baggage claim exit.'
  },
  {
    origin: 'airport',
    destination: 'Katra (Direct Transfer)',
    duration: '52 km',
    modes: [
      { mode: 'Prepaid Tourist Taxi', fare: '₹1800 - ₹2200', time: '1h 20m', recommended: true }
    ],
    tips: 'Direct highway route via NH44 bypasses central Jammu city traffic.'
  }
];

export const StationQuickRoutes: React.FC = () => {
  const [filter, setFilter] = useState<'station' | 'airport'>('station');

  const filtered = QUICK_ROUTES.filter((r) => r.origin === filter);

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {filter === 'station' ? (
            <Train className="w-4 h-4 text-primary" />
          ) : (
            <Plane className="w-4 h-4 text-primary" />
          )}
          <h3 className="font-serif font-bold text-ink text-sm">
            Quick Routes: From Hubs to Key Destinations
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setFilter('station')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              filter === 'station'
                ? 'bg-white text-primary shadow-xs'
                : 'text-slate-600 hover:text-ink'
            }`}
          >
            <Train className="w-3 h-3" />
            From Station
          </button>
          <button
            onClick={() => setFilter('airport')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
              filter === 'airport'
                ? 'bg-white text-primary shadow-xs'
                : 'text-slate-600 hover:text-ink'
            }`}
          >
            <Plane className="w-3 h-3" />
            From Airport
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        {filtered.map((route, idx) => (
          <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>To {route.destination}</span>
                <span className="text-[11px] font-normal text-slate-500">({route.duration})</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs">
              {route.modes.map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg border text-[11px] ${
                    m.recommended
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{m.mode}</span>
                    {m.recommended && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-600 text-white font-bold">
                        Top Pick
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-slate-600">
                    <span className="font-bold text-slate-800">{m.fare}</span>
                    <span>{m.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed italic bg-white/70 p-2 rounded-lg border border-slate-100">
              💡 {route.tips}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
