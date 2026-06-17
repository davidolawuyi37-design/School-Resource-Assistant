import { create } from "zustand";

type PreferencesState = {
  compactMode: boolean;
  voiceEnabled: boolean;
  setCompactMode: (value: boolean) => void;
  setVoiceEnabled: (value: boolean) => void;
};

export const usePreferencesStore = create<PreferencesState>((set) => ({
  compactMode: false,
  voiceEnabled: false,
  setCompactMode: (compactMode) => set({ compactMode }),
  setVoiceEnabled: (voiceEnabled) => set({ voiceEnabled })
}));
