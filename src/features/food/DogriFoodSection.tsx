import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Sparkles,
  MapPin,
  Star,
  ChevronRight,
  X,
  Share2,
  Check,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { DOGRI_FOOD_ITEMS, DogriFoodItem } from '@/data/foodData';

interface DogriFoodSectionProps {
  onSelectShop?: (shopName: string, location: string) => void;
}

export const DogriFoodSection: React.FC<DogriFoodSectionProps> = ({ onSelectShop }) => {
  const [selectedFood, setSelectedFood] = useState<DogriFoodItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'street_food' | 'main_course' | 'sweet'>('all');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'pure_veg' | 'jain_friendly'>('all');
  const [copiedShop, setCopiedShop] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: 'All Dogri Treats' },
    { key: 'street_food', label: 'Street Chaat & Kulcha' },
    { key: 'main_course', label: 'Feasts & Rajma' },
    { key: 'sweet', label: 'Sweets & Heritage' },
  ];

  const filteredItems = DOGRI_FOOD_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesDietary = dietaryFilter === 'all' || item.dietary === dietaryFilter;
    return matchesCategory && matchesDietary;
  });

  const handleCopyShop = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedShop(id);
    setTimeout(() => setCopiedShop(null), 2000);
  };

  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#9E4A0C]/10 text-[#9E4A0C]">
              <UtensilsCrossed size={16} />
            </span>
            <h3 className="font-heading text-base font-bold text-ink">
              Dogri Food Trail & Iconic Bites
            </h3>
          </div>
          <p className="text-xs text-stone-500">
            Taste authentic Kaladi, Bhaderwah Rajma, and traditional Dogra Dham feasts.
          </p>
        </div>
      </div>

      {/* Category & Dietary Pills */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.key
                  ? 'bg-[#9E4A0C] text-white shadow-xs'
                  : 'bg-white border border-[#EBE4DC] text-stone-600 hover:text-ink'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dietary options: Pure Veg & Jain Friendly */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] font-bold text-stone uppercase tracking-wider shrink-0">Dietary:</span>
          <button
            onClick={() => setDietaryFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              dietaryFilter === 'all'
                ? 'bg-stone-800 text-white'
                : 'bg-surface border border-border text-stone hover:text-ink'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setDietaryFilter(dietaryFilter === 'pure_veg' ? 'all' : 'pure_veg')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
              dietaryFilter === 'pure_veg'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Pure Veg 🟢</span>
          </button>
          <button
            onClick={() => setDietaryFilter(dietaryFilter === 'jain_friendly' ? 'all' : 'jain_friendly')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 ${
              dietaryFilter === 'jain_friendly'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300'
            }`}
          >
            <span>🥬 Jain Friendly (No Onion/Garlic)</span>
          </button>
        </div>
      </div>

      {/* Food Cards Carousel */}
      <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar pb-1">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedFood(item)}
            className="w-64 shrink-0 bg-white border border-[#EBE4DC] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
          >
            <div className="relative h-32 w-full overflow-hidden bg-stone-100">
              <img
                src={item.heroImage}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Hari_Market_Jammu.JPG/960px-Hari_Market_Jammu.JPG';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-amber-300">
                  {item.dogriName}
                </span>
                {item.dietary === 'jain_friendly' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-800/80 backdrop-blur-md text-[10px] font-bold text-emerald-200">
                    Jain Safe
                  </span>
                )}
              </div>
              <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                <h4 className="font-heading font-bold text-sm leading-snug drop-shadow-sm">
                  {item.name}
                </h4>
                <p className="text-[10px] text-stone-200 line-clamp-1">{item.tasteProfile}</p>
              </div>
            </div>

            <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2 border-t border-[#F1E9E0] flex items-center justify-between text-xs">
                <span className="font-bold text-[#9E4A0C] text-[11px]">{item.approxPrice}</span>
                <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-0.5 group-hover:text-[#9E4A0C] transition-colors">
                  <span>{item.iconicShops.length} Spots</span>
                  <ChevronRight size={13} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal */}
      {selectedFood && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className="relative h-44 shrink-0 bg-stone-900">
              <img
                src={selectedFood.heroImage}
                alt={selectedFood.name}
                className="w-full h-full object-cover opacity-80"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Hari_Market_Jammu.JPG/960px-Hari_Market_Jammu.JPG';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <button
                onClick={() => setSelectedFood(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="absolute bottom-3 left-4 right-4 text-white space-y-1">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#9E4A0C] text-[11px] font-bold tracking-wide">
                  {selectedFood.dogriName}
                </div>
                <h3 className="font-heading text-lg font-black leading-tight drop-shadow-sm">
                  {selectedFood.name}
                </h3>
                <p className="text-xs text-amber-200 font-medium">{selectedFood.tasteProfile}</p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs text-stone-700">
              {/* Lore / Story */}
              <div className="bg-[#FAF6F0] border border-[#F3D7C5] p-3 rounded-xl space-y-1">
                <div className="font-bold text-[#9E4A0C] flex items-center gap-1.5 text-xs">
                  <Sparkles size={14} />
                  <span>Heritage Background & Tradition</span>
                </div>
                <p className="text-stone-600 leading-relaxed text-[11px]">
                  {selectedFood.historicalStory}
                </p>
              </div>

              {/* Ingredients */}
              <div className="space-y-1.5">
                <h4 className="font-heading font-bold text-ink text-xs uppercase tracking-wider text-stone-500">
                  Key Authentic Ingredients
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFood.keyIngredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 text-[11px] font-medium"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Iconic Verified Spots */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-ink text-xs uppercase tracking-wider text-stone-500">
                    Verified Iconic Eateries in Jammu
                  </h4>
                  <span className="text-[10px] text-stone-400">Locally vetted</span>
                </div>

                <div className="space-y-2">
                  {selectedFood.iconicShops.map((shop, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-[#EBE4DC] bg-stone-50/50 hover:bg-stone-50 transition-colors space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-ink text-xs flex items-center gap-1.5">
                            <span>{shop.shopName}</span>
                            <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-0.5">
                              <Star size={10} className="fill-emerald-800" />
                              {shop.rating}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                            <MapPin size={11} className="text-[#9E4A0C] shrink-0" />
                            <span>{shop.location}</span>
                          </div>
                          <div className="text-[10px] text-stone-400 pl-3.5">
                            Near: {shop.landmark}
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleCopyShop(
                              `${shop.shopName}, ${shop.location}`,
                              `${selectedFood.id}-${idx}`
                            )
                          }
                          className="px-2 py-1 rounded-lg border border-stone-200 bg-white text-stone-600 hover:text-ink text-[10px] font-semibold flex items-center gap-1 shrink-0"
                        >
                          {copiedShop === `${selectedFood.id}-${idx}` ? (
                            <>
                              <Check size={11} className="text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Share2 size={11} />
                              <span>Share</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="bg-amber-50/80 border border-amber-200/60 p-2 rounded-lg text-[11px] text-amber-900 flex items-center justify-between">
                        <span>
                          <strong>What to order:</strong> {shop.recommendedOrder}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-stone-50 border-t border-[#EBE4DC] flex items-center justify-between">
              <div className="text-xs">
                <span className="text-stone-500">Average cost: </span>
                <span className="font-bold text-[#9E4A0C]">{selectedFood.approxPrice}</span>
              </div>
              <button
                onClick={() => setSelectedFood(null)}
                className="px-4 py-2 rounded-xl bg-[#9E4A0C] text-white text-xs font-bold hover:bg-[#853E0A] transition-colors"
              >
                Close Trail
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
