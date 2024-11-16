import { Button } from "./ui/button";
import { PenTool } from "lucide-react";
import MoodHeatmap from "./heatmap";
export const HomeTabContent = ({
  curEntry,
  setCurEntry,
  allEntries,
  setAllEntries,
  errorMessage,
  setErrorMessage,
  successMessage,
  setSuccessMessage,
}) => {
  const [writerWindow, setWriterWindow] = useState(null);

  useEffect(() => {
    return () => {
      if (writerWindow && !writerWindow.closed) {
        writerWindow.close();
      }
    };
  }, []);
  const openWritingTab = () => {
    if (writerWindow && !writerWindow.closed) {
      writerWindow.focus();
      return;
    }

    const writeURL = chrome.runtime.getURL("popup.html#/write");
    const newWindow = window.open(
      writeURL,
      "JournalWriter",
      "width=600,height=800,left=50,top=50",
    );

    if (!newWindow) {
      alert("Please allow popups for this site to open the writing tab.");
      return;
    }

    setWriterWindow(newWindow);
  };
  return (
    <div className="flex flex-col gap-1 bg-red-300/0 px-4 py-2">
      <div className="pb-2 font-bold">
        {curEntry
          ? "You have written something"
          : "You haven't written anything yet"}
      </div>
      <Button
        className="flex h-8 w-fit justify-start gap-1 rounded-sm bg-accent text-right text-sm opacity-100 hover:bg-secondary"
        onClick={openWritingTab}
      >
        <PenTool size={16} className="mr-2" />
        {curEntry ? "Start editing" : "Start writing"}
      </Button>
      <MoodHeatmap />
    </div>
  );
};
