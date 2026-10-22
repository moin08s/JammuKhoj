import React from 'react';
import { X, Heart, Shield, Compass, Sparkles, MapPin, ExternalLink, Mail, Users, CheckCircle2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-card text-ink rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-title"
      >
        {/* Header with Emblem */}
        <div className="relative bg-gradient-to-br from-primary-dark via-primary to-emerald-700 text-white p-6 rounded-t-3xl">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/icons/icon-emblem.svg" 
              alt="JammuKhoj Emblem" 
              className="w-12 h-12 rounded-xl shadow-md border border-white/20 bg-white/10 p-1"
            />
            <div>
              <h2 id="about-modal-title" className="text-xl font-serif font-bold tracking-tight text-white">
                About JammuKhoj
              </h2>
              <p className="text-xs text-white/80">Civic Heritage & Pilgrim Companion</p>
            </div>
          </div>
          <p className="text-xs text-white/90 leading-relaxed mt-2">
            Dedicated to the pilgrims, explorers, and guardians of the Duggar cultural heritage.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-sm text-slate-700">
          {/* Mission */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Compass className="w-4 h-4" />
              <h3 className="font-serif text-base text-ink">Our Core Mission</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              Every year, over <strong>10 million pilgrims</strong> pass through Jammu on their sacred journey to Shri Mata Vaishno Devi. However, most travelers face opaque transport fares, confusing walking distances, and missed connections, while Jammu’s historic royal heritage and vibrant Dogra culture remain undiscovered.
            </p>
            <p className="text-xs leading-relaxed text-slate-600">
              <strong>JammuKhoj</strong> was created as a 100% free, non-commercial civic initiative to provide reliable, verified guidance with zero advertisements and zero tracking.
            </p>
          </div>

          {/* Pillars of Trust */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Shield className="w-4 h-4" />
              <h3 className="font-serif text-base text-ink">The 4 Guarantees of JammuKhoj</h3>
            </div>
            <div className="grid grid-cols-1 gap-2.5 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface border border-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-ink">100% Offline Resilience:</span>
                  <p className="text-stone mt-0.5">Everything—maps, phone numbers, Matador routes, and itineraries—functions without an internet connection.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface border border-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-ink">Verified Fares Matrix:</span>
                  <p className="text-stone mt-0.5">Direct official rates from Transport Commissioner notifications and ground surveys, preventing tourist gouging.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface border border-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-ink">Senior Pilgrim Safety First:</span>
                  <p className="text-stone mt-0.5">Automated return-by buffers ensure passengers never miss their train or flight at Jammu Tawi or Satwari Airport.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-surface border border-border">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-ink">Cultural & GI Preservation:</span>
                  <p className="text-stone mt-0.5">Promoting authentic Geographical Indication (GI) products like Basohli paintings, Pashmina, and Dogra culinary spots.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Who Built It */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
              <Users className="w-4 h-4" />
              <h4 className="font-heading text-sm">Who Built JammuKhoj?</h4>
            </div>
            <p className="text-xs text-stone leading-relaxed">
              JammuKhoj is built with devotion by local software engineers, cultural researchers, and volunteers based in Jammu. We collaborate with regional transport unions, shopkeepers, and local elders to ensure all data remains accurate and respectful of local traditions.
            </p>
          </div>

          {/* Feedback & Community */}
          <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary dark:text-emerald-400" />
              <span>Jammu & Kashmir, India</span>
            </div>
            <a 
              href="mailto:contact@jammukhoj.in"
              className="inline-flex items-center gap-1.5 text-primary dark:text-emerald-400 hover:underline font-medium"
            >
              <Mail className="w-3.5 h-3.5" />
              contact@jammukhoj.in
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface border-t border-border rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-white font-medium text-xs hover:bg-primary-dark transition-colors"
          >
            Close & Explore
          </button>
        </div>
      </div>
    </div>
  );
};
