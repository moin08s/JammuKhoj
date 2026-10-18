import React from 'react';
import {
  X,
  ShieldCheck,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  BadgeIndianRupee,
  Building2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import type { GIProduct } from '@/data/giProductsData';
import { useNavigate } from 'react-router-dom';

interface GiProductShowcaseModalProps {
  product: GIProduct | null;
  onClose: () => void;
}

export const GiProductShowcaseModal: React.FC<GiProductShowcaseModalProps> = ({
  product,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-card border border-border rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl animate-in zoom-in-95 relative">
        {/* Sticky Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center transition-colors shadow-md"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Hero Image & GI Header */}
        <div className="relative h-48 sm:h-56 w-full rounded-t-3xl overflow-hidden">
          <img
            src={product.heroImage}
            alt={product.name.en}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          <div className="absolute bottom-3 left-4 right-4 text-white space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F3C969] text-[#1C2923] shadow-xs">
                <ShieldCheck size={12} /> {product.giStatus}
              </span>
              {product.giApplicationNo && (
                <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full font-medium">
                  {product.giApplicationNo}
                </span>
              )}
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold leading-tight">
              {product.name.en}
            </h2>
            <div className="text-xs text-white/80 flex items-center gap-2">
              <span>{product.name.hi}</span>
              {product.name.doi && <span>• {product.name.doi}</span>}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 pt-0 space-y-4">
          {/* Metadata badges */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-2xl bg-surface border border-border space-y-0.5">
              <div className="text-[10px] font-bold text-stone uppercase tracking-wider flex items-center gap-1">
                <MapPin size={11} className="text-[#174D3C]" />
                <span>District & Hub</span>
              </div>
              <div className="font-bold text-ink truncate">{product.district}</div>
              <div className="text-[11px] text-stone truncate">{product.originHub}</div>
            </div>

            <div className="p-2.5 rounded-2xl bg-surface border border-border space-y-0.5">
              <div className="text-[10px] font-bold text-stone uppercase tracking-wider flex items-center gap-1">
                <BadgeIndianRupee size={11} className="text-[#174D3C]" />
                <span>Price Benchmark</span>
              </div>
              <div className="font-bold text-[#174D3C] text-[11px] leading-snug">
                {product.priceBenchmark}
              </div>
            </div>
          </div>

          {/* Tagline & Heritage Overview */}
          <div className="space-y-1.5">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-stone">
              Heritage & Cultural Significance
            </h3>
            <p className="text-xs text-ink/90 leading-relaxed bg-surface/60 p-3 rounded-2xl border border-border/80">
              {product.description}
            </p>
          </div>

          {/* How to Spot Genuine vs Fake (Authenticity Guide) */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
            <h3 className="font-heading text-xs font-bold text-ink flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-600 dark:text-amber-400" />
              <span>How to Spot 100% Genuine GI Quality</span>
            </h3>
            <ul className="space-y-1.5">
              {product.authenticityGuide.map((tip, idx) => (
                <li key={idx} className="text-xs text-ink/85 flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Where to Buy in Jammu */}
          <div className="space-y-2">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-stone flex items-center gap-1">
              <Building2 size={13} className="text-[#174D3C]" />
              <span>Verified Purchasing Outlets in Jammu</span>
            </h3>
            <div className="space-y-2">
              {product.whereToBuyInJammu.map((store, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-surface border border-border flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-ink">{store.name}</div>
                    <div className="text-[11px] text-stone mt-0.5">{store.address}</div>
                  </div>
                  <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#174D3C]/10 text-[#174D3C] border border-[#174D3C]/20">
                    {store.verifiedType}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action footer */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-border">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-border text-xs font-semibold text-stone hover:text-ink hover:bg-surface transition-all"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                navigate('/explore');
              }}
              className="py-2.5 px-4 rounded-xl bg-[#174D3C] hover:bg-[#123E38] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-[#174D3C]/20"
            >
              <span>Explore Jammu Attractions</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
