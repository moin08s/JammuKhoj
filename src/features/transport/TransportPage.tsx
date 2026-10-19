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
  Bus,
  Compass,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { db } from '@/data/db';
import type { FareReference } from '@/data/types';
import { SEED_FARES } from '@/data/seedData';
import { MATADOR_ROUTES, OFFICIAL_TAXI_RATES } from '@/data/matadorRoutesData';
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
import { FareCalculatorWidget } from './FareCalculatorWidget';
import { TransportComparisonMatrix } from './TransportComparisonMatrix';
import { StationQuickRoutes } from './StationQuickRoutes';
import { TransitLiveStatus } from './TransitLiveStatus';

export const TransportPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'matador' | 'taxi_union' | 'prepaid_fares'>('matador');
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

  const filteredMatadorRoutes = MATADOR_ROUTES.filter((r) => {
    const q = searchFilter.toLowerCase();
    return (
      r.routeNumber.toLowerCase().includes(q) ||
      r.routeName.toLowerCase().includes(q) ||
      r.origin.toLowerCase().includes(q) ||
      r.destination.toLowerCase().includes(q) ||
      r.viaStops.some((s) => s.toLowerCase().includes(q))
    );
  });

  const filteredTaxiRates = OFFICIAL_TAXI_RATES.filter((t) => {
    const q = searchFilter.toLowerCase();
    return (
      t.route.toLowerCase().includes(q) ||
      t.authorizedBooth.toLowerCase().includes(q)
    );
  });

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
          Jammu Transit & Fare Directory
        </h2>
        <p className="text-xs text-stone-600">
          Official Govt of J&K tariffs, local Matador bus routes, and anti-surge taxi union rates.
        </p>
      </div>

      <DisclaimerNote kind="fare" />

      {/* Interactive Fare & Distance Calculator */}
      <FareCalculatorWidget />

      {/* Quick Transit Matrix (Matador vs Auto vs Taxi) */}
      <TransportComparisonMatrix />

      {/* From Station & Airport Quick Routes */}
      <StationQuickRoutes />

      {/* Main Mode Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
        <button
          onClick={() => {
            setActiveTab('matador');
            setSearchFilter('');
          }}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === 'matador'
              ? 'bg-[#9E4A0C] text-white shadow-xs'
              : 'text-stone-600 hover:text-ink'
          }`}
        >
          <Bus size={14} />
          <span>Matador Routes</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('taxi_union');
            setSearchFilter('');
          }}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === 'taxi_union'
              ? 'bg-[#9E4A0C] text-white shadow-xs'
              : 'text-stone-600 hover:text-ink'
          }`}
        >
          <Car size={14} />
          <span>Taxi Union Rates</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('prepaid_fares');
            setSearchFilter('');
          }}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
            activeTab === 'prepaid_fares'
              ? 'bg-[#9E4A0C] text-white shadow-xs'
              : 'text-stone-600 hover:text-ink'
          }`}
        >
          <BadgeIndianRupee size={14} />
          <span>Official Tariffs</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder={
            activeTab === 'matador'
              ? 'Search Matador route, destination or via stop...'
              : activeTab === 'taxi_union'
              ? 'Search destination (e.g. Katra, Patnitop, City)...'
              : 'Search tariff benchmark route...'
          }
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EBE4DC] bg-white text-ink text-xs focus:ring-2 focus:ring-[#9E4A0C]/30 focus:outline-none placeholder:text-stone-400"
        />
      </div>

      {/* TAB 1: Matador Route Directory */}
      {activeTab === 'matador' && (
        <div className="space-y-3">
          <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
            <Info size={16} className="text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">What is a Matador?</p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Matadors are Jammu&apos;s iconic local mini-buses running every 3–5 minutes along fixed corridors. Fares range between ₹10 and ₹25. Conductor accepts cash or UPI.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredMatadorRoutes.map((route, i) => (
              <div
                key={i}
                className="bg-white border border-[#EBE4DC] rounded-2xl p-3.5 shadow-xs space-y-2.5 hover:border-[#9E4A0C]/30 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#9E4A0C] text-white text-[11px] font-black">
                        {route.routeNumber}
                      </span>
                      <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">
                        {route.vehicleType}
                      </span>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-ink">{route.routeName}</h4>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-[#9E4A0C]">{route.fareRange}</div>
                    <div className="text-[10px] text-stone-400 font-medium">{route.frequencyMinutes}</div>
                  </div>
                </div>

                {/* Terminus Route */}
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-between text-xs font-semibold text-stone-800">
                  <span className="truncate max-w-[42%] text-[#9E4A0C]">{route.origin}</span>
                  <ArrowRight size={14} className="text-stone-400 shrink-0 mx-1" />
                  <span className="truncate max-w-[42%] text-emerald-800">{route.destination}</span>
                </div>

                {/* Via stops pills */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Key Stops enroute:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {route.viaStops.map((stop, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium"
                      >
                        {stop}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tourist utility advice */}
                <div className="text-[11px] text-stone-600 pt-1 border-t border-stone-100 flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold shrink-0">💡 Tourist Tip:</span>
                  <span>{route.touristUtility}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Official Taxi Union Fixed Rate Card */}
      {activeTab === 'taxi_union' && (
        <div className="space-y-3">
          <div className="p-3 bg-emerald-50 border border-emerald-200/70 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-900">
            <ShieldCheck size={16} className="text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Anti-Surge Prepaid Guarantee</p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Rates below are fixed by the Jammu Taxi Union & Traffic Police. Toll taxes are pre-included. Always insist on an official computer-generated receipt at the Police Prepaid Booth.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredTaxiRates.map((taxi) => (
              <div
                key={taxi.id}
                className="bg-white border border-[#EBE4DC] rounded-2xl p-3.5 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <h4 className="font-heading font-bold text-sm text-ink">{taxi.route}</h4>
                    <div className="text-[10px] text-stone-500 flex items-center gap-1">
                      <MapPin size={11} className="text-[#9E4A0C]" />
                      <span>{taxi.authorizedBooth}</span>
                    </div>
                  </div>
                  <a
                    href={`tel:${taxi.contactNumber.replace(/[^0-9]/g, '')}`}
                    className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center gap-1 text-[11px] font-bold shrink-0"
                  >
                    <PhoneCall size={12} />
                    <span>Call Booth</span>
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/60 text-center">
                    <div className="text-[10px] text-stone-500 font-semibold uppercase">Sedan / Hatch</div>
                    <div className="text-sm font-black text-ink">{taxi.oneWaySedan}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50/50 border border-amber-200/60 text-center">
                    <div className="text-[10px] text-amber-800 font-semibold uppercase">Innova / Ertiga</div>
                    <div className="text-sm font-black text-[#9E4A0C]">{taxi.oneWayInnova}</div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-stone-50 text-[11px] text-stone-600 space-y-1">
                  <div><strong>Round Trip / Sightseeing:</strong> {taxi.roundTrip}</div>
                  <div><strong>Night Policy:</strong> {taxi.nightSurcharge}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900 space-y-1">
            <div className="font-bold flex items-center gap-1 text-red-700">
              <AlertTriangle size={14} />
              <span>Grievance & Overcharging Reporting</span>
            </div>
            <p className="text-[11px]">
              If a driver overcharges, note the vehicle number and call Jammu Traffic Police Control: <strong>0191-2459048</strong> or dial emergency <strong>112</strong>.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: Prepaid Tariffs */}
      {activeTab === 'prepaid_fares' && (
        <div className="space-y-3">
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
                            At Jammu Tawi Station, book via the Jammu Police-manned Prepaid Taxi Booth at Platform 1 exit.
                          </li>
                          <li>
                            For Katra trips, drivers are prohibited from charging return tolls or hidden waiting fees.
                          </li>
                          <li>
                            Shared E-Rickshaws operate along Shalamar-BC Road at flat ₹15–20 per seat.
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Train, Airport Flight & Helicopter Status */}
      <TransitLiveStatus />

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
            <strong>• Matador Mini-Buses:</strong> Routes #1, #2, #3, and #7 connect Tawi Station to Indira Chowk, Jewel, and Old City Heritage gates every 3 minutes (₹10–15 cash).
          </p>
          <p>
            <strong>• Vande Bharat Express:</strong> Departs New Delhi at 06:00 AM, arriving Jammu Tawi at 12:40 PM and Shri Mata Vaishno Devi Katra at 14:00 PM.
          </p>
        </div>
      </section>
    </div>
  );
};
