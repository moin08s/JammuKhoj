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
  Mic,
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
import { voiceSearchService } from '@/services/voiceSearchService';
import { TrustBadges } from '@/ui/trust/TrustBadges';
import { TestimonialSection } from '@/ui/trust/TestimonialSection';
import { VaishnoDeviYatraGuide } from '@/features/spiritual/VaishnoDeviYatraGuide';
import { AboutModal } from '@/features/about/AboutModal';
import { TripExpenseEstimator } from '@/features/plan/TripExpenseEstimator';
import { DharamshalaAndStayGuide } from '@/features/spiritual/DharamshalaAndStayGuide';
import { WeatherAndAltitudeAdvisory } from '@/features/spiritual/WeatherAndAltitudeAdvisory';
import { ReportUpdateModal } from '@/features/contribute/ReportUpdateModal';
import { ContactSupportModal } from '@/features/about/ContactSupportModal';
import { TermsOfServiceModal } from '@/features/privacy/TermsOfServiceModal';
import { TempleCrowdGuide } from '@/features/spiritual/TempleCrowdGuide';
import { useCommandControlStore } from '@/stores/commandControlStore';
import { ShieldAlert as AlertShield, AlertTriangle as HazardTriangle, ArrowRight as RightArrow, Navigation as NavIcon } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { input, setInput, setResult } = usePlanStore();
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
  const [showCustomPlannerOptions, setShowCustomPlannerOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  const toggleVoiceSearch = () => {
    if (isVoiceListening) {
      voiceSearchService.stopListening();
      setIsVoiceListening(false);
    } else {
      voiceSearchService.startListening({
        onResult: (spokenText) => {
          setSearchQuery(spokenText);
          setIsVoiceListening(false);
        },
        onStateChange: (listening) => setIsVoiceListening(listening),
        onError: () => setIsVoiceListening(false),
      });
    }
  };
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

  // Live Disaster & Crowd Command Store
  const { activeAlerts, triggerEmergencyModal, festivalSurgeActive } = useCommandControlStore();
  const [showVaishnoDeviGuide, setShowVaishnoDeviGuide] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCrowdGuide, setShowCrowdGuide] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<'none' | 'stay' | 'weather' | 'budget'>('none');
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

  const handleLaunchQuickCircuit = (circuitType: 'darshan_4h' | 'katra_1d' | 'hill_2d' | 'heritage_halfday') => {
    if (circuitType === 'darshan_4h') {
      setResult({
        planId: `quick_darshan_${Date.now()}`,
        generatedAt: new Date().toISOString(),
        bucket: '4h',
        mustLeaveBy: '18:45',
        mustBeAtDepartureBy: '18:45',
        timeline: [
          { type: 'settle', start: '14:00', end: '14:15', minutes: 15, label: 'Jammu Tawi Railway Station arrival & cloakroom' },
          { type: 'travel', start: '14:15', end: '14:35', minutes: 20, mode: 'auto_taxi', label: 'E-Rickshaw to Shri Raghunath Temple' },
          { type: 'visit', start: '14:35', end: '15:35', minutes: 60, attractionId: 'attr_raghunath_temple', label: 'Shri Raghunath Temple Darshan & Hari Market' },
          { type: 'travel', start: '15:35', end: '15:55', minutes: 20, mode: 'auto_taxi', label: 'E-Auto across Tawi bridge to Bahu Fort' },
          { type: 'visit', start: '15:55', end: '17:00', minutes: 65, attractionId: 'attr_bahu_fort', label: 'Bahu Fort, Bawe Wali Mata Temple & Bagh-e-Bahu' },
          { type: 'travel', start: '17:00', end: '17:25', minutes: 25, mode: 'auto_taxi', label: 'Return cab via Bikram Chowk' },
          { type: 'buffer', start: '17:25', end: '18:45', minutes: 80, label: 'Guaranteed 80-minute safety buffer prior to departure' },
        ],
        warnings: ['All spots verified open offline', 'Guaranteed safety return buffer included'],
        explanations: ['Express 4-Hour Darshan circuit generated directly for layover travelers.'],
        excluded: [],
        assumptions: { hub: 'Jammu Tawi Station', duration: '4 Hours' },
        totalWalkKm: 1.2,
        usableMinutes: 240,
      });
      navigate('/plan/result');
    } else if (circuitType === 'katra_1d') {
      setResult({
        planId: `quick_katra_${Date.now()}`,
        generatedAt: new Date().toISOString(),
        bucket: '24h',
        mustLeaveBy: '22:00',
        mustBeAtDepartureBy: '22:00',
        timeline: [
          { type: 'settle', start: '06:00', end: '06:30', minutes: 30, label: 'Katra Base Camp - RFID Yatra Card verification' },
          { type: 'travel', start: '06:30', end: '07:00', minutes: 30, mode: 'auto_taxi', label: 'Baan Ganga entry gate' },
          { type: 'visit', start: '07:00', end: '10:30', minutes: 210, attractionId: 'attr_vaishno_devi', label: 'Trek to Ardhkuwari Holy Cave (Pony/Battery Car route)' },
          { type: 'visit', start: '10:30', end: '14:30', minutes: 240, attractionId: 'attr_vaishno_devi', label: 'Shri Mata Vaishno Devi Bhawan Holy Darshan' },
          { type: 'travel', start: '14:30', end: '15:30', minutes: 60, mode: 'auto_taxi', label: 'Bhairon Ghati Ropeway cable car' },
          { type: 'travel', start: '15:30', end: '19:30', minutes: 240, mode: 'auto_taxi', label: 'Descent trek back to Katra Base Camp' },
          { type: 'buffer', start: '19:30', end: '22:00', minutes: 150, label: 'Relaxation & dinner at Katra Market' },
        ],
        warnings: ['RFID Yatra Card mandatory before crossing Baan Ganga', 'Battery cars available for seniors from Himkoti'],
        explanations: ['1-Day Katra & Vaishno Devi Pilgrimage itinerary.'],
        excluded: [],
        assumptions: { hub: 'Shri Mata Vaishno Devi Katra', duration: 'Full Day' },
        totalWalkKm: 12.0,
        usableMinutes: 960,
      });
      navigate('/plan/result');
    } else if (circuitType === 'hill_2d') {
      setResult({
        planId: `quick_hill_${Date.now()}`,
        generatedAt: new Date().toISOString(),
        bucket: '24h',
        mustLeaveBy: '20:00',
        mustBeAtDepartureBy: '20:00',
        timeline: [
          { type: 'travel', start: 'Day 1 08:00', end: 'Day 1 10:30', minutes: 150, mode: 'auto_taxi', label: 'Scenic Highway drive via Chenani-Nashri Tunnel to Patnitop' },
          { type: 'visit', start: 'Day 1 10:30', end: 'Day 1 14:00', minutes: 210, attractionId: 'attr_patnitop', label: 'Patnitop Deodar Pine Woods & Skyview Gondola' },
          { type: 'travel', start: 'Day 1 14:00', end: 'Day 1 14:45', minutes: 45, mode: 'auto_taxi', label: 'Drive to Sanasar Alpine Meadows (19 km)' },
          { type: 'visit', start: 'Day 1 14:45', end: 'Day 1 18:00', minutes: 195, attractionId: 'attr_sanasar', label: 'Sanasar Lake stroll, paragliding & evening mountain sunset' },
          { type: 'visit', start: 'Day 2 09:00', end: 'Day 2 13:00', minutes: 240, attractionId: 'attr_mansar_lake', label: 'Return drive & sacred Mansar Lake Sheshnag shrine' },
        ],
        warnings: ['Carry light woollens for Patnitop & Sanasar', 'Offline map available for valley navigation'],
        explanations: ['2-Day Hill Meadow & Conifer Pine Escape.'],
        excluded: [],
        assumptions: { hub: 'Jammu Tawi Station', duration: '2 Days' },
        totalWalkKm: 3.5,
        usableMinutes: 720,
      });
      navigate('/plan/result');
    } else {
      setResult({
        planId: `quick_heritage_${Date.now()}`,
        generatedAt: new Date().toISOString(),
        bucket: '8h',
        mustLeaveBy: '19:00',
        mustBeAtDepartureBy: '19:00',
        timeline: [
          { type: 'settle', start: '10:00', end: '10:30', minutes: 30, label: 'Briefing & departure from Jammu City Center' },
          { type: 'visit', start: '10:30', end: '12:30', minutes: 120, attractionId: 'attr_amar_mahal', label: 'Amar Mahal Palace: French Chateau & 120kg Golden Throne' },
          { type: 'travel', start: '12:30', end: '12:45', minutes: 15, mode: 'auto_taxi', label: 'Short drive to Old City Royal Quarter' },
          { type: 'visit', start: '12:45', end: '14:45', minutes: 120, attractionId: 'attr_mubarak_mandi', label: 'Mubarak Mandi Dogra Palace complex & Pink Hall' },
          { type: 'visit', start: '14:45', end: '16:30', minutes: 105, attractionId: 'attr_raghunath_bazaar', label: 'Raghunath Bazaar Dogra Cuisines & Dry Fruits' },
          { type: 'buffer', start: '16:30', end: '19:00', minutes: 150, label: 'Evening relaxation at Tawi Riverfront walk' },
        ],
        warnings: ['Amar Mahal closed on Mondays and national holidays'],
        explanations: ['Half-Day Royal Dogra Heritage & Palace Trail.'],
        excluded: [],
        assumptions: { hub: 'Jammu City Center', duration: '6 Hours' },
        totalWalkKm: 2.1,
        usableMinutes: 360,
      });
      navigate('/plan/result');
    }
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
            className="w-9 h-9 rounded-2xl overflow-hidden shadow-sm shadow-primary/25 cursor-pointer apple-press shrink-0 flex items-center justify-center bg-forest-900 border border-amber-500/30"
          >
            <img
              src="/icons/icon-emblem.svg"
              alt="JammuKhoj Emblem"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to PNG if SVG encounters any issues
                (e.target as HTMLImageElement).src = '/icons/icon-192.png';
              }}
            />
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
        {/* Active Emergency Early Warning Banner (Landslide & Disasters) */}
        {activeAlerts.length > 0 && (
          <div className="p-3.5 bg-danger/10 border-2 border-danger/40 rounded-2xl shadow-xs space-y-2 animate-in fade-in">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-danger text-white flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                  <HazardTriangle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-bold uppercase bg-danger text-white px-2 py-0.5 rounded">
                      CIVIC EARLY WARNING
                    </span>
                    <span className="text-[11px] text-danger font-bold">
                      {activeAlerts[0].incidentType.toUpperCase()} HAZARD
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-ink mt-0.5">
                    {activeAlerts[0].title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => triggerEmergencyModal(activeAlerts[0])}
                className="shrink-0 text-xs px-3 py-1.5 bg-danger text-white rounded-xl font-bold hover:bg-danger/90 transition-colors shadow-xs"
              >
                View Protocol
              </button>
            </div>

            <p className="text-[11px] sm:text-xs text-ink/80 leading-relaxed bg-surface/80 p-2 rounded-xl border border-danger/20">
              <strong>Mandatory Directive:</strong> {activeAlerts[0].actionRequired}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-danger/20 text-xs">
              <span className="text-[11px] text-stone">
                Safe Holding Haven: <strong className="text-ink">{activeAlerts[0].safeHoldingArea.name}</strong>
              </span>
              <button
                onClick={() => {
                  navigate('/map', {
                    state: {
                      focusSafeSpot: activeAlerts[0].safeHoldingArea.coordinates,
                      safeSpotName: activeAlerts[0].safeHoldingArea.name,
                      hazardCoords: activeAlerts[0].coordinates,
                      offlineMode: true,
                    },
                  });
                }}
                className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
              >
                <NavIcon className="w-3.5 h-3.5" />
                <span>Open Safe Haven on City Map (Offline Ready)</span>
              </button>
            </div>
          </div>
        )}

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
              placeholder={isVoiceListening ? "Listening... (बोलिए जैसे: रघुनाथ मंदिर, बावे वाली माता)..." : "Search places, temples, food and useful services…"}
              className={`w-full pl-10 pr-20 py-3.5 rounded-2xl bg-card border text-xs sm:text-sm font-medium text-ink placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs transition-all ${
                isVoiceListening ? 'border-primary ring-2 ring-primary/30 bg-primary/5' : 'border-border'
              }`}
              aria-label="Search destinations, temples, food and services"
            />
            <div className="absolute right-2.5 flex items-center gap-1">
              <button
                type="button"
                onClick={toggleVoiceSearch}
                className={`p-2 rounded-xl transition-all ${
                  isVoiceListening
                    ? 'bg-primary text-white animate-pulse shadow-sm'
                    : 'text-stone hover:text-primary hover:bg-surface'
                }`}
                title={isVoiceListening ? "Listening... Tap to stop" : "Senior Voice Search (Dogri / Hindi / English)"}
                aria-label="Senior Voice Search"
              >
                <Mic size={16} />
              </button>
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-stone hover:text-ink"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/explore')}
                  className="p-2 rounded-xl bg-surface text-stone hover:text-primary transition-colors"
                  title="Open full filter directory"
                >
                  <SlidersHorizontal size={15} />
                </button>
              )}
            </div>
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
                      src={JAMMU_SPOT_IMAGES[attr.id] || 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Bahu_Fort%2C_Jammu.jpg/960px-Bahu_Fort%2C_Jammu.jpg'}
                      alt={attr.name.en}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Bahu_Fort%2C_Jammu.jpg/960px-Bahu_Fort%2C_Jammu.jpg';
                      }}
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

      {/* Trust Badges */}
      <TrustBadges variant="compact" className="my-1 px-1" />

      {/* =================================================================== */}
      {/* 2.5 DEDICATED VAISHNO DEVI YATRA PORTAL */}
      {/* =================================================================== */}
      <section 
        onClick={() => setShowVaishnoDeviGuide(true)}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 text-white p-5 shadow-md cursor-pointer hover:shadow-lg transition-all group"
      >
        <div className="absolute top-0 right-0 w-48 h-full opacity-20 pointer-events-none overflow-hidden">
          <img 
            src={JAMMU_SPOT_IMAGES.attr_vaishno_devi} 
            alt="Mata Vaishno Devi" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/icons/icon-emblem.svg';
            }}
          />
        </div>

        <div className="relative z-10 space-y-2 max-w-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] shadow-xs">
            <span>🛕 Holy Shrine Guide</span>
            <span>•</span>
            <span>2026 Manual</span>
          </div>

          <h3 className="font-heading font-black text-xl text-white tracking-tight flex items-center gap-2">
            <span>Shri Mata Vaishno Devi Yatra</span>
            <span className="text-amber-300 text-sm font-normal">(कटड़ा यात्रा मार्गदर्शक)</span>
          </h3>

          <p className="text-xs text-white/90 leading-relaxed">
            Step-by-step route map (Katra ➔ Bhawan ➔ Bhairon Ghati), Battery car guidelines for seniors, free RFID registration counters, and packing checklist.
          </p>

          <div className="pt-1 flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-white dark:bg-amber-100 text-amber-950 font-bold text-xs shadow-sm hover:bg-amber-100 dark:hover:bg-white transition-colors flex items-center gap-1.5"
            >
              <span>Open Complete Yatra Portal</span>
              <ArrowRight size={14} />
            </button>
            <span className="text-[11px] text-amber-200">100% Offline Guide</span>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3. SENIOR-FRIENDLY 1-TAP QUICK TRIP PLANNER */}
      {/* =================================================================== */}
      <section aria-label="1-Tap Quick Trip Planner" className="p-4 sm:p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        {/* Section Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs">
                <Sparkles size={16} />
              </span>
              <div>
                <h3 className="font-heading font-black text-base sm:text-lg text-ink">
                  1-Tap Quick Trip Planner <span className="text-primary font-normal text-xs sm:text-sm">(झटपट यात्रा प्लान)</span>
                </h3>
                <span className="text-[10px] font-bold text-stone uppercase tracking-wider block">Senior & Pilgrim Friendly</span>
              </div>
            </div>
            <p className="text-xs text-stone mt-1.5 leading-snug">
              Tap any circuit to instantly open your complete verified timeline with guaranteed train/flight return buffers — zero forms required!
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-success text-[10px] font-bold border border-emerald-200 dark:border-emerald-800 shrink-0">
            Buffer Protected
          </span>
        </div>

        {/* 4 Instant 1-Tap Curated Circuit Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Circuit 1: 4h Express Darshan */}
          <div
            onClick={() => handleLaunchQuickCircuit('darshan_4h')}
            className="p-3.5 rounded-2xl bg-surface border border-border hover:border-primary cursor-pointer apple-press transition-all shadow-xs group flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-[10px] border border-amber-500/20">
                  ⚡ 4-Hour Express Layover
                </span>
                <span className="text-[11px] font-bold text-stone">Train/Flight Safe</span>
              </div>
              <h4 className="font-heading font-bold text-sm text-ink group-hover:text-primary transition-colors">
                Shri Raghunath Temple & Bahu Fort Darshan
              </h4>
              <p className="text-[11px] text-stone leading-snug">
                Ideal for station transit. Darshan at the sacred 1857 golden sanctum, ancient hilltop fort, & 80-minute return safety buffer.
              </p>
            </div>
            <button className="w-full py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs group-hover:bg-primary-dark transition-colors">
              <span>⚡ View 4h Itinerary (तुरंत देखें)</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Circuit 2: 1-Day Katra & Vaishno Devi */}
          <div
            onClick={() => handleLaunchQuickCircuit('katra_1d')}
            className="p-3.5 rounded-2xl bg-surface border border-border hover:border-primary cursor-pointer apple-press transition-all shadow-xs group flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                  🛕 Full-Day Holy Yatra
                </span>
                <span className="text-[11px] font-bold text-stone">Katra Base Camp</span>
              </div>
              <h4 className="font-heading font-bold text-sm text-ink group-hover:text-primary transition-colors">
                Mata Vaishno Devi Holy Cave Pilgrimage
              </h4>
              <p className="text-[11px] text-stone leading-snug">
                Baan Ganga entry, Ardhkuwari cave, Bhawan darshan, and Bhairon cable car with verified battery car guidance for elders.
              </p>
            </div>
            <button className="w-full py-2 px-3 rounded-xl bg-[#174D3C] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs group-hover:bg-[#123E38] transition-colors">
              <span>⚡ View Pilgrimage Plan (यात्रा देखें)</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Circuit 3: 2-Day Hill Meadow Escape */}
          <div
            onClick={() => handleLaunchQuickCircuit('hill_2d')}
            className="p-3.5 rounded-2xl bg-surface border border-border hover:border-primary cursor-pointer apple-press transition-all shadow-xs group flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 font-bold text-[10px] border border-blue-500/20">
                  🌲 2-Day Alpine Tour
                </span>
                <span className="text-[11px] font-bold text-stone">Cool Valleys</span>
              </div>
              <h4 className="font-heading font-bold text-sm text-ink group-hover:text-primary transition-colors">
                Patnitop Pine Forests & Sanasar Meadows
              </h4>
              <p className="text-[11px] text-stone leading-snug">
                Conifer woods at 2,024m, Skyview ropeway, Sanasar paragliding bowl, and sacred Sheshnag shrine at Mansar Lake.
              </p>
            </div>
            <button className="w-full py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs group-hover:bg-primary-dark transition-colors">
              <span>⚡ View Hill Itinerary (पहाड़ी यात्रा)</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Circuit 4: Half-Day Dogra Royal Heritage */}
          <div
            onClick={() => handleLaunchQuickCircuit('heritage_halfday')}
            className="p-3.5 rounded-2xl bg-surface border border-border hover:border-primary cursor-pointer apple-press transition-all shadow-xs group flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-400 font-bold text-[10px] border border-purple-500/20">
                  🏛️ Half-Day Heritage
                </span>
                <span className="text-[11px] font-bold text-stone">City Heritage</span>
              </div>
              <h4 className="font-heading font-bold text-sm text-ink group-hover:text-primary transition-colors">
                Dogra Royal Palaces & Traditional Bazaars
              </h4>
              <p className="text-[11px] text-stone leading-snug">
                Amar Mahal French Chateau, 120kg solid gold throne, Mubarak Mandi pink hall, and authentic Dogra food at Raghunath Bazaar.
              </p>
            </div>
            <button className="w-full py-2 px-3 rounded-xl bg-[#9E4A0C] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs group-hover:bg-[#833D0A] transition-colors">
              <span>⚡ View Heritage Route (विरासत देखें)</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Quick Route Discovery Bar & Custom Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/70 text-xs">
          <button
            onClick={() => navigate('/suggestions')}
            className="text-primary font-bold hover:underline flex items-center gap-1 apple-press"
          >
            <Compass size={14} />
            <span>Browse All 5 Curated Circuits (विस्तृत प्लान देखें) →</span>
          </button>

          <button
            onClick={() => setShowCustomPlannerOptions(!showCustomPlannerOptions)}
            className="text-stone hover:text-ink font-semibold flex items-center gap-1 apple-press"
          >
            <span>{showCustomPlannerOptions ? 'Hide Custom Options ▲' : 'Custom Options (Select Station & Time) ▼'}</span>
          </button>
        </div>

        {/* Collapsible Custom Duration & Location Planner for Power Users */}
        {showCustomPlannerOptions && (
          <div className="pt-3 space-y-3.5 border-t border-border animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone">
                Custom Duration & Hub Settings
              </h4>
              <span className="text-[10px] text-stone">50-min safety margin auto-calculated</span>
            </div>

            {/* Duration Selection (4h, 8h, 24h) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                {
                  id: '4' as const,
                  hours: '4 Hours',
                  title: 'Quick Layover',
                  desc: 'Station darshan & royal chateau tour with safe return.',
                },
                {
                  id: '8' as const,
                  hours: '8 Hours',
                  title: 'Day Explorer',
                  desc: 'Forts, palaces, and border beating retreat ceremony.',
                },
                {
                  id: '24' as const,
                  hours: '24 Hours',
                  title: 'Multi-Day Plan',
                  desc: 'Immersive sacred and alpine circuit with overnight stays.',
                },
              ].map((card) => (
                <div
                  key={card.id}
                  onClick={() => setSelectedDuration(card.id)}
                  className={`p-3 rounded-2xl border cursor-pointer apple-press transition-all ${
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
                  <h5 className="font-heading font-bold text-xs text-ink mt-2">{card.title}</h5>
                  <p className="text-[10px] text-stone mt-0.5 leading-snug">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Inputs: Starting Location & Primary Interest */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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

            {/* Generate Custom Plan Button */}
            <button
              onClick={handleStartPlan}
              className="w-full py-3 px-4 rounded-2xl bg-primary text-white font-bold text-xs sm:text-sm shadow-md shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2 apple-press"
            >
              <Compass size={16} />
              <span>Generate Custom {selectedDuration === '24' ? 'Full-Day (24h)' : `${selectedDuration}-Hour`} Itinerary</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
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
          className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FFF9F3] to-[#FCEFE7] dark:from-stone-900 dark:to-stone-850 border border-[#F3D7C5] dark:border-stone-800 text-ink cursor-pointer hover:border-[#9E4A0C] dark:hover:border-amber-500/50 transition-all apple-press shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
              <Flower2 size={16} />
            </div>
            <h4 className="font-heading font-bold text-sm text-ink dark:text-white">Temple & Darshan Rules</h4>
            <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
              Official dress codes, shoe lockers, aarti timings, and mobile scanning rules for top temples.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-[#9E4A0C] dark:text-amber-400 flex items-center gap-1">
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

      {/* Testimonials & Social Proof */}
      <TestimonialSection />

      {/* Regional Traveler & Pilgrim Toolset */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-black text-base text-ink">
              Pilgrim & Travel Toolkit
            </h3>
            <p className="text-xs text-stone">
              Shrine Board accommodations, weather advisories, and estimated trip budgets
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'stay' ? 'none' : 'stay')}
            className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 text-center ${
              activeDrawer === 'stay'
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'bg-card text-stone hover:text-ink border-border hover:border-primary/40'
            }`}
          >
            <span className="text-base">🏨</span>
            <span className="text-[11px]">Shrine Stays</span>
          </button>

          <button
            onClick={() => setActiveDrawer(activeDrawer === 'weather' ? 'none' : 'weather')}
            className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 text-center ${
              activeDrawer === 'weather'
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'bg-card text-stone hover:text-ink border-border hover:border-primary/40'
            }`}
          >
            <span className="text-base">⛅</span>
            <span className="text-[11px]">Weather & Altitude</span>
          </button>

          <button
            onClick={() => setActiveDrawer(activeDrawer === 'budget' ? 'none' : 'budget')}
            className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 text-center ${
              activeDrawer === 'budget'
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'bg-card text-stone hover:text-ink border-border hover:border-primary/40'
            }`}
          >
            <span className="text-base">💰</span>
            <span className="text-[11px]">Trip Estimator</span>
          </button>

          <button
            onClick={() => setShowCrowdGuide(true)}
            className="p-2.5 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 text-center bg-card text-stone hover:text-ink border-border hover:border-primary/40 apple-press"
          >
            <span className="text-base">👥</span>
            <span className="text-[11px]">Temple Crowd</span>
          </button>
        </div>

        {activeDrawer === 'stay' && <DharamshalaAndStayGuide />}
        {activeDrawer === 'weather' && <WeatherAndAltitudeAdvisory />}
        {activeDrawer === 'budget' && <TripExpenseEstimator />}
      </section>

      {/* =================================================================== */}
      {/* 8. FOOTER */}
      {/* =================================================================== */}
      <footer className="mt-8 pt-8 border-t border-border/80 space-y-6 text-stone text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Col 1: About JammuKhoj */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl overflow-hidden bg-forest-900 border border-amber-500/30 shadow-xs flex items-center justify-center shrink-0">
                <img
                  src="/icons/icon-emblem.svg"
                  alt="JammuKhoj Emblem"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/icons/icon-192.png';
                  }}
                />
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
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px]">
              <button
                onClick={() => setShowAboutModal(true)}
                className="font-bold text-primary hover:underline apple-press"
              >
                About Us & Mission
              </button>
              <span>•</span>
              <button
                onClick={() => setShowContactModal(true)}
                className="font-bold text-emerald-700 hover:underline apple-press"
              >
                Contact & Support
              </button>
              <span>•</span>
              <button
                onClick={() => setShowReportModal(true)}
                className="font-bold text-amber-700 hover:underline apple-press"
              >
                Suggest Update
              </button>
              <span>•</span>
              <button
                onClick={() => navigate('/privacy')}
                className="font-bold text-stone hover:text-ink apple-press"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={() => setShowTermsModal(true)}
                className="font-bold text-stone hover:text-ink apple-press"
              >
                Terms of Use
              </button>
              <span>•</span>
              <button
                onClick={() => navigate('/settings')}
                className="font-bold text-stone hover:text-ink apple-press"
              >
                Settings
              </button>
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

      {/* Vaishno Devi Dedicated Yatra Guide */}
      <VaishnoDeviYatraGuide
        isOpen={showVaishnoDeviGuide}
        onClose={() => setShowVaishnoDeviGuide(false)}
      />

      {/* About Us & Mission Modal */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {/* Community Report & Suggestion Modal */}
      <ReportUpdateModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        spotName="JammuKhoj Platform & Directory"
      />

      {/* Official Contact & Pilgrim Support Modal */}
      <ContactSupportModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />

      {/* Terms of Use & Legal Advisory Modal */}
      <TermsOfServiceModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      {/* Temple Crowd & Aarti Hours Guide */}
      <TempleCrowdGuide
        isOpen={showCrowdGuide}
        onClose={() => setShowCrowdGuide(false)}
      />
    </div>
  );
};
