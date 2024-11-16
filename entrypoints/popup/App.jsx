import { useState } from "react";
import reactLogo from "@/assets/react.svg";
import wxtLogo from "/wxt.svg";
import "./App.css";
import { journalStorage } from "@/utils/backend";

function App() {
  const [count, setCount] = useState(0);
  const [entries, setEntries] = useState({});
  const [inputText, setInputText] = useState("");
  const [selectedMood, setSelectedMood] = useState("happy");
  const [tags, setTags] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [fetchedEntry, setFetchedEntry] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSaveEntry = async () => {
    if (!inputText.trim()) return;

    const tagArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    try {
      await journalStorage.saveEntry(inputText, selectedMood, tagArray);
      // Update entries state
      setEntries((prev) => ({
        ...prev,
        [new Date().toISOString().split("T")[0]]: {
          text: inputText,
          mood: selectedMood,
          tags: tagArray,
        },
      }));
      setInputText("");
      setTags("");
      setSuccessMessage("Entry saved successfully!");
      setErrorMessage(""); // Clear any previous error messages
    } catch (error) {
      console.error("Error saving entry:", error);
      setErrorMessage("Failed to save entry.");
    }
  };

  const handleFetchEntry = async () => {
    if (!selectedDate) return;

    try {
      const entry = await journalStorage.getEntry(selectedDate);
      if (entry) {
        setFetchedEntry(entry);
        setErrorMessage(""); // Clear any previous error messages
      } else {
        setFetchedEntry(null);
        setErrorMessage("No entry found for this date.");
      }
    } catch (error) {
      console.error("Error fetching entry:", error);
      setErrorMessage("Failed to fetch entry.");
    }
  };

  const handleGetAllEntries = async () => {
    try {
      const allEntries = await journalStorage.getAllEntries();
      setEntries(allEntries);
      setSuccessMessage(""); // Clear any previous success messages
    } catch (error) {
      console.error("Error fetching all entries:", error);
      setErrorMessage("Failed to fetch all entries.");
    }
  };

  const handleClearJournal = async () => {
    try {
      await journalStorage.clearJournal();
      setEntries({});
      setFetchedEntry(null);
      setSuccessMessage("Journal cleared successfully!");
    } catch (error) {
      console.error("Error clearing journal:", error);
      setErrorMessage("Failed to clear journal.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Journal Input Section */}
        <div style={{ marginBottom: "20px", width: "100%", maxWidth: "400px" }}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
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

          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            style={{
              margin: "10px",
              padding: "5px",
              backgroundColor: "#282c34",
              color: "white",
              border: "1px solid #61dafb",
            }}
          >
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="neutral">Neutral</option>
            <option value="excited">Excited</option>
          </select>

          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma-separated)"
            style={{
              margin: "10px",
              padding: "5px",
              backgroundColor: "#282c34",
              color: "white",
              border: "1px solid #61dafb",
            }}
          />
        </div>

        {/* Buttons Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button onClick={() => setCount((prev) => prev + 1)}>
            Increase Count ({count})
          </button>
          <button onClick={handleSaveEntry}>Save Entry</button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              margin: "10px",
              padding: "5px",
              backgroundColor: "#282c34",
              color: "white",
              border: "1px solid #61dafb",
            }}
          />

          <button onClick={handleFetchEntry}>Fetch Entry</button>

          <button onClick={handleGetAllEntries}>Get All Entries</button>

          <button onClick={handleClearJournal}>Clear Journal</button>
        </div>

        {/* Display Messages */}
        {errorMessage && (
          <div style={{ color: "red", marginTop: "20px" }}>{errorMessage}</div>
        )}
        {successMessage && (
          <div style={{ color: "green", marginTop: "20px" }}>
            {successMessage}
          </div>
        )}

        {/* Display Fetched Entry */}
        {fetchedEntry && (
          <div style={{ margin: "20px", textAlign: "left" }}>
            <h3>Fetched Entry:</h3>
            <p>Text: {fetchedEntry.text}</p>
            <p>Mood: {fetchedEntry.mood}</p>
            <p>Tags: {fetchedEntry.tags.join(", ")}</p>
          </div>
        )}

        {/* Display All Entries */}
        {Object.keys(entries).length > 0 && (
          <div
            style={{
              margin: "20px",
              textAlign: "left",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <h3>All Entries:</h3>
            {JSON.stringify(entries, null, 2)}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
