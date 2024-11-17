// TODO: Implement Redirection to date entries

import React, { useState, useEffect } from "react";
import DateCarousel from "@/components/date-carousel";
import { format, subDays } from "date-fns";
import { generateAiSummaryForDates } from "@/utils/chrome-ai";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const OverviewTabContent = ({
  curEntry,
  setCurEntry,
  allEntries,
  setAllEntries,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [aiSummary, setAiSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Generate dates for the last 7 days
  const getLast7Days = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      dates.push(date);
    }
    return dates;
  };

  // Get summary for the last 7 days when component mounts
  useEffect(() => {
    const fetchWeeklySummary = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const dates = getLast7Days();
        const summary = await generateAiSummaryForDates(dates);

        if (summary.errorMessage) {
          setErrorMessage(summary.errorMessage);
          setAiSummary(null);
        } else {
          setAiSummary(summary);
        }
      } catch (error) {
        setErrorMessage("Failed to generate weekly summary");
        setAiSummary(null);
      }

      setIsLoading(false);
    };

    fetchWeeklySummary();
  }, []); // Empty dependency array means this runs once on mount

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const entry = allEntries.find(
      (e) =>
        format(new Date(e.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"),
    );

    if (entry) {
      setCurEntry(entry);
    } else {
      setCurEntry(null);
      setErrorMessage("No entry found for the selected date.");
    }
  };

  return (
    <div className="space-y-4">
      <DateCarousel onSelectDate={handleDateSelect} />

      {/* Weekly AI Summary Section */}
      <Card className="p-4">
        <h3 className="mb-2 text-lg font-semibold">Weekly Summary</h3>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && errorMessage && (
          <p className="text-sm text-destructive">{errorMessage}</p>
        )}

        {!isLoading && aiSummary && !errorMessage && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Covering the last 7 days
            </p>
            <p className="text-sm">{aiSummary.summary}</p>
          </div>
        )}

        {!isLoading && !aiSummary && !errorMessage && (
          <p className="text-sm text-muted-foreground">
            No entries found for the past week.
          </p>
        )}
      </Card>
    </div>
  );
};
