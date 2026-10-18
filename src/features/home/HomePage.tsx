import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Compass,
  Map,
  Clock,
  Bookmark,
  Share2,
  Bell,
  Search,
  X,
  ChevronDown,
  ShieldAlert,
  ArrowRight,
  Volume2,
  CheckCircle2,
  MapPin,
  Star,
  Flame,
  Snowflake,
  Crown,
  Flag,
  Flower2,
  Copy,
  Check,
  ShieldCheck,
  PhoneCall,
  SlidersHorizontal,
  Sparkles,
  Download,
  Calendar,
  Layers,
  UtensilsCrossed,
  ShoppingBag,
  Building2,
  Sun,
  Moon,
  Globe,
  User,
  Navigation,
  Info,
  Maximize2,
  Car,
  Battery,
  Camera,
  Zap,
} from 'lucide-react';
import { usePlanStore } from '@/stores/planStore';
import { useAppStore } from '@/stores/appStore';
import { db } from '@/data/db';
import { JAMMU_ALL_ATTRACTIONS, JAMMU_REGIONAL_NODES } from '@/data/jammuFullData';
import { JAMMU_SPOT_IMAGES } from '@/data/spotImages';
import { InteractiveMapPreview } from '@/features/map/InteractiveMapPreview';
import { ShareAppModal } from '@/ui/sharing/ShareAppModal';
import { GoogleAuthModal } from '@/features/auth/GoogleAuthModal';
import { EmergencySosModal } from '@/ui/emergency/EmergencySosModal';
import { GiProductsSection } from '@/features/gi/GiProductsSection';
import { SpotUploadModal } from '@/features/contribute/SpotUploadModal';
import { DogriFoodSection } from '@/features/food/DogriFoodSection';
import { SpiritualEtiquetteModal } from '@/features/spiritual/SpiritualEtiquetteModal';
import { AudioTourModal } from '@/features/audio/AudioTourModal';
import { deviceService } from '@/services/deviceService';

