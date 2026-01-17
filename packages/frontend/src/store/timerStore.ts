import { create } from 'zustand';

interface TimerState {
  isRunning: boolean;
  elapsedSeconds: number;
  intervalId: number | null;

  // Actions
  start: () => void;
  pause: () => void;
  reset: () => void;
  getElapsed: () => number;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  isRunning: false,
  elapsedSeconds: 0,
  intervalId: null,

  start: () => {
    const { intervalId } = get();
    if (intervalId !== null) return; // Already running

    const id = window.setInterval(() => {
      set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 }));
    }, 1000);

    set({ isRunning: true, intervalId: id });
  },

  pause: () => {
    const { intervalId } = get();
    if (intervalId !== null) {
      clearInterval(intervalId);
      set({ isRunning: false, intervalId: null });
    }
  },

  reset: () => {
    const { intervalId } = get();
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    set({ isRunning: false, elapsedSeconds: 0, intervalId: null });
  },

  getElapsed: () => get().elapsedSeconds,
}));
