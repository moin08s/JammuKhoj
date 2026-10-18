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
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
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
        <div className="flex items-center gap-1.5 p-2 bg-stone-50 border-b border-stone-200 overflow-x-auto no-scrollbar shrink-0">
          {SPIRITUAL_SHRINES_GUIDE.map((shrine) => (
            <button
              key={shrine.id}
              onClick={() => setSelectedShrineId(shrine.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedShrineId === shrine.id
                  ? 'bg-[#9E4A0C] text-white shadow-xs'
                  : 'bg-white border border-[#EBE4DC] text-stone-600 hover:text-ink'
              }`}
            >
              {shrine.name.replace('Shri ', '').replace(' Complex', '')}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs text-stone-700">
          {/* Shrine Summary */}
          <div className="space-y-1">
            <h4 className="font-heading text-base font-bold text-ink">
              {currentShrine.name}
            </h4>
            <div className="text-[11px] text-[#9E4A0C] font-semibold">
              Deity: {currentShrine.deity}
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              {currentShrine.significance}
            </p>
          </div>

          {/* Quick Rules Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Dress Code */}
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                <Shirt size={14} className="text-amber-700" />
                <span>Dress Code</span>
              </div>
              <p className="text-[11px] text-stone-700 leading-snug">
                <strong>Recommended:</strong> {currentShrine.dressCode.recommended}
              </p>
              <p className="text-[10px] text-red-700 font-medium">
                <strong>Prohibited:</strong> {currentShrine.dressCode.prohibited}
              </p>
            </div>

            {/* Photography Policy */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-ink text-xs">
                <Camera size={14} className="text-[#9E4A0C]" />
                <span>Cameras & Mobiles</span>
              </div>
              <div className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-200 text-stone-800">
                {currentShrine.photographyRule.replace(/_/g, ' ')}
              </div>
              <p className="text-[11px] text-stone-600 leading-snug">
                {currentShrine.photographyNote}
              </p>
            </div>
          </div>

          {/* Timings & Aarti */}
          <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#F3D7C5] space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[#9E4A0C] text-xs">
              <Clock size={14} />
              <span>Darshan Timings & Special Aarti</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-stone-500 font-medium">Morning: </span>
                <span className="font-bold text-ink">{currentShrine.darshanTimings.morning}</span>
              </div>
              <div>
                <span className="text-stone-500 font-medium">Evening: </span>
                <span className="font-bold text-ink">{currentShrine.darshanTimings.evening}</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-white border border-[#EBE4DC] text-[11px] text-amber-900 font-semibold">
              🌟 {currentShrine.darshanTimings.specialAarti}
            </div>
          </div>

          {/* Footwear & Cloakroom Details */}
          <div className="space-y-2">
            <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-500">
              Footwear & Cloakroom Logistics
            </h5>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink">Footwear Stand:</span>
                <span className="text-emerald-700 font-bold">{currentShrine.footwearLocker.cost}</span>
              </div>
              <p className="text-stone-600">
                <strong>Location:</strong> {currentShrine.footwearLocker.location}
              </p>
              <p className="text-stone-500 italic">
                Tip: {currentShrine.footwearLocker.advice}
              </p>
            </div>
          </div>

          {/* Prasad & Offerings */}
          <div className="space-y-1">
            <h5 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-500">
              Prasad & Offerings Guidance
            </h5>
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-[11px] text-emerald-950 leading-relaxed">
              {currentShrine.offeringsPolicy}
            </div>
          </div>

          {/* Accessibility & Peak Days */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[10px] space-y-0.5">
              <span className="font-bold text-ink block">Accessibility:</span>
              <span className="text-stone-600">{currentShrine.accessibility}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/60 text-[10px] space-y-0.5">
              <span className="font-bold text-amber-900 block">Peak Rush Days:</span>
              <span className="text-amber-800">{currentShrine.peakDays.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-[#EBE4DC] flex items-center justify-between">
          <span className="text-[11px] text-stone-500">Shrine Board approved guidelines</span>
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
