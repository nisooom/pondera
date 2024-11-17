import { Button } from "./ui/button";
import { PenTool } from "lucide-react";
import MoodHeatmap from "./heatmap";
import { getAiQuote } from "@/utils/chrome-ai";

export const HomeTabContent = ({
  curEntry,
  coloredHeatmap,
  setCurEntry,
  allEntries,
  setAllEntries,
}) => {
  const [writerWindow, setWriterWindow] = useState(null);
  const [aiQuote, setAiQuote] = useState(
    "“Love All, trust a few, do wrong to None”",
  );

  useEffect(() => {
    getAiQuote().then((quote) => {
      setAiQuote(quote);
    });
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
    <div className="flex flex-col gap-4 bg-red-300/0 px-4 py-2">
      <section className="flex w-full flex-col gap-1">
        <div className="pb-2 font-bold">
          {curEntry
            ? "Edit today's Journal Entry"
            : "You haven't written anything yet"}
        </div>
        <Button
          className="flex h-8 w-fit justify-start gap-1 rounded-sm bg-accent text-right text-sm opacity-100 hover:bg-secondary"
          onClick={openWritingTab}
        >
          <PenTool size={16} className="mr-2" />
          {curEntry ? "Start editing" : "Start writing"}
        </Button>
      </section>

      <MoodHeatmap coloredHeatmap={coloredHeatmap} allEntries={allEntries} />
      <div className="w-full rounded-md bg-secondary p-3">
        <span className="text-sm font-semibold text-foreground">{aiQuote}</span>
      </div>
    </div>
  );
};
