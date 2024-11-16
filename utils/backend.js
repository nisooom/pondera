import { storage } from 'wxt/storage';

// Define storage keys using defineItem for better management
const journalEntries = storage.defineItem('local:journal_entries', {
  fallback: {},
});

const moodTracker = storage.defineItem('local:mood_tracker', {
  fallback: {},
});

// Journal functions using WXT storage directly
export const journalStorage = {
  // Save entry for current day
  async saveEntry(text, mood, tags = []) {
    const date = new Date().toISOString().split('T')[0];

    try {
      // Get existing entries
      const entries = await journalEntries.getValue();

      // Add new entry
      entries[date] = {
        text,
        mood,
        tags,
        timestamp: Date.now(),
      };

      // Save back to storage
      await journalEntries.setValue(entries);
    } catch (error) {
      console.error('Failed to save entry:', error);
    }
  },

  // Get entry for specific date
  async getEntry(date) {
    try {
      const entries = await journalEntries.getValue();
      return entries[date] || null;
    } catch (error) {
      console.error('Failed to get entry:', error);
      return null;
    }
  },

  // Get all entries
  async getAllEntries() {
    try {
      return await journalEntries.getValue();
    } catch (error) {
      console.error('Failed to get all entries:', error);
      return {};
    }
  },

  // Watch for changes in journal entries
  watchEntries(callback) {
    return journalEntries.watch(callback);
  },

  // Clear all journal data
  async clearJournal() {
    try {
      await journalEntries.removeValue();
    } catch (error) {
      console.error('Failed to clear journal:', error);
    }
  },

  // Take a snapshot of journal data
  async createBackup() {
    try {
      return await storage.snapshot({ area: 'local' });
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  },

  // Restore from snapshot
  async restoreBackup(snapshot) {
    if (!snapshot) {
      console.warn('No snapshot to restore from.');
      return;
    }
    
    try {
      await storage.restore(snapshot);
    } catch (error) {
      console.error('Failed to restore backup:', error);
    }
  },
};