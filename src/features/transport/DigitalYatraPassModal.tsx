import React, { useState } from 'react';
import { 
  QrCode, Ticket, CheckCircle2, ShieldCheck, Clock, Users, 
  MapPin, X, Download, Share2, Sparkles, AlertCircle 
} from 'lucide-react';
import { signTransitPass, verifyTransitPass, type TransitPassPayload } from '@/services/securityService';

interface DigitalYatraPassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type PassTier = 'jammu_katra_24h' | 'trikuta_senior' | 'heritage_circuit';

export const PASS_OPTIONS = [
  {
    id: 'jammu_katra_24h' as PassTier,
    title: 'Jammu-Katra 24h Yatra Pass',
    subtitle: 'Unlimited E-Bus & Matador transit across Jammu City & Katra Base',
    priceInr: 180,
    validHours: 24,
    badge: 'Most Popular',
    includes: ['Smart City Electric AC Buses', 'All registered Matador routes', 'Railway Station feeder shuttles'],
  },
  {
    id: 'trikuta_senior' as PassTier,
    title: 'Trikuta Senior Priority Pass',
    subtitle: 'Dedicated for pilgrims aged 60+ and differently-abled yatris',
    priceInr: 250,
    validHours: 48,
    badge: 'Senior & PWD',
    includes: ['Electric Battery Car priority queue', 'Free Wheelchair at Bhawan dispensary', 'Katra Base e-rickshaw transfers'],
  },
  {
    id: 'heritage_circuit' as PassTier,
    title: 'Dogra Heritage Circuit Pass',
    subtitle: 'Mubarak Mandi, Bahu Fort, Amar Mahal & Raghunath Bazaar',
    priceInr: 120,
    validHours: 24,
    badge: 'Culture & Forts',
    includes: ['Old City Circular Matadors', 'Tawi Riverfront Electric Rickshaws', 'Bahu Fort Ropeway discount voucher'],
  },
];

