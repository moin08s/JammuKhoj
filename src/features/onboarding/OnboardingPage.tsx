import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CalendarClock,
  WifiOff,
  ShieldCheck,
  ChevronRight,
  Globe,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { setLanguage, setSetupStatus } = useAppStore();

  const [step, setStep] = useState<'language' | number>('language');

  const handleSelectLanguage = (lang: 'en' | 'hi') => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    setStep(0);
  };

  const slides = [
    {
      icon: CalendarClock,
      color: 'text-primary bg-primary-soft',
      title: 'Plan Your Stop with Return Safety',
      desc: 'Enter arrival and departure times. JammuKhoj guarantees non-negotiable transit return buffers so you never miss your onward bus or train.',
    },
    {
      icon: WifiOff,
      color: 'text-accent-ink bg-accent/20',
      title: 'Zero Network Dependency',
      desc: 'Full pilot vector map, 8+ heritage destinations, and fair fare benchmarks are cached directly on your device. Works seamlessly in airplane mode.',
    },
    {
      icon: ShieldCheck,
      color: 'text-danger bg-danger/10',
      title: 'One-Tap Emergency 112 & GPS Copy',
      desc: 'Instant access to official J&K emergency services, police desks, hospital casualty info and landmark GPS text generation.',
    },
  ];

  const handleFinish = () => {
    setSetupStatus('onboarded');
    navigate('/download');
  };

  if (step === 'language') {
    return (
      <div className="min-h-[100dvh] bg-surface flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg mb-4 flex items-center justify-center bg-forest-900 border border-amber-500/30">
          <img
            src="/icons/icon-emblem.svg"
            alt="JammuKhoj Emblem"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/icons/icon-192.png';
            }}
          />
        </div>
        <h1 className="font-heading text-2xl font-bold text-ink">
          JammuKhoj
        </h1>
        <p className="text-xs text-stone mt-1 mb-8 max-w-xs">
          Offline-First Pilgrim & Smart Tourism Companion
        </p>

        <div className="w-full max-w-xs space-y-3">
          <div className="text-xs font-semibold text-stone uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
            <Globe size={13} />
            <span>Select Preferred Language</span>
          </div>

          <button
            onClick={() => handleSelectLanguage('en')}
            className="w-full py-3.5 px-4 rounded-card border-2 border-primary bg-card text-primary font-bold text-sm shadow-sm hover:bg-primary-soft transition-all flex items-center justify-between"
          >
            <span>English (Default)</span>
            <ChevronRight size={18} />
          </button>

          <button
            onClick={() => handleSelectLanguage('hi')}
            className="w-full py-3.5 px-4 rounded-card border-2 border-border bg-card text-ink font-bold text-sm shadow-sm hover:border-primary/40 hover:bg-surface transition-all flex items-center justify-between"
          >
            <span>हिन्दी (Hindi)</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const slide = slides[step as number];
  const Icon = slide.icon;

  return (
    <div className="min-h-[100dvh] bg-surface flex flex-col justify-between p-6 max-w-content mx-auto animate-in fade-in">
      <div className="flex justify-end pt-2">
        <button
          onClick={handleFinish}
          className="text-xs font-semibold text-stone hover:text-ink px-2 py-1"
        >
          Skip Intro
        </button>
      </div>

      <div className="my-auto space-y-6 text-center px-2">
        <div className={`w-20 h-20 rounded-2xl ${slide.color} flex items-center justify-center mx-auto shadow-sm`}>
          <Icon size={40} />
        </div>

        <div className="space-y-2">
          <h2 className="font-heading text-2xl font-bold text-ink leading-tight">
            {slide.title}
          </h2>
          <p className="text-xs text-stone leading-relaxed max-w-xs mx-auto">
            {slide.desc}
          </p>
        </div>
      </div>

      <div className="space-y-4 pb-6">
        {/* Step dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === step ? 'w-6 bg-primary' : 'w-2 bg-border'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              if (step < slides.length - 1) {
                setStep((step as number) + 1);
              } else {
                handleFinish();
              }
            }}
            className="w-full py-3.5 px-4 rounded-control bg-primary text-white font-bold text-sm shadow-md hover:bg-primary/95 transition-all flex items-center justify-center gap-2"
          >
            <span>{step === slides.length - 1 ? 'Proceed to Offline Setup' : 'Continue'}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
