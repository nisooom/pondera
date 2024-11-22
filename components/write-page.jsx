"use client";
import { PonderaIcon } from "./pondera-icon";
import { useState, useEffect } from "react";
import { getUserPreferences } from "@/utils/backend";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getTodayEntry, saveTodayEntry } from "@/utils/backend";

export default function WritePage() {
  const [allSectionsMandatory, setAllSectionsMandatory] = useState(false);
  const [activeTab, setActiveTab] = useState("journal");
  const [theme, setTheme] = useState("default");
  const [formData, setFormData] = useState({
    journal: "",
    grateful: ["", "", ""],
    goals: "",
  });

  useEffect(() => {
    getTodayEntry().then((entry) => {
      if (entry) {
        setFormData(entry.entry);
      }
    });
    getUserPreferences().then((preferences) => {
      setAllSectionsMandatory(preferences.allSectionsMandatory ?? false);
      setTheme(preferences.theme ?? "default");
    });
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);
  useEffect(() => {
    const tabTitles = {
      journal: "Journal Entry",
      grateful: "Gratitude List",
      goals: "Goals Setting",
    };

    document.title = `${tabTitles[activeTab]} - My Journal`;
  }, [activeTab]);

  const isTabCompleted = (tab) => {
    switch (tab) {
      case "journal":
        return formData.journal.trim().length > 0;
      case "grateful":
        return formData.grateful.some((item) => item.trim().length > 0);
      case "goals":
        return formData.goals.trim().length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (allSectionsMandatory && !isTabCompleted(activeTab)) {
      alert(`Please complete the ${activeTab} section before proceeding.`);
      return;
    }

    if (activeTab === "journal") setActiveTab("grateful");
    else if (activeTab === "grateful") setActiveTab("goals");
    else {
      saveTodayEntry(formData);
      const recordedURL = chrome.runtime.getURL("popup.html#/recorded");
      window.location.href = recordedURL;
    }
  };

  const handleGratefulChange = (index, value) => {
    const newGrateful = [...formData.grateful];
    newGrateful[index] = value;
    setFormData({ ...formData, grateful: newGrateful });
  };

  return (
    <div className="flex w-full items-center justify-center p-8">
      <div className="flex w-full max-w-3xl flex-col gap-4 rounded-lg bg-red-300/0">
        <div className="flex items-center justify-between bg-cyan-300/0">
          <div>
            <PonderaIcon />
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString()} • Last Edited{" "}
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="flex gap-4 p-2 text-sm font-semibold">
          {["journal", "grateful", "goals"].map((tab) => (
            <button
              key={tab}
              className={`flex items-center gap-1 ${
                activeTab === tab ? "text-accent" : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              <div
                className={`h-2 w-2 rounded-full transition-colors ${
                  activeTab === tab
                    ? "bg-accent"
                    : isTabCompleted(tab)
                      ? "bg-secondary"
                      : "bg-muted"
                }`}
              />
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="">
          {activeTab === "journal" && (
            <Textarea
              placeholder="Write your thoughts..."
              className="min-h-[200px]"
              value={formData.journal}
              onChange={(e) =>
                setFormData({ ...formData, journal: e.target.value })
              }
            />
          )}

          {activeTab === "grateful" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                Write the things you're grateful for today
              </h2>
              {formData.grateful.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <input
                    type="text"
                    className="flex-1 border-none bg-transparent text-sm focus:outline-none"
                    placeholder="I'm grateful for..."
                    value={item}
                    onChange={(e) =>
                      handleGratefulChange(index, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === "goals" && (
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your goals..."
                className="min-h-[200px]"
                value={formData.goals}
                onChange={(e) =>
                  setFormData({ ...formData, goals: e.target.value })
                }
              />
            </div>
          )}
        </div>

        <Button
          className="w-full bg-accent text-white hover:bg-accent/80"
          onClick={handleNext}
        >
          {activeTab === "goals" ? "Save" : "Next"}
        </Button>
      </div>
    </div>
  );
}
