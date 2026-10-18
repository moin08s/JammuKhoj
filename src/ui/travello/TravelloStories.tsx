import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, MapPin, ChevronRight, Heart, Share2, Compass } from 'lucide-react';

export interface StoryItem {
  id: string;
  name: string;
  category: string;
  coverImage: string;
  attractionId: string;
  badge: string;
  tagline: string;
  highlights: string[];
}

const TRAVELLO_STORIES: StoryItem[] = [
  {
    id: 'story_raghunath',
    name: 'Raghunath Mandir',
    category: 'Sacred Sanctum',
    badge: 'Must Visit',
    coverImage: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=600&q=80',
    attractionId: 'attr_raghunath_temple',
    tagline: 'North India\'s largest 1857 temple with gold-plated sanctums & 300+ stone shilas.',
    highlights: ['300+ sacred Shaligram shilas', 'Built by Maharaja Gulab Singh', 'Heart of Jammu Old City'],
  },
  {
    id: 'story_vaishno_devi',
    name: 'Vaishno Devi',
    category: 'Divine Katra',
    badge: 'Top Pilgrimage',
    coverImage: 'https://images.unsplash.com/photo-1626014303757-6467385f0efc?auto=format&fit=crop&w=600&q=80',
    attractionId: 'attr_vaishno_devi',
    tagline: 'Trikuta Mountain holy cave shrine visited by millions of pilgrims annually.',
    highlights: ['12-14 km scenic paved track', 'Helicopter & battery cars available', '24x7 holy darshan'],
  },
  {
    id: 'story_bhaderwah',
    name: 'Bhaderwah Valley',
    category: 'Mini Kashmir',
    badge: 'Offbeat Alpine',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    attractionId: 'attr_bhaderwah',
    tagline: 'Velvet meadows, deodar forests, crystal brooks, and traditional wooden hamlets.',
    highlights: ['Jai Valley stream meadows', '10,500 ft Padri Pass', 'Crisp alpine summer escape'],
  },
  {
    id: 'story_patnitop',
    name: 'Patnitop & Sanasar',
    category: 'Pine Ridges',
    badge: 'Hill Station',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
    attractionId: 'attr_patnitop',
    tagline: 'Snow-capped Shivalik viewpoints, Skyview cable car & Sanasar paragliding.',
    highlights: ['Skyview Gondola ropeway', 'Sanasar cup-shaped meadow', 'Winter snow & pine walks'],
  },
  {
    id: 'story_bahu_fort',
    name: 'Bahu Fort & Garden',
    category: 'Royal Heritage',
    badge: 'Historic Fort',
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
    attractionId: 'attr_bahu_fort',
    tagline: '3,000-year ancient sandstone fort with sacred Bawe Wali Mata & terraced aquarium.',
    highlights: ['Panoramic Tawi river sunset', 'Underground aquarium garden', 'Famous Tuesday/Sunday darshan'],
  },
  {
    id: 'story_suchetgarh',
    name: 'Suchetgarh Border',
    category: 'Border Retreat',
    badge: 'Patriotic Site',
    coverImage: 'https://images.unsplash.com/photo-1579273166152-d725a4e2b755?auto=format&fit=crop&w=600&q=80',
    attractionId: 'attr_suchetgarh_border',
    tagline: 'Daily evening Beating Retreat ceremony with BSF drills and pre-1947 railway post.',
    highlights: ['BSF daily ceremonial parade', 'Heritage border railway line', 'RS Pura Basmati countryside'],
  },
  {
    id: 'story_basohli',
    name: 'Basohli & Purthu',
    category: 'Mini Goa of J&K',
    badge: 'Lakeside Beach',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    attractionId: 'attr_basohli_purthu',
    tagline: 'Turquoise Ranjit Sagar Lake waters, Purthu green beach & GI-tagged miniature paintings.',
    highlights: ['Atal Setu suspension bridge', 'Water sports & boating', 'Centuries-old royal painting school'],
  },
];

export const TravelloStories: React.FC = () => {
  const navigate = useNavigate();
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [progress, setProgress] = useState(0);

  // Auto-progress story timer
  useEffect(() => {
    if (!activeStory) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next story or close
          const currentIndex = TRAVELLO_STORIES.findIndex((s) => s.id === activeStory.id);
          if (currentIndex < TRAVELLO_STORIES.length - 1) {
            setActiveStory(TRAVELLO_STORIES[currentIndex + 1]);
            return 0;
          } else {
            setActiveStory(null);
            return 0;
          }
        }
        return prev + 2.5; // ~4 seconds total
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStory]);

  return (
    <div className="space-y-2 select-none">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-heading font-bold text-sm text-ink flex items-center gap-1.5">
          <Sparkles size={14} className="text-amber-500" />
          <span>Travello Highlights & Stories</span>
        </h3>
        <span className="text-[11px] text-stone font-semibold">Tap to view</span>
      </div>

      {/* Stories Horizontal Scroller */}
      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar pt-1 px-1">
        {TRAVELLO_STORIES.map((story) => (
          <button
            key={story.id}
            onClick={() => {
              setActiveStory(story);
              setProgress(0);
            }}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
          >
            {/* Story Ring Avatar */}
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-primary group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <div className="p-0.5 bg-card rounded-full">
                <img
                  src={story.coverImage}
                  alt={story.name}
                  className="w-14 h-14 rounded-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback gradient if offline
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-primary', 'to-amber-500', 'w-14', 'h-14', 'flex', 'items-center', 'justify-center', 'text-white', 'font-bold', 'text-xs');
                    e.currentTarget.parentElement!.innerText = story.name.charAt(0);
                  }}
                />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-ink group-hover:text-primary transition-colors max-w-[68px] truncate text-center">
              {story.name}
            </span>
          </button>
        ))}
      </div>

      {/* Full-Screen Travello Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm h-[85vh] max-h-[700px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between bg-slate-900 border border-white/10">
            {/* Background Image with Dark Vignette */}
            <img
              src={activeStory.coverImage}
              alt={activeStory.name}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-900/80 pointer-events-none" />

            {/* Top Progress Bar and Header */}
            <div className="relative z-10 p-4 space-y-3">
              {/* Timed Progress Bar */}
              <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Story Header */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                    {activeStory.badge}
                  </span>
                  <span className="text-xs font-semibold text-white/90">{activeStory.category}</span>
                </div>
                <button
                  onClick={() => setActiveStory(null)}
                  className="p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Bottom Content & CTA */}
            <div className="relative z-10 p-5 space-y-4">
              <div className="space-y-1.5">
                <h3 className="font-heading text-2xl font-bold text-white drop-shadow-md">
                  {activeStory.name}
                </h3>
                <p className="text-xs text-white/80 leading-relaxed drop-shadow-sm">
                  {activeStory.tagline}
                </p>
              </div>

              {/* Highlight Bullets */}
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 space-y-1 text-white text-xs">
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Spot Highlights:
                </div>
                <ul className="space-y-1 text-[11px] text-white/90">
                  {activeStory.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="text-amber-400">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    navigate(`/explore/${activeStory.attractionId}`);
                    setActiveStory(null);
                  }}
                  className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold text-xs shadow-lg hover:bg-primary/95 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <Compass size={15} />
                  <span>Explore Destination</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/suggestions');
                    setActiveStory(null);
                  }}
                  className="py-3 px-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition-all active:scale-95"
                  title="Plan Visit"
                >
                  <Sparkles size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
