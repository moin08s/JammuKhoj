import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PhoneCall,
  Copy,
  Check,
  ShieldAlert,
  Building2,
  Compass,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { db } from '@/data/db';
import type { EmergencyContact, HelpPoint, SafetyGuidance } from '@/data/types';
import { SEED_EMERGENCY_CONTACTS, SEED_HELP_POINTS, SEED_SAFETY_GUIDANCE } from '@/data/seedData';
import { DisclaimerNote } from '@/ui/DisclaimerNote';
import { SourceBadge } from '@/ui/trust/SourceBadge';
import { CommandControlDashboard } from './CommandControlDashboard';

export const SafetyPage: React.FC = () => {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<EmergencyContact[]>(SEED_EMERGENCY_CONTACTS);
  const [helpPoints, setHelpPoints] = useState<HelpPoint[]>(SEED_HELP_POINTS);
  const [guidance, setGuidance] = useState<SafetyGuidance[]>(SEED_SAFETY_GUIDANCE);
  const [copied, setCopied] = useState(false);
  const [locationText, setLocationText] = useState<string>('');
  const [expandedGuidance, setExpandedGuidance] = useState<string | null>(null);

  useEffect(() => {
    db.emergencyContacts.toArray().then((data) => {
      if (data && data.length > 0) setContacts(data);
    });
    db.helpPoints.toArray().then((data) => {
      if (data && data.length > 0) setHelpPoints(data);
    });
    db.safetyGuidance.toArray().then((data) => {
      if (data && data.length > 0) setGuidance(data);
    });
  }, []);

  const handleCopyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const text = `Emergency GPS Coordinates: Latitude ${pos.coords.latitude.toFixed(6)}, Longitude ${pos.coords.longitude.toFixed(6)} (accuracy: ±${Math.round(pos.coords.accuracy)}m) in Jammu city area.`;
          navigator.clipboard.writeText(text);
          setLocationText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 3500);
        },
        () => {
          const fallback = `Emergency Location: In transit in Jammu city area. Please ask immediate bystanders for local street landmark.`;
          navigator.clipboard.writeText(fallback);
          setLocationText(fallback);
          setCopied(true);
          setTimeout(() => setCopied(false), 3500);
        },
        { timeout: 5000 }
      );
    }
  };

  const [isSharingSos, setIsSharingSos] = useState(false);

  const handleWhatsAppSos = () => {
    setIsSharingSos(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(6);
          const lon = pos.coords.longitude.toFixed(6);
          const msg = `🚨 *EMERGENCY SOS - IMMEDIATE ASSISTANCE NEEDED*\n\nI am in transit in Jammu & Kashmir and need urgent help.\n\n📍 *My GPS Location:* https://maps.google.com/?q=${lat},${lon}\n*Coordinates:* ${lat}, ${lon} (±${Math.round(pos.coords.accuracy)}m)\n\n*Emergency Dialers:*\n• National Emergency: 112\n• Shrine Board Helpline: 01991-232075\n• Ambulance: 108\n\nSent via JammuKhoj Safety Companion`;
          setIsSharingSos(false);
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
        },
        () => {
          const fallbackMsg = `🚨 *EMERGENCY SOS - IMMEDIATE ASSISTANCE NEEDED*\n\nI am in transit in Jammu & Kashmir and need urgent help.\nI am unable to resolve exact GPS coordinates. Please contact local emergency services (112) or call my phone immediately.\n\nSent via JammuKhoj Safety Companion`;
          setIsSharingSos(false);
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fallbackMsg)}`, '_blank', 'noopener,noreferrer');
        },
        { timeout: 6000 }
      );
    } else {
      setIsSharingSos(false);
      const fallbackMsg = `🚨 *EMERGENCY SOS - IMMEDIATE ASSISTANCE NEEDED*\n\nI am in transit in Jammu & Kashmir and need urgent help.\nPlease contact 112 or local emergency services immediately.\n\nSent via JammuKhoj Safety Companion`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fallbackMsg)}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="space-y-1">
        <h2 className="font-heading text-xl font-bold text-ink">
          {t('safety.title')}
        </h2>
        <p className="text-xs text-stone">
          Verified emergency response contacts, 1-Tap SOS dispatch, and medical aid directory accessible offline at all times.
        </p>
      </div>

      {/* Civic Command & Control Hub: Live Crowd Footfall & Disaster Management */}
      <CommandControlDashboard />

      <DisclaimerNote kind="emergency" />

      {/* Primary Emergency 112 Action Box */}
      <section className="bg-danger/10 border-2 border-danger/30 rounded-card p-4 text-center space-y-3 shadow-sm">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-danger text-white shadow-md">
          <PhoneCall size={24} className="animate-pulse" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-bold text-danger">
            {t('safety.emergency_call')}
          </h3>
          <p className="text-xs text-stone mt-0.5">
            Single nationwide emergency number for Police, Medical & Fire rescue
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <a
            href="tel:112"
            className="w-full py-3.5 px-4 rounded-xl bg-danger text-white font-bold text-sm shadow-md hover:bg-danger/95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            aria-label="Call national emergency 112"
          >
            <PhoneCall size={18} />
            <span>Call 112 (Toll Free)</span>
          </a>

          <button
            onClick={handleWhatsAppSos}
            disabled={isSharingSos}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md hover:bg-emerald-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <span>{isSharingSos ? 'Locating...' : '🚨 1-Tap WhatsApp SOS'}</span>
          </button>
        </div>
      </section>

      {/* Copy My Exact GPS Location */}
      <section className="bg-card border border-border rounded-card p-3.5 space-y-2 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <h4 className="font-heading text-sm font-bold text-ink flex items-center gap-1.5">
              <Compass size={16} className="text-primary" />
              <span>{t('safety.copy_location')}</span>
            </h4>
            <p className="text-xs text-stone">
              Generate formatted GPS text to read out or SMS to an emergency dispatcher without data.
            </p>
          </div>
        </div>

        <button
          onClick={handleCopyLocation}
          className={`w-full py-2.5 px-3 rounded-control border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            copied
              ? 'bg-success text-white border-success'
              : 'bg-surface text-ink border-border hover:border-primary/40'
          }`}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          <span>{copied ? t('safety.location_copied') : 'Copy Coordinates to Clipboard'}</span>
        </button>

        {locationText && (
          <div className="p-2 rounded bg-surface border border-border text-[11px] font-mono text-stone break-all">
            {locationText}
          </div>
        )}
      </section>

      {/* Specialized Helpline List */}
      <section className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone">
          Direct Jammu Assistance Helplines
        </h3>
        <div className="space-y-2">
          {contacts
            .filter((c) => c.number !== '112')
            .map((contact) => (
              <div
                key={contact.id}
                className="p-3 bg-card border border-border rounded-card flex items-center justify-between gap-3 shadow-sm hover:border-primary/30 transition-all"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-xs text-ink">{contact.name.en}</span>
                    <SourceBadge type={contact.source.type} />
                  </div>
                  <p className="text-[11px] text-stone truncate">{contact.notes}</p>
                  <div className="text-xs font-bold text-primary tabular-nums">
                    {contact.number}
                  </div>
                </div>

                <a
                  href={`tel:${contact.number}`}
                  className="shrink-0 p-2.5 rounded-full bg-primary-soft text-primary hover:bg-primary hover:text-white transition-colors"
                  aria-label={`Call ${contact.name.en}`}
                >
                  <PhoneCall size={18} />
                </a>
              </div>
            ))}
        </div>
      </section>

      {/* Nearby Medical & Police Help Points */}
      <section className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone">
          {t('safety.nearby_help')}
        </h3>
        <div className="space-y-2">
          {helpPoints.map((hp) => (
            <div
              key={hp.id}
              className="p-3 bg-card border border-border rounded-card space-y-1.5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-ink">{hp.name.en}</span>
                    {hp.hours24x7 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-success/15 text-success rounded">
                        24x7 Open
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone mt-0.5">{hp.address}</p>
                </div>
              </div>

              {hp.phone && (
                <div className="pt-1 flex justify-end">
                  <a
                    href={`tel:${hp.phone}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    <PhoneCall size={13} />
                    <span>Call Desk ({hp.phone})</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Safety Guidance Cards */}
      <section className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone">
          {t('safety.what_to_do')}
        </h3>
        <div className="space-y-2">
          {guidance.map((guide) => {
            const isExpanded = expandedGuidance === guide.id;
            const scenarioTitles: Record<string, string> = {
              road_incident: 'Road Incident or Vehicle Breakdown',
              medical_emergency: 'Sudden Illness or Severe Heat Exhaustion',
              running_late_transit: 'Delayed Schedule & Train Miss Prevention',
            };

            return (
              <div
                key={guide.id}
                className="bg-card border border-border rounded-card overflow-hidden shadow-sm"
              >
                <div
                  onClick={() => setExpandedGuidance(isExpanded ? null : guide.id)}
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-surface/50 select-none"
                >
                  <span className="text-xs font-bold text-ink">
                    {scenarioTitles[guide.scenario] || guide.scenario}
                  </span>
                  {isExpanded ? <ChevronUp size={16} className="text-stone" /> : <ChevronDown size={16} className="text-stone" />}
                </div>

                {isExpanded && (
                  <div className="p-3 pt-0 border-t border-border/70 bg-surface/30 space-y-2 animate-in fade-in">
                    <ol className="list-decimal pl-4 space-y-1 text-xs text-stone pt-2">
                      {guide.steps.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
