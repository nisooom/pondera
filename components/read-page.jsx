// read-page.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { PonderaIcon } from "./pondera-icon";
import { Button } from "@/components/ui/button";
import { X, Calendar } from "lucide-react";
import { getEntryByDate } from "@/utils/backend";
import { useEffect, useState } from "react";

const ReadPage = () => {
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
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-md flex-col gap-3 rounded-lg bg-[#f8f5ff] p-5 shadow-md fade-in">
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
            <Calendar className="h-12 w-12 text-[#6750A4]" />
          </div>

          <div className="space-y-1 text-center">
            <h2 className="text-lg font-semibold text-[#6750A4]">
              {formattedDate}
            </h2>
            <p className="text-sm text-muted-foreground">
              {JSON.stringify(entry)}
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
