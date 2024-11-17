
import { storage } from 'wxt/storage';


// Define storage keys using defineItem for better management
const journalEntries = storage.defineItem('local:journal_entries', {
  fallback: {},
});


export const saveTodayEntry = async (entry) => {
  const date = new Date().toISOString().split('T')[0];
  // TODO: Get tags and mood from ai
  const tags = [];
  const mood = "";

  try {
    const allEntries = await journalEntries.getValue();
    allEntries[date] = {
      entry,
      tags,
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
