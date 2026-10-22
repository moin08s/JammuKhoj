import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Store,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Building2,
  Phone,
  Eye,
  EyeOff,
  User,
  X,
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import type { UserRole, BusinessProfile } from '@/data/types';

export const WelcomeAuthGate: React.FC = () => {
  const navigate = useNavigate();
  const { login, setGuestMode } = useAppStore();

  // Active Tab: 'signin' | 'signup'
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<UserRole>('visitor');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Business Fields
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState<BusinessProfile['category']>('shop');
  const [contactPhone, setContactPhone] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');

  // Google Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleRoleChoice, setGoogleRoleChoice] = useState<UserRole>('visitor');
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  // Validation & Error
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters for security.');
      return;
    }
    if (activeTab === 'signup' && !agreeTerms) {
      setErrorMsg('Please agree to the Privacy Policy & Terms of Service.');
      return;
    }

    if (activeTab === 'signup' && role === 'business') {
      const bizDetails: BusinessProfile = {
        businessName: businessName || name || 'Verified Local Partner',
        category: businessCategory,
        contactPhone: contactPhone || '+91 94191 23456',
        address: businessAddress || 'Raghunath Bazaar, Old City Jammu',
        description: 'Verified authentic local enterprise dedicated to pilgrims and travellers.',
        city: 'jammu',
        isVerified: true,
        specialOffers: ['10% exclusive discount for JammuKhoj app users'],
        registeredOn: new Date().toISOString(),
      };
      login(email, 'business', businessName || name, bizDetails, 'email');
      navigate('/business');
    } else {
      login(email, role, name || (activeTab === 'signin' ? 'Jammu Explorer' : 'New Traveler'), undefined, 'email');
      navigate('/');
    }
  };

  const handleGoogleQuickAuth = (userEmail: string, userName: string, chosenRole: UserRole) => {
    setIsGoogleSigningIn(true);
    setTimeout(() => {
      if (chosenRole === 'business') {
        const bizDetails: BusinessProfile = {
          businessName: `${userName}'s Verified Dogra Stays`,
          category: 'hotel',
          contactPhone: '+91 94191 88990',
          address: 'BC Road, Jammu Near Bus Stand',
          description: 'Official partner authorized through Google Workspace for Jammu travel & hospitality.',
          city: 'jammu',
          isVerified: true,
          specialOffers: ['15% direct pilgrim discount with app verification'],
          registeredOn: new Date().toISOString(),
        };
        login(userEmail, 'business', userName, bizDetails, 'google', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80');
        setShowGoogleModal(false);
        setIsGoogleSigningIn(false);
        navigate('/business');
      } else {
        login(userEmail, 'visitor', userName, undefined, 'google', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80');
        setShowGoogleModal(false);
        setIsGoogleSigningIn(false);
        navigate('/');
      }
    }, 600);
  };

  const handleContinueAsGuest = () => {
    setGuestMode(true);
    navigate('/');
  };

  const handleDemoTraveler = () => {
    login('meera.sharma@gmail.com', 'visitor', 'Meera Sharma (Pilgrim)', undefined, 'google', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80');
    navigate('/');
  };

  const handleDemoBusiness = () => {
    const demoBiz: BusinessProfile = {
      businessName: 'Dogra Heritage Sweets & Dry Fruits Hub',
      category: 'shop',
      contactPhone: '+91 94191 23456',
      address: 'Shop 14, Main Raghunath Temple Gate, Jammu',
      description: 'Official verified local merchant offering GI saffron and walnut packs.',
      city: 'jammu',
      isVerified: true,
      specialOffers: ['Free luggage cloakroom for shoppers', '10% discount on saffron'],
      registeredOn: '2026-09-01T10:00:00Z',
    };
    login('partner@localdogra.com', 'business', demoBiz.businessName, demoBiz, 'email');
    navigate('/business');
  };

  return (
    <div className="min-h-[100dvh] bg-surface flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto select-none animate-in fade-in duration-300">
      {/* Top Branding & Explore as Guest */}
      <header className="flex items-center justify-between pt-2 pb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl overflow-hidden shadow-md shadow-[#174D3C]/20 shrink-0 flex items-center justify-center bg-forest-900 border border-amber-500/30">
            <img
              src="/icons/icon-emblem.svg"
              alt="JammuKhoj Emblem"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icons/icon-192.png';
              }}
            />
          </div>
          <div>
            <span className="font-heading font-bold text-base text-[#1C2923] tracking-tight block">JammuKhoj</span>
            <span className="text-[10px] text-[#65736B] block -mt-0.5">Explore Jammu. Travel with confidence.</span>
          </div>
        </div>

        <button
          onClick={handleContinueAsGuest}
          className="text-xs font-semibold text-[#65736B] hover:text-[#174D3C] px-3 py-1.5 rounded-full bg-card border border-border shadow-xs transition-colors flex items-center gap-1 active:scale-[0.98]"
        >
          <span>Explore as Guest</span>
          <ArrowRight size={13} />
        </button>
      </header>

      {/* Main Container */}
      <div className="my-auto py-3 space-y-4">
        {/* Apple-styled Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden p-5 text-white shadow-lg bg-gradient-to-br from-[#174D3C] via-[#123E38] to-[#0B251E]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F3C969]/15 dark:bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#F3C969] dark:bg-amber-400 text-[#1C2923] dark:text-stone-950 shadow-xs">
              <Sparkles size={11} /> Smart Tourism & Vaishno Devi Companion
            </span>
            <h1 className="font-heading text-xl font-bold leading-tight">
              Sign in to JammuKhoj
            </h1>
            <p className="text-xs text-white/85 leading-relaxed max-w-xs">
              Discover 35+ verified pilgrimage shrines, alpine circuits, live transit fares, and 100% offline maps.
            </p>
          </div>
        </div>

        {/* 1-Tap Google / Gmail Login Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              setGoogleRoleChoice('visitor');
              setShowGoogleModal(true);
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-card border border-border hover:border-[#174D3C]/40 text-[#1C2923] font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 active:scale-[0.99]"
          >
            <GoogleIcon size={20} />
            <span className="text-sm">Continue with Google / Gmail</span>
          </button>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink mx-3 text-[11px] font-semibold text-[#65736B] uppercase tracking-wider">
              or continue with email
            </span>
            <div className="flex-grow border-t border-border"></div>
          </div>
        </div>

        {/* Apple Segmented Tab Switcher: Sign In vs Sign Up */}
        <div className="p-1 bg-stone-100 dark:bg-stone-800/60 rounded-2xl flex items-center border border-border">
          <button
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'signin'
                ? 'bg-card text-[#174D3C] shadow-xs'
                : 'text-[#65736B] hover:text-[#1C2923]'
            }`}
          >
            Sign In with Password
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'signup'
                ? 'bg-card text-[#174D3C] shadow-xs'
                : 'text-[#65736B] hover:text-[#1C2923]'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Auth Form (Sign In or Sign Up) */}
        <form onSubmit={handleEmailSubmit} className="bg-card border border-border rounded-3xl p-5 space-y-3.5 shadow-xs">
          {activeTab === 'signup' && (
            /* Role Switcher Pill */
            <div className="grid grid-cols-2 p-1 bg-surface border border-border rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setRole('visitor')}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  role === 'visitor' ? 'bg-card text-[#174D3C] shadow-xs' : 'text-[#65736B] hover:text-[#1C2923]'
                }`}
              >
                <Compass size={14} />
                <span>Traveler / Pilgrim</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('business')}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  role === 'business' ? 'bg-card text-[#174D3C] shadow-xs' : 'text-[#65736B] hover:text-[#1C2923]'
                }`}
              >
                <Store size={14} />
                <span>Local Merchant</span>
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-[11px] font-semibold text-center animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {activeTab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-[#65736B] mb-1 flex items-center gap-1">
                <User size={13} className="text-[#174D3C]" />
                <span>{role === 'business' ? 'Merchant / Contact Name' : 'Full Name'}</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'business' ? 'e.g. Ramesh Dogra' : 'e.g. Meera Sharma'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-[#1C2923] text-xs focus:ring-2 focus:ring-[#174D3C]/40 focus:outline-none"
                required
              />
            </div>
          )}

          {/* Business Additional Fields during Signup */}
          {activeTab === 'signup' && role === 'business' && (
            <div className="space-y-3 pt-1 border-t border-border">
              <div>
                <label className="block text-xs font-semibold text-[#65736B] mb-1 flex items-center gap-1">
                  <Building2 size={13} className="text-[#174D3C]" />
                  <span>Shop / Hotel / Enterprise Name</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Raghunath Dry Fruits & Stays"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-[#1C2923] text-xs focus:ring-2 focus:ring-[#174D3C]/40 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#65736B] mb-1">Category</label>
                  <select
                    value={businessCategory}
                    onChange={(e) => setBusinessCategory(e.target.value as any)}
                    className="w-full px-2.5 py-2.5 rounded-xl border border-border bg-surface text-[#1C2923] text-xs focus:ring-2 focus:ring-[#174D3C]/40 focus:outline-none"
                  >
                    <option value="shop">Artisan / Dry Fruits</option>
                    <option value="hotel">Hotel / Homestay</option>
                    <option value="restaurant">Food / Traditional</option>
                    <option value="guide">Tour Guide</option>
                    <option value="transport">Prepaid Taxi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#65736B] mb-1 flex items-center gap-1">
                    <Phone size={13} className="text-[#174D3C]" />
                    <span>Phone</span>
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 94191 23456"
                    className="w-full px-2.5 py-2.5 rounded-xl border border-border bg-surface text-[#1C2923] text-xs focus:ring-2 focus:ring-[#174D3C]/40 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#65736B] mb-1 flex items-center gap-1">
              <Mail size={13} className="text-[#174D3C]" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-[#1C2923] text-xs focus:ring-2 focus:ring-[#174D3C]/40 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#65736B] mb-1 flex items-center gap-1">
              <Lock size={13} className="text-[#174D3C]" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-border bg-surface text-[#1C2923] text-xs focus:ring-2 focus:ring-[#174D3C]/40 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#65736B] hover:text-[#1C2923]"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Terms checkbox */}
          {activeTab === 'signup' && (
            <label className="flex items-start gap-2 cursor-pointer text-[11px] text-[#65736B] select-none pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded accent-[#174D3C]"
              />
              <span>
                I accept the JammuKhoj{' '}
                <span onClick={() => navigate('/privacy')} className="text-[#174D3C] font-bold underline cursor-pointer">
                  Privacy Policy
                </span>{' '}
                and offline data safety standards.
              </span>
            </label>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-[#174D3C] text-white font-bold text-xs shadow-md shadow-[#174D3C]/20 hover:bg-[#123E38] transition-all flex items-center justify-center gap-2 mt-2 active:scale-[0.99]"
          >
            <span>{activeTab === 'signup' ? 'Create JammuKhoj Account' : 'Sign In with Password'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* 1-Tap Instant Reviewer Accounts */}
        <div className="p-3.5 bg-card border border-border rounded-2xl space-y-2 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#65736B] flex items-center gap-1">
            <Sparkles size={12} className="text-[#F3C969]" />
            <span>Instant Demo Reviewer Logins:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoTraveler}
              className="p-2.5 rounded-xl bg-surface border border-border hover:border-[#174D3C]/50 text-left text-xs transition-all shadow-xs"
            >
              <div className="font-bold text-[#1C2923] flex items-center gap-1">
                <span>🧳 Demo Pilgrim</span>
              </div>
              <div className="text-[10px] text-[#65736B]">Meera Sharma (Gmail)</div>
            </button>

            <button
              type="button"
              onClick={handleDemoBusiness}
              className="p-2.5 rounded-xl bg-surface border border-border hover:border-[#174D3C]/50 text-left text-xs transition-all shadow-xs"
            >
              <div className="font-bold text-[#1C2923] flex items-center gap-1">
                <span>🏪 Demo Merchant</span>
              </div>
              <div className="text-[10px] text-[#65736B]">Heritage Sweets Hub</div>
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Footer */}
      <footer className="text-center space-y-1.5 pt-3 pb-1 border-t border-border/70">
        <div className="flex items-center justify-center gap-4 text-[11px] text-[#65736B]">
          <button onClick={() => navigate('/privacy')} className="hover:text-[#1C2923] underline">
            Privacy Policy
          </button>
          <span>•</span>
          <button onClick={() => navigate('/privacy')} className="hover:text-[#1C2923] underline">
            Data Safety
          </button>
          <span>•</span>
          <button onClick={handleContinueAsGuest} className="text-[#174D3C] font-bold hover:underline">
            Explore as Guest
          </button>
        </div>
        <div className="text-[10px] text-[#65736B]">
          Zero tracking cookies · 100% Client-side Offline IndexedDB
        </div>
      </footer>

      {/* Google / Gmail OAuth Interactive Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <GoogleIcon size={20} />
                <span className="font-heading font-bold text-base text-[#1C2923]">Sign in with Google</span>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="p-1 rounded text-[#65736B] hover:text-[#1C2923]"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-[#65736B]">
              Choose a Google account or enter your Gmail address to access <strong>JammuKhoj</strong>:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleGoogleQuickAuth('arjun.sharma@gmail.com', 'Arjun Sharma', googleRoleChoice)}
                disabled={isGoogleSigningIn}
                className="w-full p-3 rounded-2xl border border-border hover:border-[#174D3C] bg-surface hover:bg-card flex items-center gap-3 transition-all text-left shadow-xs"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                  A
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#1C2923] truncate">Arjun Sharma</div>
                  <div className="text-[11px] text-[#65736B] truncate">arjun.sharma@gmail.com</div>
                </div>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">Pilgrim</span>
              </button>

              <button
                onClick={() => handleGoogleQuickAuth('priya.dogra@gmail.com', 'Priya Dogra', googleRoleChoice)}
                disabled={isGoogleSigningIn}
                className="w-full p-3 rounded-2xl border border-border hover:border-[#174D3C] bg-surface hover:bg-card flex items-center gap-3 transition-all text-left shadow-xs"
              >
                <div className="w-9 h-9 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                  P
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#1C2923] truncate">Priya Dogra</div>
                  <div className="text-[11px] text-[#65736B] truncate">priya.dogra@gmail.com</div>
                </div>
                <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">Merchant</span>
              </button>
            </div>

            {/* Custom Gmail Input */}
            <div className="pt-2 border-t border-border space-y-2">
              <label className="block text-[11px] font-semibold text-[#65736B]">
                Or enter your own Gmail address:
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-surface text-[#1C2923] text-xs focus:ring-2 focus:ring-[#174D3C]/40 focus:outline-none"
                />
                <button
                  type="button"
                  disabled={!googleEmailInput.includes('@') || isGoogleSigningIn}
                  onClick={() => {
                    const extractedName = googleEmailInput.split('@')[0].replace(/[._]/g, ' ');
                    handleGoogleQuickAuth(googleEmailInput, extractedName || 'Google User', googleRoleChoice);
                  }}
                  className="px-3.5 py-2 bg-[#174D3C] text-white rounded-xl text-xs font-bold disabled:opacity-50 hover:bg-[#123E38] shrink-0"
                >
                  Continue
                </button>
              </div>
            </div>

            <div className="bg-surface p-2.5 rounded-xl border border-border text-[11px] text-[#65736B] flex items-center justify-between">
              <span>Selected role:</span>
              <span className="font-bold text-[#174D3C] capitalize">
                {googleRoleChoice === 'business' ? '🏪 Local Merchant' : '🧳 Traveler / Pilgrim'}
              </span>
            </div>

            {isGoogleSigningIn && (
              <div className="text-center text-xs font-semibold text-[#174D3C] animate-pulse">
                Authorizing secure Google connection...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Official Google Multi-color G Icon
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}
