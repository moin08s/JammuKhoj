import React, { useState } from 'react';
import { 
  Users, Clock, AlertTriangle, ShieldCheck, Info, ChevronRight, 
  MapPin, RefreshCw, Compass, Heart, Bell
} from 'lucide-react';

export interface TempleHourlyForecast {
  hour: string; // e.g., '06:00', '08:00', ...
  crowdLevel: 'peaceful' | 'moderate' | 'brisk' | 'regulated';
  waitingMinutes: number;
  comfortScore: number; // 0 - 100
  recommendation: string;
}

export interface TempleSanctumRadar {
  id: string;
  name: string;
  location: string;
  currentComfortScore: number; // 0-100 (100 is best/most peaceful)
  status: 'peaceful' | 'moderate' | 'brisk' | 'regulated';
  avgDarshanWaitMins: number;
  sanctumPacing: string;
  peakWindow: string;
  bestVisitingWindow: string;
  forecast: TempleHourlyForecast[];
  liveAdvisory: string;
}

export const DARSHAN_RADAR_DATA: TempleSanctumRadar[] = [
  {
    id: 'vaishno-devi-bhawan',
    name: 'Mata Vaishno Devi Bhawan',
    location: 'Trikuta Hills, Katra (Elev. 5,200 ft)',
    currentComfortScore: 68,
    status: 'moderate',
    avgDarshanWaitMins: 45,
    sanctumPacing: '70 pilgrims/min through Holy Cave Complex',
    peakWindow: '18:00 - 21:00 (Aarti & Evening Surge)',
    bestVisitingWindow: '04:00 - 06:30 & 13:00 - 15:30',
    liveAdvisory: 'Normal darshan queue flow at Gate 3. Battery cars operational between Ardhkuwari and Bhawan.',
    forecast: [
      { hour: '06:00', crowdLevel: 'peaceful', waitingMinutes: 20, comfortScore: 88, recommendation: 'Optimal early morning darshan' },
      { hour: '08:00', crowdLevel: 'moderate', waitingMinutes: 35, comfortScore: 75, recommendation: 'Good flow, morning batch entry' },
      { hour: '10:00', crowdLevel: 'brisk', waitingMinutes: 50, comfortScore: 60, recommendation: 'Expect holding shed wait at Gate 2' },
      { hour: '12:00', crowdLevel: 'moderate', waitingMinutes: 40, comfortScore: 70, recommendation: 'Midday lull between trek groups' },
      { hour: '14:00', crowdLevel: 'peaceful', waitingMinutes: 25, comfortScore: 84, recommendation: 'Recommended afternoon slot' },
      { hour: '16:00', crowdLevel: 'brisk', waitingMinutes: 55, comfortScore: 55, recommendation: 'Queue building for evening Aarti' },
      { hour: '18:00', crowdLevel: 'regulated', waitingMinutes: 80, comfortScore: 35, recommendation: 'Evening Aarti pause & VQC holding' },
      { hour: '20:00', crowdLevel: 'brisk', waitingMinutes: 60, comfortScore: 50, recommendation: 'Post-Aarti surge clearing' },
      { hour: '22:00', crowdLevel: 'moderate', waitingMinutes: 30, comfortScore: 78, recommendation: 'Quiet night darshan window' },
    ]
  },
  {
    id: 'raghunath-mandir',
    name: 'Historic Raghunath Temple',
    location: 'Jammu Old City Center',
    currentComfortScore: 85,
    status: 'peaceful',
    avgDarshanWaitMins: 15,
    sanctumPacing: 'Steady unrestricted courtyard darshan',
    peakWindow: '09:00 - 11:30 & 18:30 - 20:00',
    bestVisitingWindow: '07:00 - 09:00 & 14:00 - 17:00',
    liveAdvisory: 'Spacious parikrama flow across all 7 sanctum shrines. Locker facility open at Main North Gate.',
    forecast: [
      { hour: '06:00', crowdLevel: 'peaceful', waitingMinutes: 5, comfortScore: 95, recommendation: 'Serene morning Mangala prayer' },
      { hour: '08:00', crowdLevel: 'peaceful', waitingMinutes: 10, comfortScore: 90, recommendation: 'Pleasant courtyard breeze' },
      { hour: '10:00', crowdLevel: 'moderate', waitingMinutes: 20, comfortScore: 75, recommendation: 'Local morning worshipers visiting' },
      { hour: '12:00', crowdLevel: 'peaceful', waitingMinutes: 10, comfortScore: 88, recommendation: 'Calm midday atmosphere' },
      { hour: '14:00', crowdLevel: 'peaceful', waitingMinutes: 8, comfortScore: 92, recommendation: 'Very quiet, ideal for elders' },
      { hour: '16:00', crowdLevel: 'moderate', waitingMinutes: 15, comfortScore: 80, recommendation: 'Pilgrim tour buses arriving' },
      { hour: '18:00', crowdLevel: 'brisk', waitingMinutes: 30, comfortScore: 65, recommendation: 'Grand evening Aarti gathering' },
      { hour: '20:00', crowdLevel: 'peaceful', waitingMinutes: 12, comfortScore: 86, recommendation: 'Peaceful illuminated parikrama' },
      { hour: '22:00', crowdLevel: 'peaceful', waitingMinutes: 5, comfortScore: 96, recommendation: 'Pre-closing peaceful environment' },
    ]
  },
  {
    id: 'bawe-wali-mata',
    name: 'Bahu Fort & Bawe Wali Mata',
    location: 'Bahu Fort Cliff, Overlooking Tawi River',
    currentComfortScore: 72,
    status: 'moderate',
    avgDarshanWaitMins: 25,
    sanctumPacing: 'Brisk ramp entry; strict one-way temple exit',
    peakWindow: 'Tuesdays/Sundays all day; daily 17:30 - 19:30',
    bestVisitingWindow: '06:00 - 08:30 & 12:00 - 15:00',
    liveAdvisory: 'Moderate queue on fort ramp. Garden promenades open with clear scenic views over the Tawi valley.',
    forecast: [
      { hour: '06:00', crowdLevel: 'peaceful', waitingMinutes: 10, comfortScore: 92, recommendation: 'Sunrise view over Tawi River' },
      { hour: '08:00', crowdLevel: 'moderate', waitingMinutes: 20, comfortScore: 80, recommendation: 'Devotee morning queues moving briskly' },
      { hour: '10:00', crowdLevel: 'moderate', waitingMinutes: 25, comfortScore: 74, recommendation: 'Steady ramp entry' },
      { hour: '12:00', crowdLevel: 'peaceful', waitingMinutes: 15, comfortScore: 86, recommendation: 'Sun overhead, lighter queue' },
      { hour: '14:00', crowdLevel: 'peaceful', waitingMinutes: 15, comfortScore: 88, recommendation: 'Comfortable family visits' },
      { hour: '16:00', crowdLevel: 'moderate', waitingMinutes: 30, comfortScore: 70, recommendation: 'Garden visitors entering temple' },
      { hour: '18:00', crowdLevel: 'brisk', waitingMinutes: 45, comfortScore: 58, recommendation: 'Evening twilight rush' },
      { hour: '20:00', crowdLevel: 'moderate', waitingMinutes: 20, comfortScore: 82, recommendation: 'Pleasant evening breeze' },
      { hour: '22:00', crowdLevel: 'peaceful', waitingMinutes: 10, comfortScore: 90, recommendation: 'Gates closing soon' },
    ]
  },
  {
    id: 'shiv-khori',
    name: 'Shiv Khori Cave Sanctum',
    location: 'Ransoo, Reasi District (Elev. 4,300 ft)',
    currentComfortScore: 61,
    status: 'brisk',
    avgDarshanWaitMins: 50,
    sanctumPacing: 'Single-file 150m limestone natural tunnel',
    peakWindow: '11:00 - 15:30 (Tour bus arrivals from Katra)',
    bestVisitingWindow: '06:00 - 09:00 & 16:30 - 18:30',
    liveAdvisory: 'Cave tunnel is strictly single-file. Please wear non-slip footwear inside wet limestone pathways.',
    forecast: [
      { hour: '06:00', crowdLevel: 'peaceful', waitingMinutes: 15, comfortScore: 90, recommendation: 'Easiest cave passage slot' },
      { hour: '08:00', crowdLevel: 'moderate', waitingMinutes: 25, comfortScore: 80, recommendation: 'Early trekkers reaching mouth' },
      { hour: '10:00', crowdLevel: 'brisk', waitingMinutes: 45, comfortScore: 62, recommendation: 'Main tourist buses arriving' },
      { hour: '12:00', crowdLevel: 'regulated', waitingMinutes: 65, comfortScore: 40, recommendation: 'Peak cave choke point holding' },
      { hour: '14:00', crowdLevel: 'brisk', waitingMinutes: 50, comfortScore: 55, recommendation: 'Pony return groups entering' },
      { hour: '16:00', crowdLevel: 'moderate', waitingMinutes: 30, comfortScore: 76, recommendation: 'Queue easing significantly' },
      { hour: '18:00', crowdLevel: 'peaceful', waitingMinutes: 15, comfortScore: 88, recommendation: 'Serene sunset atmosphere' },
      { hour: '20:00', crowdLevel: 'peaceful', waitingMinutes: 10, comfortScore: 92, recommendation: 'Cave closes at 20:30' },
      { hour: '22:00', crowdLevel: 'peaceful', waitingMinutes: 0, comfortScore: 100, recommendation: 'Cave closed overnight' },
    ]
  }
];

