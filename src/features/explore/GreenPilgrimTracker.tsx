import React, { useState, useId } from 'react';
import { 
  Leaf, Award, CheckCircle, ShieldCheck, Download, Share2, 
  MapPin, Bus, Car, Footprints, Droplets, Sparkles, AlertCircle
} from 'lucide-react';

export interface RouteOption {
  id: string;
  name: string;
  distanceKm: number;
  description: string;
}

export const COMMON_YATRA_ROUTES: RouteOption[] = [
  { id: 'jammu-katra', name: 'Jammu Railway Station ➔ Katra Base', distanceKm: 48, description: 'National Highway NH-144 via Jhajjar Kotli' },
  { id: 'katra-bhawan-trek', name: 'Katra (Ban Ganga) ➔ Holy Bhawan', distanceKm: 13, description: 'Traditional & Tarakote Marg Pilgrim Footpath' },
  { id: 'jammu-patnitop', name: 'Jammu ➔ Patnitop Hill Station', distanceKm: 112, description: 'Scenic mountain climb via Chenani-Nashri Tunnel' },
  { id: 'jammu-mansar', name: 'Jammu ➔ Mansar & Surinsar Lakes', distanceKm: 62, description: 'Ramsar wetland heritage circuit' },
  { id: 'katra-shivkhori', name: 'Katra ➔ Shiv Khori Cave Sanctum', distanceKm: 75, description: 'Reasi hill road via Pouni' },
];

export const PLEDGE_ITEMS = [
  { id: 'refill', label: 'Use reusable steel/copper bottles; avoid single-use plastic water bottles in the Trikuta hills.' },
  { id: 'transit', label: 'Opt for Jammu Smart City E-Buses, shared matadors, or electric auto-rickshaws when possible.' },
  { id: 'clean', label: 'Practice "Leave No Trace" — carry wrappers and snacks back to designated green disposal hubs.' },
  { id: 'flora', label: 'Protect fragile Himalayan forest biodiversity, natural springs (baolis), and sacred cedar groves.' },
  { id: 'local', label: 'Support local Jammu Dogra artisans, organic walnuts, rajmash farmers, and traditional kulhad chai stalls.' },
];

