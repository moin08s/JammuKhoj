import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, CheckCircle2, RotateCcw, Luggage, ShieldCheck, Heart } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: 'docs' | 'clothes' | 'health' | 'gear';
  label: string;
  subtext: string;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  // Documents
  { id: 'c_id', category: 'docs', label: 'Government Photo ID (Original Aadhaar / Voter ID)', subtext: 'Mandatory for free RFID Yatra Card issuance at Katra' },
  { id: 'c_ticket', category: 'docs', label: 'Train / Flight Ticket or PNR copy', subtext: 'Required for station lounge & entry gates' },
  { id: 'c_booking', category: 'docs', label: 'SMVDSB Online Slip (if battery car / room pre-booked)', subtext: 'Printout or downloaded offline PDF' },

  // Clothing
  { id: 'c_shoes', category: 'clothes', label: 'Walking Shoes with good rubber grip', subtext: 'Avoid smooth leather soles on tiled mountain tracks' },
  { id: 'c_socks', category: 'clothes', label: '2-3 Pairs of cotton / cushioned socks', subtext: 'Protects against blisters during continuous walking' },
  { id: 'c_shawl', category: 'clothes', label: 'Light woollen shawl or jacket', subtext: 'Trikuta hills and Patnitop get chilly after sunset (12°C - 18°C)' },
  { id: 'c_poncho', category: 'clothes', label: 'Compact rain poncho or umbrella', subtext: 'Useful for sudden mountain mist or hill showers' },

  // Health
  { id: 'c_meds', category: 'health', label: 'Daily prescription medicines (+3 days buffer)', subtext: 'Keep in hand luggage, not checked bags' },
  { id: 'c_spray', category: 'health', label: 'Pain relief gel / spray & knee brace', subtext: 'Essential for calf stiffness and elder knee support' },
  { id: 'c_ors', category: 'health', label: 'ORS sachets & dry fruits (almonds / dates)', subtext: 'Maintains electrolyte levels during uphill walking' },

  // Gear
  { id: 'c_power', category: 'gear', label: 'Power Bank (10,000 - 20,000 mAh)', subtext: 'Cold air discharges phone batteries faster' },
  { id: 'c_pouch', category: 'gear', label: 'Small sling pouch or waist bag', subtext: 'Large luggage must be deposited in Katra / Bhawan cloakrooms' },
  { id: 'c_bottle', category: 'gear', label: 'Reusable water bottle', subtext: 'Free Shrine Board purified water posts every 500 meters' },
];

export const TripChecklist: React.FC = () => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('jammukhoj_trip_checklist');
      if (saved) setCheckedIds(JSON.parse(saved));
    } catch (_) {}
  }, []);

  const toggleItem = (id: string) => {
    const updated = { ...checkedIds, [id]: !checkedIds[id] };
    setCheckedIds(updated);
    try {
      localStorage.setItem('jammukhoj_trip_checklist', JSON.stringify(updated));
    } catch (_) {}
  };

  const resetAll = () => {
    setCheckedIds({});
    try {
      localStorage.removeItem('jammukhoj_trip_checklist');
    } catch (_) {}
  };

  const total = DEFAULT_CHECKLIST.length;
  const checkedCount = Object.values(checkedIds).filter(Boolean).length;
  const progressPct = Math.round((checkedCount / total) * 100);

  const categories = [
    { key: 'docs', title: '📄 Mandatory Documents', badge: 'Crucial' },
    { key: 'health', title: '💊 Health & Senior Comfort', badge: 'Recommended' },
    { key: 'clothes', title: '👟 Clothing & Trek Footwear', badge: 'Gear' },
    { key: 'gear', title: '🎒 Essentials & Power', badge: 'Handy' },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
      {/* Header & Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center">
            <Luggage className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-ink text-sm">Pilgrim & Yatra Checklist</h3>
            <p className="text-[11px] text-slate-500">Check off items before leaving your home/hotel</p>
          </div>
        </div>

        <button
          onClick={resetAll}
          className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
          title="Reset all checkboxes"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-600 font-medium">
          <span>Packing Readiness</span>
          <span className="font-bold text-primary">{checkedCount} of {total} ({progressPct}%)</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Categorized List */}
      <div className="space-y-4 pt-1">
        {categories.map((cat) => {
          const items = DEFAULT_CHECKLIST.filter((i) => i.category === cat.key);
          return (
            <div key={cat.key} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 border-b border-slate-100 pb-1">
                <span>{cat.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-normal">
                  {items.filter((i) => checkedIds[i.id]).length}/{items.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {items.map((item) => {
                  const isChecked = !!checkedIds[item.id];
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 text-xs select-none ${
                        isChecked
                          ? 'bg-emerald-50/70 border-emerald-300 text-slate-800'
                          : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <button
                        type="button"
                        aria-label={`Mark ${item.label} as ${isChecked ? 'unpacked' : 'packed'}`}
                        className="shrink-0 mt-0.5 text-primary"
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className={`font-semibold ${isChecked ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                          {item.label}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {item.subtext}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
