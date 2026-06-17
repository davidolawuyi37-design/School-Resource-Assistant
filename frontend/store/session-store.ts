import { create } from "zustand";

type SessionState = {
  activeSessionId?: string;
  masteryScore: number;
  setActiveSessionId: (id?: string) => void;
  setMasteryScore: (score: number) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  activeSessionId: undefined,
  masteryScore: 0,
  setActiveSessionId: (activeSessionId) => set({ activeSessionId }),
  setMasteryScore: (masteryScore) => set({ masteryScore })
}));
