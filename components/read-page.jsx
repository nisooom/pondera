"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PonderaIcon } from "./pondera-icon";
import { Button } from "@/components/ui/button";
import { X, Calendar } from "lucide-react";
import { getEntryByDate, getUserPreferences } from "@/utils/backend";
import { Textarea } from "./ui/textarea";

export default function ReadPage() {
  const [theme, setTheme] = useState("default");
  const [entry, setEntry] = useState(null);
  const { date } = useParams();

  useEffect(() => {
    getUserPreferences().then((preferences) => {
      setTheme(preferences.theme ?? "default");
    });
    getEntryByDate(date).then(setEntry);
  }, [date]);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (entry) {
      document.title = `${entry.entry.journal ? entry.entry.journal.substring(0, 30) : "Journal Entry"} - ${new Date(date).toLocaleDateString()}`;
    } else {
      document.title = `No Entry - ${new Date(date).toLocaleDateString()}`;
    }
  }, [entry, date]);

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const handleClose = () => window.close();

  const renderGratefulItems = (items) =>
    items.map((item, index) => (
      <div
        key={index}
        className="text-2xs flex items-center gap-1 rounded-sm py-0.5 hover:bg-secondary/30"
      >
        <div className="h-1 w-1 rounded-full bg-accent" />
        <span className="truncate">{item || "Not entered"}</span>
      </div>
    ));

  return (
    <div className="flex items-center justify-center bg-background/50 p-4">
      <div className="w-full rounded-lg bg-background">
        <div className="relative mb-2 flex items-center justify-between">
          <PonderaIcon className="h-4 w-4" />
          <h2 className="text-sm font-semibold">{formattedDate}</h2>
        </div>

        {entry ? (
          <div className="space-y-2">
            <section className="flex flex-col gap-1">
              <h3 className="text-2xs mb-0.5 px-1 font-semibold text-accent">
                My Journal
              </h3>
              <Textarea
                className="text-2xs p-w min-h-[60px] w-full resize-none border-none bg-secondary/20"
                readOnly
                value={entry.entry.journal || "No journal entry"}
              />
            </section>

            <section>
              <h3 className="text-2xs mb-0.5 font-semibold text-accent">
                Grateful For
              </h3>
              <div className="space-y-0.5 p-1">
                {renderGratefulItems(entry.entry.grateful)}
              </div>
            </section>

            <section className="flex flex-col gap-1">
              <h3 className="text-2xs mb-0.5 font-semibold text-accent">
                My Goals
              </h3>
              <Textarea
                className="text-2xs min-h-[60px] w-full resize-none border-none bg-secondary/20 p-2"
                readOnly
                value={entry.entry.goals || "No goals set"}
              />
            </section>
          </div>
        ) : (
          <p className="text-2xs text-muted-foreground">
            No entry found for this date
          </p>
        )}
      </div>
    </div>
  );
}
