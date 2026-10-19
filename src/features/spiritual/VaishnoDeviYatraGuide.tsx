import React, { useState } from 'react';
import { 
  X, Compass, MapPin, Clock, ShieldCheck, Heart, AlertCircle, 
  ChevronRight, ArrowRight, CheckCircle2, Phone, Sparkles, 
  Info, ExternalLink, Ticket, Footprints, Wind, Luggage
} from 'lucide-react';
import { JAMMU_SPOT_IMAGES } from '../../data/spotImages';

interface YatraStep {
  stage: string;
  distance: string;
  altitude: string;
  approxTimeWalking: string;
  highlights: string;
  amenities: string[];
  elderTip: string;
}

const YATRA_STAGES: YatraStep[] = [
  {
    stage: '1. Katra Town to Banganga Checkpost',
    distance: '1.5 km from Katra Market',
    altitude: '2,800 ft',
    approxTimeWalking: '25-35 mins (or ₹50 auto to Darshani Deodi)',
    highlights: 'Darshani Deodi entrance, RFID card scanning, preliminary security check.',
    amenities: ['RFID Checkpoint', 'Free Cloakrooms', 'Auto Stand', 'Walking Stick Vendors'],
    elderTip: 'Take an e-rickshaw or auto directly to Darshani Deodi to save walking through town traffic.'
  },
  {
    stage: '2. Banganga to Charan Paduka',
    distance: '2.7 km from Katra',
    altitude: '3,380 ft',
    approxTimeWalking: '45-60 mins',
    highlights: 'Sacred river Banganga where Mata quenched Langur-veer’s thirst. Charan Paduka temple holds the imprint of Goddess feet.',
    amenities: ['Drinking Water Posts', 'Medical Aid Center', 'Covered Track', 'Washrooms'],
    elderTip: 'Gradual incline. Palki (sedan chair) and pony stands are readily available here with official fixed rate boards.'
  },
  {
    stage: '3. Charan Paduka to Ardhkuwari (Garbhjoon)',
    distance: '6.0 km from Katra (Halfway Point)',
    altitude: '4,800 ft',
    approxTimeWalking: '2 - 2.5 hours',
    highlights: 'Historic cave Garbhjoon where Mata meditated for 9 months. Major rest and dining hub.',
    amenities: ['SMVDSB Bhojanalaya', '24x7 Medical Dispensary', 'Battery Car Counter', 'Dharamshalas'],
    elderTip: 'Take a break of at least 30 mins here. Senior citizens with battery car tickets board the vehicle from this junction to Bhawan.'
  },
  {
    stage: '4. Ardhkuwari to Bhawan via Himkoti (Battery Car Track)',
    distance: '5.5 km (Total 12 km)',
    altitude: '5,200 ft',
    approxTimeWalking: '2 hours walking / 25 mins by Battery Car',
    highlights: 'Smooth, gentle gradient track with zero ponies or mules. Spectacular panoramic valley views and clean air.',
    amenities: ['Battery Car Route', 'Oxygen Dispensary', 'Eco Cafeteria', 'Emergency Ambulance'],
    elderTip: 'Book Battery Car tickets online in advance at maavaishnodevi.org, or arrive early at Ardhkuwari counter with senior citizen ID.'
  },
  {
    stage: '5. Holy Bhawan (Sanctum Sanctorum)',
    distance: '12 km from Katra',
    altitude: '5,200 ft',
    approxTimeWalking: 'Darshan queue varies (1 - 3 hours)',
    highlights: 'Natural rock formation depicting Maha Kali, Maha Lakshmi, and Maha Saraswati (Pindies).',
    amenities: ['Free Blanket Store', 'Locker & Cloakrooms', 'Prasad Counters', 'VIP Senior Queue'],
    elderTip: 'Deposit all leather items, belts, and mobile phones in the free Shrine Board lockers before entering the queue.'
  },
  {
    stage: '6. Bhawan to Bhairon Ghati (Cable Car / Ropeway)',
    distance: '1.5 km above Bhawan',
    altitude: '6,600 ft',
    approxTimeWalking: '5 mins by Passenger Ropeway (₹100 return)',
    highlights: 'Mandatory completion of pilgrimage at Bhairon Nath Temple. Aerial view of Trikuta hills.',
    amenities: ['Modern Cable Car', 'Panoramic Viewing Deck', 'Medical Center'],
    elderTip: 'Do NOT attempt to walk the steep 1.5 km climb to Bhairon Ghati on foot. The ₹100 ropeway is effortless and takes only 5 minutes.'
  }
];

