import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, SlidersHorizontal, User, Store, Sparkles, X, CheckCircle2, Share2 } from 'lucide-react';
import { useAppStore } from '@/stores/appStore';
import { ShareAppModal } from '@/ui/sharing/ShareAppModal';

export const TravelloHeader: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const notifications = [
    {
      id: 'notif_1',
      title: 'Katra Pilgrimage Weather',
      time: '15m ago',
      desc: 'Clear skies reported at Bhawan (21°C). Battery car service fully operational.',
      icon: '⛅',
      category: 'Pilgrimage',
    },
    {
      id: 'notif_2',
      title: 'Partner Offer Active',
      time: '1h ago',
      desc: '10% instant discount on GI saffron at Raghunath Bazaar with app badge.',
      icon: '🛍️',
      category: 'Discounts',
    },
    {
      id: 'notif_3',
      title: 'Transit Punctuality',
      time: '3h ago',
      desc: 'Vande Bharat Express (22440) arriving on time at Jammu Tawi Platform 1.',
      icon: '🚆',
      category: 'Railway',
    },
  ];

  return (
    <div className="space-y-3.5 select-none">
      {/* Top Greeting & Notification Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(currentUser?.role === 'business' ? '/business' : '/login')}
            className="relative"
            title="Open Account"
          >
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-primary/30 shadow-md"
              />
            ) : (
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-[#084A50] text-white flex items-center justify-center font-bold text-base shadow-md shadow-primary/20">
                {currentUser?.name ? currentUser.name.charAt(0) : 'J'}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
          </button>

          <div>
            <div className="text-xs text-stone flex items-center gap-1 font-medium">
              <span>Hello,</span>
              <span className="font-bold text-ink">
                {currentUser ? currentUser.name.split(' ')[0] : 'Explorer'} 👋
              </span>
            </div>
            <h2 className="font-heading text-lg font-bold text-ink leading-tight">
              Explore Jammu
            </h2>
          </div>
        </div>

        {/* Action Buttons: Share & Notifications */}
        <div className="flex items-center gap-2">
          {/* Share App with Friends Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="w-10 h-10 rounded-2xl bg-card border border-border text-ink hover:text-primary hover:bg-surface shadow-xs flex items-center justify-center transition-all active:scale-95"
            title="Share with Friends"
            aria-label="Share with Friends"
          >
            <Share2 size={18} />
          </button>

          {/* Notification Bell with Badge */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setHasUnread(false);
              }}
              className="w-10 h-10 rounded-2xl bg-card border border-border text-ink hover:bg-surface shadow-xs flex items-center justify-center transition-all relative"
              aria-label="View notifications"
            >
              <Bell size={18} />
              {hasUnread && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Notifications Flyout Drawer */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-2xl shadow-2xl p-3 z-50 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="font-heading font-bold text-sm text-ink">Live Travel Updates</span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded text-stone hover:text-ink"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-surface border border-border/70 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-ink flex items-center gap-1">
                          <span>{n.icon}</span>
                          <span>{n.title}</span>
                        </span>
                        <span className="text-[10px] text-stone">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-stone leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Travello Search Bar with Quick Filter Pill */}
      <div className="flex items-center gap-2">
        <div
          onClick={() => navigate('/map')}
          className="flex-1 bg-card border border-border rounded-2xl px-3.5 py-3 shadow-xs flex items-center gap-2.5 text-xs text-stone hover:border-primary/50 cursor-pointer transition-colors"
        >
          <Search size={16} className="text-primary" />
          <span className="font-medium text-xs">Search places, shrines, valleys...</span>
        </div>

        <button
          onClick={() => navigate('/explore')}
          className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md shadow-primary/20 hover:bg-primary/95 transition-all shrink-0 active:scale-95"
          title="Open filters"
        >
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* Share with Friends Modal */}
      <ShareAppModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
};
