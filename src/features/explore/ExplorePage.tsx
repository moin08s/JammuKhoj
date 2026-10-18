import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Clock,
  MapPin,
  Compass,
  Filter,
  ChevronRight,
  Eye,
  CheckCircle2,
  Sparkles,
  Camera,
} from 'lucide-react';
import { db } from '@/data/db';
import type { Attraction } from '@/data/types';
import { JAMMU_ALL_ATTRACTIONS } from '@/data/jammuFullData';
import { getSpotImage } from '@/data/spotImages';
import { SourceBadge } from '@/ui/trust/SourceBadge';
import { FreshnessChip } from '@/ui/trust/FreshnessChip';
import { GiProductsSection } from '@/features/gi/GiProductsSection';
import { SpotUploadModal } from '@/features/contribute/SpotUploadModal';

const ZONE_TABS = [
  { id: 'all', label: 'All Destinations' },
  { id: 'gi_heritage', label: '🏷️ GI Marked Heritage' },
  { id: 'city', label: '🏛️ Jammu City' },
  { id: 'day_trip', label: '🚗 Day Trips' },
  { id: 'offbeat_valley', label: '🌲 Offbeat Valleys' },
  { id: 'spiritual_hidden', label: '🛕 Spiritual & Historical' },
  { id: 'border_nature', label: '🦅 Border & Nature' },
];

