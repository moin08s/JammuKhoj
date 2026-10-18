import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Heart, Clock, Sparkles } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

export interface TravelloDestination {
  id: string;
  name: string;
  location: string;
  category: string;
  isOffbeat: boolean;
  rating: number;
  reviewsCount: string;
  visitDuration: string;
  entryFee: string;
  imageUrl: string;
}

const TRAVELLO_FEATURED_DESTINATIONS: TravelloDestination[] = [
  {
    id: 'attr_raghunath_temple',
    name: 'Raghunath Temple',
    location: 'Old City, Jammu',
    category: 'Sacred Sanctum',
    isOffbeat: false,
    rating: 4.9,
    reviewsCount: '2.8k',
    visitDuration: '60 mins',
    entryFee: 'Free Darshan',
    imageUrl: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'attr_bhaderwah',
    name: 'Bhaderwah "Mini Kashmir"',
    location: 'Bhaderwah Valley, Doda',
    category: 'Alpine Meadow',
    isOffbeat: true,
    rating: 4.8,
    reviewsCount: '1.4k',
    visitDuration: '1–2 Days',
    entryFee: 'Open Access',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'attr_vaishno_devi',
    name: 'Mata Vaishno Devi Shrine',
    location: 'Trikuta Hills, Katra',
    category: 'Divine Cave',
    isOffbeat: false,
    rating: 5.0,
    reviewsCount: '14.2k',
    visitDuration: '8–12 Hours',
    entryFee: 'Free Yatra Pass',
    imageUrl: 'https://images.unsplash.com/photo-1626014303757-6467385f0efc?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'attr_bahu_fort',
    name: 'Bahu Fort & Bagh-e-Bahu',
    location: 'Tawi Riverfront, Jammu',
    category: 'Historic Sandstone Fort',
    isOffbeat: false,
    rating: 4.7,
    reviewsCount: '3.1k',
    visitDuration: '90 mins',
    entryFee: '₹20 Entry',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'attr_patnitop',
    name: 'Patnitop & Skyview Gondola',
    location: 'Udhampur Highway',
    category: 'Pine Ridge Hill Station',
    isOffbeat: false,
    rating: 4.8,
    reviewsCount: '4.5k',
    visitDuration: '4–6 Hours',
    entryFee: 'Open Access',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'attr_suchetgarh_border',
    name: 'Suchetgarh Border Retreat',
    location: 'RS Pura, Jammu Border',
    category: 'BSF Beating Retreat',
    isOffbeat: true,
    rating: 4.8,
    reviewsCount: '920',
    visitDuration: '2 Hours',
    entryFee: 'Free with Govt ID',
    imageUrl: 'https://images.unsplash.com/photo-1579273166152-d725a4e2b755?auto=format&fit=crop&w=600&q=80',
  },
];

export const TravelloHeroCardCarousel: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAppStore();

  return (
    <div className="space-y-2.5 select-none">
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="font-heading font-bold text-base text-ink">
            Popular Destinations
          </h3>
          <p className="text-[11px] text-stone">Most loved spots across Jammu Division</p>
        </div>
        <button
          onClick={() => navigate('/explore')}
          className="text-xs font-bold text-primary hover:underline"
        >
          View All
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-3.5 overflow-x-auto pb-2 pt-1 no-scrollbar px-1">
        {TRAVELLO_FEATURED_DESTINATIONS.map((dest) => {
          const isFav = favorites.includes(dest.id);
          return (
            <div
              key={dest.id}
              onClick={() => navigate(`/explore/${dest.id}`)}
              className="relative w-[230px] h-[310px] rounded-3xl overflow-hidden shrink-0 shadow-lg cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-black/5 dark:border-white/10"
            >
              {/* Background Cover Image */}
              <img
                src={dest.imageUrl}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-teal-800', 'to-slate-900');
                }}
              />

              {/* Gradient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/20 pointer-events-none" />

              {/* Top Floating Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20">
                  {dest.isOffbeat ? '✨ Hidden Gem' : dest.category}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(dest.id);
                  }}
                  className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                    isFav
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-black/30 hover:bg-black/50 text-white'
                  }`}
                  aria-label="Add to favorites"
                >
                  <Heart size={15} fill={isFav ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Bottom Information Card */}
              <div className="absolute bottom-3 left-3 right-3 z-10 text-white space-y-1.5 pointer-events-none">
                {/* Rating Badge */}
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-amber-400 text-[10px] font-bold border border-white/10">
                  <Star size={11} fill="currentColor" />
                  <span>{dest.rating.toFixed(1)}</span>
                  <span className="text-white/70">({dest.reviewsCount})</span>
                </div>

                <h4 className="font-heading font-bold text-lg text-white leading-tight drop-shadow-md truncate">
                  {dest.name}
                </h4>

                <div className="flex items-center justify-between text-xs text-white/80 pt-1 border-t border-white/15">
                  <div className="flex items-center gap-1 truncate text-[11px]">
                    <MapPin size={12} className="text-amber-400 shrink-0" />
                    <span className="truncate">{dest.location}</span>
                  </div>

                  <div className="text-[10px] font-bold text-amber-300 shrink-0 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {dest.visitDuration}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
