import { create } from 'zustand';

export interface AudioTrack {
  id: string;
  title: string;
  spotName: string;
  durationSeconds: number;
  language: 'dogri' | 'hindi' | 'english';
}

interface AudioStoreState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  progressSeconds: number;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  stopTrack: () => void;
  setProgress: (sec: number) => void;
  togglePlay: () => void;
}

export const useAudioStore = create<AudioStoreState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  progressSeconds: 0,

  playTrack: (track) => set({ currentTrack: track, isPlaying: true, progressSeconds: 0 }),
  pauseTrack: () => set({ isPlaying: false }),
  resumeTrack: () => set({ isPlaying: true }),
  stopTrack: () => set({ currentTrack: null, isPlaying: false, progressSeconds: 0 }),
  setProgress: (sec) => set({ progressSeconds: sec }),
  togglePlay: () => set({ isPlaying: !get().isPlaying }),
}));
