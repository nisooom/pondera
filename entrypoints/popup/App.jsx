import { useState, useEffect } from "react";
import React from "react";
import { saveEntry, getAllEntries, clearAllEntries } from "@/utils/backend";
import { PonderaIcon } from "@/components/pondera-icon";
import {
  X,
  Flame,
  Home,
  ChartNoAxesCombined,
  Settings,
  PenTool,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HomeTabContent } from "@/components/home-tab-content";
import { OverviewTabContent } from "@/components/overview-tab-content";
import { SettingTabContent } from "@/components/setting-tab-content";
import { Button } from "@/components/ui/button";

export default function App() {
  const [curEntry, setCurEntry] = useState("");
  const [allEntries, setAllEntries] = useState(null);
  const [coloredHeatmap, setColoredHeatmap] = useState(true);
  const [allSectionsMandatory, setAllSectionsMandatory] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [writerWindow, setWriterWindow] = useState(null);

  useEffect(() => {
    getAllEntries().then((entries) => {
      setAllEntries(entries);
      const date = new Date().toISOString().split("T")[0];
      const entry = entries[date];
      if (entry) {
        setCurEntry(entry.entry);
      }
    });

    // Clean up any existing writer window reference when main window closes
    return () => {
      if (writerWindow && !writerWindow.closed) {
        writerWindow.close();
      }
    };
  }, []);

  // Listen for messages from writer window
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "ENTRY_SAVED") {
        const { date, content } = event.data;
        setAllEntries((prev) => ({
          ...prev,
          [date]: { entry: content, date },
        }));
        setCurEntry(content);
        setSuccessMessage("Entry saved successfully");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="px-3 py-2">
      <div className="flex justify-between">
        <PonderaIcon />
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger>
              <div className="flex h-min rounded-sm bg-secondary p-1 text-sm font-bold text-primary">
                23
                <Flame className="fill-primary" size={20} />
              </div>
            </TooltipTrigger>
            <TooltipContent>Continue your streak pls</TooltipContent>
          </Tooltip>
          <div className="h-min cursor-pointer rounded-sm bg-secondary p-1 text-sm font-bold text-primary">
            <X size={20} onClick={() => window.close()} />
          </div>
        </div>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="pb-4 pt-3"
      >
        <TabsList className="h-8 w-full rounded-3xl">
      <Tabs defaultValue="home" className="pb-4 pt-3">
        <TabsList className="h-8 w-full rounded-3xl bg-secondary">
          <TabsTrigger
            className="basis-1/3 font-bold text-primary data-[state=active]:h-6 data-[state=active]:rounded-3xl data-[state=active]:bg-primary data-[state=active]:text-background"
            value="home"
          >
            <Home size={16} />
            Home
          </TabsTrigger>
          <TabsTrigger
            className="basis-1/3 font-bold text-primary data-[state=active]:h-6 data-[state=active]:rounded-3xl data-[state=active]:bg-primary data-[state=active]:text-background"
            value="overview"
          >
            <ChartNoAxesCombined size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger
            className="basis-1/3 font-bold text-primary data-[state=active]:h-6 data-[state=active]:rounded-3xl data-[state=active]:bg-primary data-[state=active]:text-background"
            value="settings"
          >
            <Settings size={16} />
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="home">
          <HomeTabContent
            curEntry={curEntry}
            setCurEntry={setCurEntry}
            allEntries={allEntries}
            setAllEntries={setAllEntries}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            successMessage={successMessage}
            setSuccessMessage={setSuccessMessage}
          />
        </TabsContent>
        <TabsContent value="overview">
          <OverviewTabContent
            curEntry={curEntry}
            setCurEntry={setCurEntry}
            allEntries={allEntries}
            setAllEntries={setAllEntries}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            successMessage={successMessage}
            setSuccessMessage={setSuccessMessage}
          />
        </TabsContent>
        <TabsContent value="settings">
          <SettingTabContent
            coloredHeatmap={coloredHeatmap} setColoredHeatmap={setColoredHeatmap}
            allSectionsMandatory={allSectionsMandatory} setAllSectionsMandatory={setAllSectionsMandatory}
            clearJournalFunc={clearJournalHandler}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
