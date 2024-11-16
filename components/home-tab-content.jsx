import { Button } from "./ui/button";
import { PenTool } from "lucide-react";

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
    <div className="space-y-4">
      <div className="pb-2 font-bold">
        {curEntry
          ? "You have written something"
          : "You haven't written anything yet"}
      </div>
      <Button
        className="h-8 rounded-md bg-accent text-sm hover:bg-accent/90"
        onClick={openWritingTab}
      >
        <PenTool size={16} className="mr-2" />
        {curEntry ? "Start editing" : "Start writing"}
      </Button>
    </div>
  );
};
