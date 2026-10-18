import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const HelpFab: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on safety page since user is already there
  if (location.pathname === '/safety') {
    return null;
  }

  return (
    <button
      onClick={() => navigate('/safety')}
      className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-danger text-white shadow-toast flex items-center justify-center hover:bg-danger/90 active:scale-95 transition-all border-2 border-white/80"
      aria-label="Emergency Help & Contacts 112"
      title="One-tap Emergency Help (112)"
    >
      <div className="relative flex items-center justify-center">
        <span className="absolute -inset-1 rounded-full bg-danger opacity-40 animate-ping pointer-events-none" />
        <ShieldAlert size={28} />
      </div>
    </button>
  );
};
