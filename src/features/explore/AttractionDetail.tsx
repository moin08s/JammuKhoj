import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Star,
  MapPin,
  Clock,
  BadgeIndianRupee,
  Navigation,
  Play,
  Pause,
  Accessibility,
  Lock,
  Camera,
  UserCheck,
  Train,
  Car,
  MessageCircle,
  Check,
  CheckCircle2,
  Crown,
  Volume2,
} from 'lucide-react';
import { TaxiIcon, AutoRickshawIcon, ExpressTrainIcon } from '@/ui/icons/TransitIcons';
import { db } from '@/data/db';
import type { Attraction, Node } from '@/data/types';
import { JAMMU_ALL_ATTRACTIONS } from '@/data/jammuFullData';
import { getSpotImage } from '@/data/spotImages';
import { useAppStore } from '@/stores/appStore';
import { useAudioStore } from '@/stores/audioStore';
import { ShareAppModal } from '@/ui/sharing/ShareAppModal';
import { JAMMU_GI_PRODUCTS, type GIProduct } from '@/data/giProductsData';
import { GiProductShowcaseModal } from '@/features/gi/GiProductShowcaseModal';
import { SpotUploadModal } from '@/features/contribute/SpotUploadModal';

export const AttractionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAppStore();
  const { playTrack, currentTrack, isPlaying: isGlobalPlaying, pauseTrack, resumeTrack, progressSeconds } = useAudioStore();

  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [node, setNode] = useState<Node | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedGiModal, setSelectedGiModal] = useState<GIProduct | null>(null);

  const isPlayingAudio = isGlobalPlaying && currentTrack?.id === id;
  const audioProgress = currentTrack?.id === id ? progressSeconds : 48;

  const handleToggleAudio = () => {
    if (!attraction) return;
    if (isPlayingAudio) {
      pauseTrack();
    } else if (currentTrack?.id === id) {
      resumeTrack();
    } else {
      playTrack({
        id: attraction.id,
        title: `${attraction.name.en} Chronicles`,
        spotName: attraction.name.en,
        durationSeconds: 192,
        language: 'english',
      });
      showToast('🎧 Playing Dogra Heritage Audio Chronicles');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    if (!id) return;
    db.attractions.get(id).then((attr) => {
      if (attr) {
        setAttraction(attr);
        db.nodes.get(attr.nodeId).then((n) => {
          if (n) setNode(n);
        });
      } else {
        const fallback = JAMMU_ALL_ATTRACTIONS.find((a) => a.id === id);
        if (fallback) setAttraction(fallback);
      }
    }).catch(() => {
      const fallback = JAMMU_ALL_ATTRACTIONS.find((a) => a.id === id);
      if (fallback) setAttraction(fallback);
    });
  }, [id]);

  if (!attraction) {
    return (
      <div className="py-12 text-center text-stone space-y-3">
        <p>Loading attraction details...</p>
        <button
          onClick={() => navigate('/explore')}
          className="text-primary font-bold text-xs underline apple-press"
        >
          Back to Attractions Directory
        </button>
      </div>
    );
  }

  const isFavorited = favorites.includes(attraction.id);
  const hours = `${attraction.opening[0]?.open || '10:00 AM'} – ${attraction.opening[0]?.close || '05:00 PM'}`;
  const feeStr = attraction.entryFee.amountInr === 0 ? 'Free Entry' : `₹${attraction.entryFee.amountInr} / ₹20`;
  const relatedGiItems = JAMMU_GI_PRODUCTS.filter((p) => p.relatedAttractionIds.includes(attraction.id));

  return (
    <div className="space-y-4 pb-24 text-[#1C1917] select-none font-sans -mx-4 -mt-3">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1C1917] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in">
          <Check size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. HERO PHOTO WITH TOP FLOATING CONTROLS & BOTTOM BADGES */}
      <div className="relative w-full h-80 bg-[#F5F5F4] overflow-hidden">
        <img
          src={getSpotImage(attraction.id, attraction.type)}
          alt={attraction.name.en}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />

        {/* Top Floating Buttons */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-[#1C1917] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
            title="Back"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-[#1C1917] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
              title="Upload Photo or Suggest Location Correction"
            >
              <Camera size={17} />
            </button>

            <button
              onClick={() => {
                toggleFavorite(attraction.id);
                showToast(isFavorited ? 'Removed from Saved' : 'Saved to Offline Favorites');
              }}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-[#1C1917] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
              title="Save"
            >
              <Bookmark size={17} className={isFavorited ? 'fill-[#9E4A0C] text-[#9E4A0C]' : ''} />
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-[#1C1917] flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
              title="Share"
            >
              <Share2 size={17} />
            </button>
          </div>
        </div>

        {/* Bottom Hero Badges */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 z-10">
          <span className="px-3 py-1 rounded-full bg-[#B91C1C] text-white text-[11px] font-extrabold flex items-center gap-1 shadow-sm">
            <span>🏛️</span>
            <span>Dogra Heritage Landmark</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-white/95 text-[#1C1917] text-[11px] font-bold flex items-center gap-1 shadow-sm">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span>4.9 (1.2k reviews)</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-[#1C1917] text-[11px] font-bold flex items-center gap-1 shadow-sm">
            <span>🏛️</span>
            <span>French Chateau Architecture</span>
          </span>
        </div>
      </div>

      {/* 2. MAIN DETAIL BODY */}
      <div className="px-4 space-y-4">
        {/* Title & Subhead */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-[#9E4A0C] font-bold">
            <MapPin size={13} />
            <span>Jammu City • Shivalik Range Foothills</span>
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-[#1C1917] leading-tight">
            {attraction.name.en}
          </h1>
          <div className="text-sm font-semibold text-[#B91C1C]">
            {attraction.name.hi || 'अमर महल पैलेस संग्रहालय'}
          </div>
          <p className="text-xs text-[#57534E] leading-relaxed pt-1">
            {attraction.summary.en} Overlooking the calm curves of the Tawi River valley and forested ridge lines, this magnificent 19th-century royal sandstone residence preserves Dogra sovereignty and Pahari artistic masterworks.
          </p>
        </div>

        {/* 3. 2x2 SPECS GRID */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 bg-white border border-[#E7E5E4] rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-[#78716C] font-semibold">
              <Clock size={13} className="text-[#9E4A0C]" />
              <span>Built Era</span>
            </div>
            <div className="font-heading font-extrabold text-base text-[#1C1917]">
              1890s
            </div>
          </div>

          <div className="p-3 bg-white border border-[#E7E5E4] rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-[#78716C] font-semibold">
              <BadgeIndianRupee size={13} className="text-[#059669]" />
              <span>Entry Fee</span>
            </div>
            <div className="font-heading font-extrabold text-base text-[#1C1917]">
              {feeStr}
            </div>
          </div>

          <div className="p-3 bg-white border border-[#E7E5E4] rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-[#78716C] font-semibold">
              <Clock size={13} className="text-[#DC2626]" />
              <span>Timings</span>
            </div>
            <div className="font-heading font-extrabold text-xs text-[#1C1917] leading-tight">
              10AM–5PM (Mon Closed)
            </div>
          </div>

          <div className="p-3 bg-white border border-[#E7E5E4] rounded-2xl shadow-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-[#78716C] font-semibold">
              <Accessibility size={13} className="text-[#7C3AED]" />
              <span>Mobility</span>
            </div>
            <div className="font-heading font-extrabold text-xs text-[#1C1917]">
              Moderate Stairs
            </div>
          </div>
        </div>

        {/* 4. CENTERPIECE RELIC CARD (GOLDEN THRONE) */}
        <div className="p-4 rounded-3xl bg-[#FFFDF5] border border-[#FDE68A] space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#9E4A0C] text-white flex items-center justify-center shrink-0">
              <Crown size={16} />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9E4A0C]">
              Centerpiece Relic
            </span>
          </div>

          <div>
            <h3 className="font-heading font-bold text-base text-[#1C1917] leading-tight">
              The 35kg Pure Gold Dogra Throne
            </h3>
            <p className="text-xs text-[#57534E] leading-relaxed mt-1">
              Crafted entirely in pure gold and resting upon a velvet hexagonal dais, this regal throne symbolizes the reign of Maharaja Hari Singh. Adjoining halls exhibit the renowned Nal-Damyanti miniature series and original Basohli paintings portraying the Ramayana.
            </p>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#FDE68A]/60 text-xs text-[#92400E]">
            <div className="flex items-center gap-1.5 font-bold">
              <span>🎨</span>
              <span>Kangra & Basohli Gallery</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] font-extrabold text-[10px]">
              47 Miniatures
            </span>
          </div>
        </div>

        {/* GI MARKED HERITAGE SPOTLIGHT */}
        {relatedGiItems.length > 0 && (
          <div className="p-4 rounded-3xl bg-[#F7F6F0] dark:bg-card border border-[#E5E5EA] dark:border-border space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#F3C969] text-[#1C2923] flex items-center justify-center font-bold text-sm shadow-xs">
                  🏷️
                </span>
                <div>
                  <h3 className="font-heading font-bold text-sm text-[#1C2923] dark:text-ink">
                    Certified Regional GI Heritage
                  </h3>
                  <span className="text-[10px] text-[#65736B]">Officially registered Geographical Indications from this area</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {relatedGiItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedGiModal(item)}
                  className="p-3 rounded-2xl bg-card border border-border hover:border-[#174D3C]/50 flex items-center gap-3 cursor-pointer transition-all shadow-2xs group"
                >
                  <img
                    src={item.heroImage}
                    alt={item.name.en}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#9E4A0C] dark:text-[#F3C969] block">
                      {item.giStatus}
                    </span>
                    <h4 className="font-bold text-xs text-ink truncate group-hover:text-[#174D3C] transition-colors">
                      {item.name.en}
                    </h4>
                    <span className="text-[10px] text-[#65736B] truncate block">
                      {item.priceBenchmark}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. AUDIO GUIDE CHRONICLES BANNER */}
        <div className="p-3.5 rounded-3xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#9E4A0C] text-white flex items-center justify-center shrink-0">
                <Volume2 size={18} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-[#1E3A8A]">
                  Dogra History Chronicles
                </h4>
                <p className="text-[10px] text-[#3B82F6] font-medium">
                  3 min audio • Dogri, Hindi, English
                </p>
              </div>
            </div>

            <button
              onClick={handleToggleAudio}
              className="w-10 h-10 rounded-full bg-[#9E4A0C] text-white flex items-center justify-center shadow-md shadow-[#9E4A0C]/25 hover:bg-[#853E0A] transition-all active:scale-95 shrink-0"
              title={isPlayingAudio ? 'Pause' : 'Play'}
            >
              {isPlayingAudio ? <Pause size={17} /> : <Play size={17} className="ml-0.5" />}
            </button>
          </div>

          {/* Audio Slider Progress Bar */}
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#64748B]">
            <span>
              {String(Math.floor(audioProgress / 60)).padStart(2, '0')}:
              {String(audioProgress % 60).padStart(2, '0')}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-[#DBEAFE] overflow-hidden">
              <div
                className="h-full bg-[#9E4A0C] rounded-full transition-all duration-300"
                style={{ width: `${(audioProgress / 192) * 100}%` }}
              />
            </div>
            <span>03:12</span>
          </div>
        </div>

        {/* 6. VISITOR PRACTICALITIES */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 font-heading font-bold text-sm text-[#1C1917]">
            <CheckCircle2 size={16} className="text-[#059669]" />
            <span>Visitor Practicalities</span>
          </div>

          <div className="space-y-1.5 text-xs text-[#44403C]">
            <div className="p-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl flex items-center gap-2.5">
              <Accessibility size={16} className="text-[#059669] shrink-0" />
              <span>Step-free ramp to the ground museum & royal portrait suites.</span>
            </div>

            <div className="p-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl flex items-center gap-2.5">
              <Lock size={16} className="text-[#059669] shrink-0" />
              <span>Secure cloakroom & locker deposit at the northern entrance gate.</span>
            </div>

            <div className="p-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl flex items-center gap-2.5">
              <Camera size={16} className="text-[#059669] shrink-0" />
              <span>Camera / smartphone photography ticket: ₹100 per device.</span>
            </div>

            <div className="p-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl flex items-center gap-2.5">
              <UserCheck size={16} className="text-[#059669] shrink-0" />
              <span>Certified heritage historians available at reception desk (₹250/group).</span>
            </div>

            {/* Upload / Suggest Correction Card */}
            <div className="p-3 bg-white border border-border rounded-2xl flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <Camera size={16} className="text-primary shrink-0" />
                <span className="text-xs font-semibold text-ink">Have a photo or location correction for this spot?</span>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="px-3 py-1.5 rounded-xl bg-primary text-white text-[11px] font-bold shadow-xs hover:bg-primary-dark transition-all shrink-0 apple-press"
              >
                Upload / Correct
              </button>
            </div>
          </div>
        </div>

        {/* 7. TRANSIT & COMMUTE CARD */}
        <div className="p-3.5 rounded-3xl bg-[#F0F4FF] border border-[#DCE4FD] space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#1E1B4B]">
            <TaxiIcon size={18} color="#9E4A0C" />
            <span>Transit & Commute</span>
          </div>

          <div className="space-y-1.5 text-xs text-[#334155]">
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E0E7FF]">
              <div className="flex items-center gap-2 font-medium">
                <ExpressTrainIcon size={16} color="#085444" />
                <span>Jammu Tawi Railway Station</span>
              </div>
              <span className="font-extrabold text-[#DC2626]">4.5 km away</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E0E7FF]">
              <div className="flex items-center gap-2 font-medium">
                <TaxiIcon size={16} color="#9E4A0C" />
                <span>Prepaid Taxi / E-Rickshaw</span>
              </div>
              <span className="font-extrabold text-[#059669]">₹150 – ₹200</span>
            </div>
          </div>
        </div>
      </div>

      {/* 8. STICKY BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border p-3">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/map', { state: { targetNode: attraction.nodeId } })}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#9E4A0C] text-white font-bold text-xs shadow-md shadow-[#9E4A0C]/25 hover:bg-[#853E0A] transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <Navigation size={16} />
            <span>Start Offline GPS Route</span>
          </button>

          <button
            onClick={() => navigate('/safety')}
            className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center border border-[#86EFAC] shadow-xs hover:bg-[#BBF7D0] transition-colors shrink-0"
            title="Help & Safety"
          >
            <MessageCircle size={20} />
          </button>
        </div>
      </div>

      {/* SHARE MODAL */}
      <ShareAppModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={`${attraction.name.en} (${attraction.name.hi}) — JammuKhoj`}
        text={`Explore ${attraction.name.en} in Jammu: ${attraction.summary.en} with offline maps on JammuKhoj!`}
        url={window.location.href}
      />

      {/* GI PRODUCT DETAIL MODAL */}
      <GiProductShowcaseModal
        product={selectedGiModal}
        onClose={() => setSelectedGiModal(null)}
      />

      {/* SPOT & PHOTO UPLOAD / CORRECTION MODAL */}
      <SpotUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        targetAttractionId={attraction.id}
        onSuccess={(updated) => {
          setAttraction(updated);
          showToast(`Updated details & photos for "${updated.name.en}"!`);
        }}
      />
    </div>
  );
};
