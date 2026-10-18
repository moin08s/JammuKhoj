import React from 'react';
import { Play, Pause, X, Volume2, FastForward } from 'lucide-react';
import { useAudioStore } from '@/stores/audioStore';

export const GlobalAudioMiniPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    progressSeconds,
    playbackRate,
    setPlaybackRate,
    togglePlay,
    stopTrack,
  } = useAudioStore();

  if (!currentTrack) {
    return null;
  }

  const duration = currentTrack.durationSeconds || 180;
  const progressPercent = Math.min(100, Math.max(0, (progressSeconds / duration) * 100));

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCycleRate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rates = [1.0, 1.25, 1.5, 0.75];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  };

  return (
    <aside
      aria-label="Audio guide player"
      className="fixed bottom-[68px] sm:bottom-0 left-0 right-0 z-40 max-w-lg mx-auto px-3.5 pb-1 animate-in slide-in-from-bottom-3 duration-300 pointer-events-auto"
    >
      <div className="bg-[#103D32]/95 dark:bg-[#07241D]/95 text-white backdrop-blur-md rounded-2xl shadow-xl shadow-black/30 border border-emerald-500/30 overflow-hidden">
        {/* Progress scrub bar line */}
        <div className="w-full bg-emerald-950/60 h-1 relative">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="p-2.5 px-3 flex items-center justify-between gap-3">
          {/* Track metadata */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-forest-950 flex items-center justify-center shrink-0 shadow-sm shadow-amber-400/20">
              <Volume2 size={18} className={isPlaying ? 'animate-pulse' : ''} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded">
                  {currentTrack.language}
                </span>
                <span className="text-[10px] text-emerald-200/80">
                  {formatTime(progressSeconds)} / {formatTime(duration)}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white truncate leading-snug mt-0.5">
                {currentTrack.title}
              </h4>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Speed toggle */}
            <button
              onClick={handleCycleRate}
              className="text-[11px] font-bold px-2 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-amber-300 border border-amber-400/20 apple-press"
              title="Change playback speed"
            >
              {playbackRate}x
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-amber-400 hover:bg-amber-300 text-forest-950 flex items-center justify-center shadow-sm apple-press"
              aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            >
              {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" className="ml-0.5" />}
            </button>

            {/* Close track */}
            <button
              onClick={stopTrack}
              className="p-1.5 rounded-lg text-emerald-200/70 hover:text-white hover:bg-emerald-900/40 transition-colors apple-press"
              aria-label="Close audio player"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
