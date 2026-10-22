import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Search, Home, MapPin, CalendarDays, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="py-12 px-4 max-w-lg mx-auto text-center space-y-6 animate-in fade-in">
      {/* 404 Badge and Graphic */}
      <div className="relative inline-block mx-auto">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 border-2 border-primary/30 text-primary flex items-center justify-center mx-auto shadow-md">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>
        <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-mono font-bold text-xs shadow-sm">
          404
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-bold text-ink">
          Destination Trail Not Found
        </h1>
        <p className="text-xs sm:text-sm text-stone max-w-sm mx-auto leading-relaxed">
          The shrine, mountain route, or page you were trying to reach has moved or does not exist in the Jammu directory.
        </p>
      </div>

      {/* Quick Search */}
      <form onSubmit={handleSearch} className="relative max-w-sm mx-auto">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Katra, Bahu Fort, Patnitop..."
          className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-border bg-card text-xs text-ink placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="Search destination from 404 page"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark transition-all"
        >
          Find
        </button>
      </form>

      {/* Suggested Quick Links Grid */}
      <div className="grid grid-cols-2 gap-2 text-left pt-2">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="p-3 rounded-2xl bg-surface border border-border hover:border-primary/50 text-xs font-semibold text-ink flex items-center gap-2.5 transition-all apple-press shadow-xs"
        >
          <Home size={16} className="text-primary shrink-0" />
          <span>Home Hub</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/explore')}
          className="p-3 rounded-2xl bg-surface border border-border hover:border-primary/50 text-xs font-semibold text-ink flex items-center gap-2.5 transition-all apple-press shadow-xs"
        >
          <Compass size={16} className="text-emerald-600 shrink-0" />
          <span>All 36 Destinations</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/map')}
          className="p-3 rounded-2xl bg-surface border border-border hover:border-primary/50 text-xs font-semibold text-ink flex items-center gap-2.5 transition-all apple-press shadow-xs"
        >
          <MapPin size={16} className="text-amber-600 shrink-0" />
          <span>Offline City Map</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/plan')}
          className="p-3 rounded-2xl bg-surface border border-border hover:border-primary/50 text-xs font-semibold text-ink flex items-center gap-2.5 transition-all apple-press shadow-xs"
        >
          <CalendarDays size={16} className="text-blue-600 shrink-0" />
          <span>1-Tap Layover Plan</span>
        </button>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-stone hover:text-ink font-semibold transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Go back to previous screen</span>
        </button>
      </div>
    </div>
  );
};
