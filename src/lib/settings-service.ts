
'use client';

const SETTINGS_STORAGE_KEY = 'leadpilot-settings';

export type SmtpSettings = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
};

export type AppSettings = {
  smtp?: SmtpSettings;
};

export function getSettings(): AppSettings {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading settings from localStorage:', error);
  }
  return {};
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const currentSettings = getSettings();
    const newSettings = { ...currentSettings, ...settings };
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
}
