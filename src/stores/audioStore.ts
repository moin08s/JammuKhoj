import { create } from 'zustand';

export interface AudioTrack {
  id: string;
  title: string;
  spotName: string;
  durationSeconds: number;
  language: 'dogri' | 'hindi' | 'english';
  transcriptText?: string;
  heroImage?: string;
}

interface AudioStoreState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  progressSeconds: number;
  playbackRate: number;
  isNarratingViaTts: boolean;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  stopTrack: () => void;
  setProgress: (sec: number) => void;
  togglePlay: () => void;
  setPlaybackRate: (rate: number) => void;
}

// Global reference for Web Speech API Utterance
let activeUtterance: SpeechSynthesisUtterance | null = null;

const stopTts = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      activeUtterance = null;
    } catch {
      // Ignore
    }
  }
};

const speakTranscript = (track: AudioTrack, rate: number, onEnd: () => void) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !track.transcriptText) {
    return false;
  }
  try {
    stopTts();
    const utterance = new SpeechSynthesisUtterance(track.transcriptText);
    utterance.rate = rate;
    
    // Choose appropriate voice language
    if (track.language === 'hindi' || track.language === 'dogri') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.onend = () => {
      onEnd();
    };
    utterance.onerror = () => {
      onEnd();
    };

    activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
};

export const useAudioStore = create<AudioStoreState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  progressSeconds: 0,
  playbackRate: 1.0,
  isNarratingViaTts: false,

  playTrack: (track) => {
    stopTts();
    const rate = get().playbackRate;
    const hasTts = speakTranscript(track, rate, () => {
      set({ isPlaying: false, progressSeconds: track.durationSeconds });
    });

    set({
      currentTrack: track,
      isPlaying: true,
      progressSeconds: 0,
      isNarratingViaTts: hasTts,
    });
  },

  pauseTrack: () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.pause();
      } catch {}
    }
    set({ isPlaying: false });
  },

  resumeTrack: () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else if (get().currentTrack) {
          const track = get().currentTrack!;
          speakTranscript(track, get().playbackRate, () => {
            set({ isPlaying: false, progressSeconds: track.durationSeconds });
          });
        }
      } catch {}
    }
    set({ isPlaying: true });
  },

  stopTrack: () => {
    stopTts();
    set({ currentTrack: null, isPlaying: false, progressSeconds: 0, isNarratingViaTts: false });
  },

  setProgress: (sec) => set({ progressSeconds: sec }),

  togglePlay: () => {
    const isPlaying = get().isPlaying;
    if (isPlaying) {
      get().pauseTrack();
    } else {
      get().resumeTrack();
    }
  },

  setPlaybackRate: (rate) => {
    set({ playbackRate: rate });
    const currentTrack = get().currentTrack;
    if (currentTrack && get().isPlaying) {
      speakTranscript(currentTrack, rate, () => {
        set({ isPlaying: false, progressSeconds: currentTrack.durationSeconds });
      });
    }
  },
}));
