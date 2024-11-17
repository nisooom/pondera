"use client";

import React from "react";
import { PonderaIcon } from "./pondera-icon";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const RecordedPage = () => {
  const handleCloseTab = () => {
    window.close();
  };

  return (
    <div className="flex w-full items-center justify-center p-8">
      <div className="flex w-full max-w-3xl flex-col gap-4 rounded-lg bg-[#f8f5ff] p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <PonderaIcon />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <h2 className="text-2xl font-semibold text-[#6750A4]">
            Your journal has been recorded!
          </h2>
          <p className="text-center text-muted-foreground">
            Thank you for taking the time to reflect. Your thoughts, gratitude,
            and goals have been saved.
          </p>
          <p className="text-center text-muted-foreground">
            You can safely close this tab now.
          </p>
          <Button
            className="mt-4 bg-[#6750A4] text-white hover:bg-[#6750A4]/90"
            onClick={handleCloseTab}
          >
            Close Tab
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecordedPage;
