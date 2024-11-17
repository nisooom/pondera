// read-page.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { PonderaIcon } from "./pondera-icon";
import { Button } from "@/components/ui/button";
import { X, Calendar } from "lucide-react";
import { getEntryByDate } from "@/utils/backend";
import { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { getUserPreferences } from "@/utils/backend";

const ReadPage = () => {
  const [theme, setTheme] = useState("default");
  useEffect(() => {
    getUserPreferences().then((preferences) => {
      setTheme(preferences.theme ?? "default");
    });
  }, []);
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);
  const { date } = useParams();
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [entry, setEntry] = useState(null);

  useEffect(() => {
    getEntryByDate(date).then((entry) => {
      setEntry(entry);
    });
  }, [date]);

  const handleClose = () => window.close();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-secondary p-4">
      <div className="flex w-full max-w-md flex-col gap-3 rounded-lg bg-background p-5 shadow-md fade-in">
        <div className="flex items-center justify-between">
          <PonderaIcon />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-7 w-7 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col items-center space-y-2 py-4">
          <div className="scale-in">
            <Calendar className="h-12 w-12 text-accent" />
          </div>

          <div className="w-full space-y-1">
            <h2 className="text-accent] text-center text-lg font-semibold">
              {formattedDate}
            </h2>
            <p className="pt-2 text-sm text-muted-foreground">
              {entry ? (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="text-xl font-semibold">My journal</div>
                    <div className="text-lg">
                      <Textarea
                        className="min-h-[150px]"
                        readOnly={true}
                        value={entry.entry.journal}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-xl font-semibold">
                      I am grateful for
                    </div>
                    <div className="text-lg">
                      {entry.entry.grateful.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-[#6750A4]" />
                          <input
                            type="text"
                            className="flex-1 border-none bg-transparent text-sm focus:outline-none"
                            placeholder="Not entered"
                            value={item}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-xl font-semibold">My goals</div>
                    <div className="text-lg">
                      <Textarea
                        className="min-h-[150px]"
                        readOnly={true}
                        value={entry.entry.goals}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                "No entry found"
              )}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.95);
          }
          to {
            transform: scale(1);
          }
        }
        .scale-in {
          animation: scaleIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ReadPage;
