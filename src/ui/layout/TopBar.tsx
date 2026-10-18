import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Menu,
  Bookmark,
  Settings,
  Moon,
  Sun,
  Globe,
  User,
  Store,
  Sparkles,
  Compass,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/stores/appStore';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ title, showBack }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, language, setLanguage, currentUser, connectivity } = useAppStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location.pathname === '/';
  const shouldShowBack = showBack ?? !isHome;

  const toggleLanguage = () => {
    const cycleMap: Record<string, 'en' | 'hi' | 'doi'> = {
      en: 'hi',
      hi: 'doi',
      doi: 'en',
    };
    const nextLang = cycleMap[language] || 'en';
    i18n.changeLanguage(nextLang);
    setLanguage(nextLang);
  };

  return (
    <header className="sticky top-0 z-30 apple-glass border-b border-border/70 px-4 py-2.5 flex items-center justify-between min-h-[58px] transition-all">
      <div className="flex items-center gap-3 min-w-0">
        {shouldShowBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 -ml-1 rounded-xl text-ink hover:bg-surface min-w-[36px] min-h-[36px] flex items-center justify-center transition-colors apple-press"
            aria-label={t('common.back')}
          >
            <ArrowLeft size={19} />
          </button>
        )}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 truncate cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-xl overflow-hidden shadow-sm shadow-primary/20 shrink-0 group-hover:scale-105 transition-transform flex items-center justify-center bg-forest-900 border border-amber-500/30">
            <img
              src="/icons/icon-emblem.svg"
              alt="JammuKhoj Emblem"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icons/icon-192.png';
              }}
            />
          </div>
          <div className="min-w-0">
            <h1 className="font-heading text-lg font-bold text-ink truncate leading-tight group-hover:text-primary transition-colors">
              {title || 'JammuKhoj'}
            </h1>
            <div className="flex items-center gap-1.5 text-[11px] text-stone">
              <span className={`w-1.5 h-1.5 rounded-full ${connectivity === 'online' ? 'bg-success' : 'bg-warn'}`}></span>
              <span className="font-medium">
                {connectivity === 'online' ? 'Online • Pack Synced' : 'Offline Mode • Local DB Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-1.5 mx-4" aria-label="Desktop Navigation">
        {[
          { to: '/explore', label: 'Explore' },
          { to: '/plan', label: 'Trip Planner' },
          { to: '/transport', label: 'Transport' },
          { to: '/safety', label: 'Safety (112)' },
          { to: '/saved', label: 'Saved Places' },
        ].map((link) => (
          <button
            key={link.to}
            onClick={() => navigate(link.to)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold apple-press transition-colors ${
              location.pathname === link.to
                ? 'bg-primary/10 text-primary font-bold'
                : 'text-stone hover:text-ink hover:bg-surface'
            }`}
          >
            {link.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {/* User Account / Login Pill */}
        {currentUser ? (
          <button
            onClick={() => navigate(currentUser.role === 'business' ? '/business' : '/login')}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all flex items-center gap-1.5 shrink-0 apple-press"
            title={`Signed in as ${currentUser.name}`}
          >
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-4 h-4 rounded-full object-cover shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : currentUser.role === 'business' ? (
              <Store size={13} />
            ) : (
              <User size={13} />
            )}
            <span className="max-w-[80px] truncate font-bold">{currentUser.name.split(' ')[0]}</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-dark transition-all flex items-center gap-1 shrink-0 shadow-sm apple-press"
          >
            <span>Sign In</span>
          </button>
        )}

        {/* Language switch quick toggle */}
        <button
          onClick={toggleLanguage}
          className="px-2.5 py-1.5 rounded-xl text-xs font-bold border border-border text-primary hover:bg-primary-soft transition-colors flex items-center gap-1 apple-press"
          aria-label="Switch Language (English / Hindi / Dogri)"
          title="Switch language"
        >
          <Globe size={13} />
          <span>{language === 'en' ? 'हिन्दी' : language === 'hi' ? 'डोगरी' : 'EN'}</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-xl text-stone hover:text-ink hover:bg-surface transition-colors apple-press"
          aria-label="Toggle dark/light mode"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Menu toggle */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-xl text-stone hover:text-ink hover:bg-surface transition-colors apple-press"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu size={19} />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xs"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-50 bg-card border border-border rounded-2xl shadow-2xl min-w-[230px] p-2 text-sm text-ink animate-in fade-in slide-in-from-top-2">
                <button
                  className="w-full px-3.5 py-2.5 rounded-xl flex items-center gap-3 hover:bg-surface text-left transition-colors font-medium text-xs"
                  onClick={() => {
                    navigate('/suggestions');
                    setMenuOpen(false);
                  }}
                >
                  <Sparkles size={16} className="text-amber-500" />
                  <span>Trip Suggestions & Planner</span>
                </button>

                <button
                  className="w-full px-3.5 py-2.5 rounded-xl flex items-center gap-3 hover:bg-surface text-left transition-colors font-medium text-xs"
                  onClick={() => {
                    navigate('/business');
                    setMenuOpen(false);
                  }}
                >
                  <Store size={16} className="text-primary" />
                  <span>Local Business Portal</span>
                </button>

                <button
                  className="w-full px-3.5 py-2.5 rounded-xl flex items-center gap-3 hover:bg-surface text-left transition-colors font-medium text-xs"
                  onClick={() => {
                    navigate('/saved');
                    setMenuOpen(false);
                  }}
                >
                  <Bookmark size={16} className="text-primary" />
                  <span>Saved Itineraries</span>
                </button>

                <button
                  className="w-full px-3.5 py-2.5 rounded-xl flex items-center gap-3 hover:bg-surface text-left transition-colors font-medium text-xs"
                  onClick={() => {
                    navigate('/transport');
                    setMenuOpen(false);
                  }}
                >
                  <Compass size={16} className="text-amber-600" />
                  <span>Transit & Fare Calculator</span>
                </button>

                <div className="border-t border-border/80 my-1.5" />

                <button
                  className="w-full px-3.5 py-2.5 rounded-xl flex items-center gap-3 hover:bg-surface text-left transition-colors font-medium text-xs"
                  onClick={() => {
                    navigate('/login');
                    setMenuOpen(false);
                  }}
                >
                  <User size={16} className="text-stone" />
                  <span>{currentUser ? 'My Profile' : 'Sign In with Gmail / Email'}</span>
                </button>

                <button
                  className="w-full px-3.5 py-2.5 rounded-xl flex items-center gap-3 hover:bg-surface text-left transition-colors font-medium text-xs"
                  onClick={() => {
                    navigate('/settings');
                    setMenuOpen(false);
                  }}
                >
                  <Settings size={16} className="text-stone" />
                  <span>Settings & Storage</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