export const DarshanComfortIndex: React.FC = () => {
  const [selectedTempleId, setSelectedTempleId] = useState<string>(DARSHAN_RADAR_DATA[0].id);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [notifSubscribed, setNotifSubscribed] = useState<Record<string, boolean>>({});

  const activeTemple = DARSHAN_RADAR_DATA.find(t => t.id === selectedTempleId) || DARSHAN_RADAR_DATA[0];

  const getStatusBadge = (status: TempleSanctumRadar['status']) => {
    switch (status) {
      case 'peaceful':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
          dot: 'bg-emerald-500',
          label: 'Peaceful & Open (Comfort 80-100)'
        };
      case 'moderate':
        return {
          bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300',
          dot: 'bg-sky-500',
          label: 'Moderate Flow (Comfort 60-79)'
        };
      case 'brisk':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300',
          dot: 'bg-amber-500',
          label: 'Brisk / Heavy (Comfort 40-59)'
        };
      case 'regulated':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300',
          dot: 'bg-rose-500 animate-pulse',
          label: 'Regulated Gate Holding (Comfort <40)'
        };
    }
  };

  const getHourlyBarColor = (level: TempleHourlyForecast['crowdLevel']) => {
    switch (level) {
      case 'peaceful': return 'bg-emerald-500';
      case 'moderate': return 'bg-sky-500';
      case 'brisk': return 'bg-amber-500';
      case 'regulated': return 'bg-rose-500';
    }
  };

  const handleRefresh = () => {
    setLastRefreshed(new Date());
  };

  const toggleNotif = (templeId: string) => {
    setNotifSubscribed(prev => ({
      ...prev,
      [templeId]: !prev[templeId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Kyoto Philosophy Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                Kyoto Smart Tourism Benchmark
              </span>
              <span className="text-xs text-teal-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Updated: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Darshan Comfort Index & Crowd Horizon
            </h1>
            <p className="text-sm md:text-base text-teal-100 max-w-2xl mt-1">
              Live sanctum pacing, predictive 16-hour crowd forecasting, and stress-free visiting windows for major holy shrines across the Jammu division.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white font-medium text-xs md:text-sm flex items-center gap-2 transition-all border border-white/20"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Radar
            </button>
          </div>
        </div>
      </div>

      {/* Temple Selector Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {DARSHAN_RADAR_DATA.map(temple => {
          const isSelected = temple.id === selectedTempleId;
          const status = getStatusBadge(temple.status);
          return (
            <button
              key={temple.id}
              onClick={() => setSelectedTempleId(temple.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                isSelected 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {temple.location.split(',')[0]}
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${status.dot}`} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                {temple.name}
              </h3>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-xs text-slate-500 dark:text-slate-400">Comfort:</span>
                <span className={`text-xs font-black px-1.5 py-0.5 rounded ${
                  temple.currentComfortScore >= 80 ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-950/60' :
                  temple.currentComfortScore >= 60 ? 'text-sky-700 dark:text-sky-300 bg-sky-100/60 dark:bg-sky-950/60' :
                  temple.currentComfortScore >= 40 ? 'text-amber-700 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-950/60' :
                  'text-rose-700 dark:text-rose-300 bg-rose-100/60 dark:bg-rose-950/60'
                }`}>
                  {temple.currentComfortScore}/100
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Focus Card for Active Temple */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Active Header & Live Metrics */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(activeTemple.status).bg}`}>
                  <span className={`w-2 h-2 rounded-full ${getStatusBadge(activeTemple.status).dot}`} />
                  {getStatusBadge(activeTemple.status).label}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {activeTemple.location}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50">
                {activeTemple.name}
              </h2>
            </div>

            <button
              onClick={() => toggleNotif(activeTemple.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                notifSubscribed[activeTemple.id]
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
              }`}
            >
              <Bell className="w-4 h-4" />
              {notifSubscribed[activeTemple.id] ? 'Alerts Active (Comfort Alerts)' : 'Notify Me of Calm Hours'}
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Wait</span>
              <p className="text-lg font-black text-slate-900 dark:text-slate-100 mt-0.5">
                ~{activeTemple.avgDarshanWaitMins} mins
              </p>
              <span className="text-[10px] text-slate-500">From queue head to sanctum</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sanctum Pacing</span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">
                {activeTemple.sanctumPacing.split('(')[0]}
              </p>
              <span className="text-[10px] text-slate-500">Regulated batch throughput</span>
            </div>

            <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Optimal Window</span>
              <p className="text-sm font-bold text-emerald-950 dark:text-emerald-200 mt-1 line-clamp-1">
                {activeTemple.bestVisitingWindow}
              </p>
              <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400">Shortest wait & cool weather</span>
            </div>

            <div className="bg-amber-50/60 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200/60 dark:border-amber-800/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">Peak Surge Window</span>
              <p className="text-sm font-bold text-amber-950 dark:text-amber-200 mt-1 line-clamp-1">
                {activeTemple.peakWindow}
              </p>
              <span className="text-[10px] text-amber-700/80 dark:text-amber-400">Expect longer holding times</span>
            </div>
          </div>

          {/* Live Sanctum Advisory Notice */}
          <div className="mt-4 p-3 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-xl flex items-start gap-2.5 text-xs text-sky-900 dark:text-sky-200">
            <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Live Ground Advisory: </span>
              {activeTemple.liveAdvisory}
            </div>
          </div>
        </div>

        {/* 16-Hour Predictive Comfort Horizon */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Hourly Comfort & Wait Time Forecast
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Modeled after Kyoto Smart Tourism Bureau crowd prediction algorithm to prevent bottlenecking.
              </p>
            </div>
            {/* Color Legend */}
            <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Peaceful</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-sky-500" /> Moderate</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Brisk</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Regulated</span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2.5">
            {activeTemple.forecast.map((fc, idx) => (
              <div 
                key={idx} 
                className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-600 transition-all text-center"
              >
                <div>
                  <span className="font-black text-xs text-slate-800 dark:text-slate-200 block">{fc.hour}</span>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 my-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${getHourlyBarColor(fc.crowdLevel)}`} 
                      style={{ width: `${fc.comfortScore}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    ~{fc.waitingMinutes}m wait
                  </span>
                </div>
                <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className={`text-[9px] font-bold uppercase tracking-tight block ${
                    fc.crowdLevel === 'peaceful' ? 'text-emerald-600 dark:text-emerald-400' :
                    fc.crowdLevel === 'moderate' ? 'text-sky-600 dark:text-sky-400' :
                    fc.crowdLevel === 'brisk' ? 'text-amber-600 dark:text-amber-400' :
                    'text-rose-600 dark:text-rose-400'
                  }`}>
                    {fc.crowdLevel}
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5 line-clamp-2">
                    {fc.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Practical Yatri Tips */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Senior Citizens & Children</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Target hours with Comfort Score &gt;80. Avail battery vehicle slips at Ardhkuwari early morning.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-2.5">
              <Heart className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Medical Posts on Route</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  14 emergency medical dispensaries with automated oxygen and AEDs are situated every 1.2 km on the track.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-2.5">
              <Compass className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Alternate Scenic Visits</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  When Bhawan is in regulated holding, consider serene morning visit to Kol Kandoli (Nagrota) or Shiv Khori.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
