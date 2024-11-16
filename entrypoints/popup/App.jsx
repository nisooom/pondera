import { useState } from "react";
import "./App.css";
import { saveEntry, getAllEntries, clearAllEntries } from "@/utils/backend";

export default function App() {
  const [curEntry, setCurEntry] = useState("");
  const [allEntries, setAllEntries] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // first load all entries
  // then try to load the current date's entry
  useEffect(() => {
    getAllEntries().then((entries) => {
      setAllEntries(entries);
      const date = new Date().toISOString().split('T')[0];
      const entry = entries[date];
      if (entry) {
        setCurEntry(entry.entry);
      }
    })
  }, [])

  const saveEntryHandler = async () => {
    if (!curEntry.trim()) {
      setSuccessMessage("");
      setErrorMessage("have something plz");
      return;
    }

    const date = new Date().toISOString().split('T')[0];
    const saved = await saveEntry(curEntry, date);
    if (saved !== null) {
      // optimistic updates
      setAllEntries((prev) => ({
        ...prev,
        [date]: saved,
      }))

      // NOTE: it doesnt make sense to clear the input box after saving
      // since they might edit it again
      // setCurEntry("");
      setSuccessMessage("Entry saved successfully");
      setErrorMessage("");
    } else {
      setSuccessMessage("");
      setErrorMessage("Failed to save entry");
    }
  };

  const clearJournalHandler = async () => {
    try {
      await clearAllEntries();
      setCurEntry("");
      setAllEntries({});
      setSuccessMessage("Journal cleared successfully!");
      setErrorMessage("");
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage("Failed to clear journal.");
    }
  };

  const logAllEntries = () => {
    console.log(allEntries);
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Journal Input Section */}
        <div style={{ marginBottom: "10px", width: "100%", maxWidth: "400px" }}>
          <textarea
            value={curEntry}
            onChange={(e) => setCurEntry(e.target.value)}
            placeholder="Write your journal entry..."
            style={{
              width: "100%",
              minHeight: "100px",
              margin: "10px 0",
              padding: "10px",
              backgroundColor: "#282c34",
              color: "white",
              border: "1px solid #61dafb",
            }}
          />
        </div>

        {/* Buttons Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button onClick={saveEntryHandler}>Save Entry</button>
          <button onClick={clearJournalHandler}>Clear Journal</button>
          <button onClick={logAllEntries}>console.log(allEntries)</button>
        </div>

        {/* Display Messages */}
        {errorMessage && (
          <div style={{ color: "red", marginTop: "20px" }}>
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div style={{ color: "green", marginTop: "20px" }}>
            {successMessage}
          </div>
        )}
      </header>
    </div>
  );
}
