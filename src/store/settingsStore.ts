import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'fr' | 'fa' | 'ur';
export type Currency = 'EUR' | 'USD' | 'GBP' | 'INR' | 'CNY' | 'IRR';

interface SettingsState {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (cur: Currency) => void;
  exchangeRates: Record<Currency, number>; // Base: EUR
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      currency: 'EUR',
      exchangeRates: {
        EUR: 1,
        USD: 1.08,
        GBP: 0.85,
        INR: 90.50,
        CNY: 7.85,
        IRR: 45000,
      },
      setLanguage: (language) => {
        set({ language });
        if (typeof document !== 'undefined') {
          document.documentElement.lang = language;
          document.documentElement.dir = (language === 'fa' || language === 'ur') ? 'rtl' : 'ltr';
        }
      },
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'augeo-settings',
    }
  )
);
