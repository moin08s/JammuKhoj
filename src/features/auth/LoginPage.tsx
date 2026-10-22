import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  MapPin,
  LogOut,
  User,
  X,
  ExternalLink,
  Check,
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import type { UserRole, BusinessProfile } from '@/data/types';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, login, logout } = useAppStore();

  const [role, setRole] = useState<UserRole>('visitor');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  // Business specific fields
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState<BusinessProfile['category']>('shop');
  const [contactPhone, setContactPhone] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');

  // Google Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleRoleChoice, setGoogleRoleChoice] = useState<UserRole>('visitor');
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (role === 'business') {
      const bizDetails: BusinessProfile = {
        businessName: businessName || name || 'Local Enterprise',
        category: businessCategory,
        contactPhone: contactPhone || '+91 94191 23456',
        address: businessAddress || 'Raghunath Bazaar, Jammu',
        description: businessDescription || 'Authentic local partner dedicated to serving travellers and pilgrims.',
        city: 'jammu',
        isVerified: true,
        specialOffers: ['Exclusive 10% welcome discount for JammuKhoj app users', 'Free luggage cloakroom for pilgrim shoppers'],
        registeredOn: new Date().toISOString(),
      };
      login(email, 'business', businessName || name, bizDetails, 'email');
      navigate('/business');
    } else {
      login(email, 'visitor', name || 'Jammu Explorer', undefined, 'email');
      navigate('/');
    }
  };

  const handleGoogleQuickAuth = (userEmail: string, userName: string, chosenRole: UserRole) => {
    setIsGoogleSigningIn(true);
    setTimeout(() => {
      if (chosenRole === 'business') {
        const bizDetails: BusinessProfile = {
          businessName: `${userName}'s Verified Dogra Stays & Services`,
          category: 'hotel',
          contactPhone: '+91 94191 88990',
          address: 'Near Old Heritage Gate, BC Road, Jammu',
          description: 'Official verified partner registered with Google Workspace for Jammu travel & hospitality.',
          city: 'jammu',
          isVerified: true,
          specialOffers: ['15% direct discount for Google/Gmail verified pilgrims'],
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
    }, 700);
  };

  const handleDemoTraveler = () => {
    login('meera.sharma@example.com', 'visitor', 'Meera Sharma (Pilgrim / Tourist)', undefined, 'email');
    navigate('/');
  };

  const handleDemoBusiness = () => {
    const demoBiz: BusinessProfile = {
      businessName: 'Dogra Heritage Sweets & Dry Fruit Hub',
      category: 'shop',
      contactPhone: '+91 94191 23456',
      address: 'Shop 14, Main Raghunath Temple Gate, Jammu',
      description: 'Official verified local merchant offering certified products, authentic regional flavours, walnut/saffron gift packs and pilgrim assistance.',
      city: 'jammu',
      isVerified: true,
      specialOffers: [
        'Free locker luggage deposit with purchases above ₹200',
        '10% discount on GI-tagged Kashmiri saffron and walnuts',
      ],
      registeredOn: '2026-09-01T10:00:00Z',
    };
    login('partner@localdogra.com', 'business', demoBiz.businessName, demoBiz, 'email');
    navigate('/business');
  };

  if (currentUser) {
    return (
      <div className="space-y-5 py-6 animate-in fade-in duration-200 max-w-md mx-auto">
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm text-center">
          <div className="relative w-20 h-20 mx-auto">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-primary shadow-sm"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl border-2 border-primary/30">
                {currentUser.name.charAt(0)}
              </div>
            )}
            {currentUser.authProvider === 'google' && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card shadow-md border border-border flex items-center justify-center">
                <GoogleIcon size={14} />
              </div>
            )}
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {currentUser.role === 'business' ? '🏪 Local Business Partner' : '🧳 Traveler / Explorer'}
            </span>
            <h2 className="font-heading text-xl font-bold text-ink mt-2.5">
              {currentUser.name}
            </h2>
            <p className="text-xs text-stone flex items-center justify-center gap-1.5 mt-0.5">
              <span>{currentUser.email}</span>
              {currentUser.authProvider === 'google' && (
                <span className="text-[10px] text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.2 rounded font-semibold border border-blue-200 dark:border-blue-800">
                  Gmail Verified
                </span>
              )}
            </p>
          </div>

          {currentUser.role === 'business' && currentUser.businessDetails && (
            <div className="p-3.5 bg-surface border border-border rounded-xl text-left text-xs space-y-1.5">
              <div className="font-bold text-ink flex items-center justify-between">
                <span>{currentUser.businessDetails.businessName}</span>
                <span className="text-success text-[10px] bg-success/15 px-2 py-0.5 rounded-full font-bold">
                  ✓ Verified Listing
                </span>
              </div>
              <div className="text-[11px] text-stone">{currentUser.businessDetails.address}</div>
              <div className="text-[11px] text-primary font-semibold">📞 {currentUser.businessDetails.contactPhone}</div>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            {currentUser.role === 'business' ? (
              <button
                onClick={() => navigate('/business')}
                className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow hover:bg-primary/95 transition-all"
              >
                Go to Business Partner Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate('/suggestions')}
                className="w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow hover:bg-primary/95 transition-all"
              >
                View Curated Trip Suggestions
              </button>
            )}

            <button
              onClick={logout}
              className="w-full py-2 rounded-xl border border-danger/30 text-danger text-xs font-bold hover:bg-danger/10 transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-2 animate-in fade-in duration-200 max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm mx-auto flex items-center justify-center bg-forest-900 border border-amber-500/30">
          <img
            src="/icons/icon-emblem.svg"
            alt="JammuKhoj Emblem"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
          <Sparkles size={14} />
          <span>JammuKhoj Unified Account</span>
        </div>
        <h2 className="font-heading text-2xl font-bold text-ink">
          Sign In to Your Journey
        </h2>
        <p className="text-xs text-stone">
          Choose Gmail or email login for personalized itineraries & local merchant benefits.
        </p>
      </div>

      {/* Role Switcher Tabs (Segmented Control) */}
      <div className="grid grid-cols-2 p-1 bg-surface border border-border rounded-xl">
        <button
          type="button"
          onClick={() => setRole('visitor')}
          className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            role === 'visitor'
              ? 'bg-card text-primary shadow-sm border border-border'
              : 'text-stone hover:text-ink'
          }`}
        >
          <Compass size={16} className={role === 'visitor' ? 'text-primary' : 'text-stone'} />
          <span>Traveler / Visitor</span>
        </button>

        <button
          type="button"
          onClick={() => setRole('business')}
          className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            role === 'business'
              ? 'bg-card text-primary shadow-sm border border-border'
              : 'text-stone hover:text-ink'
          }`}
        >
          <Store size={16} className={role === 'business' ? 'text-primary' : 'text-stone'} />
          <span>Local Business</span>
        </button>
      </div>

      {/* Professional Google / Gmail Sign In Button */}
      <button
        type="button"
        onClick={() => {
          setGoogleRoleChoice(role);
          setShowGoogleModal(true);
        }}
        className="w-full py-3 px-4 rounded-xl bg-card border-2 border-slate-200 hover:border-slate-300 dark:border-border dark:hover:border-primary/50 text-ink font-semibold text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-3 active:scale-[0.99]"
      >
        <GoogleIcon size={18} />
        <span>Continue with Google / Gmail</span>
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative px-3 bg-surface text-[11px] font-semibold text-stone uppercase tracking-wider">
          Or with email
        </div>
      </div>

      {/* Email / Password Form */}
      <form onSubmit={handleEmailLogin} className="bg-card border border-border rounded-2xl p-4 space-y-3.5 shadow-sm">
        <div>
          <label className="block text-xs font-semibold text-stone mb-1 flex items-center gap-1">
            <Mail size={13} className="text-primary" />
            <span>Email Address</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={role === 'business' ? 'partner@jammustays.in' : 'name@example.com'}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-ink text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone mb-1">
            {role === 'business' ? 'Owner / Manager Name' : 'Your Name (Optional)'}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={role === 'business' ? 'e.g. Ramesh Dogra' : 'e.g. Meera Sharma'}
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-ink text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
        </div>

        {/* Business Specific Registration Fields */}
        {role === 'business' && (
          <div className="space-y-3 pt-1 border-t border-border/70">
            <div>
              <label className="block text-xs font-semibold text-stone mb-1 flex items-center gap-1">
                <Building2 size={13} className="text-primary" />
                <span>Enterprise / Shop Name</span>
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Raghunath Heritage Dry Fruits & Saffron"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-ink text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone mb-1">Category</label>
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value as any)}
                  className="w-full px-2.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                >
                  <option value="shop">Artisan / Dry Fruits</option>
                  <option value="hotel">Hotel / Homestay</option>
                  <option value="restaurant">Food / Traditional</option>
                  <option value="guide">Heritage Tour Guide</option>
                  <option value="transport">Prepaid Auto / Taxi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone mb-1 flex items-center gap-1">
                  <Phone size={13} className="text-primary" />
                  <span>Contact Phone</span>
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 94191 23456"
                  className="w-full px-2.5 py-2.5 rounded-xl border border-border bg-surface text-ink text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone mb-1 flex items-center gap-1">
                <MapPin size={13} className="text-primary" />
                <span>Physical Address / Landmark in Jammu</span>
              </label>
              <input
                type="text"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="e.g. Shop 12, Raghunath Bazaar, Old City Jammu"
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-ink text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                required
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-stone mb-1 flex items-center gap-1">
            <Lock size={13} className="text-primary" />
            <span>Password / Passcode</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-ink text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 rounded-xl bg-primary text-white font-bold text-xs shadow-md hover:bg-primary/95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2"
        >
          <span>{role === 'visitor' ? 'Sign In as Traveler' : 'Register / Sign In Business'}</span>
          <ArrowRight size={16} />
        </button>
      </form>

      {/* 1-Tap Instant Test Accounts */}
      <div className="p-3.5 bg-surface border border-border rounded-2xl space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-stone flex items-center gap-1">
          <Sparkles size={13} className="text-accent" />
          <span>Instant One-Tap Test Accounts:</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleDemoTraveler}
            className="p-2.5 rounded-xl bg-card border border-border hover:border-primary/50 text-left text-xs transition-all shadow-sm group"
          >
            <div className="font-bold text-ink group-hover:text-primary transition-colors">🧳 Demo Traveler</div>
            <div className="text-[10px] text-stone">Meera (Pilgrim / Tourist)</div>
          </button>

          <button
            type="button"
            onClick={handleDemoBusiness}
            className="p-2.5 rounded-xl bg-card border border-border hover:border-primary/50 text-left text-xs transition-all shadow-sm group"
          >
            <div className="font-bold text-ink group-hover:text-primary transition-colors">🏪 Demo Business</div>
            <div className="text-[10px] text-stone">Dogra Heritage Hub</div>
          </button>
        </div>
      </div>

      {/* Google OAuth Interactive Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card border border-border rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <GoogleIcon size={20} />
                <span className="font-heading font-bold text-base text-ink">Sign in with Google</span>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="p-1 rounded text-stone hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-stone">
              Choose an active Gmail account to continue to <strong>JammuKhoj</strong>:
            </p>

            {/* Simulated Google Accounts List */}
            <div className="space-y-2">
              <button
                onClick={() => handleGoogleQuickAuth('arjun.sharma@gmail.com', 'Arjun Sharma', googleRoleChoice)}
                disabled={isGoogleSigningIn}
                className="w-full p-3 rounded-xl border border-border hover:border-primary bg-surface hover:bg-card flex items-center gap-3 transition-all text-left shadow-sm"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                  A
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-ink truncate">Arjun Sharma</div>
                  <div className="text-[11px] text-stone truncate">arjun.sharma@gmail.com</div>
                </div>
              </button>

              <button
                onClick={() => handleGoogleQuickAuth('priya.dogra@gmail.com', 'Priya Dogra', googleRoleChoice)}
                disabled={isGoogleSigningIn}
                className="w-full p-3 rounded-xl border border-border hover:border-primary bg-surface hover:bg-card flex items-center gap-3 transition-all text-left shadow-sm"
              >
                <div className="w-9 h-9 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                  P
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-ink truncate">Priya Dogra (Local Partner)</div>
                  <div className="text-[11px] text-stone truncate">priya.dogra@gmail.com</div>
                </div>
              </button>
            </div>

            {/* Custom Gmail Input */}
            <div className="pt-2 border-t border-border space-y-2">
              <label className="block text-[11px] font-semibold text-stone">
                Or type your personal Gmail address:
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-surface text-ink text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
                <button
                  type="button"
                  disabled={!googleEmailInput.includes('@') || isGoogleSigningIn}
                  onClick={() => {
                    const extractedName = googleEmailInput.split('@')[0].replace(/[._]/g, ' ');
                    handleGoogleQuickAuth(googleEmailInput, extractedName || 'Google User', googleRoleChoice);
                  }}
                  className="px-3 py-2 bg-primary text-white rounded-xl text-xs font-bold disabled:opacity-50 hover:bg-primary/95 shrink-0"
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Role indicator inside Google Modal */}
            <div className="bg-surface p-2.5 rounded-xl border border-border text-[11px] text-stone flex items-center justify-between">
              <span>Signing in as:</span>
              <span className="font-bold text-primary capitalize">
                {googleRoleChoice === 'business' ? '🏪 Local Business' : '🧳 Traveler'}
              </span>
            </div>

            {isGoogleSigningIn && (
              <div className="text-center text-xs font-semibold text-primary animate-pulse">
                Authorizing secure Google connection...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Official Google G Multi-Color SVG Icon
function GoogleIcon({ size = 18 }: { size?: number }) {
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
