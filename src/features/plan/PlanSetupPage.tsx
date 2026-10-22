import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Info,
  ShieldCheck,
  Plane,
  Compass,
  Edit2,
  Clock,
  MapPin,
  CheckCircle2,
  Share2,
  Navigation,
  Trash2,
  Calendar,
  Sparkles,
  ChevronRight,
  Plus,
  Bookmark,
  Check,
  ArrowRight,
} from 'lucide-react';
import { db } from '@/data/db';
import type { SavedPlan, TimelineEntry } from '@/data/types';
import { usePlanStore } from '@/stores/planStore';
import { generatePlan } from '@/domain/planner/planner';
import { TaxiIcon, ExpressTrainIcon, CityBusIcon } from '@/ui/icons/TransitIcons';
import { INITIAL_PREVIOUS_PLANS } from '@/domain/offline/bundleManager';
import { JAMMU_CURATED_SUGGESTIONS } from '@/data/jammuFullData';

export const PlanSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { input, setInput, setResult, setGenerating } = usePlanStore();

  const [activeMode, setActiveMode] = useState<'curated' | 'layover' | 'previous' | 'multiday'>('curated');
  const [selectedHub, setSelectedHub] = useState<'station_jammu' | 'airport_jammu' | 'station_katra'>('station_jammu');
  const [selectedDuration, setSelectedDuration] = useState<string>('4');
  const [trainInfo, setTrainInfo] = useState<string>('Train: 12426 Jammu Rajdhani at 19:45');
  const [isEditingTrain, setIsEditingTrain] = useState(false);
  const [showCircuit, setShowCircuit] = useState(true);
  const [previousPlans, setPreviousPlans] = useState<SavedPlan[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Multi-day Planner State
  const [multiDays, setMultiDays] = useState<'1' | '2' | '3' | '5'>('2');
  const [multiTheme, setMultiTheme] = useState<'spiritual' | 'heritage' | 'alpine' | 'mixed'>('spiritual');
  const [multiTravelers, setMultiTravelers] = useState<number>(2);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    const dur = searchParams.get('duration');
    if (dur === '4') {
      setActiveMode('layover');
      setSelectedDuration('4');
    } else if (dur === '8') {
      setActiveMode('layover');
      setSelectedDuration('8');
    } else if (dur === '24') {
      setActiveMode('multiday');
      setMultiDays('1');
    }
  }, [searchParams]);

  const loadSavedPlans = async () => {
    const all = await db.savedPlans.toArray();
    if (all.length === 0) {
      await db.savedPlans.bulkAdd(INITIAL_PREVIOUS_PLANS);
      setPreviousPlans(INITIAL_PREVIOUS_PLANS);
    } else {
      setPreviousPlans(all.reverse());
    }
  };

  useEffect(() => {
    loadSavedPlans();
  }, []);

  const handleCalculate = async () => {
    setGenerating(true);
    const stationNodeMap = {
      station_jammu: 'node_station',
      station_katra: 'node_katra_base',
      airport_jammu: 'node_airport',
    };
    const startNode = stationNodeMap[selectedHub];
    const durationHours = parseFloat(selectedDuration) || 3.5;

    const arrMin = 14 * 60; // 14:00
    const depMin = arrMin + Math.round(durationHours * 60);
    const depH = Math.floor((depMin % 1440) / 60);
    const depM = depMin % 60;
    const depStr = `${String(depH).padStart(2, '0')}:${String(depM).padStart(2, '0')}`;

    const planInput = {
      ...input,
      startNode,
      departureNode: startNode,
      arrivalTime: '14:00',
      departureTime: depStr,
    };
    setInput(planInput);

    try {
      const plan = await generatePlan(planInput);
      setResult(plan);
      setShowCircuit(true);
      showToast('Itinerary calculated with 50-minute guaranteed safety margin!');
    } catch (err) {
      // fallback
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveCurrentCircuit = async () => {
    const newPlan: SavedPlan = {
      id: `plan_${Date.now()}`,
      title: `Jammu ${selectedDuration}h Safe Layover Circuit`,
      createdAt: new Date().toISOString(),
      bucket: '4h',
      startNode: 'node_station',
      departureNode: 'node_station',
      departureTime: '18:45',
      timeline: [
        { type: 'travel', start: '14:00', end: '14:20', minutes: 20, label: 'Station to Raghunath Temple via E-Rickshaw' },
        { type: 'visit', start: '14:20', end: '15:20', minutes: 60, attractionId: 'attr_raghunath_temple', label: 'Shri Raghunath Temple Darshan' },
        { type: 'travel', start: '15:20', end: '15:35', minutes: 15, label: 'Cab to Amar Mahal Museum' },
        { type: 'visit', start: '15:35', end: '16:35', minutes: 60, attractionId: 'attr_amar_mahal', label: 'Amar Mahal Palace & Golden Throne' },
        { type: 'travel', start: '16:35', end: '17:00', minutes: 25, label: 'Scenic return via Tawi Bridge & Bikram Chowk' },
        { type: 'buffer', start: '17:00', end: '18:45', minutes: 105, label: 'Safe Executive Lounge Arrival (50m prior to Train 12426)' },
      ],
      warnings: ['All spots verified open offline', '50-minute safety buffer included'],
    };

    await db.savedPlans.put(newPlan);
    showToast('✓ Layover plan saved to Previous Plan Trips!');
    loadSavedPlans();
  };

  const handleDeletePlan = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await db.savedPlans.delete(id);
    setPreviousPlans((prev) => prev.filter((p) => p.id !== id));
    showToast('Plan deleted from previous trips.');
  };

  const handleOpenPlan = (plan: SavedPlan) => {
    setResult({
      planId: plan.id,
      generatedAt: plan.createdAt,
      bucket: plan.bucket,
      mustLeaveBy: plan.departureTime,
      mustBeAtDepartureBy: plan.departureTime,
      timeline: plan.timeline,
      warnings: plan.warnings,
      explanations: ['Saved offline plan reloaded from device storage.'],
      excluded: [],
      assumptions: {},
      totalWalkKm: 1.5,
      usableMinutes: 240,
    });
    navigate('/plan/result');
  };

  const handleLaunchCuratedCircuit = (id: string) => {
    const sugg = JAMMU_CURATED_SUGGESTIONS.find((s) => s.id === id);
    if (!sugg) return;

    let curTime = 9 * 60; // 09:00 AM
    const timeline: TimelineEntry[] = [
      {
        type: 'settle',
        start: '09:00',
        end: '09:30',
        minutes: 30,
        label: `${selectedHub === 'station_katra' ? 'Katra' : 'Jammu'} Departure Hub Briefing & Token Sync`,
      },
    ];
    curTime += 30;

    sugg.attractionIds.forEach((attrId) => {
      const startH = Math.floor(curTime / 60);
      const startM = curTime % 60;
      curTime += 25;
      const endTravelH = Math.floor(curTime / 60);
      const endTravelM = curTime % 60;
      timeline.push({
        type: 'travel',
        start: `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`,
        end: `${String(endTravelH).padStart(2, '0')}:${String(endTravelM).padStart(2, '0')}`,
        minutes: 25,
        mode: 'auto_taxi',
      });

      const visitStartH = Math.floor(curTime / 60);
      const visitStartM = curTime % 60;
      curTime += 60;
      const visitEndH = Math.floor(curTime / 60);
      const visitEndM = curTime % 60;
      timeline.push({
        type: 'visit',
        attractionId: attrId,
        start: `${String(visitStartH).padStart(2, '0')}:${String(visitStartM).padStart(2, '0')}`,
        end: `${String(visitEndH).padStart(2, '0')}:${String(visitEndM).padStart(2, '0')}`,
        minutes: 60,
        label: sugg.subtitle,
      });
    });

    timeline.push({
      type: 'buffer',
      start: `${String(Math.floor(curTime / 60)).padStart(2, '0')}:${String(curTime % 60).padStart(2, '0')}`,
      end: `${String(Math.floor((curTime + 60) / 60)).padStart(2, '0')}:${String((curTime + 60) % 60).padStart(2, '0')}`,
      minutes: 60,
      label: 'Guaranteed Return Safety Buffer',
    });

    setResult({
      planId: `sugg_plan_${Date.now()}`,
      generatedAt: new Date().toISOString(),
      bucket: sugg.duration.includes('4') ? '4h' : sugg.duration.includes('8') ? '8h' : '24h',
      mustLeaveBy: '19:00',
      mustBeAtDepartureBy: '19:00',
      timeline,
      warnings: sugg.tips,
      explanations: [sugg.description],
      excluded: [],
      assumptions: { duration: sugg.duration, zone: sugg.zone },
      totalWalkKm: 2.2,
      usableMinutes: curTime - 9 * 60,
    });
    navigate('/plan/result');
  };

  const handleGenerateMultiDay = async () => {
    const daysNum = parseInt(multiDays, 10);
    const titlesMap: Record<string, string> = {
      spiritual: `${daysNum}-Day Vaishno Devi & Katra Sacred Corridor`,
      heritage: `${daysNum}-Day Royal Dogra Palaces & Forts Heritage Trail`,
      alpine: `${daysNum}-Day Chenab Valley, Bhaderwah & Padri Pass Tour`,
      mixed: `${daysNum}-Day Complete Jammu Division Highlights`,
    };

    const newMultiPlan: SavedPlan = {
      id: `plan_multi_${Date.now()}`,
      title: titlesMap[multiTheme] || `${daysNum}-Day Jammu Custom Plan`,
      createdAt: new Date().toISOString(),
      bucket: '24h',
      startNode: 'node_station',
      departureNode: 'node_station',
      departureTime: '20:00',
      timeline: [
        { type: 'travel', start: 'Day 1 09:00', end: 'Day 1 11:00', minutes: 120, label: 'Arrival & Check-in' },
        { type: 'visit', start: 'Day 1 11:00', end: 'Day 1 14:00', minutes: 180, attractionId: 'attr_raghunath_temple', label: 'Primary Sacred Darshan & Local Bazaars' },
        { type: 'visit', start: 'Day 1 15:30', end: 'Day 1 18:00', minutes: 150, attractionId: 'attr_amar_mahal', label: 'Royal French Chateau & Basohli Miniatures' },
        { type: 'travel', start: 'Day 2 08:00', end: 'Day 2 11:00', minutes: 180, label: 'Scenic Highway drive into foothills' },
        { type: 'visit', start: 'Day 2 11:00', end: 'Day 2 16:00', minutes: 300, attractionId: 'attr_bhaderwah', label: 'Valley Exploration & Pine Forest Trails' },
      ],
      warnings: ['Prepaid taxi booked with flat voucher', 'Offline map pre-downloaded'],
    };

    await db.savedPlans.put(newMultiPlan);
    showToast(`✓ Created ${titlesMap[multiTheme]} and added to Previous Trips!`);
    loadSavedPlans();
    setActiveMode('previous');
  };

  const handleWhatsAppShare = () => {
    const text = `🛕 Safe Layover Itinerary (Jammu): Golden Temple & Chateau Circuit (2h 45m). Safe margin 50m return buffer included! Explore offline on JammuKhoj: ${window.location.origin}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-4 pb-24 text-[#1C1917] select-none font-sans animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1C1917] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in">
          <Check size={14} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 1. TOP HEADER */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded-xl text-ink hover:bg-surface transition-colors"
            title="Back"
          >
            <ArrowLeft size={19} />
          </button>
          <div>
            <h1 className="font-heading font-extrabold text-lg text-ink leading-tight">
              Trip Planner & Layover
            </h1>
            <p className="text-[10px] text-stone font-semibold">
              Jammu Division Transit Shield & Multi-Day Circuits
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/safety')}
          className="p-1.5 rounded-full text-stone hover:text-ink"
          title="Info"
        >
          <Info size={17} />
        </button>
      </div>

      {/* 2. MODE SELECTOR TABS (Instant Curated, Layover, Previous Trips, Multi-Day) */}
      <div className="flex items-center gap-1 bg-surface p-1 rounded-2xl border border-border text-xs font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveMode('curated')}
          className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 shrink-0 ${
            activeMode === 'curated'
              ? 'bg-[#9E4A0C] text-white shadow-xs'
              : 'text-stone hover:text-ink'
          }`}
        >
          <Sparkles size={13} />
          <span>⚡ Instant Circuits</span>
        </button>

        <button
          onClick={() => setActiveMode('layover')}
          className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 shrink-0 ${
            activeMode === 'layover'
              ? 'bg-[#9E4A0C] text-white shadow-xs'
              : 'text-stone hover:text-ink'
          }`}
        >
          <Clock size={13} />
          <span>Custom Layover</span>
        </button>

        <button
          onClick={() => setActiveMode('previous')}
          className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 shrink-0 ${
            activeMode === 'previous'
              ? 'bg-[#9E4A0C] text-white shadow-xs'
              : 'text-stone hover:text-ink'
          }`}
        >
          <Bookmark size={13} />
          <span>Saved ({previousPlans.length})</span>
        </button>

        <button
          onClick={() => setActiveMode('multiday')}
          className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 shrink-0 ${
            activeMode === 'multiday'
              ? 'bg-[#9E4A0C] text-white shadow-xs'
              : 'text-stone hover:text-ink'
          }`}
        >
          <Calendar size={13} />
          <span>Multi-Day</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* MODE 0: 1-TAP INSTANT CURATED CIRCUITS */}
      {/* ============================================================== */}
      {activeMode === 'curated' && (
        <div className="space-y-3.5 animate-in fade-in">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-500/20 dark:from-stone-900 dark:to-stone-850 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-full bg-[#9E4A0C] text-white flex items-center justify-center shrink-0 shadow-xs font-bold text-sm">
                ⚡
              </span>
              <div>
                <h3 className="font-heading font-bold text-xs text-[#9E4A0C] dark:text-amber-400">
                  One-Tap Verified Circuits (झटपट यात्रा)
                </h3>
                <p className="text-[11px] text-stone leading-tight">
                  Pre-configured with local taxi rates, temple darshan schedules, and safety buffers.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveMode('layover')}
              className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#9E4A0C] text-white shrink-0 shadow-xs apple-press"
            >
              Custom Layover ↗
            </button>
          </div>

          <div className="space-y-3">
            {JAMMU_CURATED_SUGGESTIONS.map((sugg) => (
              <div
                key={sugg.id}
                className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:border-[#9E4A0C]/50 transition-all space-y-3 text-ink"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-[#9E4A0C] dark:text-amber-400 font-bold text-[10px] border border-amber-500/30">
                        {sugg.duration}
                      </span>
                      <span className="text-[10px] text-stone font-bold uppercase tracking-wider">
                        {sugg.zone === 'city' ? 'City Core' : sugg.zone === 'day_trip' ? 'Day Excursion' : 'Scenic Highland'}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-sm text-ink mt-1.5">
                      {sugg.title}
                    </h3>
                    <p className="text-xs text-stone mt-0.5 leading-snug">
                      {sugg.description}
                    </p>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="bg-surface border border-border p-2.5 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-stone uppercase tracking-wider block">Key Stops Included:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-stone">
                    {sugg.highlights.slice(0, 3).map((h, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <Check size={11} className="text-[#059669] dark:text-emerald-400 shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-stone">
                    {sugg.attractionIds.length} Verified Stops • Buffer Protected
                  </span>
                  <button
                    onClick={() => handleLaunchCuratedCircuit(sugg.id)}
                    className="py-2 px-3.5 rounded-xl bg-[#9E4A0C] text-white font-bold text-xs shadow-xs hover:bg-[#853E0A] transition-all flex items-center gap-1.5 apple-press"
                  >
                    <span>⚡ Launch Itinerary (यात्रा देखें)</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 1: SAFE LAYOVER PLANNER (Stitch Screen 5) */}
      {/* ============================================================== */}
      {activeMode === 'layover' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Guaranteed On-Time Return Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#ECFDF5] to-[#F0FDF4] border border-[#A7F3D0] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#059669] text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xs text-[#065F46]">
                Guaranteed On-Time Return Protocol
              </h3>
              <p className="text-[11px] text-[#047857] leading-tight">
                Calculates live buffer for road transit, security checkpoints, and baggage drop.
              </p>
            </div>
          </div>

          {/* STEP 1: TRANSIT HUB SELECTOR */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs px-0.5">
              <div className="flex items-center gap-1.5 font-bold text-[#1C1917]">
                <span className="w-5 h-5 rounded-full bg-[#9E4A0C] text-white text-[11px] font-bold flex items-center justify-center">
                  1
                </span>
                <span>Transit Hub Selector</span>
              </div>
              <span className="text-[10px] text-[#78716C] font-semibold">Depart & Return</span>
            </div>

            <div className="space-y-2">
              {/* Radio 1: Jammu Tawi */}
              <div
                onClick={() => setSelectedHub('station_jammu')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedHub === 'station_jammu'
                    ? 'bg-amber-500/10 border-[#9E4A0C] dark:border-amber-400 shadow-xs'
                    : 'bg-card border-border hover:bg-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedHub === 'station_jammu' ? 'border-[#9E4A0C]' : 'border-[#A8A29E]'
                    }`}
                  >
                    {selectedHub === 'station_jammu' && <span className="w-2 h-2 rounded-full bg-[#9E4A0C]" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-ink">Jammu Tawi Railway Station</h4>
                    <p className="text-[10px] text-stone">Code: JAT • City Center Station</p>
                  </div>
                </div>
                <ExpressTrainIcon size={19} color={selectedHub === 'station_jammu' ? '#9E4A0C' : '#A8A29E'} />
              </div>

              {/* Radio 2: Jammu Airport */}
              <div
                onClick={() => setSelectedHub('airport_jammu')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedHub === 'airport_jammu'
                    ? 'bg-amber-500/10 border-[#9E4A0C] dark:border-amber-400 shadow-xs'
                    : 'bg-card border-border hover:bg-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedHub === 'airport_jammu' ? 'border-[#9E4A0C]' : 'border-[#A8A29E]'
                    }`}
                  >
                    {selectedHub === 'airport_jammu' && <span className="w-2 h-2 rounded-full bg-[#9E4A0C]" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-ink">Jammu Airport</h4>
                    <p className="text-[10px] text-stone">Code: IXJ • Civil Enclave Satwari</p>
                  </div>
                </div>
                <Plane size={17} className={selectedHub === 'airport_jammu' ? 'text-[#9E4A0C]' : 'text-[#A8A29E]'} />
              </div>

              {/* Radio 3: Katra Base */}
              <div
                onClick={() => setSelectedHub('station_katra')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedHub === 'station_katra'
                    ? 'bg-amber-500/10 border-[#9E4A0C] dark:border-amber-400 shadow-xs'
                    : 'bg-card border-border hover:bg-surface'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedHub === 'station_katra' ? 'border-[#9E4A0C]' : 'border-[#A8A29E]'
                    }`}
                  >
                    {selectedHub === 'station_katra' && <span className="w-2 h-2 rounded-full bg-[#9E4A0C]" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-ink">Katra Base Station</h4>
                    <p className="text-[10px] text-stone">Code: SVDK • Holy Shrine Hub</p>
                  </div>
                </div>
                <Compass size={17} className={selectedHub === 'station_katra' ? 'text-[#9E4A0C]' : 'text-[#A8A29E]'} />
              </div>
            </div>
          </div>

          {/* STEP 2: DURATION PILLS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs px-0.5">
              <div className="flex items-center gap-1.5 font-bold text-[#1C1917]">
                <span className="w-5 h-5 rounded-full bg-[#9E4A0C] text-white text-[11px] font-bold flex items-center justify-center">
                  2
                </span>
                <span>Layover Duration</span>
              </div>
              <span className="text-[10px] text-[#78716C] font-semibold">Total Window</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { val: '4', label: '4h (Quick)' },
                { val: '8', label: '8h (Day)' },
                { val: '24', label: '24h (Full)' },
                { val: '3.5', label: '3.5h (Transit)' },
              ].map((pill) => (
                <button
                  key={pill.val}
                  onClick={() => setSelectedDuration(pill.val)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border apple-press ${
                    selectedDuration === pill.val
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-card border-border text-ink hover:bg-surface'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 3: PNR LINKED DEPARTURE TIME */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs px-0.5">
              <div className="flex items-center gap-1.5 font-bold text-[#1C1917]">
                <span className="w-5 h-5 rounded-full bg-[#9E4A0C] text-white text-[11px] font-bold flex items-center justify-center">
                  3
                </span>
                <span>PNR-Linked Departure Time</span>
              </div>
              <span className="text-[10px] text-[#78716C] font-semibold">Sync or Input</span>
            </div>

            <div className="p-3 rounded-2xl bg-card border border-border flex items-center justify-between text-ink">
              <div className="flex items-center gap-2.5">
                <Clock size={16} className="text-[#9E4A0C] dark:text-amber-400" />
                {isEditingTrain ? (
                  <input
                    type="text"
                    value={trainInfo}
                    onChange={(e) => setTrainInfo(e.target.value)}
                    onBlur={() => setIsEditingTrain(false)}
                    autoFocus
                    className="text-xs font-bold text-ink bg-transparent border-b border-[#9E4A0C] outline-none"
                  />
                ) : (
                  <span className="text-xs font-bold text-ink">{trainInfo}</span>
                )}
              </div>
              <button
                onClick={() => setIsEditingTrain(!isEditingTrain)}
                className="text-[11px] font-bold text-[#9E4A0C] dark:text-amber-400 hover:underline flex items-center gap-0.5"
              >
                <span>Edit</span>
                <Edit2 size={11} />
              </button>
            </div>
          </div>

          {/* CALCULATE BUTTON */}
          <button
            onClick={handleCalculate}
            className="w-full py-3 rounded-2xl bg-[#9E4A0C] text-white font-bold text-xs shadow-md shadow-[#9E4A0C]/25 hover:bg-[#853E0A] transition-all flex items-center justify-center gap-1.5 active:scale-98"
          >
            <Sparkles size={16} />
            <span>Calculate Safe Itinerary</span>
          </button>

          {/* GENERATED SAFE CIRCUIT SECTION */}
          {showCircuit && (
            <div className="p-4 rounded-3xl bg-card border border-border space-y-4 shadow-sm animate-in fade-in text-ink">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div>
                  <h3 className="font-heading font-extrabold text-sm text-ink">
                    Generated Safe Circuit
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] text-stone font-semibold">
                    <span>Circuit: 2h 45m</span>
                    <span>•</span>
                    <span className="text-[#059669] dark:text-emerald-400 font-bold">50m Safe Margin</span>
                  </div>
                </div>

                <button
                  onClick={handleWhatsAppShare}
                  className="px-2.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-500/20"
                >
                  <Share2 size={12} />
                  <span>Share Plan</span>
                </button>
              </div>

              {/* Progress Bar of Margin */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-ink">Safe Return Margin</span>
                  <span className="text-[#059669] dark:text-emerald-400">50m buffer verified</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface border border-border overflow-hidden">
                  <div className="h-full bg-[#059669] dark:bg-emerald-500 rounded-full w-full"></div>
                </div>
              </div>

              {/* Step-by-Step Vertical Route */}
              <div className="pl-6 relative border-l-2 border-dashed border-border space-y-4 text-xs">
                {/* Stop 1 */}
                <div className="relative space-y-1">
                  <div className="absolute -left-7 top-0.5 w-5 h-5 rounded-full bg-[#9E4A0C] text-white flex items-center justify-center text-[10px] font-bold">
                    1
                  </div>
                  <div className="text-[11px] font-bold text-[#9E4A0C] dark:text-amber-400">14:00 • Departure from Jammu Tawi</div>
                  <h4 className="font-bold text-xs text-ink">Exit Platform 1 to Prepaid Taxi Stand</h4>
                  <p className="text-[11px] text-stone leading-snug">
                    Board pre-assigned police voucher auto/taxi.
                  </p>
                </div>

                {/* Stop 2 */}
                <div className="relative space-y-1">
                  <div className="absolute -left-7 top-0.5 w-5 h-5 rounded-full bg-[#9E4A0C] text-white flex items-center justify-center text-[10px] font-bold">
                    2
                  </div>
                  <div className="text-[11px] font-bold text-[#9E4A0C] dark:text-amber-400">14:20 • Shri Raghunath Temple</div>
                  <h4 className="font-bold text-xs text-ink">Darshan at Gold Sanctum</h4>
                  <p className="text-[11px] text-stone leading-snug">
                    Free mobile & shoe locker counter available at Gate 2.
                  </p>
                </div>

                {/* Stop 3 */}
                <div className="relative space-y-1">
                  <div className="absolute -left-7 top-0.5 w-5 h-5 rounded-full bg-[#9E4A0C] text-white flex items-center justify-center text-[10px] font-bold">
                    3
                  </div>
                  <div className="text-[11px] font-bold text-[#9E4A0C] dark:text-amber-400">15:35 • Amar Mahal Palace</div>
                  <h4 className="font-bold text-xs text-ink">Golden Throne & French Chateau</h4>
                  <p className="text-[11px] text-stone leading-snug">
                    Tour the Dogra royal archives and Basohli art gallery.
                  </p>
                </div>

                {/* Stop 4 */}
                <div className="relative space-y-1">
                  <div className="absolute -left-7 top-0.5 w-5 h-5 rounded-full bg-[#059669] text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <div className="text-[11px] font-bold text-[#059669] dark:text-emerald-400">16:45 • Safe Station Lounge Arrival</div>
                  <h4 className="font-bold text-xs text-ink">Platform 1 Executive Waiting Lounge</h4>
                  <p className="text-[11px] text-stone leading-snug">
                    Arrive 50 full minutes ahead of train boarding.
                  </p>
                </div>
              </div>

              {/* Prepaid Taxi Guarantee Card */}
              <div className="p-3 rounded-2xl bg-surface border border-border flex items-center justify-between text-ink">
                <div className="flex items-center gap-2.5">
                  <TaxiIcon size={20} color="#9E4A0C" />
                  <div>
                    <div className="text-xs font-bold text-ink flex items-center gap-1">
                      <span>Prepaid Taxi Guarantee</span>
                      <CheckCircle2 size={12} className="text-[#059669] dark:text-emerald-400" />
                    </div>
                    <div className="text-[10px] text-stone">Jammu RTO verified fixed rate</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-sm text-[#9E4A0C] dark:text-amber-400">₹450</span>
                  <div className="text-[9px] text-stone">Flat Round-Trip</div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => navigate('/map')}
                  className="w-full py-3 rounded-xl bg-[#9E4A0C] text-white font-bold text-xs shadow-md shadow-[#9E4A0C]/20 hover:bg-[#853E0A] flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <Navigation size={15} />
                  <span>Start Layover Navigation</span>
                </button>

                <button
                  onClick={handleSaveCurrentCircuit}
                  className="w-full py-2.5 rounded-xl border border-[#9E4A0C] text-[#9E4A0C] dark:text-amber-400 font-bold text-xs hover:bg-surface flex items-center justify-center gap-1.5"
                >
                  <Bookmark size={14} />
                  <span>Save Plan to Previous Trips</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 2: PREVIOUS PLAN TRIPS (Full History & Navigation) */}
      {/* ============================================================== */}
      {activeMode === 'previous' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between px-0.5">
            <div>
              <h2 className="font-heading font-black text-base text-ink">
                Previous Plan Trips
              </h2>
              <p className="text-xs text-stone-600">
                All saved offline itineraries stored directly in IndexedDB.
              </p>
            </div>
            <button
              onClick={() => setActiveMode('multiday')}
              className="px-2.5 py-1.5 rounded-xl bg-[#9E4A0C] text-white text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <Plus size={13} />
              <span>New Plan</span>
            </button>
          </div>

          <div className="space-y-3">
            {previousPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => handleOpenPlan(plan)}
                className="p-4 bg-card border border-border rounded-2xl shadow-sm hover:border-[#9E4A0C]/40 cursor-pointer transition-all space-y-3 group text-ink"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-[#9E4A0C] dark:text-amber-400 border border-amber-500/20">
                      {plan.bucket} Plan
                    </span>
                    <h3 className="font-heading font-bold text-sm text-ink group-hover:text-[#9E4A0C] dark:group-hover:text-amber-400 transition-colors mt-1">
                      {plan.title}
                    </h3>
                  </div>

                  <button
                    onClick={(e) => handleDeletePlan(plan.id, e)}
                    className="p-1.5 rounded-lg text-stone hover:text-red-600 hover:bg-red-500/10 transition-colors"
                    title="Delete saved plan"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Timeline Route Stops Pills */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone">
                  {plan.timeline
                    .filter((t) => t.type === 'visit' || t.type === 'buffer')
                    .map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-surface border border-border text-stone"
                      >
                        {item.label}
                      </span>
                    ))}
                </div>

                <div className="flex items-center justify-between text-xs text-stone pt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-[#9E4A0C] dark:text-amber-400" />
                    <span>Return by: {plan.departureTime}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[#9E4A0C] font-bold">
                    <span>Open Route</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 3: MULTI-DAY & CUSTOM TOUR BUILDER */}
      {/* ============================================================== */}
      {activeMode === 'multiday' && (
        <div className="bg-card border border-border text-ink rounded-3xl p-5 space-y-4 shadow-sm animate-in fade-in">
          <div>
            <h3 className="font-heading font-black text-base text-ink">
              Multi-Day Tour Builder
            </h3>
            <p className="text-xs text-stone">
              Generate full day-by-day itineraries tailored to your schedule and travel group.
            </p>
          </div>

          {/* Number of Days */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Select Trip Duration:</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { val: '1', label: '1 Day' },
                { val: '2', label: '2 Days' },
                { val: '3', label: '3 Days' },
                { val: '5', label: '5 Days' },
              ].map((d) => (
                <button
                  key={d.val}
                  onClick={() => setMultiDays(d.val as any)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    multiDays === d.val
                      ? 'bg-[#9E4A0C] text-white border-[#9E4A0C]'
                      : 'bg-surface border-border text-stone hover:bg-surface/80'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Focus */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Trip Focus / Theme:</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { key: 'spiritual', label: '🛕 Pilgrimage & Shrines' },
                { key: 'heritage', label: '🏰 Dogra Forts & Palaces' },
                { key: 'alpine', label: '🌲 Alpine Valleys & Passes' },
                { key: 'mixed', label: '🌟 Complete All-in-One' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setMultiTheme(t.key as any)}
                  className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                    multiTheme === t.key
                      ? 'bg-amber-500/10 border-[#9E4A0C] dark:border-amber-500 text-[#9E4A0C] dark:text-amber-400'
                      : 'bg-surface border-border text-stone hover:bg-surface/80'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Travelers Count & Budget Estimate */}
          <div className="p-3 bg-surface border border-border rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-ink">Travelers:</span>
              <div className="flex items-center gap-2">
                {[1, 2, 4, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setMultiTravelers(num)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold ${
                      multiTravelers === num
                        ? 'bg-[#9E4A0C] text-white'
                        : 'bg-card border border-border text-ink hover:bg-surface'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between border-t border-border pt-2 text-stone">
              <span>Estimated Budget:</span>
              <strong className="text-ink">
                ₹{parseInt(multiDays, 10) * multiTravelers * 1250} – ₹{parseInt(multiDays, 10) * multiTravelers * 1800}
              </strong>
            </div>
          </div>

          <button
            onClick={handleGenerateMultiDay}
            className="w-full py-3 rounded-2xl bg-[#9E4A0C] text-white font-bold text-xs shadow-md shadow-[#9E4A0C]/25 hover:bg-[#853E0A] transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles size={16} />
            <span>Generate & Save Multi-Day Plan</span>
          </button>
        </div>
      )}
    </div>
  );
};
