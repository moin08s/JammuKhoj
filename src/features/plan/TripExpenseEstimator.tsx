import React, { useState } from 'react';
import { BadgeIndianRupee, Users, Calendar, Sparkles, Building, Utensils, Bus, CheckCircle2 } from 'lucide-react';

export const TripExpenseEstimator: React.FC = () => {
  const [days, setDays] = useState<number>(2);
  const [travelers, setTravelers] = useState<number>(2);
  const [tier, setTier] = useState<'budget' | 'comfort' | 'family'>('comfort');
  const [includeKatra, setIncludeKatra] = useState<boolean>(true);

  // Daily base costs per traveler by tier (INR)
  const rates = {
    budget: { stay: 350, food: 250, transit: 150 }, // Dharamshala / basic room, dhabas, matadors / shared auto
    comfort: { stay: 900, food: 500, transit: 350 }, // Budget AC hotel / shrine board room, restaurants, autos / bus
    family: { stay: 1800, food: 850, transit: 700 }, // 3-star family room, heritage dining, dedicated cab
  };

  const currentRate = rates[tier];
  const stayCost = currentRate.stay * days * (tier === 'family' ? Math.ceil(travelers / 2) : travelers);
  const foodCost = currentRate.food * days * travelers;
  const transitCost = currentRate.transit * days * travelers + (includeKatra ? (tier === 'family' ? 1800 : 120 * travelers) : 0);
  const miscCost = 150 * days * travelers; // Prasad, entry tickets, shoe tokens

  const grandTotal = stayCost + foodCost + transitCost + miscCost;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
            <BadgeIndianRupee className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-ink text-sm">Trip Expense & Budget Estimator</h3>
            <p className="text-[11px] text-slate-500">Realistic estimates based on official 2026 ground rates</p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
          2026 Tariff Base
        </span>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {/* Days */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Duration</label>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setDays(Math.max(1, days - 1))}
              className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100"
            >
              -
            </button>
            <span className="font-bold text-slate-800 tabular-nums">{days} {days === 1 ? 'Day' : 'Days'}</span>
            <button
              onClick={() => setDays(Math.min(7, days + 1))}
              className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Travelers */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Travelers</label>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setTravelers(Math.max(1, travelers - 1))}
              className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100"
            >
              -
            </button>
            <span className="font-bold text-slate-800 tabular-nums">{travelers} {travelers === 1 ? 'Person' : 'People'}</span>
            <button
              onClick={() => setTravelers(Math.min(10, travelers + 1))}
              className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100"
            >
              +
            </button>
          </div>
        </div>

        {/* Travel Tier */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 col-span-2">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Budget Style</label>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'budget', label: 'Dharamshala' },
              { id: 'comfort', label: 'Comfort Hotel' },
              { id: 'family', label: 'Private Group' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTier(t.id as any)}
                className={`py-1 px-1 rounded-lg text-[10px] font-semibold transition-all ${
                  tier === t.id
                    ? 'bg-primary text-white shadow-2xs font-bold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vaishno Devi Katra Checkbox */}
      <div 
        onClick={() => setIncludeKatra(!includeKatra)}
        className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 cursor-pointer text-xs select-none"
      >
        <input 
          type="checkbox"
          checked={includeKatra}
          onChange={() => {}}
          className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
        />
        <div className="flex-1">
          <span className="font-bold text-amber-950">Include Katra (Vaishno Devi) transit transfer</span>
          <span className="text-[11px] text-amber-800 block">Adds train/bus or prepaid cab fare between Jammu and Katra base</span>
        </div>
      </div>

      {/* Cost Breakdown Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
          <Building className="w-4 h-4 text-primary shrink-0" />
          <div>
            <div className="text-[10px] text-slate-500">Stay / Rooms</div>
            <div className="font-bold text-slate-800">₹{stayCost.toLocaleString()}</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
          <Utensils className="w-4 h-4 text-orange-600 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-500">Food & Prasad</div>
            <div className="font-bold text-slate-800">₹{foodCost.toLocaleString()}</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
          <Bus className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-500">Transit & Auto</div>
            <div className="font-bold text-slate-800">₹{transitCost.toLocaleString()}</div>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-500">Tickets & Misc</div>
            <div className="font-bold text-slate-800">₹{miscCost.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Grand Total Box */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shadow-xs">
        <div>
          <div className="text-[11px] text-emerald-100 uppercase tracking-wider font-semibold">
            Estimated Total for {travelers} {travelers === 1 ? 'Traveler' : 'Travelers'} ({days} {days === 1 ? 'Day' : 'Days'})
          </div>
          <div className="text-xl sm:text-2xl font-bold font-serif tracking-tight">
            ₹{grandTotal.toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-xs font-semibold">
            ~₹{Math.round(grandTotal / travelers).toLocaleString()} / person
          </span>
        </div>
      </div>
    </div>
  );
};
