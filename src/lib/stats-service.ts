
'use client';

const STATS_STORAGE_KEY = 'leadpilot-stats';

export type AppStats = {
  messagesSent: number;
};

function getStoredStats(): AppStats {
  if (typeof window === 'undefined') {
    return { messagesSent: 0 };
  }
  try {
    const stored = window.localStorage.getItem(STATS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading stats from localStorage:', error);
  }
  // If nothing is stored, initialize with default stats
  const defaultStats: AppStats = { messagesSent: 0 };
  try {
    window.localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(defaultStats));
  } catch (error) {
    console.error('Error saving initial stats to localStorage:', error);
  }
  return defaultStats;
}

function saveStats(stats: AppStats): void {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch (error) {
        console.error('Error saving stats to localStorage:', error);
    }
}


export function getStats(): AppStats {
  return getStoredStats();
}

export function incrementMessagesSent(): void {
  const currentStats = getStoredStats();
  const newStats = { ...currentStats, messagesSent: (currentStats.messagesSent || 0) + 1 };
  saveStats(newStats);
}

export function resetStats(): void {
    const defaultStats: AppStats = { messagesSent: 0 };
    saveStats(defaultStats);
}
