import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Bookmark,
  Download,
  CheckCircle2,
  Bell,
  Trash2,
  ArrowRight,
  MapPin,
  Clock,
  Navigation,
  ShieldCheck,
  PhoneCall,
  SlidersHorizontal,
  ChevronRight,
  HardDrive,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  Wifi,
  X,
} from 'lucide-react';
import { db } from '@/data/db';
import type { SavedPlan } from '@/data/types';
import { usePlanStore } from '@/stores/planStore';
import { useAppStore } from '@/stores/appStore';
import { JAMMU_SPOT_IMAGES } from '@/data/spotImages';
import { TaxiIcon, CityBusIcon, AutoRickshawIcon, ExpressTrainIcon, PrivateCarIcon } from '@/ui/icons/TransitIcons';
import { GoogleAuthModal } from '@/features/auth/GoogleAuthModal';
import { INITIAL_PREVIOUS_PLANS } from '@/domain/offline/bundleManager';

export const SavedPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { currentUser, language, setLanguage } = useAppStore();
  const { setResult } = usePlanStore();

  const [activeTab, setActiveTab] = useState<'spots' | 'plans' | 'packs'>('spots');
  const [autoUpdateWifi, setAutoUpdateWifi] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showTaxiModal, setShowTaxiModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customPlans, setCustomPlans] = useState<SavedPlan[]>([]);
  const [savedSpots, setSavedSpots] = useState({
    bhaderwah: true,
    raghunath: true,
    mansar: true,
    suchetgarh: true,
  });

  const [filterCategory, setFilterCategory] = useState<'all' | 'pilgrimage' | 'nature' | 'heritage' | 'border'>('all');
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadPlans = async () => {
    const all = await db.savedPlans.toArray();
    if (all.length === 0) {
      await db.savedPlans.bulkAdd(INITIAL_PREVIOUS_PLANS);
      setCustomPlans(INITIAL_PREVIOUS_PLANS);
    } else {
      setCustomPlans(all.reverse());
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleLanguageChange = (lang: 'en' | 'hi') => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const handleClearCache = async () => {
    await db.savedPlans.clear();
    setCustomPlans([]);
    setShowClearModal(false);
  };

  const toggleSpotBookmark = (spotKey: keyof typeof savedSpots, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedSpots((prev) => ({ ...prev, [spotKey]: !prev[spotKey] }));
  };

  const userName = currentUser?.name || 'Rajesh Sharma';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'RS';

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1C2923] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-emerald-500/30">
          <CheckCircle2 size={14} className="text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Brand Header */}
      <div className="flex items-center justify-between pt-1 pb-1">
        <div className="flex items-center gap-2.5 cursor-pointer apple-press" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-xl overflow-hidden shadow-xs shrink-0 flex items-center justify-center bg-forest-900 border border-amber-500/30">
            <img
              src="/icons/icon-emblem.svg"
              alt="JammuKhoj Emblem"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="font-heading font-black text-xl tracking-tight text-[#9E4A0C]">
            JammuKhoj
          </span>
        </div>

        <button
          onClick={() => setShowNotifModal(true)}
          className="p-2 rounded-full text-stone hover:text-ink hover:bg-stone/10 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell size={20} className="text-stone-700" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
      </div>

      {/* 2. User Profile Card */}
      <div className="bg-white border border-[#EBE4DC] rounded-2xl p-4 shadow-sm flex items-center gap-3.5">
        <div className="relative shrink-0">
          <div className="w-13 h-13 rounded-full bg-[#FCEFE7] border-2 border-[#F3D7C5] flex items-center justify-center text-[#9E4A0C] font-heading font-black text-lg shadow-inner">
            {userInitials}
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#15803D] ring-2 ring-white"></span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h3 className="font-heading font-bold text-base text-ink truncate flex items-center gap-1">
              <span>{userName}</span>
              <ShieldCheck size={14} className="text-[#15803D] shrink-0" />
            </h3>
            {currentUser?.authProvider === 'google' ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                Google Account Synced
              </span>
            ) : (
              <button
                onClick={() => setShowGoogleModal(true)}
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white text-stone-700 border border-stone-300 hover:border-[#9E4A0C] hover:text-[#9E4A0C] shrink-0 flex items-center gap-1 shadow-2xs"
              >
                <span>G Login & Sync</span>
              </button>
            )}
          </div>

          <div className="text-xs text-stone-600 mt-0.5 flex items-center gap-1">
            <span>{currentUser?.email || 'Pilgrim / Heritage Explorer'}</span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] text-[11px] font-semibold text-[#15803D]">
              <CheckCircle2 size={12} className="text-[#15803D]" />
              <span>Offline Pack: 184 MB downloaded</span>
            </div>

            {currentUser?.authProvider !== 'google' && (
              <button
                onClick={() => setShowGoogleModal(true)}
                className="text-[11px] font-bold text-[#9E4A0C] hover:underline"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Segmented Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-[#F5F5F4] p-1 rounded-2xl border border-[#E7E5E4] text-xs font-bold">
        <button
          onClick={() => setActiveTab('spots')}
          className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
            activeTab === 'spots'
              ? 'bg-[#9E4A0C] text-white shadow-xs'
              : 'text-stone-600 hover:text-ink'
          }`}
        >
          <Bookmark size={13} />
          <span>Spots ({Object.values(savedSpots).filter(Boolean).length})</span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
            activeTab === 'plans'
              ? 'bg-[#9E4A0C] text-white shadow-xs'
              : 'text-stone-600 hover:text-ink'
          }`}
        >
          <Clock size={13} />
          <span>Previous Trips ({customPlans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('packs')}
          className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
            activeTab === 'packs'
              ? 'bg-[#9E4A0C] text-white shadow-xs'
              : 'text-stone-600 hover:text-ink'
          }`}
        >
          <Download size={13} />
          <span>Packs</span>
        </button>
      </div>

      {/* 4. Tab Content */}
      {activeTab === 'spots' ? (
        <div className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <h2 className="font-heading font-black text-lg text-ink">
                Saved Destinations
              </h2>
              <p className="text-xs text-stone-600">
                Cached for field navigation without cellular network
              </p>
            </div>
            <button
              onClick={() => setShowFilterBar(!showFilterBar)}
              className={`p-2 rounded-lg transition-colors apple-press ${
                showFilterBar ? 'bg-[#9E4A0C] text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
              title="Filter spots"
              aria-label="Filter saved spots"
            >
              <SlidersHorizontal size={17} />
            </button>
          </div>

          {/* Filter Bar Chips */}
          {showFilterBar && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar animate-in fade-in">
              {[
                { id: 'all', label: 'All Destinations' },
                { id: 'pilgrimage', label: '🛕 Pilgrimage' },
                { id: 'nature', label: '🌲 Lakes & Valleys' },
                { id: 'border', label: '🚩 Border Heritage' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setFilterCategory(chip.id as any)}
                  className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 transition-all apple-press ${
                    filterCategory === chip.id
                      ? 'bg-[#9E4A0C] text-white shadow-xs'
                      : 'bg-surface border border-border text-stone hover:text-ink'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          {/* Destination Card 1: Bhaderwah & Jai Valley */}
          {savedSpots.bhaderwah && (filterCategory === 'all' || filterCategory === 'nature') && (
            <div className="bg-white border border-[#EBE4DC] rounded-2xl overflow-hidden shadow-sm group">
              <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                <img
                  src={JAMMU_SPOT_IMAGES.attr_bhaderwah}
                  alt="Bhaderwah & Jai Valley"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Bhaderwah_Valley_2.jpg/960px-Bhaderwah_Valley_2.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

                {/* Top Badge */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#15803D]/90 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
                  <span>⛺</span>
                  <span>Alpine Valley</span>
                </span>

                {/* Bookmark Button */}
                <button
                  onClick={(e) => toggleSpotBookmark('bhaderwah', e)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-red-600 hover:scale-110 transition-transform"
                >
                  <Bookmark size={15} fill="currentColor" />
                </button>

                {/* Overlay Text */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-heading font-bold text-base leading-snug">
                    Bhaderwah & Jai Valley (Mini Kashmir)
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-stone-200 mt-0.5">
                    <span>⛰️</span>
                    <span>10,500ft Padri pass circuit</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white flex items-center justify-between text-xs border-t border-[#F1E9E0]">
                <div className="flex items-center gap-1.5 text-[#15803D] font-bold">
                  <CheckCircle2 size={14} />
                  <span>Offline map saved</span>
                </div>

                <button
                  onClick={() => navigate('/map')}
                  className="px-3 py-1.5 rounded-full bg-[#FCEFE7] text-[#9E4A0C] font-bold text-xs hover:bg-[#F3D7C5] transition-colors flex items-center gap-1"
                >
                  <span>View Route</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Destination Card 2: Shri Raghunath Temple */}
          {savedSpots.raghunath && (filterCategory === 'all' || filterCategory === 'pilgrimage') && (
            <div
              onClick={() => navigate('/explore/attr_raghunath_temple')}
              className="bg-white border border-[#EBE4DC] rounded-2xl p-3.5 shadow-sm hover:border-[#9E4A0C]/40 cursor-pointer transition-all flex items-center gap-3.5 group"
            >
              <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 relative border border-[#EBE4DC] bg-stone-100 shadow-xs">
                <img
                  src={JAMMU_SPOT_IMAGES.attr_raghunath_temple}
                  alt="Shri Raghunath Temple"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Raghunath_Temple_Jammu.JPG';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#FCEFE7] text-[#9E4A0C] text-[10px] font-bold">
                    Pilgrimage Hub
                  </span>
                  <span className="text-xs font-bold text-stone-700 flex items-center gap-0.5">
                    ★ 4.5
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-ink mt-1 group-hover:text-[#9E4A0C] transition-colors truncate">
                  Shri Raghunath Temple
                </h3>
                <div className="flex items-center gap-1 text-xs text-[#15803D] font-medium mt-0.5">
                  <CheckCircle2 size={13} />
                  <span>Shoelockers confirmed</span>
                </div>
              </div>

              <button
                onClick={(e) => toggleSpotBookmark('raghunath', e)}
                className="p-2 text-red-600 hover:scale-110 transition-transform shrink-0"
              >
                <Bookmark size={18} fill="currentColor" />
              </button>
            </div>
          )}

          {/* Destination Card 3: Mansar Sacred Lake */}
          {savedSpots.mansar && (filterCategory === 'all' || filterCategory === 'nature') && (
            <div className="bg-white border border-[#EBE4DC] rounded-2xl overflow-hidden shadow-sm group">
              <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                <img
                  src={JAMMU_SPOT_IMAGES.attr_mansar_lake}
                  alt="Mansar Sacred Lake"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Beautiful_Mansar_Lake_%28ramsar_Wetland%29_Dr._Harleen_Kaur.jpg/960px-Beautiful_Mansar_Lake_%28ramsar_Wetland%29_Dr._Harleen_Kaur.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
                  <span>🚣</span>
                  <span>Boating & Shrines</span>
                </span>

                <button
                  onClick={(e) => toggleSpotBookmark('mansar', e)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-red-600 hover:scale-110 transition-transform"
                >
                  <Bookmark size={15} fill="currentColor" />
                </button>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-heading font-bold text-base leading-snug">
                    Mansar Sacred Lake
                  </h3>
                  <div className="text-xs text-stone-200 mt-0.5 truncate">
                    Forest fringe, sacred carp feeding & Sheshnag shrine
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white flex items-center justify-between text-xs border-t border-[#F1E9E0]">
                <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                  <Navigation size={13} className="text-[#9E4A0C]" />
                  <span>62 km from Jammu City</span>
                </div>

                <button
                  onClick={() => navigate('/explore/attr_mansar_lake')}
                  className="text-[#9E4A0C] font-bold hover:underline flex items-center gap-1"
                >
                  <span>Explore Guide</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Destination Card 4: Suchetgarh Border Post */}
          {savedSpots.suchetgarh && (filterCategory === 'all' || filterCategory === 'border') && (
            <div className="bg-white border border-[#EBE4DC] rounded-2xl overflow-hidden shadow-sm group">
              <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                <img
                  src={JAMMU_SPOT_IMAGES.attr_suchetgarh_border}
                  alt="Suchetgarh Border Post"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Indian_Army_Jammu.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#B91C1C]/90 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
                  <span>🚩</span>
                  <span>Retreat at 17:00</span>
                </span>

                <button
                  onClick={(e) => toggleSpotBookmark('suchetgarh', e)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-red-600 hover:scale-110 transition-transform"
                >
                  <Bookmark size={15} fill="currentColor" />
                </button>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-heading font-bold text-base leading-snug">
                    Suchetgarh Border Post
                  </h3>
                  <div className="text-xs text-stone-200 mt-0.5 truncate">
                    Historic Octroi post & ceremonial parade
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white flex items-center justify-between text-xs border-t border-[#F1E9E0]">
                <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                  <Clock size={13} className="text-[#9E4A0C]" />
                  <span>Entry closes 16:30</span>
                </div>

                <button
                  onClick={() => setShowGuidelinesModal(true)}
                  className="text-[#9E4A0C] font-bold hover:underline flex items-center gap-1"
                >
                  <span>View Pass Guidelines</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* User Custom Saved Plans (if any) */}
          {customPlans.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="font-heading font-bold text-sm text-ink">
                Custom Saved Itineraries ({customPlans.length})
              </h3>
              {customPlans.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setResult({
                      planId: p.id,
                      generatedAt: p.createdAt,
                      bucket: p.bucket,
                      mustLeaveBy: p.departureTime,
                      mustBeAtDepartureBy: p.departureTime,
                      timeline: p.timeline,
                      warnings: p.warnings,
                      explanations: ['Saved offline plan reloaded.'],
                      excluded: [],
                      assumptions: {},
                      totalWalkKm: 1.5,
                      usableMinutes: 240,
                    });
                    navigate('/plan/result');
                  }}
                  className="p-3 bg-white border border-[#EBE4DC] rounded-xl flex items-center justify-between cursor-pointer hover:border-[#9E4A0C]/40 transition-all shadow-xs"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#9E4A0C] bg-[#FCEFE7] px-2 py-0.5 rounded">
                      {p.bucket} Plan
                    </span>
                    <h4 className="font-heading font-bold text-sm text-ink mt-1">{p.title}</h4>
                    <div className="text-xs text-stone-500 mt-0.5">Return by {p.departureTime}</div>
                  </div>
                  <ChevronRight size={16} className="text-stone-400" />
                </div>
              ))}
            </div>
          )}

          {/* 5. Offline Data Storage Card */}
          <div className="bg-white border border-[#EBE4DC] rounded-2xl p-4 space-y-3.5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FCEFE7] text-[#9E4A0C] flex items-center justify-center shrink-0">
                  <HardDrive size={20} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-ink">
                    Offline Data Storage
                  </h3>
                  <p className="text-[11px] text-stone-600">
                    Full topographic map & pilgrimage circuits
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-[#E6F7F2] text-[#085444] text-[10px] font-bold border border-[#BCE8DD]">
                Vector v2.4
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1.5">
                <span>Jammu Division Full Vector Pack</span>
                <span className="text-ink font-bold">184 MB</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div className="h-full bg-[#9E4A0C] rounded-full w-full"></div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#15803D] font-bold mt-1.5">
                <CheckCircle2 size={13} />
                <span>100% Up to date • Last verified today</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F1E9E0]">
              <div className="flex items-center gap-2 text-xs text-stone-700 font-medium">
                <Wifi size={15} className="text-[#9E4A0C]" />
                <span>Auto-update maps on Wi-Fi</span>
              </div>
              <button
                type="button"
                onClick={() => setAutoUpdateWifi(!autoUpdateWifi)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  autoUpdateWifi ? 'bg-[#9E4A0C]' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                    autoUpdateWifi ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={() => setShowClearModal(true)}
              className="w-full py-2.5 rounded-xl border border-[#F3D7C5] bg-white text-[#9E4A0C] font-bold text-xs hover:bg-[#FCEFE7] transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>Clear offline cache / Reset local data</span>
            </button>
          </div>

          {/* 6. Emergency & Directory Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-black text-base text-ink">
                Emergency & Directory
              </h2>
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                <span>24x7 Active</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <a
                href="tel:112"
                className="bg-white border border-[#EBE4DC] rounded-xl p-3 text-center space-y-1 hover:border-red-300 transition-colors shadow-xs group"
              >
                <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <ShieldCheck size={16} />
                </div>
                <div className="font-heading font-bold text-xs text-ink">112 ERSS</div>
                <div className="text-[10px] text-stone-500">Police Central</div>
              </a>

              <a
                href="tel:01991232029"
                className="bg-white border border-[#EBE4DC] rounded-xl p-3 text-center space-y-1 hover:border-[#9E4A0C]/40 transition-colors shadow-xs group"
              >
                <div className="w-8 h-8 rounded-full bg-[#FCEFE7] text-[#9E4A0C] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <PhoneCall size={16} />
                </div>
                <div className="font-heading font-bold text-xs text-ink">Tourist Help</div>
                <div className="text-[10px] text-stone-500">Katra Desk</div>
              </a>

              <a
                href="tel:01912584211"
                className="bg-white border border-[#EBE4DC] rounded-xl p-3 text-center space-y-1 hover:border-emerald-300 transition-colors shadow-xs group"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <span className="font-bold text-base leading-none">✚</span>
                </div>
                <div className="font-heading font-bold text-xs text-ink">Hospital</div>
                <div className="text-[10px] text-stone-500">Jammu Civil</div>
              </a>
            </div>
          </div>

          {/* 7. Prepaid Taxi Rate Chart Card */}
          <div
            onClick={() => setShowTaxiModal(true)}
            className="bg-white border border-[#EBE4DC] rounded-2xl p-3.5 shadow-sm hover:border-[#9E4A0C]/40 cursor-pointer transition-all flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#1D4ED8] shrink-0 group-hover:scale-105 transition-transform">
                <TaxiIcon size={22} color="#1D4ED8" />
              </div>

              <div>
                <h3 className="font-heading font-bold text-sm text-ink group-hover:text-[#9E4A0C] transition-colors">
                  Prepaid Taxi Rate Chart
                </h3>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Govt J&K approved Katra, Patnitop & Airport tariffs
                </p>
              </div>
            </div>

            <div className="p-2 rounded-lg text-stone-500 group-hover:text-[#9E4A0C] transition-colors">
              <ChevronRight size={18} />
            </div>
          </div>

          {/* 8. App Language Selector */}
          <div className="bg-white border border-[#EBE4DC] rounded-2xl p-3.5 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-ink">
              <span className="text-[#9E4A0C] text-base">文A</span>
              <span>App Language</span>
            </div>

            <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'en'
                    ? 'bg-[#9E4A0C] text-white shadow-xs'
                    : 'text-stone-600 hover:text-ink'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  language === 'hi'
                    ? 'bg-[#9E4A0C] text-white shadow-xs'
                    : 'text-stone-600 hover:text-ink'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => handleLanguageChange('hi')}
                className="px-2.5 py-1 rounded-lg text-xs font-medium text-stone-500 hover:text-ink transition-colors"
                title="Dogri localized pack"
              >
                डोगरी
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === 'plans' ? (
        /* Tab 2: Previous Plan Trips */
        <div className="space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pt-1">
            <div>
              <h2 className="font-heading font-black text-lg text-ink">
                Previous Plan Trips
              </h2>
              <p className="text-xs text-stone-600">
                Saved offline itineraries • Ready for offline field navigation
              </p>
            </div>
            <button
              onClick={() => navigate('/plan')}
              className="px-3 py-1.5 rounded-full bg-[#9E4A0C] text-white text-xs font-bold hover:bg-[#863D0A] transition-colors shadow-xs"
            >
              + Create New
            </button>
          </div>

          <div className="space-y-3">
            {customPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => {
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
                }}
                className="bg-white border border-[#EBE4DC] rounded-2xl p-4 shadow-sm hover:border-[#9E4A0C]/40 cursor-pointer transition-all space-y-2.5 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#FCEFE7] text-[#9E4A0C] border border-[#F3D7C5]">
                      {plan.bucket} Plan
                    </span>
                    <h3 className="font-heading font-bold text-base text-ink group-hover:text-[#9E4A0C] transition-colors mt-1">
                      {plan.title}
                    </h3>
                  </div>

                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await db.savedPlans.delete(plan.id);
                      setCustomPlans((prev) => prev.filter((p) => p.id !== plan.id));
                    }}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete plan"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Timeline Route Stops */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-600">
                  {plan.timeline
                    .filter((t) => t.type === 'visit' || t.type === 'buffer')
                    .map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-stone-50 border border-stone-200 text-stone-700"
                      >
                        {item.label}
                      </span>
                    ))}
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-[#F1E9E0]">
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-[#9E4A0C]" />
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
      ) : (
        /* Tab 3: Downloaded Offline Packs */
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-[#E6F7F2] border border-[#BCE8DD] rounded-2xl p-4 text-[#085444] space-y-2">
            <div className="flex items-center gap-2 font-heading font-bold text-sm">
              <CheckCircle2 size={16} />
              <span>Offline System Active (184 MB)</span>
            </div>
            <p className="text-xs leading-relaxed text-[#085444]/90">
              All vector road networks, heritage GPS pins, audio chronicles, and emergency numbers are cached locally. You can explore Jammu without cellular network or Wi-Fi.
            </p>
          </div>

          <div className="space-y-2.5">
            {[
              {
                title: 'Jammu Division Full Vector Pack',
                size: '184 MB',
                status: 'Installed & Verified',
                desc: 'Streets, contour lines, POIs, Bahu Fort, Amar Mahal',
              },
              {
                title: 'Katra & Vaishno Devi Pilgrimage Corridor',
                size: '64 MB',
                status: 'Installed',
                desc: 'Baan Ganga, Ardhkuwari, Bhawan, Bhairon temple topo',
              },
              {
                title: 'Bhaderwah & Chenab Highlands Topo Pack',
                size: '72 MB',
                status: 'Downloaded',
                desc: 'Jai Valley, Padri Pass, Seoj Meadow offline routes',
              },
              {
                title: 'Patnitop & Sanasar Trekking Trails',
                size: '38 MB',
                status: 'Ready to Download',
                desc: 'Conifer trails, paragliding LZ, Madhatop routes',
              },
            ].map((pack, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#EBE4DC] rounded-2xl p-3.5 shadow-sm space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-ink">{pack.title}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">{pack.desc}</p>
                  </div>
                  <span className="text-xs font-black text-ink shrink-0">{pack.size}</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#F1E9E0]">
                  <span className="text-[#15803D] font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>{pack.status}</span>
                  </span>
                  <button
                    onClick={() => {
                      showToast(`Verified: ${pack.title} checksum valid & cached locally`);
                    }}
                    className="text-[#9E4A0C] font-bold hover:underline flex items-center gap-1 apple-press"
                  >
                    <RefreshCw size={12} />
                    <span>Re-verify</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Prepaid Taxi Rate Chart */}
      {showTaxiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-[#EBE4DC] rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <TaxiIcon size={20} color="#9E4A0C" />
                <h3 className="font-heading font-bold text-base text-ink">
                  Prepaid Taxi Rate Chart
                </h3>
              </div>
              <button
                onClick={() => setShowTaxiModal(false)}
                className="p-1 rounded-full text-stone hover:bg-stone-100"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Government of Jammu & Kashmir officially capped point-to-point tariffs. No bargaining required at official station prepaid booths.
            </p>

            <div className="space-y-2 text-xs">
              {[
                { route: 'Jammu Tawi ➔ Katra Base', taxi: '₹1,450', car: '₹1,200', bus: '₹85' },
                { route: 'Jammu Airport ➔ Old City', taxi: '₹350', car: '₹300', bus: '₹20' },
                { route: 'Jammu ➔ Patnitop Hill Station', taxi: '₹2,800', car: '₹2,400', bus: '₹180' },
                { route: 'Jammu ➔ Bhaderwah / Jai Valley', taxi: '₹4,200', car: '₹3,600', bus: '₹260' },
                { route: 'Jammu City ➔ Suchetgarh Border', taxi: '₹850 (Round)', car: '₹750', bus: '₹35' },
              ].map((item, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1">
                  <div className="font-bold text-ink">{item.route}</div>
                  <div className="flex items-center justify-between text-[11px] text-stone-600 pt-1">
                    <span className="flex items-center gap-1">
                      <TaxiIcon size={13} color="#9E4A0C" /> {item.taxi}
                    </span>
                    <span className="flex items-center gap-1">
                      <PrivateCarIcon size={13} color="#085444" /> {item.car}
                    </span>
                    <span className="flex items-center gap-1">
                      <CityBusIcon size={13} color="#2563EB" /> {item.bus}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setShowTaxiModal(false);
                navigate('/transport');
              }}
              className="w-full py-2.5 rounded-xl bg-[#9E4A0C] text-white font-bold text-xs hover:bg-[#863D0A] transition-colors"
            >
              Open Full Transit Guide
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Notifications */}
      {showNotifModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-[#EBE4DC] rounded-3xl p-5 max-w-sm w-full space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="font-heading font-bold text-base text-ink flex items-center gap-1.5">
                <Bell size={18} className="text-[#9E4A0C]" />
                <span>Field Advisories</span>
              </h3>
              <button
                onClick={() => setShowNotifModal(false)}
                className="p-1 rounded-full text-stone hover:bg-stone-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F0FDF4] border border-[#DCFCE7] space-y-1">
                <div className="font-bold text-[#15803D]">Vector Map Pack v4.2 Active</div>
                <div className="text-stone-600 text-[11px]">
                  All Jammu division roads and trails are loaded offline into device cache.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] space-y-1">
                <div className="font-bold text-red-700">Suchetgarh Border Retreat</div>
                <div className="text-stone-600 text-[11px]">
                  Ceremony timings scheduled for 17:00 IST today. Public entry closes at 16:30.
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] space-y-1">
                <div className="font-bold text-blue-700">Vaishno Devi Bhawan Weather</div>
                <div className="text-stone-600 text-[11px]">
                  18°C, clear visibility, cable car and helicopter operations running on schedule.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowNotifModal(false)}
              className="w-full py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs hover:bg-stone-200 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Suchetgarh Pass Guidelines */}
      {showGuidelinesModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-[#EBE4DC] rounded-3xl p-5 max-w-sm w-full space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <h3 className="font-heading font-bold text-base text-ink">
                Suchetgarh Border Guidelines
              </h3>
              <button
                onClick={() => setShowGuidelinesModal(false)}
                className="p-1 rounded-full text-stone hover:bg-stone-100"
              >
                <X size={18} />
              </button>
            </div>

            <ul className="text-xs text-stone-600 space-y-2 list-disc pl-4">
              <li>Carry a valid government photographic ID (Aadhaar, Passport, Voter Card).</li>
              <li>Entry is free for all Indian citizens and international registered tourists.</li>
              <li>Ceremony begins promptly at 17:00 IST; visitor gate closes at 16:30.</li>
              <li>Photography is permitted in the designated spectator pavilion.</li>
            </ul>

            <button
              onClick={() => setShowGuidelinesModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#9E4A0C] text-white font-bold text-xs hover:bg-[#863D0A] transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Clear Cache Confirmation */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-[#EBE4DC] rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl">
            <h4 className="font-heading text-base font-bold text-ink">
              Clear Local Cache?
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              This will reset custom cached itineraries on your device. The permanent core vector map and spot directory will be retained.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2 rounded-xl border border-stone-300 text-xs font-semibold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearCache}
                className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Google Authentication */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSuccess={() => {
          loadPlans();
        }}
      />
    </div>
  );
};
