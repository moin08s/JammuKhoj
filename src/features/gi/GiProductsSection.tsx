import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  MapPin,
  ChevronRight,
  BadgeIndianRupee,
  Layers,
  Info,
} from 'lucide-react';
import { JAMMU_GI_PRODUCTS, type GIProduct } from '@/data/giProductsData';
import { GiProductShowcaseModal } from './GiProductShowcaseModal';

interface GiProductsSectionProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  showFilters?: boolean;
}

export const GiProductsSection: React.FC<GiProductsSectionProps> = ({
  title = 'Certified GI Heritage of Jammu',
  subtitle = 'Officially registered Geographical Indications & Dogra artisanal masterworks',
  limit,
  showFilters = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'craft' | 'handloom' | 'agriculture' | 'food'>('all');
  const [activeModalProduct, setActiveModalProduct] = useState<GIProduct | null>(null);

  const filteredProducts = JAMMU_GI_PRODUCTS.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  }).slice(0, limit || JAMMU_GI_PRODUCTS.length);

  return (
    <section aria-label="GI Marked Items" className="space-y-3.5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F3C969]/20 text-[#9E4A0C] dark:text-[#F3C969] border border-[#F3C969]/40">
              <ShieldCheck size={11} /> GI Certified Heritage
            </span>
          </div>
          <h2 className="font-heading font-bold text-base sm:text-lg text-ink mt-0.5">
            {title}
          </h2>
          <p className="text-xs text-stone">{subtitle}</p>
        </div>

        {/* Category Filter Pills */}
        {showFilters && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all', label: 'All Treasures' },
              { id: 'craft', label: '🎨 Crafts' },
              { id: 'handloom', label: '🧣 Handloom' },
              { id: 'food', label: '🍯 Food & Dairy' },
              { id: 'agriculture', label: '🌾 Saffron & Rajma' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCategory === tab.id
                    ? 'bg-[#174D3C] text-white border-[#174D3C] shadow-xs'
                    : 'bg-card text-stone hover:text-ink border-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of GI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            onClick={() => setActiveModalProduct(prod)}
            className="group bg-card border border-border hover:border-[#174D3C]/50 rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Card Image Banner */}
              <div className="relative h-36 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={prod.heroImage}
                  alt={prod.name.en}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Hari_Market_Jammu.JPG/960px-Hari_Market_Jammu.JPG';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#F3C969] dark:bg-amber-400 text-[#1C2923] dark:text-stone-950 shadow-xs">
                    <ShieldCheck size={10} /> {prod.giStatus}
                  </span>
                </div>

                {/* Bottom Overlay Title on Image */}
                <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                  <div className="text-[10px] text-white/80 flex items-center gap-1">
                    <MapPin size={10} className="text-[#F3C969] dark:text-amber-300" />
                    <span className="truncate">{prod.district}</span>
                  </div>
                  <h3 className="font-heading font-bold text-sm leading-tight truncate">
                    {prod.name.en}
                  </h3>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-3.5 space-y-2">
                <p className="text-[11px] text-stone line-clamp-2 leading-relaxed">
                  {prod.tagline}
                </p>

                <div className="p-2 rounded-xl bg-surface border border-border text-[10px] space-y-0.5">
                  <span className="font-bold text-stone uppercase tracking-wider block">Price Benchmark:</span>
                  <span className="text-[#174D3C] font-semibold block leading-tight">
                    {prod.priceBenchmark}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="px-3.5 pb-3 pt-1 border-t border-border/70 flex items-center justify-between text-xs font-bold text-[#174D3C] group-hover:text-[#123E38]">
              <span>Authenticity & Buying Guide</span>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <GiProductShowcaseModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />
    </section>
  );
};
