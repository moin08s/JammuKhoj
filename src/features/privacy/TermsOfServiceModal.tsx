import React from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Compass,
  Bus,
  CheckCircle2,
} from 'lucide-react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-card border border-border rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl animate-in zoom-in-95 relative p-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Scale size={20} />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-ink">
                Terms of Use & Legal Advisory
              </h2>
              <p className="text-[11px] text-stone">
                Last Updated: October 19, 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface border border-border text-stone hover:text-ink flex items-center justify-center transition-colors apple-press"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Section 1: Introduction */}
        <div className="space-y-2 text-xs leading-relaxed text-stone">
          <div className="font-bold text-ink flex items-center gap-1.5 text-sm">
            <Compass size={15} className="text-primary" />
            <span>1. Platform Purpose & Scope</span>
          </div>
          <p>
            <strong>JammuKhoj</strong> (available at <em>https://jammukhoj.in</em>) is an independent, community-driven civic tourism and pilgrimage companion for the Jammu Division and Shri Mata Vaishno Devi Yatra. By accessing or using this application, you agree to these Terms.
          </p>
        </div>

        {/* Section 2: Mountain & Pilgrimage Trek Safety Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2 text-xs">
          <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 text-sm">
            <AlertTriangle size={16} className="text-amber-600" />
            <span>2. Pilgrimage Trek & Health Advisory</span>
          </div>
          <p className="text-stone leading-relaxed text-[11px]">
            The Holy Yatra to Mata Vaishno Devi Bhawan involves an uphill trek of ~12 to 14 km reaching an altitude of 5,200 ft. Shiv Khori, Machail Mata, and Patnitop are mountainous terrains subject to sudden weather shifts.
          </p>
          <ul className="space-y-1 text-[11px] text-stone list-disc pl-4">
            <li>Users with cardiovascular conditions, asthma, or advanced pregnancy must consult their medical provider before trekking on foot.</li>
            <li>Senior citizens are strongly encouraged to utilize battery cars (Ardhkuwari ➔ Bhawan) or ponies and palanquins.</li>
            <li>JammuKhoj is an informational tool and does not assume liability for physical strain, weather disruptions, or personal accidents.</li>
          </ul>
        </div>

        {/* Section 3: Transport & Tariff Reference Benchmark */}
        <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-2 text-xs">
          <div className="font-bold text-ink flex items-center gap-1.5 text-sm">
            <Bus size={15} className="text-primary" />
            <span>3. Public Transport & Tariff Disclaimer</span>
          </div>
          <p className="text-stone leading-relaxed text-[11px]">
            Matador mini-bus stages, auto-rickshaw fares, and prepaid taxi estimates presented on JammuKhoj are surveyed reference benchmarks intended to assist commuters against overcharging.
          </p>
          <p className="text-stone leading-relaxed text-[11px]">
            JammuKhoj is <strong>not a commercial booking broker or taxi operator</strong>. Official tariffs are regulated by the Transport Commissioner of Jammu & Kashmir and respective local unions.
          </p>
        </div>

        {/* Section 4: 100% Client-Side Privacy Guarantee */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2 text-xs">
          <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 text-sm">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>4. Privacy & Zero Tracking Guarantee</span>
          </div>
          <p className="text-stone leading-relaxed text-[11px]">
            JammuKhoj does not collect, sell, or monetize user data. All itineraries, bookmarked spots, custom notes, and offline map layers remain strictly on your personal device using IndexedDB (Dexie).
          </p>
        </div>

        {/* Section 5: Intellectual Property & Open Data */}
        <div className="space-y-2 text-xs text-stone leading-relaxed">
          <div className="font-bold text-ink flex items-center gap-1.5 text-sm">
            <FileText size={15} className="text-primary" />
            <span>5. Attribution & Fair Use</span>
          </div>
          <p className="text-[11px]">
            Geographic coordinates and baseline road networks are sourced under the OpenStreetMap (ODbL) license. Administrative guidelines are derived from published circulars of the Shri Mata Vaishno Devi Shrine Board (SMVDSB) and Directorate of Tourism, Jammu.
          </p>
        </div>

        {/* Close button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-primary hover:bg-primary/95 text-white font-bold text-xs shadow-md transition-all apple-press"
          >
            I Understand and Agree
          </button>
        </div>
      </div>
    </div>
  );
};
