import React, { useState } from 'react';
import {
  Globe,
  MapPin,
  Compass,
  Star,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Layers,
  Sparkles,
  BarChart3,
  Award,
  Zap,
  Info,
  ChevronRight,
  Bus,
  Volume2,
} from 'lucide-react';

interface CityBenchmarkData {
  name: string;
  country: string;
  type: 'indian' | 'foreign';
  flag: string;
  walkabilityScore: number;
  transitClarityScore: number;
  audioGuideScore: number;
  antiOverchargingScore: number;
  offlineReadinessScore: number;
  keyInnovation: string;
  topAppBenchmark: string;
  jammuKhojAdoption: string;
}

const BENCHMARK_CITIES: CityBenchmarkData[] = [
  // Indian Cities
  {
    name: 'Jammu',
    country: 'India (J&K)',
    type: 'indian',
    flag: '🇮🇳',
    walkabilityScore: 78,
    transitClarityScore: 88,
    audioGuideScore: 92,
    antiOverchargingScore: 90,
    offlineReadinessScore: 98,
    keyInnovation: 'Offline-first GIS, Matador route directory, live device GPS/battery telemetry, and GI artisan registry',
    topAppBenchmark: 'JammuKhoj (v2.0)',
    jammuKhojAdoption: 'Native implementation with full offline capability, zero-login required',
  },
  {
    name: 'Varanasi',
    country: 'India (UP)',
    type: 'indian',
    flag: '🇮🇳',
    walkabilityScore: 82,
    transitClarityScore: 74,
    audioGuideScore: 70,
    antiOverchargingScore: 68,
    offlineReadinessScore: 62,
    keyInnovation: 'Smart City Ghat navigation signage & e-boat QR ticketing',
    topAppBenchmark: 'Kashi Yatra / Smart Varanasi',
    jammuKhojAdoption: 'Adopted: Fixed union tariffs and verified aarti timings cards',
  },
  {
    name: 'Amritsar',
    country: 'India (Punjab)',
    type: 'indian',
    flag: '🇮🇳',
    walkabilityScore: 90,
    transitClarityScore: 80,
    audioGuideScore: 75,
    antiOverchargingScore: 78,
    offlineReadinessScore: 65,
    keyInnovation: 'Heritage street pedestrianization around Golden Temple & free e-shuttles',
    topAppBenchmark: 'Amritsar Smart City',
    jammuKhojAdoption: 'Adopted: Pedestrian zone indicators and locker/footwear counter guides',
  },
  {
    name: 'Jaipur',
    country: 'India (Rajasthan)',
    type: 'indian',
    flag: '🇮🇳',
    walkabilityScore: 80,
    transitClarityScore: 78,
    audioGuideScore: 85,
    antiOverchargingScore: 72,
    offlineReadinessScore: 70,
    keyInnovation: 'Composite monument entry smart pass & government QR audio tour kiosks',
    topAppBenchmark: 'Rajasthan Tourism App',
    jammuKhojAdoption: 'Adopted: Multilingual spoken audio narration and single-tap transcripts',
  },
  {
    name: 'Srinagar',
    country: 'India (J&K)',
    type: 'indian',
    flag: '🇮🇳',
    walkabilityScore: 74,
    transitClarityScore: 72,
    audioGuideScore: 68,
    antiOverchargingScore: 65,
    offlineReadinessScore: 72,
    keyInnovation: 'Dal Lake Shikara union fixed rate signage & Smart City electric bus line',
    topAppBenchmark: 'JK Tourism Portal',
    jammuKhojAdoption: 'Adopted: Transparent tariff bands and grievance hotline directly linked to 112',
  },
  {
    name: 'Tirupati',
    country: 'India (Andhra)',
    type: 'indian',
    flag: '🇮🇳',
    walkabilityScore: 85,
    transitClarityScore: 92,
    audioGuideScore: 78,
    antiOverchargingScore: 88,
    offlineReadinessScore: 80,
    keyInnovation: 'Live darshan queue wait tracking, slotted biometric tokens, and pure prasad safety audits',
    topAppBenchmark: 'TTD Devasthanams App',
    jammuKhojAdoption: 'Adopted: Temple Darshan rules, dress code modal, and shoe locker locator',
  },
  {
    name: 'Agra',
    country: 'India (UP)',
    type: 'indian',
    flag: '🇮🇳',
    walkabilityScore: 72,
    transitClarityScore: 70,
    audioGuideScore: 82,
    antiOverchargingScore: 60,
    offlineReadinessScore: 65,
    keyInnovation: 'ASI turnstile QR entry and golf-cart zero-emission transit zone',
    topAppBenchmark: 'Incredible India ASI Guide',
    jammuKhojAdoption: 'Adopted: Step-by-step shrine entrance procedures to avoid unauthorized guides',
  },
  {
    name: 'Udaipur',
    country: 'India (Rajasthan)',
    type: 'indian',
    flag: '🇮🇳',
    walkabilityScore: 86,
    transitClarityScore: 75,
    audioGuideScore: 80,
    antiOverchargingScore: 76,
    offlineReadinessScore: 68,
    keyInnovation: 'Curated royal heritage walking trails and solar boat ferry timetables',
    topAppBenchmark: 'City Palace Udaipur App',
    jammuKhojAdoption: 'Adopted: Dogri Food Trail and curated historic palace walks',
  },
  {
    name: 'Mysore',
    country: 'India (Karnataka)',
    type: 'indian',
    flag: '🇮🇳',
    walkabilityScore: 88,
    transitClarityScore: 85,
    audioGuideScore: 84,
    antiOverchargingScore: 82,
    offlineReadinessScore: 75,
    keyInnovation: 'Multilingual palace headphone audio sets & illuminated night tours',
    topAppBenchmark: 'Mysore Tourism Board',
    jammuKhojAdoption: 'Adopted: High-contrast night theme and Dogri/Hindi/English voice player',
  },
  {
    name: 'Kochi',
    country: 'India (Kerala)',
    type: 'indian',
    flag: '🇮🇳',
    walkabilityScore: 84,
    transitClarityScore: 94,
    audioGuideScore: 82,
    antiOverchargingScore: 88,
    offlineReadinessScore: 78,
    keyInnovation: 'Water Metro unified transit card integrated with electric feeders',
    topAppBenchmark: 'Kochi1 Unified Transit',
    jammuKhojAdoption: 'Adopted: Multi-modal transit guide (Matadors, E-Buses, Taxis)',
  },

  // Foreign Cities
  {
    name: 'Kyoto',
    country: 'Japan',
    type: 'foreign',
    flag: '🇯🇵',
    walkabilityScore: 96,
    transitClarityScore: 98,
    audioGuideScore: 94,
    antiOverchargingScore: 99,
    offlineReadinessScore: 92,
    keyInnovation: '“Akimahen” tourist cultural etiquette visual signs, silent zones in shrines, bus day-pass zones',
    topAppBenchmark: 'Kyoto Official Travel Guide',
    jammuKhojAdoption: 'Adopted: Temple etiquette modal with clear visual dress code & photo rules',
  },
  {
    name: 'Rome',
    country: 'Italy',
    type: 'foreign',
    flag: '🇮🇳',
    walkabilityScore: 92,
    transitClarityScore: 88,
    audioGuideScore: 96,
    antiOverchargingScore: 80,
    offlineReadinessScore: 85,
    keyInnovation: 'Rick Steves audio walks synced to GPS steps, basilica dress code enforcement',
    topAppBenchmark: 'Rick Steves Audio Europe / RomaPass',
    jammuKhojAdoption: 'Adopted: Spoken voice tour with real-time text transcript tracking',
  },
  {
    name: 'Florence',
    country: 'Italy',
    type: 'foreign',
    flag: '🇮🇹',
    walkabilityScore: 98,
    transitClarityScore: 90,
    audioGuideScore: 95,
    antiOverchargingScore: 84,
    offlineReadinessScore: 82,
    keyInnovation: 'Compact pedestrianized historic center with geo-fenced artisan craft workshops',
    topAppBenchmark: 'Firenze The Heart of the Renaissance',
    jammuKhojAdoption: 'Adopted: GI-Tagged Artisan Showcase with direct artisan contact',
  },
  {
    name: 'Bangkok',
    country: 'Thailand',
    type: 'foreign',
    flag: '🇹🇭',
    walkabilityScore: 76,
    transitClarityScore: 90,
    audioGuideScore: 82,
    antiOverchargingScore: 78,
    offlineReadinessScore: 74,
    keyInnovation: 'Chao Phraya Express river boat color-coded lines and verified street food stall certifications',
    topAppBenchmark: 'Grab / Amazing Thailand',
    jammuKhojAdoption: 'Adopted: Dogri Culinary Trail with street food stall ratings & recommendations',
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    type: 'foreign',
    flag: '🇪🇸',
    walkabilityScore: 95,
    transitClarityScore: 96,
    audioGuideScore: 92,
    antiOverchargingScore: 88,
    offlineReadinessScore: 88,
    keyInnovation: 'Superblocks (superilles) pedestrian zones, T-Casual multi-journey transit card',
    topAppBenchmark: 'TMB Barcelona / Citymapper',
    jammuKhojAdoption: 'Adopted: Clear Matador route numbering and fare stages',
  },
  {
    name: 'Dubai',
    country: 'UAE',
    type: 'foreign',
    flag: '🇦🇪',
    walkabilityScore: 68,
    transitClarityScore: 98,
    audioGuideScore: 90,
    antiOverchargingScore: 99,
    offlineReadinessScore: 88,
    keyInnovation: 'RTA smart meter taxis with anti-surge automated dispute resolution',
    topAppBenchmark: 'Visit Dubai / S’hail Transit',
    jammuKhojAdoption: 'Adopted: Official Police prepaid booth contact numbers & grievance hotline',
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    type: 'foreign',
    flag: '🇸🇬',
    walkabilityScore: 94,
    transitClarityScore: 99,
    audioGuideScore: 92,
    antiOverchargingScore: 100,
    offlineReadinessScore: 90,
    keyInnovation: 'Hawker Center hygiene A-grade licensing & contactless transit open loop tap',
    topAppBenchmark: 'MyTransport.SG / VisitSingapore',
    jammuKhojAdoption: 'Adopted: Pure vegetarian & hygienic eatery badge indicators',
  },
  {
    name: 'Istanbul',
    country: 'Turkey',
    type: 'foreign',
    flag: '🇹🇷',
    walkabilityScore: 88,
    transitClarityScore: 92,
    audioGuideScore: 88,
    antiOverchargingScore: 75,
    offlineReadinessScore: 80,
    keyInnovation: 'Istanbulkart intermodal transit connecting European and Asian ferry docks',
    topAppBenchmark: 'Mobiett / Istanbul Guide',
    jammuKhojAdoption: 'Adopted: Inter-nodal routing linking Tawi Station, Airport, and Katra Base',
  },
  {
    name: 'Edinburgh',
    country: 'UK',
    type: 'foreign',
    flag: '🇬🇧',
    walkabilityScore: 96,
    transitClarityScore: 94,
    audioGuideScore: 95,
    antiOverchargingScore: 95,
    offlineReadinessScore: 86,
    keyInnovation: 'Royal Mile historical storytelling trails with ghost & literary audio maps',
    topAppBenchmark: 'Edinburgh City Audio Guide',
    jammuKhojAdoption: 'Adopted: Local Dogri folklore and royal stories for Mubarak Mandi & Bahu Fort',
  },
  {
    name: 'Prague',
    country: 'Czechia',
    type: 'foreign',
    flag: '🇨🇿',
    walkabilityScore: 95,
    transitClarityScore: 96,
    audioGuideScore: 90,
    antiOverchargingScore: 82,
    offlineReadinessScore: 84,
    keyInnovation: 'Historic Tram #22 scenic route guide and anti-tourist scam money-exchange maps',
    topAppBenchmark: 'Prague PID Lítačka / Honest Guide',
    jammuKhojAdoption: 'Adopted: Anti-scam pilgrim safeguards and transparent official fare cards',
  },
];

