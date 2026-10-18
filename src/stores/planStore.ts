import { create } from 'zustand';
import type { PlanInput, PlanOutput } from '@/domain/planner/planner';

interface PlanStoreState {
  input: PlanInput;
  result: PlanOutput | null;
  isGenerating: boolean;

  setInput: (input: Partial<PlanInput>) => void;
  setResult: (result: PlanOutput) => void;
  setGenerating: (generating: boolean) => void;
  reset: () => void;
}

const defaultInput: PlanInput = {
  startNode: 'node_jammu_tawi_station',
  arrivalTime: '06:10',
  departureNode: 'node_bus_stand',
  departureTime: '14:00',
  departureMode: 'bus',
  preferences: ['heritage', 'religious', 'riverfront'],
  mobility: 'walk_ok',
  groupFlags: [],
  luggage: 'carrying',
};

export const usePlanStore = create<PlanStoreState>((set) => ({
  input: defaultInput,
  result: null,
  isGenerating: false,

  setInput: (partial) =>
    set((state) => ({ input: { ...state.input, ...partial } })),
  setResult: (result) => set({ result, isGenerating: false }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  reset: () => set({ input: defaultInput, result: null, isGenerating: false }),
}));
