import React, { useState } from 'react';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Languages,
  X,
  Sparkles,
  BookOpen,
  FastForward,
} from 'lucide-react';
import { AUDIO_TOUR_SPOTS, AudioTourSpot } from '@/data/audioStoriesData';
import { useAudioStore } from '@/stores/audioStore';

interface AudioTourModalProps {
  initialSpotId?: string;
  onClose: () => void;
}

export const AudioTourModal: React.FC<AudioTourModalProps> = ({
  initialSpotId,
  onClose,
}) => {
  const [selectedSpotId, setSelectedSpotId] = useState<string>(
    initialSpotId || AUDIO_TOUR_SPOTS[0].id
  );
  const [language, setLanguage] = useState<'en' | 'hi' | 'doi'>('en');

  const {
    currentTrack,
    isPlaying,
    progressSeconds,
    playTrack,
    pauseTrack,
    resumeTrack,
    stopTrack,
    playbackRate,
    setPlaybackRate,
  } = useAudioStore();

  const spot =
    AUDIO_TOUR_SPOTS.find((s) => s.id === selectedSpotId) || AUDIO_TOUR_SPOTS[0];

  const transcript = spot.transcripts[language];

  const isCurrentSpotPlaying =
    currentTrack?.id === `${spot.id}-${language}` && isPlaying;

  const handleStartNarration = () => {
    if (isCurrentSpotPlaying) {
      pauseTrack();
    } else if (currentTrack?.id === `${spot.id}-${language}`) {
      resumeTrack();
    } else {
      playTrack({
        id: `${spot.id}-${language}`,
        title: spot.title,
        spotName: spot.spotName,
        durationSeconds: spot.durationSeconds,
        language: language === 'doi' ? 'dogri' : language === 'hi' ? 'hindi' : 'english',
        transcriptText: transcript,
        heroImage: spot.heroImage,
      });
    }
  };

  const handleRateCycle = () => {
    const nextRate = playbackRate === 1.0 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1.0;
    setPlaybackRate(nextRate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#1C1917] text-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-stone-800 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="relative h-44 shrink-0 bg-stone-900">
          <img
            src={spot.heroImage}
            alt={spot.spotName}
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-stone-300 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#9E4A0C] text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-1">
            <Volume2 size={12} />
            <span>Spoken Heritage Tour</span>
          </div>

          <div className="absolute bottom-3 left-4 right-4">
            <div className="text-[11px] text-amber-300 font-bold">{spot.dogriTitle}</div>
            <h3 className="font-heading text-lg font-black text-white leading-tight">
              {spot.spotName}
            </h3>
            <p className="text-xs text-stone-300 line-clamp-1">{spot.title}</p>
          </div>
        </div>

        {/* Spot Carousel / Tabs */}
        <div className="flex items-center gap-1.5 p-2 bg-stone-900/90 border-b border-stone-800 overflow-x-auto no-scrollbar shrink-0">
          {AUDIO_TOUR_SPOTS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSpotId(s.id);
                if (currentTrack && currentTrack.id.startsWith(s.id)) {
                  // already active
                } else if (isPlaying) {
                  stopTrack();
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSpotId === s.id
                  ? 'bg-[#9E4A0C] text-white shadow-xs'
                  : 'bg-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              {s.spotName.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Body & Interactive Transcript */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Language Switcher */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-stone-900 border border-stone-800">
            <div className="flex items-center gap-1.5 text-stone-400 text-xs">
              <Languages size={14} className="text-[#9E4A0C]" />
              <span>Narration Language:</span>
            </div>
            <div className="flex items-center gap-1">
              {[
                { code: 'doi', label: 'डोगरी (Dogri)' },
                { code: 'hi', label: 'हिंदी (Hindi)' },
                { code: 'en', label: 'English' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as any);
                    if (isPlaying) {
                      stopTrack();
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    language === lang.code
                      ? 'bg-[#9E4A0C] text-white'
                      : 'bg-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transcript Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-stone-400 text-[11px]">
              <span className="flex items-center gap-1">
                <BookOpen size={12} className="text-amber-400" />
                <span>Live Audio Transcript</span>
              </span>
              <span>Self-paced narration</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 leading-relaxed text-stone-200 text-xs font-sans space-y-2">
              <p>{transcript}</p>
            </div>
          </div>
        </div>

        {/* Floating Player Controls */}
        <div className="p-3 bg-stone-900/95 border-t border-stone-800 space-y-2 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleRateCycle}
              className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-xs font-bold flex items-center gap-1"
            >
              <FastForward size={12} />
              <span>{playbackRate}x</span>
            </button>

            <button
              onClick={handleStartNarration}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#9E4A0C] hover:bg-[#853E0A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {isCurrentSpotPlaying ? (
                <>
                  <Pause size={16} />
                  <span>Pause Voice Guide</span>
                </>
              ) : (
                <>
                  <Play size={16} className="ml-0.5" />
                  <span>Listen to Spoken Guide</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                stopTrack();
              }}
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
              title="Stop & Reset"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