export const GreenPilgrimTracker: React.FC = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(COMMON_YATRA_ROUTES[0].id);
  const [travelMode, setTravelMode] = useState<'electric_bus' | 'diesel_cab' | 'walking_trek'>('electric_bus');
  const [pilgrimCount, setPilgrimCount] = useState<number>(2);
  const [yatriName, setYatriName] = useState<string>('');
  const [pledges, setPledges] = useState<Record<string, boolean>>({
    refill: true,
    transit: true,
    clean: true,
  });
  const [isCertificateGenerated, setIsCertificateGenerated] = useState<boolean>(false);
  const [certId, setCertId] = useState<string>('');

  const currentRoute = COMMON_YATRA_ROUTES.find(r => r.id === selectedRouteId) || COMMON_YATRA_ROUTES[0];

  // Emission factors in kg CO2 per passenger per km:
  // Diesel private cab: 0.192 kg CO2 / passenger-km (assuming 1 person in car = 0.192; distributed over pax = 0.192 / count)
  // Shared E-Bus: 0.038 kg CO2 / passenger-km
  // Walking / Trek: 0.000 kg CO2 / passenger-km
  const getEmissionsKg = () => {
    const dist = currentRoute.distanceKm;
    if (travelMode === 'walking_trek') {
      return { actual: 0, baselineCab: Number((dist * 0.192 * pilgrimCount).toFixed(2)), saved: Number((dist * 0.192 * pilgrimCount).toFixed(2)) };
    }
    if (travelMode === 'electric_bus') {
      const actual = Number((dist * 0.038 * pilgrimCount).toFixed(2));
      const baselineCab = Number((dist * 0.192 * pilgrimCount).toFixed(2));
      const saved = Number((baselineCab - actual).toFixed(2));
      return { actual, baselineCab, saved };
    }
    // diesel cab
    const actual = Number((dist * 0.192 * pilgrimCount).toFixed(2));
    return { actual, baselineCab: actual, saved: 0 };
  };

  const { actual, baselineCab, saved } = getEmissionsKg();

  const togglePledge = (id: string) => {
    setPledges(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleGenerateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yatriName.trim()) return;
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCertId(`HY-JK-${new Date().getFullYear()}-${randomHex}`);
    setIsCertificateGenerated(true);
  };

  const allPledgesChecked = PLEDGE_ITEMS.every(p => pledges[p.id]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5" /> Punya & Prakriti Initiative
              </span>
              <span className="text-xs text-emerald-200">Zero-Plastic & Low-Carbon Yatra</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Green Pilgrim Carbon Footprint & Pledge
            </h1>
            <p className="text-sm md:text-base text-emerald-100 max-w-2xl mt-1">
              Calculate your pilgrimage travel carbon footprint, switch to eco-friendly transport, take the holy Harit Yatri pledge, and earn your verified digital certificate.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: CO2 Calculator */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              1. Pilgrimage Route & Transport Calculator
            </h2>

            {/* Select Route */}
            <div className="space-y-2 mb-4">
              <label className="text-xs font-semibold text-stone uppercase tracking-wider block">
                Select Pilgrim Corridor:
              </label>
              <select
                value={selectedRouteId}
                onChange={e => setSelectedRouteId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {COMMON_YATRA_ROUTES.map(route => (
                  <option key={route.id} value={route.id}>
                    {route.name} ({route.distanceKm} km)
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentRoute.description}
              </p>
            </div>

            {/* Mode of Travel */}
            <div className="space-y-2 mb-5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Choose Mode of Transport:
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setTravelMode('electric_bus')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    travelMode === 'electric_bus'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900 dark:text-emerald-200'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Bus className="w-5 h-5 mx-auto mb-1 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold block">Smart E-Bus</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">~78% less CO2</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTravelMode('walking_trek')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    travelMode === 'walking_trek'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900 dark:text-emerald-200'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Footprints className="w-5 h-5 mx-auto mb-1 text-teal-600 dark:text-teal-400" />
                  <span className="text-xs font-bold block">Walking / Trek</span>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">100% Zero Emission</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTravelMode('diesel_cab')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    travelMode === 'diesel_cab'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20 text-amber-900 dark:text-amber-200'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Car className="w-5 h-5 mx-auto mb-1 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold block">Private Diesel</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">High Carbon</span>
                </button>
              </div>
            </div>

            {/* Pilgrim Count */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700/60 mb-5">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Number of Yatris</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Total passengers in your family / group</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPilgrimCount(Math.max(1, pilgrimCount - 1))}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-bold text-sm text-slate-700 dark:text-slate-200 active:scale-95"
                >
                  -
                </button>
                <span className="w-8 text-center font-black text-sm text-slate-900 dark:text-slate-100">
                  {pilgrimCount}
                </span>
                <button
                  type="button"
                  onClick={() => setPilgrimCount(Math.min(20, pilgrimCount + 1))}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-bold text-sm text-slate-700 dark:text-slate-200 active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            {/* Carbon Comparison Output */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400 block">Your Footprint</span>
                  <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 block mt-0.5">
                    {actual} <span className="text-xs font-normal">kg CO₂</span>
                  </span>
                </div>
                <div className="p-2 border-x border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400 block">Cab Baseline</span>
                  <span className="text-xl font-black text-slate-600 dark:text-slate-400 block mt-0.5">
                    {baselineCab} <span className="text-xs font-normal">kg CO₂</span>
                  </span>
                </div>
                <div className="p-2">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400 block">CO₂ Prevented</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-300 block mt-0.5">
                    +{saved} <span className="text-xs font-normal">kg</span>
                  </span>
                </div>
              </div>
              {saved > 0 && (
                <div className="mt-3 pt-3 border-t border-emerald-500/20 text-center">
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                    🌳 By choosing clean mobility, you saved equivalent to planting <strong>{(saved / 2.1).toFixed(1)} pine saplings</strong> in the Pir Panjal mountain range!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 5-Point Harit Yatri Pledge */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              2. Holy Harit Yatri (Green Pilgrim) Pledge
            </h2>
            <p className="text-xs text-stone mb-4">
              Tick your environmental commitments for the duration of your stay in the sacred land of Jammu:
            </p>

            <div className="space-y-3">
              {PLEDGE_ITEMS.map((item) => (
                <label 
                  key={item.id} 
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    pledges[item.id]
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-slate-900 dark:text-slate-100'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!pledges[item.id]}
                    onChange={() => togglePledge(item.id)}
                    className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-medium leading-relaxed">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Certificate Issuance & Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-ink flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-amber-500" />
              3. Claim Your Digital Green Yatri Certificate
            </h2>
            <p className="text-xs text-stone mb-4">
              Enter your name to generate an official digital badge recognized across Jammu Khoj eco-initiatives.
            </p>

            <form onSubmit={handleGenerateCertificate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone uppercase tracking-wider block mb-1.5">
                  Pilgrim Name (As on ID):
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={yatriName}
                  onChange={e => setYatriName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={!yatriName.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 active:scale-95 text-white font-bold text-sm shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" />
                Issue My Harit Yatri Certificate
              </button>
            </form>
          </div>

          {/* Certificate View */}
          {isCertificateGenerated && (
            <div className="bg-gradient-to-b from-amber-50/70 via-white to-emerald-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30 rounded-2xl border-2 border-emerald-500/40 p-6 shadow-xl relative overflow-hidden text-center">
              <div className="absolute top-2 right-2 text-[10px] font-mono text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded">
                {certId}
              </div>

              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-400 flex items-center justify-center mb-3">
                <Leaf className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>

              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-300 block">
                Certificate of Environmental Dharma
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">
                {yatriName}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 italic px-2">
                "Recognized as an official Harit Yatri for upholding sacred ecological sanctity in the Jammu & Pir Panjal mountain sanctuary."
              </p>

              <div className="my-4 py-3 px-4 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-left text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Route Honored:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{currentRoute.name.split('➔')[1] || currentRoute.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Pledge Level:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">
                    {allPledgesChecked ? 'Gold Standard (5/5 Pledges)' : 'Silver Standard (Harit Yatri)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">CO₂ Avoided:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">+{saved} kg CO₂</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Verified by Jammu Khoj Eco-Tourism Taskforce
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
