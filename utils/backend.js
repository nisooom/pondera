
import { storage } from 'wxt/storage';


// Define storage keys using defineItem for better management
const journalEntries = storage.defineItem('local:journal_entries', {
  fallback: {},
});


export const saveEntry = async (entry, date) => {
  // TODO: Get tags and mood from ai
  const tags = [];
  const mood = "";

  try {
    const entries = await journalEntries.getValue();
    entries[date] = {
      entry,
      tags,
      mood,
    }
    await journalEntries.setValue(entries);
    console.log('Sucessfully save entry:', entries[date])
    return entries[date];
  } catch (error) {
    console.error('Failed to save entry:', error)
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
  } catch (error) {
    console.error('Failed to clear entries:', error);
  }
}
