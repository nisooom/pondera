import { useState } from "react";
import "./App.css";
import {
  getAllEntries,
  clearAllEntries,
  getUserPreferences,
} from "@/utils/backend";
import { PonderaIcon } from "@/components/pondera-icon";
import { X, Flame, Home, ChartNoAxesCombined, Settings } from "lucide-react";
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
import { Logs } from "lucide-react";
import { subDays } from "date-fns";
import { generateAiSummaryForDates } from "@/utils/chrome-ai";

export default function App() {
  const [curEntry, setCurEntry] = useState("");
  const [allEntries, setAllEntries] = useState(null);
  const [coloredHeatmap, setColoredHeatmap] = useState(true);
  const [allSectionsMandatory, setAllSectionsMandatory] = useState(false);
  const [streak, setStreak] = useState(0);
  const [didToday, setDidToday] = useState(false);
  const [aiCachedSummary, setAiCachedSummary] = useState(null);
  const [theme, setTheme] = useState("default");

  const fetchWeeklySummary = async () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString().split("T")[0]);
    }
    const summary = await generateAiSummaryForDates(dates);

    setAiCachedSummary(summary);
    console.log("AI: ", aiCachedSummary);
  };

  // first load all entries
  // then try to load the current date's entry
  const init = () => {
    getAllEntries().then((entries) => {
      setAllEntries(entries);
      const date = new Date().toISOString().split("T")[0];
      const entry = entries[date];

      let streakCounter = 0;
      if (entry) {
        setCurEntry(entry.entry);
        setDidToday(true);
        streakCounter += 1;
      } else {
        setDidToday(false);
      }

      let curDate = new Date();
      while (true) {
        curDate = subDays(curDate, 1);
        if (entries[curDate.toLocaleDateString().split("T")[0]]) {
          streakCounter += 1;
        } else {
          break;
        }
      }

      setStreak(streakCounter);
    });
  };

  journalEntries.watch(init);

  useEffect(() => {
    init();
    getUserPreferences().then((preferences) => {
      setTheme(preferences.theme ?? "default");
      setColoredHeatmap(preferences.coloredHeatmap ?? true);
      setAllSectionsMandatory(preferences.allSectionsMandatory ?? false);
    });

    fetchWeeklySummary();
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!allEntries) {
      return;
    }
    const dateStr = new Date().toISOString().split("T")[0];
    if (allEntries[dateStr]) {
      if (!didToday) {
        setStreak(streak + 1);
      }
      setDidToday(true);
    }
  }, [allEntries]);

  const clearJournalHandler = async () => {
    await clearAllEntries();
    setCurEntry("");
    setAllEntries({});
  };

  const logAllEntries = () => {
    console.log(allEntries);
  };

  return (
    <div className="px-3 py-2">
      <div className="flex justify-between">
        <PonderaIcon />
        <div className="flex items-center gap-1">
          {/* <Button variant="destructive" size="icon" onClick={logAllEntries}>
            <Logs />
          </Button> */}
          <Tooltip>
            <TooltipTrigger>
              <div className="flex h-min rounded-sm bg-secondary p-1 text-sm font-bold text-foreground">
                {streak}
                {didToday ? (
                  <Flame className="fill-foreground" size={20} />
                ) : (
                  <Flame className="fill-secondary" size={20} />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>Continue your streak pls</TooltipContent>
          </Tooltip>
          <div className="h-min cursor-pointer rounded-sm bg-secondary p-1 text-sm font-bold text-primary">
            <X size={20} onClick={() => window.close()} />
          </div>
        </div>
      </div>
      <Tabs defaultValue="home" className="pb-4 pt-3">
        <TabsList className="h-8 w-full rounded-3xl bg-secondary">
          <TabsTrigger
            className="flex basis-1/3 gap-2 font-bold text-foreground data-[state=active]:h-6 data-[state=active]:rounded-3xl data-[state=active]:bg-foreground data-[state=active]:text-background"
            value="home"
          >
            <Home size={16} />
            Home
          </TabsTrigger>
          <TabsTrigger
            className="flex basis-1/3 gap-2 font-bold text-foreground data-[state=active]:h-6 data-[state=active]:rounded-3xl data-[state=active]:bg-foreground data-[state=active]:text-background"
            value="overview"
          >
            <ChartNoAxesCombined size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger
            className="flex basis-1/3 gap-2 font-bold text-foreground data-[state=active]:h-6 data-[state=active]:rounded-3xl data-[state=active]:bg-foreground data-[state=active]:text-background"
            value="settings"
          >
            <Settings size={16} />
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="home">
          <HomeTabContent
            coloredHeatmap={coloredHeatmap}
            curEntry={curEntry}
            setCurEntry={setCurEntry}
            allEntries={allEntries}
            setAllEntries={setAllEntries}
          />
        </TabsContent>
        <TabsContent value="overview">
          <OverviewTabContent aiCachedSummary={aiCachedSummary} />
        </TabsContent>
        <TabsContent value="settings">
          <SettingTabContent
            activeTheme={theme}
            setActiveTheme={setTheme}
            coloredHeatmap={coloredHeatmap}
            setColoredHeatmap={setColoredHeatmap}
            allSectionsMandatory={allSectionsMandatory}
            setAllSectionsMandatory={setAllSectionsMandatory}
            clearJournalFunc={clearJournalHandler}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
