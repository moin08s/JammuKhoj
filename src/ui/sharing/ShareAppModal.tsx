import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Sparkles,
  Smartphone,
  ExternalLink,
  Users,
} from 'lucide-react';

interface ShareAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  text?: string;
  url?: string;
}

export const ShareAppModal: React.FC<ShareAppModalProps> = ({
  isOpen,
  onClose,
  title = 'JammuKhoj — City of Temples & Regional Travel Guide',
  text = 'Explore 35+ verified pilgrimage spots, Dogra palaces, alpine valleys (Bhaderwah, Patnitop), and offline transit maps on JammuKhoj!',
  url,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = url || window.location.origin;
  const fullShareText = `🌟 ${title}\n\n${text}\n\n📲 Open & Install free on Android / Web: ${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
        onClose();
      } catch (err) {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTelegramShare = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title + '\n' + text)}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md bg-card border border-border rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Share2 size={20} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-ink">
                Share with Friends
              </h3>
              <p className="text-xs text-stone">
                Invite friends & family to explore Jammu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface text-stone hover:text-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Play Store & Free Direct Sharing Notice */}
        <div className="p-3 rounded-2xl bg-primary-soft/50 border border-primary/20 text-xs space-y-1">
          <div className="font-bold text-primary flex items-center gap-1.5">
            <Smartphone size={14} />
            <span>100% Free · Direct Android & Web Link</span>
          </div>
          <p className="text-[11px] text-stone leading-relaxed">
            Anyone with this link can open JammuKhoj directly on their Android phone, add it to their home screen with 1 tap, and access offline maps without cost.
          </p>
        </div>

        {/* Quick 1-Tap Share Actions */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsAppShare}
            className="p-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] flex items-center gap-2.5 font-bold text-xs transition-all shadow-xs"
          >
            <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
              <MessageCircle size={16} />
            </div>
            <div className="text-left">
              <div className="text-ink">WhatsApp</div>
              <div className="text-[10px] text-stone font-normal">Send in chats</div>
            </div>
          </button>

          {/* Telegram / Social */}
          <button
            onClick={handleTelegramShare}
            className="p-3 rounded-2xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border border-[#0088cc]/30 text-[#0088cc] flex items-center gap-2.5 font-bold text-xs transition-all shadow-xs"
          >
            <div className="w-8 h-8 rounded-full bg-[#0088cc] text-white flex items-center justify-center shrink-0">
              <ExternalLink size={16} />
            </div>
            <div className="text-left">
              <div className="text-ink">Telegram</div>
              <div className="text-[10px] text-stone font-normal">Share to groups</div>
            </div>
          </button>
        </div>

        {/* Native Android Share Sheet */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full py-3 px-4 rounded-2xl bg-primary text-white font-bold text-xs hover:bg-primary/95 shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Share2 size={15} />
            <span>Open Android System Share Tray</span>
          </button>
        )}

        {/* Copy Link Bar */}
        <div className="space-y-1.5 pt-1">
          <label className="text-[11px] font-bold text-stone uppercase tracking-wider block">
            Direct Link
          </label>
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface border border-border">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent text-xs text-ink px-2 flex-1 outline-none truncate font-mono select-all"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-primary text-white hover:bg-primary/95'
              }`}
            >
              {copied ? (
                <>
                  <Check size={13} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          {copied && (
            <p className="text-[11px] text-emerald-600 font-medium animate-in fade-in flex items-center gap-1 pt-0.5">
              <Check size={12} />
              <span>Link copied to clipboard! Paste it into WhatsApp or SMS.</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
