import React from 'react';
import { ShieldAlert, Terminal, MapPin, Radio, Users, CheckCircle2 } from 'lucide-react';
import { CommandControlDashboard } from '@/features/safety/CommandControlDashboard';
import { useNavigate } from 'react-router-dom';

export const CommandPortalPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-4 sm:p-6 rounded-2xl border border-emerald-500/30 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-emerald-300">
              Official Civic Terminal • Division Level-4
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading mt-1 flex items-center gap-2">
            <span>Disaster Command & Pilgrim Control Console</span>
          </h1>
          <p className="text-xs text-white/80 max-w-2xl mt-1 leading-relaxed">
            Centralized coordination interface for J&K Disaster Management Authority, Traffic Police Headquarters, and Shri Mata Vaishno Devi Shrine Board (SMVDSB).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/map')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4" />
            <span>Tactical Map</span>
          </button>
          <button
            onClick={() => navigate('/safety')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Citizen Safety Hub
          </button>
        </div>
      </div>

      {/* Main Command & Control Dashboard Engine */}
      <CommandControlDashboard />
    </div>
  );
};
