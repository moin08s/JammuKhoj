import React, { useState } from 'react';
import { Ticket, QrCode, ShieldCheck, Bus, Award, ArrowRight } from 'lucide-react';
import { DigitalYatraPassModal, PASS_OPTIONS } from './DigitalYatraPassModal';

export const TransitPassPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5" /> Singapore & London TfL Oyster Model
              </span>
              <span className="text-xs text-blue-200">100% Offline Cryptographic QR</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Digital Yatra Transit Pass
            </h1>
            <p className="text-sm md:text-base text-blue-100 max-w-2xl mt-1">
              One contactless pass for all Jammu Smart City E-Buses, registered Matador routes, and Katra Base Shuttles. No internet needed to scan or board.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg active:scale-95 flex items-center gap-2 w-fit"
          >
            <QrCode className="w-4 h-4" />
            Open / Issue Digital Pass
          </button>
        </div>
      </div>

      {/* Available Tiers Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PASS_OPTIONS.map(opt => (
          <div 
            key={opt.id}
            className="p-5 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {opt.badge}
                </span>
                <span className="text-lg font-black text-ink">
                  ₹{opt.priceInr}
                </span>
              </div>
              <h3 className="font-bold text-base text-ink">
                {opt.title}
              </h3>
              <p className="text-xs text-stone mt-1 mb-3">
                {opt.subtitle}
              </p>
              <ul className="text-xs text-stone space-y-1.5 border-t border-border pt-3">
                {opt.includes.map((inc, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-surface border border-border hover:border-primary/40 text-primary font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              Select & Generate Pass <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <DigitalYatraPassModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};