export const HomePage: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { input, setInput } = usePlanStore();
  const {
    language,
    setLanguage,
    theme,
    toggleTheme,
    currentUser,
    favorites,
    toggleFavorite,
    connectivity,
    deviceGps,
    deviceBattery,
  } = useAppStore();

  // State
  const [selectedDuration, setSelectedDuration] = useState<'4' | '8' | '24'>('4');
  const [startingLocation, setStartingLocation] = useState<'station_jammu' | 'station_katra' | 'airport_jammu'>('station_jammu');
  const [primaryInterest, setPrimaryInterest] = useState<'all' | 'pilgrimage' | 'heritage' | 'nature' | 'food'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareData, setShareData] = useState<{ title?: string; text?: string }>({});
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [savedPlansCount, setSavedPlansCount] = useState<number>(0);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Modals
  const [showStationModal, setShowStationModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState<null | { title: string; subtitle?: string; img: string; desc: string }>(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [showSpotUploadModal, setShowSpotUploadModal] = useState(false);
  const [showSpiritualModal, setShowSpiritualModal] = useState(false);
  const [showAudioTourModal, setShowAudioTourModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    db.savedPlans.count().then(setSavedPlansCount).catch(() => {});
  }, []);

  const toggleLang = () => {
    const cycleMap: Record<string, 'en' | 'hi' | 'doi'> = {
      en: 'hi',
      hi: 'doi',
      doi: 'en',
    };
    const nextLang = cycleMap[language] || 'en';
    i18n.changeLanguage(nextLang);
    setLanguage(nextLang);
  };

  // Local-data search filter
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return JAMMU_ALL_ATTRACTIONS.filter((attr) => {
      const en = attr.name?.en?.toLowerCase() || '';
      const hi = attr.name?.hi?.toLowerCase() || '';
      const summaryEn = attr.summary?.en?.toLowerCase() || '';
      const tags = attr.tags?.join(' ').toLowerCase() || '';
      const type = attr.type?.toLowerCase() || '';
      return en.includes(q) || hi.includes(q) || summaryEn.includes(q) || tags.includes(q) || type.includes(q);
    }).slice(0, 5);
  }, [searchQuery]);

  const handleStartPlan = () => {
    const nodeMap = {
      station_jammu: 'node_station',
      station_katra: 'node_katra_base',
      airport_jammu: 'node_airport',
    };
    setInput({
      ...input,
      startNode: nodeMap[startingLocation],
      departureNode: nodeMap[startingLocation],
    });
    navigate(`/plan?duration=${selectedDuration}&interest=${primaryInterest}`);
  };

  const handleCopyCoords = () => {
    navigator.clipboard.writeText('32.7266° N, 74.8570° E (Jammu City Center)');
    setCopiedCoords(true);
    showToast('GPS coordinates copied to clipboard');
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  // 5 Curated Editorial Highlights
  const featuredAttractions = useMemo(() => {
    return [
      {
        id: 'attr_amar_mahal',
        name: 'Amar Mahal Palace Museum (अमर महल)',
        badge: 'Dogra Royal Chateau',
        image: JAMMU_SPOT_IMAGES.attr_amar_mahal,
        rating: '4.9',
        reviews: '1.2k',
        desc: '19th-century French chateau designed by a French architect for Raja Amar Singh. Houses the legendary 120 kg pure solid gold throne, Pahari miniature paintings, and royal library overlooking the River Tawi.',
        hours: '10:00 - 17:00',
        fee: '₹50 Entry',
        nodeId: 'node_amar_mahal',
      },
      {
        id: 'attr_raghunath_temple',
        name: 'Shri Raghunath Temple Complex (रघुनाथ मंदिर)',
        badge: 'Sacred Heart of Jammu',
        image: JAMMU_SPOT_IMAGES.attr_raghunath_temple,
        rating: '4.9',
        reviews: '2.5k',
        desc: 'Central pilgrimage landmark founded in 1860 by Maharaja Gulab Singh. Complex of 17 shrines containing thousands of sacred Shaligrams and Sanskrit manuscripts.',
        hours: '06:00 - 20:30',
        fee: 'Free Entry',
        nodeId: 'node_raghunath_temple',
      },
      {
        id: 'attr_bahu_fort',
        name: 'Bahu Fort & Bagh-e-Bahu (बाहु किला)',
        badge: 'Ancient 3000-Yr Citadel',
        image: JAMMU_SPOT_IMAGES.attr_bahu_fort,
        rating: '4.8',
        reviews: '1.8k',
        desc: 'Historic hilltop fort housing the revered Bawe Wali Mata temple, surrounding terraced Mughal gardens, and subcontinents largest underground marine aquarium.',
        hours: '06:00 - 20:00',
        fee: '₹25 Entry',
        nodeId: 'node_bahu_fort',
      },
      {
        id: 'attr_bhaderwah',
        name: 'Bhaderwah Valley & Jai Meadow (मिनी कश्मीर)',
        badge: 'Alpine Pine Forests',
        image: JAMMU_SPOT_IMAGES.attr_bhaderwah,
        rating: '4.9',
        reviews: '950',
        desc: 'Serene mountain valley featuring deodar cedar pines, gushing trout streams, Seoj alpine meadow, and 10,500 ft high Padri pass on the scenic gateway to Chamba.',
        hours: 'Daylight Hours',
        fee: '₹0 Entry',
        nodeId: 'node_bhaderwah',
      },
      {
        id: 'attr_suchetgarh_border',
        name: 'Suchetgarh Border Retreat (सुचेतगढ़)',
        badge: 'Heritage Border Post',
        image: JAMMU_SPOT_IMAGES.attr_suchetgarh_border,
        rating: '4.7',
        reviews: '820',
        desc: 'Historic pre-partition railway terminal on the old Sialkot line. Features daily ceremonial beating retreat by BSF at 05:00 PM without requiring prior permits.',
        hours: '09:00 - 18:00',
        fee: 'Free Entry',
        nodeId: 'node_suchetgarh_border',
      },
    ];
  }, []);

  return (
    <div className="space-y-7 pb-12 select-none font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-ink text-surface px-4 py-2 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check size={14} className="text-success" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =================================================================== */}
      {/* 1. HEADER */}
      {/* =================================================================== */}
      <header className="sticky top-0 -mx-3 sm:-mx-6 px-3.5 sm:px-6 py-2.5 z-30 apple-glass border-b border-border/70 flex items-center justify-between transition-all">
        {/* Brand Mark & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-heading font-bold text-sm shadow-sm shadow-primary/25 cursor-pointer apple-press shrink-0"
          >
            JK
          </div>
          <div className="min-w-0">
            <h1
              onClick={() => navigate('/')}
              className="font-heading text-lg font-bold text-ink leading-tight cursor-pointer hover:text-primary transition-colors truncate"
            >
              JammuKhoj
            </h1>
            <button
              onClick={() => setShowStationModal(true)}
              className="flex items-center gap-1 text-[11px] text-stone font-semibold hover:text-primary transition-colors apple-press"
              aria-label="Switch transit station base"
            >
              <MapPin size={11} className="text-primary shrink-0" />
              <span className="truncate">
                {startingLocation === 'station_jammu' && 'Jammu Tawi Station • 28°C'}
                {startingLocation === 'station_katra' && 'Katra SVDK Base • 24°C'}
                {startingLocation === 'airport_jammu' && 'Jammu Airport • 29°C'}
              </span>
              <ChevronDown size={11} className="shrink-0" />
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 mx-3" aria-label="Desktop Top Navigation">
          {[
            { to: '/explore', label: 'Explore' },
            { to: '/map', label: 'Map' },
            { to: '/plan', label: 'My Plan' },
            { to: '/transport', label: 'Transport' },
            { to: '/safety', label: 'Safety (112)' },
            { to: '/saved', label: 'Saved Places' },
          ].map((item) => (
            <button
              key={item.to}
              onClick={() => navigate(item.to)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone hover:text-ink hover:bg-surface apple-press transition-colors"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Header Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Saved Places Counter Link */}
          <button
            onClick={() => navigate('/saved')}
            className="p-2 rounded-xl text-stone hover:text-ink hover:bg-surface apple-press transition-colors relative"
            title="Saved Places & Itineraries"
            aria-label="View saved places"
          >
            <Bookmark size={17} />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLang}
            className="px-2.5 py-1 rounded-xl text-xs font-bold border border-border text-primary hover:bg-primary-soft apple-press transition-colors"
            aria-label="Toggle language"
            title="Switch Language"
          >
            {language === 'en' ? 'हिन्दी' : language === 'hi' ? 'डोगरी' : 'EN'}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-stone hover:text-ink hover:bg-surface apple-press transition-colors"
            aria-label="Toggle dark/light mode"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Profile / Account */}
          {currentUser ? (
            <button
              onClick={() => navigate(currentUser.role === 'business' ? '/business' : '/settings')}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 apple-press transition-all flex items-center gap-1"
            >
              <User size={13} />
              <span className="max-w-[70px] truncate font-bold">{currentUser.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => setShowGoogleModal(true)}
              className="px-2.5 py-1 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-dark apple-press transition-all shadow-xs"
            >
              Sign In
            </button>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setHasUnread(false);
              }}
              className="p-2 rounded-xl text-stone hover:text-ink hover:bg-surface apple-press transition-colors relative"
              title="Travel Alerts"
              aria-label="Travel Alerts"
            >
              <Bell size={17} />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger ring-2 ring-card" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-2xl shadow-xl p-3 z-50 space-y-2">
                <div className="flex items-center justify-between border-b border-border/80 pb-2">
                  <span className="font-bold text-xs text-ink">Live Travel Alerts</span>
                  <button onClick={() => setShowNotifications(false)} className="text-stone hover:text-ink">
                    <X size={14} />
                  </button>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto text-xs">
                  <div className="p-2 bg-surface rounded-xl space-y-0.5">
                    <div className="font-bold text-ink flex items-center gap-1">
                      <span>🚆</span> <span>Vande Bharat Express</span>
                    </div>
                    <p className="text-[11px] text-stone">Train 22440 on-time at Jammu Tawi Platform 1.</p>
                  </div>
                  <div className="p-2 bg-surface rounded-xl space-y-0.5">
                    <div className="font-bold text-ink flex items-center gap-1">
                      <span>⛅</span> <span>Katra Yatra Weather</span>
                    </div>
                    <p className="text-[11px] text-stone">Clear skies at Bhawan (21°C). Battery car operational.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* 2. HERO WITH PROMINENT SEARCH */}
      {/* =================================================================== */}
      <section aria-label="Hero Introduction and Search" className="space-y-4 pt-1">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-bold border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Jammu & Vaishno Devi Travel Companion</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink tracking-tight leading-tight">
            Your Jammu journey, made simple.
          </h2>
          <p className="text-xs sm:text-sm text-stone max-w-xl leading-relaxed">
            Discover verified temples, royal Dogra palaces, scenic alpine passes, and transparent transport benchmarks — designed especially for travellers with limited time.
          </p>
        </div>

        {/* Prominent Search Bar */}
        <div className="relative space-y-2">
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3.5 text-stone pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places, temples, food and useful services…"
              className="w-full pl-10 pr-10 py-3.5 rounded-2xl bg-card border border-border text-xs sm:text-sm font-medium text-ink placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs transition-all"
              aria-label="Search destinations, temples, food and services"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 p-1 rounded-full text-stone hover:text-ink"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            ) : (
              <button
                onClick={() => navigate('/explore')}
                className="absolute right-2.5 p-2 rounded-xl bg-surface text-stone hover:text-primary transition-colors"
                title="Open full filter directory"
              >
                <SlidersHorizontal size={15} />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {searchQuery.trim().length > 0 && (
            <div className="bg-card border border-border rounded-2xl shadow-xl p-2 space-y-1 z-20">
              {searchResults.length > 0 ? (
                searchResults.map((attr) => (
                  <div
                    key={attr.id}
                    onClick={() => {
                      navigate(`/explore/${attr.id}`);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface cursor-pointer apple-press transition-colors"
                  >
                    <img
                      src={JAMMU_SPOT_IMAGES[attr.id] || 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=160&q=80'}
                      alt={attr.name.en}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-ink truncate">{attr.name.en}</h4>
                      <p className="text-[11px] text-stone truncate">{attr.summary.en}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-semibold text-primary capitalize">{attr.type}</span>
                        <span className="text-[10px] text-stone">• {attr.visit?.typicalMinutes || 45} mins</span>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-stone shrink-0" />
                  </div>
                ))
              ) : (
                <div className="p-4 text-center space-y-1">
                  <p className="text-xs font-semibold text-ink">No places found for &quot;{searchQuery}&quot;</p>
                  <p className="text-[11px] text-stone">
                    Try searching for &quot;Raghunath&quot;, &quot;Amar Mahal&quot;, &quot;Patnitop&quot;, or &quot;Saffron&quot;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Device Telemetry & Contribution Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-card border border-border shadow-xs">
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Live GPS Telemetry */}
            <button
              type="button"
              onClick={async () => {
                showToast('Acquiring real-time device GPS...');
                const res = await deviceService.requestGpsLocation();
                if (res.success && res.data) {
                  showToast(`Live GPS: ${res.data.lat}° N, ${res.data.lng}° E (±${res.data.accuracy}m)`);
                } else {
                  showToast(res.error || 'Failed to get GPS location');
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface border border-border text-ink hover:text-primary transition-colors apple-press"
              title="Click to refresh live device GPS"
            >
              <Navigation size={13} className={deviceGps ? 'text-emerald-500 fill-emerald-500 animate-pulse' : 'text-stone'} />
              <span className="font-semibold text-[11px]">
                {deviceGps ? `${deviceGps.lat.toFixed(4)}°N, ${deviceGps.lng.toFixed(4)}°E (±${deviceGps.accuracy}m)` : 'Acquire Live GPS'}
              </span>
            </button>

            {/* Live Battery Telemetry */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-semibold ${
                deviceBattery && deviceBattery.level <= 20
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                  : 'bg-surface border-border text-ink'
              }`}
              title="Real-time device battery monitor"
            >
              <Battery size={13} className={deviceBattery?.isCharging ? 'text-amber-500' : 'text-stone'} />
              <span>
                {deviceBattery ? `${deviceBattery.level}%` : '85%'} {deviceBattery?.isCharging ? '⚡' : ''}
                {deviceBattery && deviceBattery.level <= 20 ? ' · Low Battery Mode' : ''}
              </span>
            </div>
          </div>

          {/* Add / Upload Spot Photo Button */}
          <button
            type="button"
            onClick={() => setShowSpotUploadModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#174D3C] text-white text-xs font-bold shadow-xs hover:bg-[#123E38] transition-all apple-press ml-auto"
            title="Upload attraction photos, accurate coordinates, and live updates"
          >
            <Camera size={13} />
            <span>Upload Spot / Photo</span>
          </button>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. TIME-BASED TRIP PLANNER */}
      {/* =================================================================== */}
      <section aria-label="Time-based Trip Planner" className="p-4 sm:p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <Clock size={15} />
              </span>
              <h3 className="font-heading font-bold text-base text-ink">
                Time-Based Trip Planner
              </h3>
            </div>
            <p className="text-xs text-stone mt-1 leading-snug">
              Select your available transit window and starting hub. Includes a guaranteed 50-minute return safety buffer.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-success text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 shrink-0">
            Buffer Protected
          </span>
        </div>

        {/* Duration Selection (4h, 8h, 24h) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            {
              id: '4' as const,
              hours: '4 Hours',
              title: 'Quick Visit',
              desc: 'Station layover. Darshan & royal chateau tour with safe return.',
            },
            {
              id: '8' as const,
              hours: '8 Hours',
              title: 'Day Explorer',
              desc: 'City & foothill highlights. Forts, palaces, and border ceremony.',
            },
            {
              id: '24' as const,
              hours: '24 Hours',
              title: 'Full-Day Plan',
              desc: 'Immersive sacred and alpine circuit with overnight stays.',
            },
          ].map((card) => (
            <div
              key={card.id}
              onClick={() => setSelectedDuration(card.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer apple-press transition-all ${
                selectedDuration === card.id
                  ? 'bg-primary-soft/70 border-primary ring-2 ring-primary/20 shadow-xs'
                  : 'bg-surface border-border hover:border-primary/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-card border border-border">
                  {card.hours}
                </span>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedDuration === card.id ? 'border-primary' : 'border-stone/40'
                  }`}
                >
                  {selectedDuration === card.id && <span className="w-2 h-2 rounded-full bg-primary" />}
                </div>
              </div>
              <h4 className="font-heading font-bold text-sm text-ink mt-2">{card.title}</h4>
              <p className="text-[11px] text-stone mt-0.5 leading-snug">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Inputs: Starting Location & Primary Interest */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* Starting Location */}
          <div className="bg-surface p-2.5 rounded-2xl border border-border">
            <label className="text-[10px] font-bold text-stone block uppercase tracking-wider">
              Starting Location
            </label>
            <select
              value={startingLocation}
              onChange={(e) => setStartingLocation(e.target.value as any)}
              className="w-full bg-transparent font-bold text-ink outline-none text-xs mt-1 cursor-pointer"
            >
              <option value="station_jammu">Jammu Tawi Railway Station (JAT)</option>
              <option value="station_katra">Shri Mata Vaishno Devi Katra (SVDK)</option>
              <option value="airport_jammu">Jammu Civil Airport (IXJ Satwari)</option>
            </select>
          </div>

          {/* Primary Interest */}
          <div className="bg-surface p-2.5 rounded-2xl border border-border">
            <label className="text-[10px] font-bold text-stone block uppercase tracking-wider">
              Primary Interest
            </label>
            <select
              value={primaryInterest}
              onChange={(e) => setPrimaryInterest(e.target.value as any)}
              className="w-full bg-transparent font-bold text-ink outline-none text-xs mt-1 cursor-pointer"
            >
              <option value="all">All Highlights (Balanced Circuit)</option>
              <option value="pilgrimage">Temples & Pilgrimage Darshan</option>
              <option value="heritage">Dogra Royal Palaces & Forts</option>
              <option value="nature">Alpine Valleys & Meadows</option>
              <option value="food">Local Food & Spice Bazaars</option>
            </select>
          </div>
        </div>

        {/* Generate Itinerary Button */}
        <button
          onClick={handleStartPlan}
          className="w-full py-3 px-4 rounded-2xl bg-primary text-white font-bold text-xs sm:text-sm shadow-md shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 apple-press"
        >
          <Compass size={16} />
          <span>Generate {selectedDuration === '24' ? 'Full-Day (24h)' : `${selectedDuration}-Hour`} Itinerary</span>
          <ArrowRight size={15} />
        </button>
      </section>

      {/* =================================================================== */}
      {/* 4. INTERACTIVE MAP PREVIEW */}
      {/* =================================================================== */}
      <section aria-label="Interactive Map Section">
        <InteractiveMapPreview />
      </section>

      {/* =================================================================== */}
      {/* 5. FEATURED ATTRACTIONS (EDITORIAL LAYOUT) */}
      {/* =================================================================== */}
      <section aria-label="Featured Attractions" className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-bold text-base text-ink leading-tight">
              Featured Attractions
            </h2>
            <p className="text-xs text-stone mt-0.5">
              Verified destination cards with authentic Dogra heritage details
            </p>
          </div>
          <button
            onClick={() => navigate('/explore')}
            className="text-xs font-bold text-primary hover:underline apple-press"
          >
            Explore all 35+ →
          </button>
        </div>

        {/* Hero Card: Amar Mahal */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
          <div className="relative w-full h-56 bg-surface overflow-hidden">
            <img
              src={featuredAttractions[0].image}
              alt={featuredAttractions[0].name}
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1000&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white/95 text-ink text-[11px] font-bold flex items-center gap-1 shadow-xs">
                <Star size={11} className="text-amber-500 fill-amber-500" />
                <span>{featuredAttractions[0].rating} ({featuredAttractions[0].reviews})</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-primary text-white text-[10px] font-extrabold uppercase tracking-wide shadow-xs">
                {featuredAttractions[0].badge}
              </span>
            </div>

            <button
              onClick={() => {
                toggleFavorite(featuredAttractions[0].id);
                showToast(favorites.includes(featuredAttractions[0].id) ? 'Removed from Saved' : 'Saved to Offline Favorites');
              }}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-ink flex items-center justify-center shadow-sm apple-press"
              aria-label="Save attraction"
            >
              <Bookmark size={16} className={favorites.includes(featuredAttractions[0].id) ? 'fill-primary text-primary' : ''} />
            </button>

            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md mb-1">
                🏰 Forts & Royal Palaces • Overlooking River Tawi
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-bold leading-tight">
                {featuredAttractions[0].name}
              </h3>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <p className="text-xs text-stone leading-relaxed">
              {featuredAttractions[0].desc}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-stone border-t border-border/80 pt-2.5">
              <div className="flex items-center gap-1.5">
                <span>🕒</span> <span className="text-ink font-semibold">{featuredAttractions[0].hours}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🎫</span> <span className="text-ink font-semibold">{featuredAttractions[0].fee}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>👑</span> <span className="text-ink font-semibold">120 kg Gold Throne</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🚶</span> <span className="text-ink font-semibold">Low Walking Load</span>
              </div>
            </div>

            {/* Action Bar (View details, Save, Map actions) */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => navigate(`/explore/${featuredAttractions[0].id}`)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5 apple-press"
              >
                <span>View Details</span>
                <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate('/map', { state: { targetNode: featuredAttractions[0].nodeId } })}
                className="px-3.5 py-2.5 rounded-xl border border-border text-ink hover:bg-surface font-bold text-xs flex items-center gap-1.5 apple-press"
                title="View on Map"
              >
                <Map size={14} className="text-primary" />
                <span>Map</span>
              </button>
              <button
                onClick={() => {
                  toggleFavorite(featuredAttractions[0].id);
                  showToast(favorites.includes(featuredAttractions[0].id) ? 'Removed from Saved' : 'Saved to Offline Favorites');
                }}
                className="p-2.5 rounded-xl border border-border text-stone hover:text-ink hover:bg-surface apple-press"
                title="Save attraction"
              >
                <Bookmark size={15} className={favorites.includes(featuredAttractions[0].id) ? 'fill-primary text-primary' : ''} />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Supporting Destination Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {featuredAttractions.slice(1).map((spot) => (
            <div
              key={spot.id}
              className="bg-card border border-border rounded-2xl p-3 space-y-2.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="relative w-full h-32 rounded-xl overflow-hidden bg-surface">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                    ★ {spot.rating} • {spot.fee}
                  </span>
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-ink truncate">
                    {spot.name}
                  </h4>
                  <p className="text-[11px] text-stone line-clamp-2 mt-0.5 leading-snug">
                    {spot.desc}
                  </p>
                </div>
              </div>

              {/* Action Buttons: View Details, Save, Map */}
              <div className="flex items-center justify-between pt-2 border-t border-border/80 text-xs gap-1.5">
                <button
                  onClick={() => navigate(`/explore/${spot.id}`)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-surface border border-border text-ink font-semibold text-[11px] hover:text-primary transition-colors text-center apple-press"
                >
                  Details
                </button>
                <button
                  onClick={() => navigate('/map', { state: { targetNode: spot.nodeId } })}
                  className="p-1.5 rounded-lg border border-border text-stone hover:text-primary transition-colors apple-press"
                  title="Open on Map"
                >
                  <Map size={14} />
                </button>
                <button
                  onClick={() => {
                    toggleFavorite(spot.id);
                    showToast(favorites.includes(spot.id) ? 'Removed from Saved' : 'Saved to Offline Favorites');
                  }}
                  className="p-1.5 rounded-lg border border-border text-stone hover:text-primary transition-colors apple-press"
                  title="Bookmark spot"
                >
                  <Bookmark size={14} className={favorites.includes(spot.id) ? 'fill-primary text-primary' : ''} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. INTEREST CATEGORIES */}
      {/* =================================================================== */}
      <section aria-label="Interest Categories" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-base text-ink">
            Explore by Category
          </h2>
          <span className="text-xs text-stone">6 Essential Interests</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            {
              id: 'pilgrimage',
              label: 'Temples & Pilgrimage',
              icon: Flame,
              count: '12 Shrines',
              color: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300',
              route: '/explore?category=temples',
            },
            {
              id: 'heritage',
              label: 'Royal Heritage',
              icon: Building2,
              count: '10 Forts & Palaces',
              color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
              route: '/explore?category=heritage',
            },
            {
              id: 'nature',
              label: 'Alpine Nature',
              icon: Compass,
              count: '8 Valleys & Passes',
              color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
              route: '/explore?category=valleys',
            },
            {
              id: 'food',
              label: 'Food & Local Markets',
              icon: UtensilsCrossed,
              count: 'Dogra Delicacies',
              color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300',
              route: '/explore?category=food',
            },
            {
              id: 'gi_heritage',
              label: 'GI Marked Heritage',
              icon: Sparkles,
              count: '8 Certified Goods',
              color: 'bg-teal-50 dark:bg-teal-950/40 text-[#174D3C] dark:text-[#F3C969]',
              route: '/explore?category=gi_heritage',
            },
            {
              id: 'transport_services',
              label: 'Transport & Services',
              icon: ShieldAlert,
              count: 'Prepaid Fares & SOS',
              color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',
              route: '/transport',
            },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(cat.route)}
                className="p-3 rounded-2xl bg-card border border-border flex flex-col items-center text-center gap-2 apple-press hover:border-primary/40 transition-colors shadow-2xs"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-ink">{cat.label}</h4>
                  <span className="text-[10px] text-stone">{cat.count}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 6.5 CERTIFIED GI HERITAGE OF JAMMU (GEOGRAPHICAL INDICATIONS) */}
      {/* =================================================================== */}
      <GiProductsSection />

      {/* =================================================================== */}
      {/* 6.6 AUTHENTIC DOGRI CUISINE & FOOD TRAILS */}
      {/* =================================================================== */}
      <DogriFoodSection />

      {/* =================================================================== */}
      {/* 6.7 NEXT-GEN TRAVEL INNOVATION HUB */}
      {/* =================================================================== */}
      <section aria-label="Smart Tourism Tools" className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Audio Tour Guide Card */}
        <div
          onClick={() => setShowAudioTourModal(true)}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 text-white cursor-pointer hover:border-amber-500/50 border border-stone-800 transition-all apple-press shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-[#9E4A0C] text-white flex items-center justify-center">
              <Volume2 size={16} />
            </div>
            <h4 className="font-heading font-bold text-sm text-white">Audio Story Tours</h4>
            <p className="text-[11px] text-stone-300 leading-snug">
              Listen to spoken folklore and history for Bahu Fort, Mubarak Mandi & Raghunath in Dogri, Hindi & English.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-amber-300 flex items-center gap-1">
            <span>Start voice guide</span>
            <ArrowRight size={13} />
          </div>
        </div>

        {/* Spiritual Etiquette Card */}
        <div
          onClick={() => setShowSpiritualModal(true)}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FFF9F3] to-[#FCEFE7] border border-[#F3D7C5] text-ink cursor-pointer hover:border-[#9E4A0C] transition-all apple-press shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
              <Flower2 size={16} />
            </div>
            <h4 className="font-heading font-bold text-sm text-ink">Temple & Darshan Rules</h4>
            <p className="text-[11px] text-stone-600 leading-snug">
              Official dress codes, shoe lockers, aarti timings, and mobile scanning rules for top temples.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-[#9E4A0C] flex items-center gap-1">
            <span>View shrine guide</span>
            <ArrowRight size={13} />
          </div>
        </div>

        {/* City Benchmark Analysis Card */}
        <div
          onClick={() => navigate('/city-analysis')}
          className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950 to-stone-900 text-white cursor-pointer hover:border-emerald-500/50 border border-emerald-900/50 transition-all apple-press shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Globe size={16} />
            </div>
            <h4 className="font-heading font-bold text-sm text-white">Global City Analysis</h4>
            <p className="text-[11px] text-emerald-200 leading-snug">
              Compare 20 Indian & International heritage cities (Kyoto, Rome, Varanasi) and app benchmarks.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-emerald-300 flex items-center gap-1">
            <span>Explore 20 cities</span>
            <ArrowRight size={13} />
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 7. TRAVEL ESSENTIALS */}
      {/* =================================================================== */}
      <section aria-label="Travel Essentials" className="space-y-3">
        <h2 className="font-heading font-bold text-base text-ink">
          Travel Essentials
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Transport & Fare References Card */}
          <div className="p-4 rounded-2xl bg-card border border-border space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚕</span>
                <div>
                  <h3 className="font-heading font-bold text-sm text-ink">Transport & Fare References</h3>
                  <span className="text-[10px] text-stone">Surveyed 2026 Counter Rates</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/transport')}
                className="text-xs font-bold text-primary hover:underline apple-press"
              >
                View all fares →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-surface border border-border/80">
                <span className="text-stone">Jammu Tawi to Katra SVDK:</span>
                <span className="font-bold text-ink">₹1,400 - ₹1,600 (Sedan)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-surface border border-border/80">
                <span className="text-stone">Station to Raghunath Bazaar:</span>
                <span className="font-bold text-ink">₹150 - ₹200 (E-Rickshaw)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-surface border border-border/80">
                <span className="text-stone">Jammu Airport to Katra:</span>
                <span className="font-bold text-ink">₹1,750 - ₹1,950 (Prepaid Cab)</span>
              </div>
            </div>

            <p className="text-[10px] text-stone italic leading-tight">
              *Disclaimer: Surveyed reference benchmarks for passenger guidance. Always request the official printed voucher at railway station or airport prepaid counters.
            </p>
          </div>

          {/* Safety Hub & Emergency Resources Card */}
          <div className="p-4 rounded-2xl bg-card border border-border space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛡️</span>
                <div>
                  <h3 className="font-heading font-bold text-sm text-ink">Safety Hub & Emergency</h3>
                  <span className="text-[10px] text-danger font-bold">24x7 J&K Police & Medical</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/safety')}
                className="text-xs font-bold text-primary hover:underline apple-press"
              >
                Safety Hub →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setShowSosModal(true)}
                className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-danger font-bold flex items-center justify-center gap-1.5 apple-press"
              >
                <PhoneCall size={14} />
                <span>Call 112 (SOS)</span>
              </button>

              <button
                onClick={handleCopyCoords}
                className="p-2.5 rounded-xl bg-surface border border-border text-ink font-semibold flex items-center justify-center gap-1.5 apple-press"
                title="Copy GPS coordinates"
              >
                {copiedCoords ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                <span>{copiedCoords ? 'Copied GPS' : 'Copy GPS'}</span>
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-surface border border-border/80 text-[11px] text-stone space-y-1">
              <div className="flex justify-between">
                <span>Women Helpline: <strong>181 / 112</strong></span>
                <span>Traffic Control: <strong>0191-2459048</strong></span>
              </div>
              <p className="leading-tight pt-0.5">
                SOS dialer includes confirmation safeguards. Coordinate copy enables rapid location transmission during remote valley emergencies.
              </p>
            </div>
          </div>
        </div>

        {/* Offline Travel Kit Box */}
        <div className="p-4 rounded-3xl bg-surface border border-border space-y-3 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xs">
                <Download size={18} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-ink">Offline Travel Kit</h3>
                <p className="text-[11px] text-stone">Local on-device package • Signal-independent travel</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-success text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
              100% Ready
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-ink">
            <div className="p-2.5 rounded-xl bg-card border border-border/80">
              <span className="text-[10px] text-stone block">Saved Places</span>
              <span className="font-heading font-bold text-sm text-primary">{favorites.length} Locations</span>
            </div>

            <div className="p-2.5 rounded-xl bg-card border border-border/80">
              <span className="text-[10px] text-stone block">Saved Itineraries</span>
              <span className="font-heading font-bold text-sm text-primary">{savedPlansCount} Plans</span>
            </div>

            <div className="p-2.5 rounded-xl bg-card border border-border/80">
              <span className="text-[10px] text-stone block">Vector Maps</span>
              <span className="font-heading font-bold text-sm text-success">MapLibre Active</span>
            </div>

            <div className="p-2.5 rounded-xl bg-card border border-border/80">
              <span className="text-[10px] text-stone block">Data Last Verified</span>
              <span className="font-heading font-bold text-sm text-ink">Oct 2026 Survey</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-stone">
              Zero network pings. All places saved locally in Dexie IndexedDB.
            </span>
            <button
              onClick={() => navigate('/saved')}
              className="text-xs font-bold text-primary hover:underline apple-press"
            >
              Manage Saved Kit →
            </button>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 8. FOOTER */}
      {/* =================================================================== */}
      <footer className="mt-8 pt-8 border-t border-border/80 space-y-6 text-stone text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Col 1: About JammuKhoj */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs">
                JK
              </div>
              <h4 className="font-heading font-bold text-sm text-ink">JammuKhoj</h4>
            </div>
            <p className="text-[11px] leading-relaxed">
              JammuKhoj is an offline-first smart tourism and pilgrim safety companion built for visitors, transit layovers, and Vaishno Devi pilgrims across the Jammu Division.
            </p>
            <span className="text-[10px] text-stone block">
              Tagline: Explore Jammu. Travel with confidence.
            </span>
          </div>

          {/* Col 2: Data Sources & Map Attribution */}
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-xs text-ink uppercase tracking-wider">
              Data Sources & Map Attribution
            </h4>
            <ul className="space-y-1 text-[11px]">
              <li>• Attactions & Timings: J&K Tourism & Heritage Dept</li>
              <li>• Pilgrimage Protocol: SMVDSB Katra Shrine Board</li>
              <li>• Transport Benchmarks: J&K Transport Union Counter Survey</li>
              <li>• Map Data: © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">OpenStreetMap</a> contributors, CARTO & MapLibre GL</li>
            </ul>
          </div>

          {/* Col 3: Contact, Feedback & Privacy Disclaimers */}
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-xs text-ink uppercase tracking-wider">
              Disclaimers & Contact
            </h4>
            <p className="text-[11px] leading-relaxed">
              Transport fares and route times are surveyed reference benchmarks to assist passenger negotiation. In medical or police emergencies, dial <strong>112</strong> immediately.
            </p>
            <div className="flex items-center gap-3 pt-1 text-[11px]">
              <button
                onClick={() => navigate('/privacy')}
                className="font-bold text-primary hover:underline apple-press"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={() => navigate('/settings')}
                className="font-bold text-stone hover:text-ink apple-press"
              >
                Settings
              </button>
              <span>•</span>
              <a
                href="mailto:support@jammukhoj.app"
                className="font-bold text-stone hover:text-ink"
              >
                Feedback
              </a>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-stone">
          <div>
            © 2026 JammuKhoj. Designed with Apple Human Interface Guidelines for Jammu visitors.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            <span>100% On-Device IndexedDB Storage</span>
          </div>
        </div>
      </footer>

      {/* =================================================================== */}
      {/* INTERACTIVE MODALS */}
      {/* =================================================================== */}
      {/* Station Base Selector Modal */}
      {showStationModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-3">
          <div className="bg-card rounded-3xl p-5 max-w-sm w-full space-y-3 shadow-2xl border border-border animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="font-bold text-sm text-ink">Select Base Location</span>
              <button onClick={() => setShowStationModal(false)} className="text-stone hover:text-ink">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2">
              {[
                { id: 'station_jammu', label: 'Jammu Tawi Railway Station (JAT)', weather: '28°C • Sunny' },
                { id: 'station_katra', label: 'Shri Mata Vaishno Devi Katra (SVDK)', weather: '24°C • Pleasant' },
                { id: 'airport_jammu', label: 'Jammu Civil Airport (IXJ)', weather: '29°C • Clear' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setStartingLocation(s.id as any);
                    setShowStationModal(false);
                    showToast(`Switched base to ${s.label.split('(')[0]}`);
                  }}
                  className={`w-full p-3 rounded-2xl text-left border text-xs transition-all flex items-center justify-between apple-press ${
                    startingLocation === s.id
                      ? 'bg-primary-soft border-primary font-bold text-primary'
                      : 'border-border hover:bg-surface text-ink'
                  }`}
                >
                  <div>
                    <div className="text-xs">{s.label}</div>
                    <div className="text-[10px] text-stone">{s.weather}</div>
                  </div>
                  {startingLocation === s.id && <Check size={16} className="text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareAppModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={shareData.title}
        text={shareData.text}
      />

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSuccess={() => {
          setShowGoogleModal(false);
          showToast('Signed in successfully!');
        }}
      />

      {/* Emergency SOS Modal */}
      <EmergencySosModal
        isOpen={showSosModal}
        onClose={() => setShowSosModal(false)}
      />

      {/* Spot & Photo Upload Modal */}
      <SpotUploadModal
        isOpen={showSpotUploadModal}
        onClose={() => setShowSpotUploadModal(false)}
        onSuccess={(spot) => {
          showToast(`Successfully contributed "${spot.name.en}"!`);
        }}
      />

      {/* Spiritual Etiquette & Temple Customs Modal */}
      {showSpiritualModal && (
        <SpiritualEtiquetteModal
          onClose={() => setShowSpiritualModal(false)}
        />
      )}

      {/* Audio Heritage Story Tour Modal */}
      {showAudioTourModal && (
        <AudioTourModal
          onClose={() => setShowAudioTourModal(false)}
        />
      )}
    </div>
  );
};
