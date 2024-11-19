"use client";

import React from "react";
import { PonderaIcon } from "./pondera-icon";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserPreferences } from "@/utils/backend";
const RecordedPage = () => {
  const [theme, setTheme] = useState("default");
  useEffect(() => {
    getUserPreferences().then((preferences) => {
      setTheme(preferences.theme ?? "default");
    });
  }, []);
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const handleCloseTab = () => {
    window.close();
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="flex w-full max-w-md flex-col gap-4 rounded-lg bg-background p-6 fade-in">
        <div className="flex items-center justify-between">
          <PonderaIcon />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseTab}
            className="h-8 w-8 rounded-full hover:text-white"
          >
            {/* <X className="h-4 w-4" /> */}
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center space-y-2 py-6">
          <div className="scale-in">
            <CheckCircle className="text-accent] h-16 w-16 animate-bounce" />
          </div>

          <div className="space-y-2 text-center">
            <h2 className="animate-fade-in text-xl font-bold text-accent">
              Successfully Recorded!
            </h2>
            <p className="max-w-md text-base text-muted-foreground">
              Your thoughts, gratitude, and goals have been saved for today.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 pt-2">
            <Button
              size="lg"
              className="transform bg-primary text-white transition-all duration-200 hover:scale-105 hover:bg-accent/90"
              onClick={handleCloseTab}
            >
              Close Window
            </Button>
            <Button
              variant="ghost"
              className="text-sm text-muted-foreground transition-colors hover:bg-gray-200/10 hover:text-foreground"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Return to Journal
            </Button>
          </div>

          <p className="text-xs text-muted-foreground/60">
            See you tomorrow for your next reflection!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
          }
          to {
            transform: scale(1);
          }
        }
        .scale-in {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RecordedPage;