export const VaishnoDeviYatraGuide: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'route' | 'essentials' | 'seniors' | 'fares'>('route');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vaishno-devi-guide-title"
      >
        {/* Banner with Authentic Imagery */}
        <div className="relative h-48 bg-slate-900 text-white overflow-hidden rounded-t-3xl shrink-0">
          <img 
            src={JAMMU_SPOT_IMAGES.attr_vaishno_devi} 
            alt="Shri Mata Vaishno Devi Shrine"
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/icons/icon-emblem.svg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
          
          <button
            onClick={onClose}
            aria-label="Close guide"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 active:scale-95 text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-5 right-5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/90 text-slate-950 font-semibold text-[11px] mb-1.5 shadow-xs">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              Complete 2026 Pilgrim Manual
            </span>
            <h2 id="vaishno-devi-guide-title" className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              Shri Mata Vaishno Devi Yatra Guide
            </h2>
            <p className="text-xs text-white/80">Katra Base ➔ Bhawan ➔ Bhairon Ghati (12 km Sacred Trek)</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 py-2 gap-1.5 overflow-x-auto text-xs font-medium sticky top-0 z-10 backdrop-blur-xs">
          <button
            onClick={() => setActiveTab('route')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'route' 
                ? 'bg-primary text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            Step-by-Step Route
          </button>
          <button
            onClick={() => setActiveTab('seniors')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'seniors' 
                ? 'bg-primary text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Senior & Elder Advice
          </button>
          <button
            onClick={() => setActiveTab('essentials')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'essentials' 
                ? 'bg-primary text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            RFID & Rules
          </button>
          <button
            onClick={() => setActiveTab('fares')}
            className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === 'fares' 
                ? 'bg-primary text-white shadow-xs' 
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            Helpline & Fares
          </button>
        </div>

        {/* Content Tabs */}
        <div className="p-5 space-y-4 text-slate-700 text-sm">
          {/* TAB 1: ROUTE */}
          {activeTab === 'route' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-start gap-2.5 text-xs text-amber-950">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Recommended Departure:</strong> 4:30 AM (for cool weather and minimal midday fatigue) or 4:00 PM (for night trek with lighted path).
                </div>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {YATRA_STAGES.map((stage, idx) => (
                  <div key={idx} className="relative group">
                    {/* Step marker */}
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                      {idx + 1}
                    </div>

                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:border-primary/40 transition-all">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <h4 className="font-serif font-bold text-ink text-sm">{stage.stage}</h4>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                          {stage.altitude}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-primary font-medium mb-2">
                        <span>{stage.distance}</span>
                        <span>•</span>
                        <span>{stage.approxTimeWalking}</span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {stage.highlights}
                      </p>

                      <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/50 text-[11px] text-amber-900 mb-2.5 flex items-start gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div><strong>Elder & Ease Tip:</strong> {stage.elderTip}</div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {stage.amenities.map((amenity, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SENIORS */}
          {activeTab === 'seniors' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Heart className="w-4 h-4 text-emerald-600" />
                  Senior Citizen Priority Facilities (Shrine Board)
                </div>
                <p className="text-xs leading-relaxed text-emerald-950/80">
                  The Shri Mata Vaishno Devi Shrine Board (SMVDSB) provides dedicated facilities to make the sacred pilgrimage accessible for elderly yatris, pregnant women, and differently-abled devotees.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
                  <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    1. Battery Car Service (Ardhkuwari ➔ Bhawan)
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Operates on the gentle gradient Himkoti track. Priority is given to senior citizens (60+ years) and persons with medical certificates.
                  </p>
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                    • <strong>Fare:</strong> ₹354 per person (Ardhkuwari to Bhawan) / ₹236 (Bhawan to Ardhkuwari).<br />
                    • <strong>Booking:</strong> Online at maavaishnodevi.org or offline at Ardhkuwari Battery Car counter.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
                  <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    2. Bhairon Ghati Passenger Ropeway (Cable Car)
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Instead of a punishing 1.5 km steep climb, the Swiss-engineered ropeway transports pilgrims from Bhawan to Bhairon Temple in just 5 minutes.
                  </p>
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                    • <strong>Fare:</strong> ₹100 per person (Return ticket included).<br />
                    • <strong>Ticket Counter:</strong> Located right above the Bhawan entrance. Highly recommended for all seniors.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
                  <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    3. Palki (Sedan Chair) & Wheelchair Support
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Four-bearer sedan chairs (Palkis) are managed under strict rate regulation by SMVDSB. Free wheelchairs are available at Bhawan and Ardhkuwari dispensaries for emergency mobility.
                  </p>
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                    • <strong>Official Rates:</strong> Check the official board at Banganga before hiring; ensure porter possesses a verified SMVDSB RFID card.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ESSENTIALS */}
          {activeTab === 'essentials' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Ticket className="w-4 h-4 text-blue-600" />
                  Mandatory RFID Yatra Card
                </div>
                <p className="text-xs leading-relaxed text-blue-950/80">
                  No pilgrim is allowed past Banganga or Tarakote checkposts without an active RFID Yatra Card. The card is <strong>100% FREE</strong> and ensures security tracking and emergency medical assistance.
                </p>
                <div className="text-[11px] bg-white/80 p-2.5 rounded-xl border border-blue-200">
                  <strong>Where to collect:</strong> Katra Railway Station (Counters 1-4), Katra Inter-State Bus Stand, or Tarakote Marg Registration Center. Bring any Government Photo ID (Aadhaar, Voter ID, Passport).
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-ink flex items-center gap-1.5">
                  <Luggage className="w-4 h-4 text-primary" />
                  What to Carry Checklist
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Valid Original Photo ID (Aadhaar)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Comfortable walking shoes with rubber grip</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Light woollen shawl / jacket (chilly nights)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Prescribed medications & knee brace</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-rose-800">
                  <AlertCircle className="w-4 h-4" />
                  Items strictly prohibited inside Bhawan
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Mobile phones, cameras, leather purses, leather belts, and cigarettes/tobacco must be deposited in the <strong>Free SMVDSB Cloakrooms</strong> prior to entering the Pindies cave queue.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: FARES & HELPLINE */}
          {activeTab === 'fares' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-ink">Emergency Helplines (Katra & Shrine Board)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <a 
                    href="tel:01991232075"
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-primary transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">SMVDSB Central Helpline</div>
                      <div className="text-[11px] text-slate-500">24x7 Yatra Assistance</div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                  </a>

                  <a 
                    href="tel:01991232010"
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-primary transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">Police Station Katra</div>
                      <div className="text-[11px] text-slate-500">Law Enforcement & Safety</div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                  </a>

                  <a 
                    href="tel:01991285634"
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-primary transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">Narayana Superspeciality</div>
                      <div className="text-[11px] text-slate-500">Kakryal Trauma Center</div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                  </a>

                  <a 
                    href="tel:112"
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-primary transition-all flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-800">National Emergency</div>
                      <div className="text-[11px] text-slate-500">Toll-Free All Services</div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-slate-800">Official Portal:</div>
                <p className="text-slate-600">
                  Book official Shrine Board rooms, battery cars, helicopter services, and special poojas at the authorized portal:
                </p>
                <a 
                  href="https://online.maavaishnodevi.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
                >
                  online.maavaishnodevi.org <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Information verified with SMVDSB • Oct 2026
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-white font-medium text-xs hover:bg-primary-dark transition-colors shadow-xs"
          >
            Jai Mata Di • Back to Guide
          </button>
        </div>
      </div>
    </div>
  );
};
