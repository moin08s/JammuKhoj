import React, { useState } from 'react';
import {
  Flower2,
  X,
  Camera,
  Shirt,
  Clock,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';
import { SPIRITUAL_SHRINES_GUIDE, SpiritualShrineGuide } from '@/data/spiritualEtiquetteData';

interface SpiritualEtiquetteModalProps {
  initialShrineId?: string;
  onClose: () => void;
}

export const SpiritualEtiquetteModal: React.FC<SpiritualEtiquetteModalProps> = ({
  initialShrineId,
  onClose,
}) => {
  const [selectedShrineId, setSelectedShrineId] = useState<string>(
    initialShrineId || SPIRITUAL_SHRINES_GUIDE[0].id
  );

  const currentShrine =
    SPIRITUAL_SHRINES_GUIDE.find((s) => s.id === selectedShrineId) ||
    SPIRITUAL_SHRINES_GUIDE[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
      <div className="bg-card border border-border w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200 text-ink">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-700 via-[#9E4A0C] to-amber-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
              <Flower2 size={20} className="text-amber-200" />
            </div>
            <div>
              <h3 className="font-heading font-black text-base leading-tight">
                Temple Etiquette & Darshan Rules
              </h3>
              <p className="text-[11px] text-amber-200">
                Official shrine customs, dress codes, & security guidelines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Shrine Selector Tabs */}
        <div className="flex items-center gap-1.5 p-2 bg-surface border-b border-border overflow-x-auto no-scrollbar shrink-0">
          {SPIRITUAL_SHRINES_GUIDE.map((shrine) => (
            <button
              key={shrine.id}
              onClick={() => setSelectedShrineId(shrine.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedShrineId === shrine.id
                  ? 'bg-[#9E4A0C] text-white shadow-xs'
                  : 'bg-card border border-border text-stone hover:text-ink'
              }`}
            >
              {shrine.name.replace('Shri ', '').replace(' Complex', '')}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs text-ink">
          {/* Shrine Summary */}
          <div className="space-y-1">
            <h4 className="font-heading text-base font-bold text-ink">
              {currentShrine.name}
            </h4>
            <div className="text-[11px] text-[#9E4A0C] dark:text-amber-400 font-semibold">
              Deity: {currentShrine.deity}
            </div>
            <p className="text-stone text-[11px] leading-relaxed">
              {currentShrine.significance}
            </p>
          </div>

          {/* Quick Rules Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Dress Code */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 text-xs">
                <Shirt size={14} className="text-amber-600 dark:text-amber-400" />
                <span>Dress Code</span>
              </div>
              <p className="text-[11px] text-stone leading-snug">
                <strong>Recommended:</strong> {currentShrine.dressCode.recommended}
              </p>
              <p className="text-[10px] text-red-600 dark:text-red-400 font-medium">
                <strong>Prohibited:</strong> {currentShrine.dressCode.prohibited}
              </p>
            </div>

            {/* Photography Policy */}
            <div className="p-3 rounded-xl bg-surface border border-border space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-ink text-xs">
                <Camera size={14} className="text-[#9E4A0C] dark:text-amber-400" />
                <span>Cameras & Mobiles</span>
              </div>
              <div className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface border border-border text-stone">
                {currentShrine.photographyRule.replace(/_/g, ' ')}
              </div>
              <p className="text-[11px] text-stone leading-snug">
                {currentShrine.photographyNote}
              </p>
            </div>
          </div>

          {/* Timings & Aarti */}
          <div className="p-3 rounded-xl bg-surface border border-border space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[#9E4A0C] dark:text-amber-400 text-xs">
              <Clock size={14} />
              <span>Darshan Timings & Special Aarti</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-stone font-medium">Morning: </span>
                <span className="font-bold text-ink">{currentShrine.darshanTimings.morning}</span>
              </div>
              <div>
                <span className="text-stone font-medium">Evening: </span>
                <span className="font-bold text-ink">{currentShrine.darshanTimings.evening}</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-card border border-border text-[11px] text-amber-900 dark:text-amber-300 font-semibold">
              🌟 {currentShrine.darshanTimings.specialAarti}
            </div>
          </div>

          {/* Footwear & Cloakroom Details */}
          <div className="space-y-2">
            <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-stone">
              Footwear & Cloakroom Logistics
            </h5>
            <div className="p-3 rounded-xl bg-surface border border-border space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink">Footwear Stand:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{currentShrine.footwearLocker.cost}</span>
              </div>
              <p className="text-stone">
                <strong>Location:</strong> {currentShrine.footwearLocker.location}
              </p>
              <p className="text-stone italic">
                Tip: {currentShrine.footwearLocker.advice}
              </p>
            </div>
          </div>

          {/* Prasad & Offerings */}
          <div className="space-y-1">
            <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-stone">
              Prasad & Offerings Guidance
            </h5>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-950 dark:text-emerald-200 leading-relaxed">
              {currentShrine.offeringsPolicy}
            </div>
          </div>

          {/* Accessibility & Peak Days */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-xl bg-surface border border-border text-[10px] space-y-0.5">
              <span className="font-bold text-ink block">Accessibility:</span>
              <span className="text-stone">{currentShrine.accessibility}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] space-y-0.5">
              <span className="font-bold text-amber-900 dark:text-amber-300 block">Peak Rush Days:</span>
              <span className="text-amber-800 dark:text-amber-400">{currentShrine.peakDays.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface border-t border-border flex items-center justify-between">
          <span className="text-[11px] text-stone">Shrine Board approved guidelines</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#9E4A0C] text-white text-xs font-bold hover:bg-[#853E0A] transition-colors"
          >
            I Understand & Comply
          </button>
        </div>
      </div>
    </div>
  );
};
