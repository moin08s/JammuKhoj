import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, User, Store, Plus } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import type { UserRole, BusinessProfile } from '@/data/types';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  onSuccess?: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'visitor',
  onSuccess,
}) => {
  const { login } = useAppStore();
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleSelectAccount = (email: string, name: string, chosenRole: UserRole, avatar?: string) => {
    setIsSigningIn(true);
    setTimeout(() => {
      let bizDetails: BusinessProfile | undefined;
      if (chosenRole === 'business') {
        bizDetails = {
          businessName: `${name}'s Verified Dogra Emporium`,
          category: 'shop',
          contactPhone: '+91 94191 77665',
          address: 'Main Raghunath Bazaar, Jammu',
          description: 'Official verified artisan partner synced via Google Workspace.',
          city: 'jammu',
          isVerified: true,
          specialOffers: ['10% discount on pure GI Kashmiri Saffron'],
          registeredOn: new Date().toISOString(),
        };
      }

      login(email, chosenRole, name, bizDetails, 'google', avatar);
      setIsSigningIn(false);
      onClose();
      if (onSuccess) onSuccess();
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) return;
    const derivedName = customEmail.split('@')[0].replace(/[._]/g, ' ');
    const capitalized = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
    handleSelectAccount(customEmail, capitalized, role);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="bg-white border border-[#EBE4DC] rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95">
        {/* Google Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <div>
              <h3 className="font-heading font-bold text-base text-ink leading-tight">
                Sign in with Google
              </h3>
              <p className="text-[11px] text-stone-500">Sync trips & offline saves to Google</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone hover:bg-stone-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Role Segmented Selector */}
        <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('visitor')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
              role === 'visitor'
                ? 'bg-white text-[#9E4A0C] shadow-xs'
                : 'text-stone-600 hover:text-ink'
            }`}
          >
            <User size={13} />
            <span>Pilgrim / Explorer</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('business')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
              role === 'business'
                ? 'bg-white text-[#9E4A0C] shadow-xs'
                : 'text-stone-600 hover:text-ink'
            }`}
          >
            <Store size={13} />
            <span>Local Business</span>
          </button>
        </div>

        {/* Google Account List */}
        <div className="space-y-2">
          {/* Account 1: Rajesh Sharma */}
          <button
            onClick={() =>
              handleSelectAccount(
                'rajesh.sharma@gmail.com',
                'Rajesh Sharma',
                role,
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
              )
            }
            disabled={isSigningIn}
            className="w-full p-2.5 rounded-2xl border border-stone-200 hover:border-[#9E4A0C]/50 hover:bg-stone-50 text-left transition-all flex items-center gap-3 active:scale-98"
          >
            <div className="w-10 h-10 rounded-full bg-[#E0E7FF] text-[#3730A3] font-bold text-sm flex items-center justify-center shrink-0">
              RS
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-ink truncate flex items-center gap-1">
                <span>Rajesh Sharma</span>
                <ShieldCheck size={13} className="text-[#15803D]" />
              </div>
              <div className="text-[11px] text-stone-500 truncate">rajesh.sharma@gmail.com</div>
            </div>
          </button>

          {/* Account 2: Moin Khan */}
          <button
            onClick={() =>
              handleSelectAccount(
                'moin.jammu@gmail.com',
                'Moin Khan',
                role,
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
              )
            }
            disabled={isSigningIn}
            className="w-full p-2.5 rounded-2xl border border-stone-200 hover:border-[#9E4A0C]/50 hover:bg-stone-50 text-left transition-all flex items-center gap-3 active:scale-98"
          >
            <div className="w-10 h-10 rounded-full bg-[#DCFCE7] text-[#166534] font-bold text-sm flex items-center justify-center shrink-0">
              MK
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-ink truncate flex items-center gap-1">
                <span>Moin Khan</span>
                <CheckCircle2 size={13} className="text-[#15803D]" />
              </div>
              <div className="text-[11px] text-stone-500 truncate">moin.jammu@gmail.com</div>
            </div>
          </button>

          {/* Account 3: Dogra Artisan Shop */}
          {role === 'business' && (
            <button
              onClick={() =>
                handleSelectAccount(
                  'artisan.jammu@gmail.com',
                  'Dogra Saffron & Handloom Guild',
                  'business'
                )
              }
              disabled={isSigningIn}
              className="w-full p-2.5 rounded-2xl border border-stone-200 hover:border-[#9E4A0C]/50 hover:bg-stone-50 text-left transition-all flex items-center gap-3 active:scale-98"
            >
              <div className="w-10 h-10 rounded-full bg-[#FEF3C7] text-[#92400E] font-bold text-sm flex items-center justify-center shrink-0">
                DS
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-ink truncate">
                  Dogra Saffron & Handloom Guild
                </div>
                <div className="text-[11px] text-stone-500 truncate">artisan.jammu@gmail.com</div>
              </div>
            </button>
          )}

          {/* Use Another Account Toggle */}
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className="w-full p-2.5 rounded-2xl border border-dashed border-stone-300 text-stone-600 hover:text-ink hover:border-stone-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={14} />
              <span>Use another Google account</span>
            </button>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-2 pt-1 animate-in fade-in">
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="Enter your Gmail address..."
                className="w-full p-2.5 rounded-xl border border-stone-300 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-[#9E4A0C]/40"
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-[#9E4A0C] text-white text-xs font-bold hover:bg-[#853E0A]"
              >
                Sign In with this Gmail
              </button>
            </form>
          )}
        </div>

        {/* Security and Google Privacy Footer */}
        <div className="text-[10px] text-stone-500 leading-tight border-t border-stone-100 pt-3 flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-[#15803D] shrink-0" />
          <span>
            Google Play Verified • End-to-end client encryption. No passwords stored on device.
          </span>
        </div>
      </div>
    </div>
  );
};
