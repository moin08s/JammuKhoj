import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  ShieldCheck,
  Tag,
  Phone,
  MapPin,
  TrendingUp,
  Eye,
  Navigation,
  CheckCircle2,
  Plus,
  Trash2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

export const BusinessPortal: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateBusinessProfile } = useAppStore();

  const [newOffer, setNewOffer] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  if (!currentUser || currentUser.role !== 'business' || !currentUser.businessDetails) {
    return (
      <div className="py-12 text-center space-y-4 animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <Store size={32} />
        </div>
        <h3 className="font-heading text-lg font-bold">Jammu Local Business Portal</h3>
        <p className="text-xs text-stone max-w-xs mx-auto">
          Please sign in with your local business partner email to manage your enterprise listing and promotions.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 rounded-control bg-primary text-white text-xs font-bold shadow hover:bg-primary/95 transition-all"
        >
          Sign In as Business Partner
        </button>
      </div>
    );
  }

  const profile = currentUser.businessDetails;

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.trim()) return;

    const currentOffers = profile.specialOffers || [];
    updateBusinessProfile({
      specialOffers: [...currentOffers, newOffer.trim()],
    });
    setNewOffer('');
    setSuccessNotice('Special visitor promotion published to Jammu tourist directories!');
    setTimeout(() => setSuccessNotice(''), 3000);
  };

  const handleRemoveOffer = (index: number) => {
    const currentOffers = profile.specialOffers || [];
    updateBusinessProfile({
      specialOffers: currentOffers.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4 py-2 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-card border border-border rounded-card p-4 shadow-sm space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-success/15 text-success border border-success/30">
              <ShieldCheck size={13} /> Verified Local Business
            </span>
            <h2 className="font-heading text-xl font-bold text-ink mt-1">
              {profile.businessName}
            </h2>
            <div className="text-xs text-stone capitalize">
              {profile.category} · Serving Jammu Division
            </div>
          </div>

          <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
            <Store size={26} />
          </div>
        </div>

        <div className="p-3 bg-surface border border-border rounded-control space-y-1 text-xs text-stone">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-primary shrink-0" />
            <span className="truncate">{profile.address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone size={13} className="text-primary shrink-0" />
            <span>{profile.contactPhone}</span>
          </div>
        </div>
      </div>

      {successNotice && (
        <div className="bg-success/15 text-success text-xs font-semibold px-3 py-2 rounded-card text-center animate-in fade-in">
          {successNotice}
        </div>
      )}

      {/* Analytics Snapshot */}
      <section className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone">
          Jammu Visitor Reach (Last 30 Days)
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-card border border-border rounded-card p-3 text-center shadow-sm">
            <div className="text-primary flex justify-center mb-1"><Eye size={16} /></div>
            <div className="font-heading text-lg font-bold text-ink">1,420</div>
            <div className="text-[10px] text-stone">POI Views</div>
          </div>

          <div className="bg-card border border-border rounded-card p-3 text-center shadow-sm">
            <div className="text-accent flex justify-center mb-1"><Navigation size={16} /></div>
            <div className="font-heading text-lg font-bold text-ink">384</div>
            <div className="text-[10px] text-stone">Route Directions</div>
          </div>

          <div className="bg-card border border-border rounded-card p-3 text-center shadow-sm">
            <div className="text-success flex justify-center mb-1"><Phone size={16} /></div>
            <div className="font-heading text-lg font-bold text-ink">92</div>
            <div className="text-[10px] text-stone">Call Inquiries</div>
          </div>
        </div>
      </section>

      {/* Special Offers & Pilgrim Amenities */}
      <section className="bg-card border border-border rounded-card p-4 space-y-3 shadow-sm text-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-ink flex items-center gap-1.5">
            <Tag size={15} className="text-primary" />
            <span>Active Pilgrim & Visitor Offers</span>
          </h3>
          <span className="text-[10px] text-stone">Shown on your POI Card</span>
        </div>

        <div className="space-y-2">
          {(profile.specialOffers || []).map((offer, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-control bg-surface border border-border flex items-center justify-between gap-2 text-ink"
            >
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 size={14} className="text-success shrink-0" />
                <span className="truncate">{offer}</span>
              </div>
              <button
                onClick={() => handleRemoveOffer(idx)}
                className="text-stone hover:text-danger p-1"
                title="Remove offer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddOffer} className="flex gap-2 pt-1">
          <input
            type="text"
            value={newOffer}
            onChange={(e) => setNewOffer(e.target.value)}
            placeholder="e.g. Free luggage cloakroom with purchase above ₹200..."
            className="flex-1 px-3 py-2 rounded-control border border-border bg-surface text-ink text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-control bg-primary text-white font-bold text-xs hover:bg-primary/95 flex items-center gap-1 shrink-0"
          >
            <Plus size={14} />
            <span>Add</span>
          </button>
        </form>

        {/* Quick GI Tag Promotion Presets */}
        <div className="pt-1 space-y-1">
          <div className="text-[10px] text-stone font-semibold uppercase tracking-wider">
            Quick GI Tag Offer Presets:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              '🏷️ 10% Pilgrim Discount on Certified GI Saffron',
              '🏷️ Authentic GI Bhaderwah Rajmash (Vacuum Packed)',
              '🏷️ Genuine Basohli Pashmina with J&K Govt Hologram',
              '🏷️ Raw Organic Ramban Sulai Honey in stock',
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const currentOffers = profile.specialOffers || [];
                  if (!currentOffers.includes(preset)) {
                    updateBusinessProfile({
                      specialOffers: [...currentOffers, preset],
                    });
                    setSuccessNotice('GI promotion badge updated!');
                    setTimeout(() => setSuccessNotice(''), 2500);
                  }
                }}
                className="px-2 py-1 rounded-lg bg-surface border border-border hover:border-primary/50 text-[10px] font-medium text-ink transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Standards */}
      <section className="bg-surface border border-border rounded-card p-3.5 space-y-1.5 text-xs text-stone">
        <div className="font-bold text-ink flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-success" />
          <span>Verified Jammu Partner Code of Ethics</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          As a verified partner, your listing adheres to fair rate transparency, authentic certified goods, clean sanitary rest areas, and zero aggressive tourist touting across Jammu region.
        </p>
      </section>
    </div>
  );
};