export const CityAnalysisPage: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'indian' | 'foreign'>('all');
  const [selectedCity, setSelectedCity] = useState<CityBenchmarkData | null>(BENCHMARK_CITIES[0]);

  const filteredCities = BENCHMARK_CITIES.filter((city) => {
    if (filterType === 'all') return true;
    return city.type === filterType;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-[#9E4A0C]/10 text-[#9E4A0C]">
            <Globe size={18} />
          </span>
          <h2 className="font-heading text-xl font-bold text-ink">
            Global & Indian Tourism City Analysis
          </h2>
        </div>
        <p className="text-xs text-stone-600">
          Cross-city benchmark of 20 world heritage cities, app innovations, and how JammuKhoj adopts the best international standards.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-2xl border border-stone-200">
        {[
          { key: 'all', label: 'All 20 World Cities' },
          { key: 'indian', label: 'Top 10 Indian Heritage Cities' },
          { key: 'foreign', label: 'Top 10 Foreign Global Cities' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterType(tab.key as any)}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
              filterType === tab.key
                ? 'bg-[#9E4A0C] text-white shadow-xs'
                : 'text-stone-600 hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* JammuKhoj Distinctive Positioning Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1C1917] via-stone-900 to-amber-950 text-white space-y-3 shadow-lg border border-stone-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
              Benchmark Standard
            </span>
            <span className="text-xs font-bold text-stone-300">JammuKhoj Ecosystem</span>
          </div>
          <Award size={18} className="text-amber-400" />
        </div>

        <div>
          <h3 className="font-heading font-black text-lg text-amber-200 leading-tight">
            Synthesizing Kyoto’s Etiquette + Citymapper’s Transit
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed mt-1">
            JammuKhoj bridges global features (spoken audio walks, strict anti-overcharging rate cards, dress code protocols) with India-specific pilgrim requirements (offline-first, live device GPS/battery monitoring, and GI craft verification).
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-stone-800 text-center">
          <div className="p-2 rounded-xl bg-stone-800/60">
            <div className="text-[10px] text-stone-400 font-medium">Offline GIS</div>
            <div className="text-sm font-black text-emerald-400">98 / 100</div>
          </div>
          <div className="p-2 rounded-xl bg-stone-800/60">
            <div className="text-[10px] text-stone-400 font-medium">Anti-Surge Fares</div>
            <div className="text-sm font-black text-amber-300">90 / 100</div>
          </div>
          <div className="p-2 rounded-xl bg-stone-800/60">
            <div className="text-[10px] text-stone-400 font-medium">Voice Audio Guides</div>
            <div className="text-sm font-black text-sky-400">92 / 100</div>
          </div>
        </div>
      </div>

      {/* City Comparison Grid / Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
          <span>Comparative City Benchmarks ({filteredCities.length} Cities)</span>
          <span>Tap city to expand details</span>
        </div>

        {filteredCities.map((city, idx) => {
          const isSelected = selectedCity?.name === city.name;

          return (
            <div
              key={idx}
              onClick={() => setSelectedCity(isSelected ? null : city)}
              className={`bg-white border rounded-2xl overflow-hidden shadow-xs cursor-pointer transition-all ${
                isSelected ? 'border-[#9E4A0C] ring-2 ring-[#9E4A0C]/15' : 'border-[#EBE4DC] hover:border-stone-300'
              }`}
            >
              <div className="p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-xl shrink-0">
                    {city.flag}
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-heading font-bold text-sm text-ink truncate">
                        {city.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-stone-100 text-stone-600 font-medium">
                        {city.country}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 truncate">
                      {city.keyInnovation}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-black text-[#9E4A0C]">
                    {Math.round(
                      (city.walkabilityScore +
                        city.transitClarityScore +
                        city.audioGuideScore +
                        city.antiOverchargingScore +
                        city.offlineReadinessScore) /
                        5
                    )}
                    /100
                  </div>
                  <div className="text-[10px] text-stone-400">Overall Index</div>
                </div>
              </div>

              {isSelected && (
                <div className="p-3.5 pt-0 border-t border-[#F1E9E0] bg-stone-50/50 space-y-3 text-xs animate-in fade-in">
                  {/* Scores Metrics Bar */}
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-bold text-ink uppercase tracking-wider text-stone-500">
                      Feature Capability Breakdown:
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <div className="flex justify-between text-stone-600 mb-0.5">
                          <span>Walkability:</span>
                          <span className="font-bold text-ink">{city.walkabilityScore}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-stone-200 overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${city.walkabilityScore}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-stone-600 mb-0.5">
                          <span>Transit Clarity:</span>
                          <span className="font-bold text-ink">{city.transitClarityScore}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-stone-200 overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${city.transitClarityScore}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-stone-600 mb-0.5">
                          <span>Audio Guides:</span>
                          <span className="font-bold text-ink">{city.audioGuideScore}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-stone-200 overflow-hidden">
                          <div
                            className="h-full bg-purple-600 rounded-full"
                            style={{ width: `${city.audioGuideScore}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-stone-600 mb-0.5">
                          <span>Anti-Overcharging:</span>
                          <span className="font-bold text-ink">{city.antiOverchargingScore}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-stone-200 overflow-hidden">
                          <div
                            className="h-full bg-amber-600 rounded-full"
                            style={{ width: `${city.antiOverchargingScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Benchmark App */}
                  <div className="p-2.5 rounded-xl bg-white border border-[#EBE4DC] space-y-1">
                    <div className="text-[11px]">
                      <strong>Benchmark App:</strong> {city.topAppBenchmark}
                    </div>
                    <div className="text-[11px]">
                      <strong>Key Innovation:</strong> {city.keyInnovation}
                    </div>
                  </div>

                  {/* JammuKhoj Integration Strategy */}
                  <div className="p-2.5 rounded-xl bg-[#FAF6F0] border border-[#F3D7C5] text-[11px] text-[#9E4A0C] space-y-0.5">
                    <strong>JammuKhoj Integration:</strong>
                    <p className="text-stone-700">{city.jammuKhojAdoption}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
