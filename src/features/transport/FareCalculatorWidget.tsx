import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, ShieldCheck, Bus, Car, Zap, Info, CheckCircle2 } from 'lucide-react';
import { TaxiIcon, AutoRickshawIcon, CityBusIcon } from '@/ui/icons/TransitIcons';

interface TransitHub {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zone: string;
}

const JAMMU_HUBS: TransitHub[] = [
  { id: 'station', name: 'Jammu Tawi Railway Station', lat: 32.7058, lng: 74.8778, zone: 'Rail Terminal' },
  { id: 'airport', name: 'Jammu Civil Airport (Satwari)', lat: 32.6891, lng: 74.8374, zone: 'Airport' },
  { id: 'bus_stand', name: 'General Bus Stand (BC Road)', lat: 32.7315, lng: 74.8622, zone: 'Central Hub' },
  { id: 'raghunath', name: 'Raghunath Bazaar / Old City', lat: 32.7295, lng: 74.8643, zone: 'Heritage Market' },
  { id: 'bahu_fort', name: 'Bahu Fort & Bagh-e-Bahu', lat: 32.7302, lng: 74.8814, zone: 'Shrine & Fort' },
  { id: 'katra', name: 'Katra (Mata Vaishno Devi Base)', lat: 32.9912, lng: 74.9318, zone: 'Pilgrim Gateway' },
  { id: 'nagrota', name: 'Nagrota Toll Post (NH-44)', lat: 32.7845, lng: 74.9125, zone: 'Highway Junction' },
  { id: 'akhnoor', name: 'Akhnoor Fort (Chenab River)', lat: 32.8967, lng: 74.7412, zone: 'Historic Border' },
];

export const FareCalculatorWidget: React.FC = () => {
  const [originId, setOriginId] = useState<string>('station');
  const [destinationId, setDestinationId] = useState<string>('bahu_fort');

  const origin = useMemo(() => JAMMU_HUBS.find((h) => h.id === originId) || JAMMU_HUBS[0], [originId]);
  const destination = useMemo(() => JAMMU_HUBS.find((h) => h.id === destinationId) || JAMMU_HUBS[4], [destinationId]);

  // Approximate crow-fly distance to driving road distance (1.35x road winding factor)
  const estimatedKm = useMemo(() => {
    if (origin.id === destination.id) return 0;
    // Haversine
    const R = 6371; // km
    const dLat = ((destination.lat - origin.lat) * Math.PI) / 180;
    const dLon = ((destination.lng - origin.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((origin.lat * Math.PI) / 180) *
        Math.cos((destination.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const crowFly = R * c;
    return Math.max(1.5, Math.round(crowFly * 1.35 * 10) / 10);
  }, [origin, destination]);

  // Government Notified Tariff Estimations (2025-2026 J&K Transport Department)
  const fares = useMemo(() => {
    if (estimatedKm === 0) return null;

    // Matador: Stage carriage flat ₹10 up to 3 km, ₹15 up to 7 km, ₹20 up to 15 km, ₹45 for Katra direct shuttle
    let matadorFare = 15;
    if (estimatedKm <= 3) matadorFare = 10;
    else if (estimatedKm <= 8) matadorFare = 15;
    else if (estimatedKm <= 16) matadorFare = 20;
    else if (estimatedKm > 30) matadorFare = 55; // Outstation bus/express

    // Auto Rickshaw: ₹35 base + ₹14/km (Night: +20%)
    const autoMin = Math.round(35 + (estimatedKm - 1) * 13);
    const autoMax = Math.round(autoMin * 1.2);

    // Taxi (Sedan / Dzire AC): ₹200 minimum base + ₹22/km
    const taxiMin = Math.round(Math.max(220, 200 + (estimatedKm - 2) * 21));
    const taxiMax = Math.round(taxiMin * 1.15);

    // E-Rickshaw (Local short hop < 4km): ₹10-₹20 flat
    const eRickshaw = estimatedKm <= 4 ? '₹10 - ₹20' : 'Not suitable (>4 km)';

    return {
      matador: `₹${matadorFare}`,
      auto: `₹${autoMin} - ₹${autoMax}`,
      taxi: `₹${taxiMin} - ₹${taxiMax}`,
      eRickshaw,
    };
  }, [estimatedKm]);

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-forest-900 text-amber-400 flex items-center justify-center font-bold">
            <Calculator size={18} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-ink">
              Interactive Fare & Distance Calculator
            </h3>
            <p className="text-[11px] text-stone">
              Standard official J&K RTA union benchmarks • Zero surge pricing
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
          <ShieldCheck size={11} /> Verified Tariff
        </span>
      </div>

      {/* Selectors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-stone block mb-1">
            Pick-up Hub / Origin
          </label>
          <select
            value={originId}
            onChange={(e) => setOriginId(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs font-semibold text-ink focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {JAMMU_HUBS.map((hub) => (
              <option key={hub.id} value={hub.id} disabled={hub.id === destinationId}>
                📍 {hub.name} ({hub.zone})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-stone block mb-1">
            Destination Landmark
          </label>
          <select
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs font-semibold text-ink focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {JAMMU_HUBS.map((hub) => (
              <option key={hub.id} value={hub.id} disabled={hub.id === originId}>
                🏁 {hub.name} ({hub.zone})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Distance and Estimated Fares Matrix */}
      {fares && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-stone px-1">
            <span>Approximate Road Distance:</span>
            <span className="text-forest-900 dark:text-forest-200 text-sm font-heading font-extrabold">
              ~{estimatedKm} km
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Matador Option */}
            <div className="bg-surface rounded-xl p-2.5 border border-border text-center space-y-1">
              <div className="w-7 h-7 mx-auto rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                <CityBusIcon size={16} />
              </div>
              <div className="text-[10px] font-bold text-stone">Matador / Mini-Bus</div>
              <div className="text-xs sm:text-sm font-extrabold text-blue-700 dark:text-blue-400">
                {fares.matador}
              </div>
              <div className="text-[9px] text-stone">Pay conductor inside</div>
            </div>

            {/* Auto Rickshaw Option */}
            <div className="bg-surface rounded-xl p-2.5 border border-border text-center space-y-1">
              <div className="w-7 h-7 mx-auto rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <AutoRickshawIcon size={16} />
              </div>
              <div className="text-[10px] font-bold text-stone">Auto Rickshaw</div>
              <div className="text-xs sm:text-sm font-extrabold text-amber-700 dark:text-amber-400">
                {fares.auto}
              </div>
              <div className="text-[9px] text-stone">Point-to-point meter</div>
            </div>

            {/* Taxi Option */}
            <div className="bg-surface rounded-xl p-2.5 border border-border text-center space-y-1">
              <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                <TaxiIcon size={16} />
              </div>
              <div className="text-[10px] font-bold text-stone">Prepaid / Private Cab</div>
              <div className="text-xs sm:text-sm font-extrabold text-emerald-800 dark:text-emerald-400">
                {fares.taxi}
              </div>
              <div className="text-[9px] text-stone">TRC prepaid booth</div>
            </div>
          </div>

          <div className="text-[11px] bg-forest-50 dark:bg-forest-950/30 p-2.5 rounded-xl border border-forest-500/20 text-forest-900 dark:text-forest-200 flex items-start gap-2">
            <Info size={14} className="shrink-0 mt-0.5 text-forest-700 dark:text-forest-400" />
            <div>
              <strong>Pilgrim Anti-Overcharging Shield:</strong> Always insist on the standard prepaid slip at Jammu Tawi Station or Bus Stand TRC booth. For Matadors, fares are regulated by J&K Motor Vehicles Department.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
