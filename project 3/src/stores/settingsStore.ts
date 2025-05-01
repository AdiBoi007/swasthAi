import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'english' | 'hindi' | 'punjabi' | 'tamil';
export type UserMode = 'patient' | 'doctor';
export type Theme = 'light' | 'dark';

interface SettingsState {
  language: Language;
  userMode: UserMode;
  theme: Theme;
  isOfflineMode: boolean;
  setLanguage: (language: Language) => void;
  setUserMode: (mode: UserMode) => void;
  toggleTheme: () => void;
  toggleOfflineMode: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'english',
      userMode: 'patient',
      theme: 'light',
      isOfflineMode: false,
      
      setLanguage: (language) => set({ language }),
      setUserMode: (userMode) => set({ userMode }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      toggleOfflineMode: () => set((state) => ({ 
        isOfflineMode: !state.isOfflineMode 
      })),
    }),
    {
      name: 'settings-storage',
    }
  )
);