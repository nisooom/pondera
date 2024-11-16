import { useState } from "react";
import "./App.css";
import { saveEntry, getAllEntries, clearAllEntries } from "@/utils/backend";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PonderaIcon } from "@/components/pondera-icon";
import { X } from "lucide-react";
import { Flame } from "lucide-react";
import { Home } from "lucide-react";
import { ChartNoAxesCombined } from "lucide-react";
import { Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
    <div className="px-3 py-2">
      <div className="flex justify-between">
        <PonderaIcon />
        <div className="flex gap-1 items-center">
          <Tooltip>
            <TooltipTrigger>
            <div className="bg-secondary rounded-sm p-1 flex text-primary font-bold text-sm h-min">
              23
              <Flame className="fill-primary" size={20} />
            </div>
            </TooltipTrigger>
            <TooltipContent>
              Continue your streak pls
            </TooltipContent>
          </Tooltip>
          <div className="bg-secondary rounded-sm p-1 text-primary font-bold text-sm h-min">
            <X size={20} />
          </div>
        </div>
      </div>
      <Tabs defaultValue="home" className="py-3">
        <TabsList className="w-full h-8 rounded-3xl">
          <TabsTrigger className="data-[state=active]:h-6 data-[state=active]:rounded-3xl data-[state=active]:bg-primary data-[state=active]:text-background basis-1/3 text-sm" value="home">
            <Home size={16} />
            Home
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:h-6 data-[state=active]:rounded-3xl data-[state=active]:bg-primary data-[state=active]:text-background  basis-1/3" value="overview">
            <ChartNoAxesCombined size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger className="data-[state=active]:h-6 data-[state=active]:rounded-3xl data-[state=active]:bg-primary data-[state=active]:text-background  basis-1/3" value="settings">
            <Settings size={16} />
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="home">
          home page
        </TabsContent>
        <TabsContent value="overview">
          overview page
        </TabsContent>
        <TabsContent value="settings">
          settings page
        </TabsContent>
      </Tabs>
    </div>
  );

  // return (
  //   <div className="App">
  //     <Tabs defaultValue="home" className="w-full">
  //       <TabsList>
  //         <TabsTrigger value="home">Home</TabsTrigger>
  //         <TabsTrigger value="report">Report</TabsTrigger>
  //         <TabsTrigger value="misc">Misc</TabsTrigger>
  //       </TabsList>
  //       <TabsContent value="home">
  //         <div className="text-lg">HOME TAB (not implemented)</div>
  //       </TabsContent>
  //       <TabsContent value="report">
  //         <div className="text-lg">REPORT TAB (not implemented)</div>
  //       </TabsContent>
  //       <TabsContent value="misc">
  //         <div className="flex flex-col gap-2">
  //           <Button
  //             onClick={() => alert('not implemented yet')}
  //             variant="outline"
  //             className="rounded-md hover:border-[#646cff] border-[1px] px-4 py-2 font-semibold transition duration-300"
  //           >
  //             Theme Selector
  //           </Button>
  //           <Button
  //             onClick={clearJournalHandler}
  //             variant="outline"
  //             className="rounded-md hover:border-[#646cff] border-[1px] px-4 py-2 font-semibold transition duration-300"
  //           >
  //             Clear Journal
  //           </Button>
  //         </div>
  //       </TabsContent>
  //     </Tabs>

  //     <div className="w-full text-red-900 font-bold text-xl pt-5">
  //       EVERYTHING BELOW SHOULD BE REMOVED
  //     </div>

  //     {/* Journal Input Section */}
  //     <div style={{ marginBottom: "10px", width: "100%", maxWidth: "400px" }}>
  //       <textarea
  //         value={curEntry}
  //         onChange={(e) => setCurEntry(e.target.value)}
  //         placeholder="Write your journal entry..."
  //         style={{
  //           width: "100%",
  //           minHeight: "100px",
  //           margin: "10px 0",
  //           padding: "10px",
  //           backgroundColor: "#282c34",
  //           color: "white",
  //           border: "1px solid #61dafb",
  //         }}
  //       />
  //     </div>

  //     {/* Buttons Section */}
  //     <div className="flex flex-col gap-2">
  //       <Button variant="outline" onClick={saveEntryHandler}>Save Entry</Button>
  //       <Button variant="outline" onClick={clearJournalHandler}>Clear Journal</Button>
  //       <Button variant="outline" onClick={logAllEntries}>console.log(allEntries)</Button>
  //     </div>

  //     {/* Display Messages */}
  //     {errorMessage && (
  //       <div style={{ color: "red", marginTop: "20px" }}>
  //         {errorMessage}
  //       </div>
  //     )}
  //     {successMessage && (
  //       <div style={{ color: "green", marginTop: "20px" }}>
  //         {successMessage}
  //       </div>
  //     )}
  //   </div>
  // );
}
