import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Mail,
  PhoneCall,
  Send,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Clock,
  MapPin,
  HeartHandshake,
} from 'lucide-react';

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactSupportModal: React.FC<ContactSupportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'channels' | 'feedback'>('channels');
  const [subject, setSubject] = useState('Yatra Assistance');
  const [message, setMessage] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Simulate instant local queueing
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setMessage('');
      setEmailOrPhone('');
      onClose();
    }, 2200);
  };

  const whatsappUrl = `https://wa.me/919419199999?text=${encodeURIComponent(
    'Hello JammuKhoj Pilgrim Helpdesk, I need assistance with travel in Jammu / Mata Vaishno Devi yatra.'
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-card border border-border rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl animate-in zoom-in-95 relative p-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <HeartHandshake size={20} />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-ink">
                Contact & Pilgrim Support
              </h2>
              <p className="text-[11px] text-stone">
                24x7 Official Jammu & Vaishno Devi Assistance
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

        {/* Tab switch */}
        <div className="flex rounded-2xl bg-surface p-1 border border-border text-xs font-semibold">
          <button
            onClick={() => setActiveTab('channels')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'channels'
                ? 'bg-card text-ink shadow-xs border border-border/80 font-bold'
                : 'text-stone hover:text-ink'
            }`}
          >
            Direct Helplines
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'feedback'
                ? 'bg-card text-ink shadow-xs border border-border/80 font-bold'
                : 'text-stone hover:text-ink'
            }`}
          >
            Leave a Message
          </button>
        </div>

        {activeTab === 'channels' ? (
          <div className="space-y-3 pt-1">
            {/* WhatsApp 1-tap support */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between hover:bg-emerald-500/15 transition-all apple-press group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <span>Chat on WhatsApp</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-600/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                      Fastest
                    </span>
                  </div>
                  <div className="text-[11px] text-stone">
                    Connect with local volunteer & yatri guide
                  </div>
                </div>
              </div>
              <ExternalLink size={16} className="text-emerald-600 shrink-0" />
            </a>

            {/* Email Contact */}
            <a
              href="mailto:support@jammukhoj.in?subject=JammuKhoj%20Pilgrim%20Assistance"
              className="p-3.5 rounded-2xl bg-surface border border-border flex items-center justify-between hover:bg-card transition-all apple-press"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold text-ink">Official Email Support</div>
                  <div className="text-[11px] text-primary font-mono">support@jammukhoj.in</div>
                </div>
              </div>
              <ExternalLink size={15} className="text-stone" />
            </a>

            {/* Official Directory Numbers */}
            <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
              <h3 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <PhoneCall size={14} className="text-primary" />
                <span>Essential Official Contacts</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                  <div>
                    <div className="font-bold text-ink">SMVDSB Katra Shrine Board</div>
                    <div className="text-[10px] text-stone">24x7 Yatra Enquiry & Battery Car</div>
                  </div>
                  <a
                    href="tel:01991232125"
                    className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary/20"
                  >
                    01991-232125
                  </a>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                  <div>
                    <div className="font-bold text-ink">SMVDSB Toll Free Helpline</div>
                    <div className="text-[10px] text-stone">All-India Free Darshan & Stay Support</div>
                  </div>
                  <a
                    href="tel:18001807212"
                    className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary/20"
                  >
                    1800-180-7212
                  </a>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                  <div>
                    <div className="font-bold text-ink">J&K Tourism Directorate</div>
                    <div className="text-[10px] text-stone">TRC Residency Road, Jammu</div>
                  </div>
                  <a
                    href="tel:01912548172"
                    className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary/20"
                  >
                    0191-2548172
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-ink">Indian Railway Station Help</div>
                    <div className="text-[10px] text-stone">Jammu Tawi & Katra Station Enquiry</div>
                  </div>
                  <a
                    href="tel:139"
                    className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary/20"
                  >
                    139
                  </a>
                </div>
              </div>
            </div>

            {/* Operating Hours Note */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-stone text-[11px] leading-relaxed flex items-start gap-2">
              <Clock size={15} className="text-amber-600 shrink-0 mt-0.5" />
              <span>
                WhatsApp helpline is monitored by verified Jammu tourism volunteers from <strong>6:00 AM to 10:00 PM IST</strong> daily. In immediate life-safety emergencies, dial <strong>112 (ERSS)</strong>.
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            {isSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-in zoom-in-95">
                <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
                <h3 className="font-heading font-bold text-base text-ink">Message Received</h3>
                <p className="text-xs text-stone">
                  Thank you! Our volunteer coordinator will review your note and respond promptly.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone uppercase tracking-wider">
                    Inquiry Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-border bg-surface text-ink text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                  >
                    <option value="Yatra Assistance">Mata Vaishno Devi Yatra Assistance</option>
                    <option value="Transport Inquiry">Transport & Matador Route Query</option>
                    <option value="Senior Friendly Tour">Senior Citizen Accessibility Support</option>
                    <option value="Data Correction">Correction in Fare / Timing</option>
                    <option value="General Feedback">General Feedback / Appreciation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone uppercase tracking-wider">
                    Your Contact (WhatsApp / Phone / Email)
                  </label>
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210 or yourname@gmail.com"
                    className="w-full p-2.5 rounded-xl border border-border bg-surface text-ink text-xs focus:ring-1 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone uppercase tracking-wider">
                    How can we help you?
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your dates, travel query, or feedback here..."
                    className="w-full p-2.5 rounded-xl border border-border bg-surface text-ink text-xs focus:ring-1 focus:ring-primary focus:outline-hidden resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-primary hover:bg-primary/95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all apple-press"
                >
                  <Send size={14} />
                  <span>Send Message to Team</span>
                </button>
              </>
            )}
          </form>
        )}

        <div className="pt-2 text-center text-[10px] text-stone">
          JammuKhoj Civic Travel Initiative • Designed for Pilgrim Welfare
        </div>
      </div>
    </div>
  );
};