export const ExplorePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [selectedZone, setSelectedZone] = useState('all');
  const [vibeFilter, setVibeFilter] = useState<'all' | 'classic' | 'offbeat'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxDuration, setMaxDuration] = useState<number>(360);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const loadAttractions = () => {
    db.attractions.toArray().then((items) => {
      if (items && items.length > 0) {
        setAttractions(items);
      } else {
        setAttractions(JAMMU_ALL_ATTRACTIONS);
      }
    }).catch(() => {
      setAttractions(JAMMU_ALL_ATTRACTIONS);
    });
  };

  useEffect(() => {
    loadAttractions();
  }, []);

  useEffect(() => {
    if (categoryParam === 'gi_heritage') {
      setSelectedZone('gi_heritage');
    } else if (categoryParam === 'temples') {
      setSelectedZone('spiritual_hidden');
    } else if (categoryParam === 'valleys') {
      setSelectedZone('offbeat_valley');
    }
  }, [categoryParam]);

  const filteredAttractions = useMemo(() => {
    return attractions.filter((item) => {
      const matchesZone =
        selectedZone === 'all' || item.zone === selectedZone;

      const matchesVibe =
        vibeFilter === 'all' ||
        (vibeFilter === 'classic' && !item.isOffbeat) ||
        (vibeFilter === 'offbeat' && item.isOffbeat);

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.en.toLowerCase().includes(q) ||
        item.name.hi.toLowerCase().includes(q) ||
        item.summary.en.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      const matchesDuration = item.visit.typicalMinutes <= maxDuration;

      return matchesZone && matchesVibe && matchesSearch && matchesDuration;
    });
  }, [attractions, selectedZone, vibeFilter, searchQuery, maxDuration]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h2 className="font-heading text-xl font-bold text-ink">
            Jammu Regional Directory
          </h2>
          <p className="text-xs text-stone">
            36 verified shrines, Dogra forts, alpine valleys, and offbeat wonders across Jammu division.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="px-3 py-2 rounded-xl bg-surface border border-border text-ink hover:text-primary text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 apple-press"
            title="Upload new spot, accurate GPS or photo"
          >
            <Camera size={14} className="text-primary" />
            <span>+ Add Spot</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/map')}
            className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:bg-primary-dark transition-all flex items-center gap-1.5 apple-press"
            title="Switch to Interactive Map"
          >
            <Compass size={14} />
            <span>Interactive Map</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search (e.g. Raghunath, Bhaderwah, Patnitop, Shiv Khori, Suchetgarh)..."
          className="w-full pl-9 pr-3 py-2.5 rounded-control border border-border bg-card text-ink text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
        />
      </div>

      {/* Zone Category Pills Slider */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none">
        {ZONE_TABS.map((tab) => {
          const isActive = selectedZone === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedZone(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-card border border-border text-stone hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Vibe and Duration Filters */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        {/* Vibe Toggle */}
        <div className="flex p-0.5 rounded-control bg-card border border-border shrink-0">
          <button
            onClick={() => setVibeFilter('all')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              vibeFilter === 'all' ? 'bg-primary text-white shadow-sm' : 'text-stone hover:text-ink'
            }`}
          >
            All Spots
          </button>
          <button
            onClick={() => setVibeFilter('classic')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              vibeFilter === 'classic' ? 'bg-primary text-white shadow-sm' : 'text-stone hover:text-ink'
            }`}
          >
            🏛️ Popular
          </button>
          <button
            onClick={() => setVibeFilter('offbeat')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              vibeFilter === 'offbeat' ? 'bg-accent text-accent-ink shadow-sm' : 'text-stone hover:text-ink'
            }`}
          >
            ✨ Hidden Gems
          </button>
        </div>

        {/* Duration Pills */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-stone">Visit:</span>
          {[60, 120, 240, 360].map((mins) => (
            <button
              key={mins}
              onClick={() => setMaxDuration(mins)}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                maxDuration === mins
                  ? 'bg-primary-soft text-primary font-bold'
                  : 'hover:bg-surface text-stone'
              }`}
            >
              ≤{mins}m
            </button>
          ))}
        </div>
      </div>

      {selectedZone === 'gi_heritage' ? (
        <div className="pt-1 animate-in fade-in">
          <GiProductsSection
            title="Registered GI Treasures of Jammu & Kashmir"
            subtitle="Explore officially registered Geographical Indications, authentic buying outlets, price standards and verification criteria."
          />
        </div>
      ) : (
        <>
          {/* Result Count */}
          <div className="text-[11px] font-semibold text-stone">
            Showing {filteredAttractions.length} verified destinations across Jammu
          </div>

          {/* Attraction Cards (Photo First, Then Info) */}
          <div className="space-y-4">
        {filteredAttractions.map((attr) => (
          <div
            key={attr.id}
            onClick={() => navigate(`/explore/${attr.id}`)}
            className="overflow-hidden bg-card border border-border rounded-2xl hover:border-primary/50 cursor-pointer transition-all shadow-sm hover:shadow-md group"
          >
            {/* Spot Photographic Image First */}
            <div className="relative w-full h-44 sm:h-52 bg-surface overflow-hidden">
              <img
                src={getSpotImage(attr.id, attr.type)}
                alt={attr.name.en}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

              {/* Tag Overlays */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                {attr.isOffbeat ? (
                  <span className="text-[10px] bg-amber-500/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full font-bold shadow-sm">
                    ✨ Hidden Gem
                  </span>
                ) : (
                  <span className="text-[10px] bg-primary/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full font-bold shadow-sm">
                    🏛️ Must-Visit
                  </span>
                )}
                <span className="text-[10px] bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full font-medium capitalize">
                  {attr.type}
                </span>
                <SourceBadge type={attr.sourceType} />
              </div>

              {/* Rating Badge */}
              <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 text-white text-xs font-bold shadow-sm">
                <span className="text-amber-400">★</span>
                <span>4.9</span>
              </div>

              {/* Bottom Title on Image */}
              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <h3 className="font-heading font-bold text-base sm:text-lg leading-tight drop-shadow-md">
                  {attr.name.en}
                </h3>
                <div className="text-xs text-white/80 font-medium">
                  {attr.name.hi}
                </div>
              </div>
            </div>

            {/* Spot Informational Content */}
            <div className="p-3.5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-stone line-clamp-2 leading-relaxed">
                  {attr.summary.en}
                </p>
                <FreshnessChip verifiedOn={attr.verification.verifiedOn} reviewDueOn={attr.reviewDueOn} />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-stone">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-primary" />
                    <span>{attr.visit.typicalMinutes}m visit</span>
                  </span>
                  <span className="capitalize">{attr.visit.bestTime}</span>
                  {attr.zone && (
                    <span className="capitalize px-1.5 py-0.2 bg-surface border border-border rounded text-[10px] font-medium text-ink">
                      {attr.zone.replace('_', ' ')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/map', { state: { targetNode: attr.nodeId } });
                    }}
                    className="px-2 py-1 rounded-lg border border-border text-stone hover:text-primary hover:bg-surface text-[11px] font-semibold flex items-center gap-1 apple-press"
                    title="View on Map"
                  >
                    <Compass size={12} />
                    <span>Map</span>
                  </button>
                  <div className="flex items-center gap-1 text-primary font-bold text-xs">
                    <span>View Details</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )}

  {/* Spot & Photo Upload Modal */}
  <SpotUploadModal
    isOpen={showUploadModal}
    onClose={() => setShowUploadModal(false)}
    onSuccess={() => {
      loadAttractions();
    }}
  />
</div>
  );
};