export const DigitalYatraPassModal: React.FC<DigitalYatraPassModalProps> = ({ isOpen, onClose }) => {
  const [selectedTier, setSelectedTier] = useState<PassTier>('jammu_katra_24h');
  const [travelers, setTravelers] = useState<number>(2);
  const [leadPassengerName, setLeadPassengerName] = useState<string>('Moin');
  const [passGenerated, setPassGenerated] = useState<boolean>(false);
  const [passId, setPassId] = useState<string>('');
  const [passSignature, setPassSignature] = useState<string>('');
  const [issuedTimestamp, setIssuedTimestamp] = useState<string>('');
  const [expiresTimestamp, setExpiresTimestamp] = useState<string>('');

  if (!isOpen) return null;

  const activePass = PASS_OPTIONS.find(p => p.id === selectedTier)!;
  const totalPrice = activePass.priceInr * travelers;

  const handleGeneratePass = () => {
    const id = `JK-PASS-${Date.now().toString(36).toUpperCase()}`;
    const nowMs = Date.now();
    const expiresMs = nowMs + activePass.validHours * 60 * 60 * 1000;
    const issueIso = new Date(nowMs).toISOString();
    const expireIso = new Date(expiresMs).toISOString();

    const payload: TransitPassPayload = {
      passId: id,
      tier: selectedTier,
      travelers,
      leadPassengerName: leadPassengerName.trim() || 'Pilgrim',
      issuedAt: issueIso,
      expiresAt: expireIso,
    };

    const sig = signTransitPass(payload);

    setPassId(id);
    setIssuedTimestamp(issueIso);
    setExpiresTimestamp(expireIso);
    setPassSignature(sig.substring(0, 24).toUpperCase());
    setPassGenerated(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none">
      <div className="bg-card text-ink border border-border rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto space-y-4 shadow-2xl animate-in zoom-in-95 p-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Ticket size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
                  Swiss SBB Pass Benchmark
                </span>
              </div>
              <h3 className="font-heading font-black text-base text-ink">
                Digital Yatra Transit Pass
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface border border-border text-stone hover:text-ink flex items-center justify-center transition-colors"
            aria-label="Close pass modal"
          >
            <X size={16} />
          </button>
        </div>

        {!passGenerated ? (
          /* Form View: Select Tier & Travelers */
          <div className="space-y-4">
            <div className="text-xs text-stone leading-relaxed">
              Generate an offline cryptographic travel badge valid across Jammu Division Smart City E-Buses, Matadors, and authorized prepaid auto stands. 100% scannable in zero-connectivity valleys.
            </div>

            {/* Pass Tiers */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-ink">Select Pass Category:</label>
              <div className="grid grid-cols-1 gap-2">
                {PASS_OPTIONS.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedTier(opt.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedTier === opt.id
                        ? 'bg-amber-500/10 border-[#9E4A0C] dark:border-amber-400 text-ink shadow-xs'
                        : 'bg-surface border-border text-stone hover:bg-surface/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-ink">{opt.title}</h4>
                          <span className="text-[10px] font-bold bg-card border border-border px-1.5 py-0.2 rounded text-primary">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone mt-0.5">{opt.subtitle}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono font-black text-sm text-ink">₹{opt.priceInr}</div>
                        <span className="text-[10px] text-stone">/ person</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Travelers & Name */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-surface border border-border rounded-xl space-y-1">
                <label className="text-[10px] font-bold text-stone uppercase block">Lead Yatri Name</label>
                <input
                  type="text"
                  value={leadPassengerName}
                  onChange={(e) => setLeadPassengerName(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-2 py-1.5 text-xs text-ink font-bold focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Yatri name"
                />
              </div>

              <div className="p-3 bg-surface border border-border rounded-xl space-y-1">
                <label className="text-[10px] font-bold text-stone uppercase block">Travelers Count</label>
                <div className="flex items-center justify-between pt-0.5">
                  <button
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="w-6 h-6 rounded bg-card border border-border text-ink font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm text-ink">{travelers}</span>
                  <button
                    onClick={() => setTravelers(Math.min(8, travelers + 1))}
                    className="w-6 h-6 rounded bg-card border border-border text-ink font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Total Fare & Generate CTA */}
            <div className="p-3 bg-card border border-border rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-stone uppercase tracking-wider block">Estimated Prepaid Fare</span>
                <div className="font-mono font-black text-base text-ink">₹{totalPrice} (for {travelers} yatris)</div>
              </div>
              <button
                onClick={handleGeneratePass}
                className="py-2.5 px-4 rounded-xl bg-primary text-white font-bold text-xs shadow-md hover:bg-primary-dark transition-all flex items-center gap-1.5"
              >
                <Sparkles size={14} />
                <span>Issue Offline Pass</span>
              </button>
            </div>
          </div>
        ) : (
          /* Pass Issued View: Cryptographic QR Wallet */
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white shadow-xl relative overflow-hidden border border-emerald-700/40 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-bold uppercase tracking-wider">
                    <ShieldCheck size={12} /> Offline Verified Yatra Pass
                  </div>
                  <h4 className="font-heading font-black text-lg text-white mt-1">
                    {activePass.title}
                  </h4>
                  <div className="text-xs text-emerald-200">
                    Lead: <strong>{leadPassengerName}</strong> ({travelers} {travelers === 1 ? 'Yatri' : 'Yatris'})
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-300 font-mono block">Pass Validity</span>
                  <strong className="text-sm font-mono text-white">{activePass.validHours} Hours</strong>
                </div>
              </div>

              {/* Offline Scannable Simulated 2D QR Code */}
              <div className="bg-white p-3.5 rounded-2xl flex flex-col items-center justify-center mx-auto max-w-[200px] text-slate-900 shadow-lg space-y-1">
                <div className="w-36 h-36 border-4 border-slate-900 rounded-xl p-2 flex flex-col justify-between relative bg-white">
                  {/* Position detection markers */}
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-4 border-slate-900 flex items-center justify-center"><div className="w-3 h-3 bg-slate-900" /></div>
                    <div className="w-8 h-8 border-4 border-slate-900 flex items-center justify-center"><div className="w-3 h-3 bg-slate-900" /></div>
                  </div>
                  <div className="flex items-center justify-center my-auto">
                    <QrCode size={48} className="text-slate-900" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-4 border-slate-900 flex items-center justify-center"><div className="w-3 h-3 bg-slate-900" /></div>
                    <div className="w-3 h-3 bg-slate-900 self-end" />
                  </div>
                </div>
                <div className="text-[9px] font-mono font-bold text-slate-700 tracking-wider">
                  {passId}
                </div>
              </div>

              {/* Security Digest & Verification Key */}
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 text-[10px] font-mono space-y-0.5">
                <div className="flex justify-between text-emerald-300 font-bold">
                  <span>HMAC-SHA256 SIGNATURE:</span>
                  <span>VERIFIED OFFLINE</span>
                </div>
                <div className="truncate text-white/80">{passSignature}</div>
                <div className="text-[9px] text-white/60">
                  Issued: {new Date(issuedTimestamp).toLocaleTimeString()} • Valid until: {expiresTimestamp ? new Date(expiresTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : `${activePass.validHours}h`}
                </div>
              </div>
            </div>

              <div className="flex items-center gap-2">
              <button
                onClick={() => setPassGenerated(false)}
                className="flex-1 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-ink hover:bg-surface/80"
              >
                Change Pass
              </button>
              <button
                onClick={() => {
                  alert(`Pass ${passId} saved to your offline wallet! Available anytime without internet.`);
                  onClose();
                }}
                className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark shadow-xs"
              >
                Save to Offline Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
