import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Car,
  BadgeIndianRupee,
  ShieldCheck,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  PhoneCall,
  Search,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { db } from '@/data/db';
import type { FareReference } from '@/data/types';
import { SEED_FARES } from '@/data/seedData';
import { SourceBadge } from '@/ui/trust/SourceBadge';
import { FreshnessChip } from '@/ui/trust/FreshnessChip';
import { DisclaimerNote } from '@/ui/DisclaimerNote';
import {
  TaxiIcon,
  PrivateCarIcon,
  CityBusIcon,
  AutoRickshawIcon,
  ExpressTrainIcon,
} from '@/ui/icons/TransitIcons';

export const TransportPage: React.FC = () => {
  const { t } = useTranslation();
  const [fares, setFares] = useState<FareReference[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    db.fareReferences.toArray().then((data) => {
      setFares(data && data.length > 0 ? data : SEED_FARES);
    });
  }, []);

  const getVehicleIcon = (vehicleName: string) => {
    const v = vehicleName.toLowerCase();
    if (v.includes('taxi')) return <TaxiIcon size={20} color="#9E4A0C" />;
    if (v.includes('bus') || v.includes('matador')) return <CityBusIcon size={20} color="#2563EB" />;
    if (v.includes('auto') || v.includes('rickshaw')) return <AutoRickshawIcon size={20} color="#D97706" />;
    if (v.includes('train')) return <ExpressTrainIcon size={20} color="#085444" />;
    return <PrivateCarIcon size={20} color="#085444" />;
  };

  const filteredFares = fares.filter((f) => {
    const matchesSearch =
      f.routePairId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      f.vehicle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      f.conditions.toLowerCase().includes(searchFilter.toLowerCase());

    if (!matchesSearch) return false;
    if (vehicleFilter === 'all') return true;
    if (vehicleFilter === 'taxi') return f.vehicle.toLowerCase().includes('taxi');
    if (vehicleFilter === 'car') return f.vehicle.toLowerCase().includes('car');
    if (vehicleFilter === 'bus') return f.vehicle.toLowerCase().includes('bus');
    if (vehicleFilter === 'auto') return f.vehicle.toLowerCase().includes('auto') || f.vehicle.toLowerCase().includes('rickshaw');
    return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-heading text-xl font-bold text-ink">
          Prepaid Transit & Fare Benchmarks
        </h2>
        <p className="text-xs text-stone-600">
          Official Govt of J&K tariffs and anti-surge benchmarks for taxis, cars, e-buses, and autos.
        </p>
      </div>

      <DisclaimerNote kind="fare" />

      {/* Vehicle Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { key: 'all', label: 'All Modes', icon: null },
          { key: 'taxi', label: 'Taxi', icon: <TaxiIcon size={14} /> },
          { key: 'car', label: 'Car / Cab', icon: <PrivateCarIcon size={14} /> },
          { key: 'bus', label: 'E-Bus / Matador', icon: <CityBusIcon size={14} /> },
          { key: 'auto', label: 'Auto / E-Rickshaw', icon: <AutoRickshawIcon size={14} /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setVehicleFilter(tab.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              vehicleFilter === tab.key
                ? 'bg-[#9E4A0C] text-white shadow-xs'
                : 'bg-white border border-[#EBE4DC] text-stone-600 hover:text-ink'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Search route (e.g., Station, Katra, Bahu, Airport)..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EBE4DC] bg-white text-ink text-xs focus:ring-2 focus:ring-[#9E4A0C]/30 focus:outline-none placeholder:text-stone-400"
        />
      </div>

      {/* Fare Cards */}
      <div className="space-y-2.5">
        {filteredFares.map((fare) => {
          const isExpanded = expandedId === fare.id;
          const min = fare.amount.min;
          const max = fare.amount.max;
          const fareDisplay = min && max ? `₹${min} – ₹${max}` : min ? `₹${min}` : 'Metered';

          return (
            <div
              key={fare.id}
              className="bg-white border border-[#EBE4DC] rounded-2xl overflow-hidden shadow-sm transition-all"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : fare.id)}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-stone-50 select-none gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#FCEFE7] border border-[#F3D7C5] flex items-center justify-center shrink-0 mt-0.5">
                    {getVehicleIcon(fare.vehicle)}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-heading text-sm font-bold text-ink">
                        {fare.vehicle}
                      </span>
                      <SourceBadge type={fare.sourceType} />
                    </div>
                    <div className="text-xs font-semibold text-[#9E4A0C] truncate">
                      {fare.routePairId}
                    </div>
                    <div className="text-[11px] text-stone-500 truncate">
                      {fare.conditions}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <div className="font-heading text-base font-black text-[#9E4A0C] tabular-nums">
                      {fareDisplay}
                    </div>
                    <div className="text-[10px] text-stone-500">Official band</div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-stone-400" />
                  ) : (
                    <ChevronDown size={16} className="text-stone-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="p-3.5 pt-0 border-t border-[#F1E9E0] space-y-3 bg-stone-50/50 text-xs text-stone-600 animate-in fade-in">
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <span className="text-[11px] font-semibold text-ink">
                      Verification Status:
                    </span>
                    <FreshnessChip
                      verifiedOn={fare.verification.verifiedOn}
                      reviewDueOn={fare.reviewDueOn}
                    />
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-[#EBE4DC] text-[11px] space-y-1">
                    <div>
                      <strong>Survey Basis:</strong> {fare.basis.replace(/_/g, ' ')}
                    </div>
                    <div>
                      <strong>Data Authority:</strong> {fare.source.name}
                    </div>
                    <div>
                      <strong>Last Audited:</strong> {fare.updatedAt}
                    </div>
                  </div>

                  {/* Anti-Scam Verification Tips */}
                  <div className="space-y-1">
                    <div className="font-bold text-ink flex items-center gap-1.5 text-xs">
                      <ShieldCheck size={14} className="text-[#15803D]" />
                      <span>Pilgrim & Commuter Safeguards</span>
                    </div>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                      <li>
                        At Jammu Tawi Station, only book via the official Jammu Police-manned Prepaid Taxi Booth at Platform 1 exit.
                      </li>
                      <li>
                        For Katra trips, drivers are prohibited from charging return tolls or hidden waiting fees.
                      </li>
                      <li>
                        Shared E-Rickshaws operate along Shalamar-BC Road at flat ₹15–20 per seat.
                      </li>
                    </ul>
                  </div>

                  {/* Complaint & Overcharging Hotline */}
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-[11px] space-y-1 text-red-900">
                    <div className="font-bold flex items-center gap-1 text-red-700">
                      <AlertTriangle size={13} />
                      <span>Overcharging Grievance Cell:</span>
                    </div>
                    <p>
                      If a driver refuses the prepaid voucher or overcharges, record their registration plate and dial <strong>112</strong> or Jammu Traffic Control at <strong>0191-2459048</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Transit Network Reference Card */}
      <section className="bg-white border border-[#EBE4DC] rounded-2xl p-4 space-y-2.5 shadow-sm text-xs">
        <h4 className="font-heading text-sm font-bold text-ink flex items-center gap-2">
          <CityBusIcon size={16} color="#9E4A0C" />
          <span>Jammu Public Transit Network Guide</span>
        </h4>
        <div className="text-stone-600 space-y-2 text-[11px] leading-relaxed">
          <p>
            <strong>• Jammu Smart City E-Buses:</strong> Fully air-conditioned electric buses operate every 10–15 mins linking Jammu Tawi Station, General Bus Stand, Airport, and Katra base. Flat digital ticketing from ₹15.
          </p>
          <p>
            <strong>• Matador Mini-Buses:</strong> Routes #2, #3, and #7 connect Tawi Station to Indira Chowk, Jewel, and Old City Heritage gates every 3 minutes (₹10–15 cash).
          </p>
          <p>
            <strong>• Vande Bharat Express:</strong> Departs New Delhi at 06:00 AM, arriving Jammu Tawi at 12:40 PM and Shri Mata Vaishno Devi Katra at 14:00 PM.
          </p>
        </div>
      </section>
    </div>
  );
};
