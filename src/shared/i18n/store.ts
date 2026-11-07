'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppLocale = 'uk' | 'en';
export type NoteNamingMode = 'letter' | 'dual';

interface LocaleState {
  locale: AppLocale;
  noteNaming: NoteNamingMode;
  setLocale: (locale: AppLocale) => void;
  setNoteNaming: (mode: NoteNamingMode) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'uk',
      noteNaming: 'letter',
      setLocale: (locale) => set({ locale }),
      setNoteNaming: (noteNaming) => set({ noteNaming }),
    }),
    {
      name: 'rifflore-locale-v1',
    }
  )
);
