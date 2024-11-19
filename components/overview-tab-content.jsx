// TODO: Implement Redirection to date entries

import React, { useState, useEffect } from "react";
import DateCarousel from "@/components/date-carousel";
import { format, subDays } from "date-fns";
import { generateAiSummaryForDates } from "@/utils/chrome-ai";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export const OverviewTabContent = ({ aiCachedSummary }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [aiSummary, setAiSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // change the aisummary once compenent mounts
  useEffect(() => {
    setIsLoading(true);
    if (aiCachedSummary) {
      if (aiCachedSummary.errorMessage) {
        setErrorMessage(error);
        setIsLoading(false);
        return;
      }
      setAiSummary(
        // remove /n all new lines  and all quotes and trim the string
        aiCachedSummary.replace(/(\r\n|\n|\r)/gm, "").replace(/"/g, ""),
      );
      setIsLoading(false);
    }
  }, [aiCachedSummary]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);

    const formattedDate = format(date, "yyyy-MM-dd");
    const writeURL = chrome.runtime.getURL(`popup.html#/read/${formattedDate}`);
    const newWindow = window.open(
      writeURL,
      "JournalReader",
      "width=600,height=800,left=50,top=50",
    );

    if (!newWindow) {
      alert("Please allow popups for this site to open the writing tab.");
      return;
    }
  };

  return (
    <div className="space-y-4">
      <DateCarousel onSelectDate={handleDateSelect} />

      {/* Weekly AI Summary Section */}
      <h3 className="mb-2 text-lg font-semibold">Weekly Summary</h3>
      <Card className="border-secondary bg-background p-4 text-foreground">
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
            <p className="text-sm text-foreground/50">
              Covering the last 7 days
            </p>
            <p className="text-sm">{aiSummary}</p>
            {/* <p className="text-sm">{aiSummary}</p> */}
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
