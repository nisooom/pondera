
import { storage } from 'wxt/storage';
import { getAiMood } from './chrome-ai';

// Define storage keys using defineItem for better management
const journalEntries = storage.defineItem('local:journal_entries', {
  fallback: {},
});

const userPreferences = storage.defineItem('local:user_preferences', {
  fallback: {},
});

// User Preferences
// {
//   theme: 'light',
//   heatmapColor: 'red',
//   allItemsRequired: false,
// }

export const saveUserPreferences = async ({key, value}) => {
  try {
    let pref = await getUserPreferences();
    pref[key] = value;
    await userPreferences.setValue(pref);
    console.log('Sucessfully saved preferences:', preferences);
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
}

export const getUserPreferences = async () => {
  try {
    return await userPreferences.getValue();
  } catch (error) {
    console.error('Failed to get preferences:', error);
    return {};
  }
}


export const saveTodayEntry = async (entry) => {
  const date = new Date().toISOString().split('T')[0];
  // TODO: Get mood from ai
  const mood = await getAiMood(entry);

  try {
    const allEntries = await journalEntries.getValue();
    allEntries[date] = {
      entry,
      mood,
    }
    await journalEntries.setValue(allEntries);
    console.log('Sucessfully saved entry:', allEntries[date]);
    return allEntries[date];
  } catch (error) {
    console.error('Failed to save entry:', error);
    return null;
  }
}


export const getTodayEntry = async () => {
  const date = new Date().toISOString().split('T')[0];
  try {
    const allEntries = await journalEntries.getValue();
    console.log('Sucessfully get entry:', allEntries[date] ?? null);
    return allEntries[date] ?? null;
  } catch (error) {
    console.error('Failed to get entry:', error);
    return null;
  }
}

export const getEntryByDate = async (date) => {
  try {
    const allEntries = await journalEntries.getValue();
    console.log('Sucessfully get entry:', allEntries[date] ?? null);
    return allEntries[date] ?? null;
  } catch (error) {
    console.error('Failed to get entry:', error);
    return null;
  }
}

export const getAllEntries = async () => {
  try {
    return await journalEntries.getValue();
  } catch (error) {
    console.error('Failed to get entries:', error);
    return {};
  }
}


export const clearAllEntries = async () => {
  try {
    await journalEntries.setValue({});
    console.log("Cleared all the entries");
  } catch (error) {
    console.error('Failed to clear entries:', error);
  }
}
