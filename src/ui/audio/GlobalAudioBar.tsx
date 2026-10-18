import React, { useEffect } from 'react';
import { Volume2, Play, Pause, X } from 'lucide-react';
import { useAudioStore } from '@/stores/audioStore';

export const GlobalAudioBar: React.FC = () => {
  const { currentTrack, isPlaying, progressSeconds, togglePlay, stopTrack, setProgress } = useAudioStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        if (progressSeconds >= currentTrack.durationSeconds) {
          stopTrack();
        } else {
          setProgress(progressSeconds + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progressSeconds, currentTrack, setProgress, stopTrack]);

  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = Math.min(100, (progressSeconds / currentTrack.durationSeconds) * 100);

  return (
    <div className="fixed bottom-16 left-3 right-3 z-40 max-w-md mx-auto animate-in slide-in-from-bottom-2">
      <div className="bg-[#1C1917]/95 backdrop-blur-md text-white rounded-2xl p-3 shadow-2xl border border-stone-800 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#9E4A0C] text-white flex items-center justify-center shrink-0">
              <Volume2 size={16} className={isPlaying ? 'animate-pulse' : ''} />
            </div>
            <div className="min-w-0">
              <div className="font-heading font-bold text-xs text-white truncate">
                {currentTrack.title}
              </div>
              <div className="text-[10px] text-stone-300 truncate">
                {currentTrack.spotName} • {currentTrack.language.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-[#9E4A0C] text-white flex items-center justify-center hover:bg-[#853E0A] transition-colors"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
            </button>
            <button
              onClick={stopTrack}
              className="p-1 rounded-full text-stone-400 hover:text-white transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Progress Bar & Timer */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-stone-400">
          <span>{formatTime(progressSeconds)}</span>
          <div className="flex-1 h-1.5 rounded-full bg-stone-700 overflow-hidden">
            <div
              className="h-full bg-[#9E4A0C] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span>{formatTime(currentTrack.durationSeconds)}</span>
        </div>
      </div>
    </div>
  );
};
