"use client";

import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data generation
const generateMockData = () => {
  const moods = ["Happy", "Sad", "Angry", "Excited", "Calm", "null"];
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString(),
      mood: moods[Math.floor(Math.random() * moods.length)],
    });
  }
  return data;
};

const moodData = generateMockData();

const getMoodColor = (mood) => {
  const colors = {
    Happy: "bg-yellow-300",
    Sad: "bg-blue-300",
    Angry: "bg-red-400",
    Excited: "bg-green-300",
    Calm: "bg-teal-300",
    null: "bg-none border border-secondary",
  };
  return colors[mood] || "bg-gray-300";
};

const MoodHeatmap = () => {
  const [hoveredDay, setHoveredDay] = useState(null);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeks = [];
  for (let i = 0; i < 5; i++) {
    weeks.push(moodData.slice(i * 7, (i + 1) * 7));
  }

  return (
    <div className="max-w-full overflow-x-auto p-0">
      <div className="flex flex-col">
        <div className="mb-2 flex">
          {/* <div className="w-8"></div> */}
          {daysOfWeek.map((day, index) => (
            <div key={index} className="w-9 text-center text-xs text-gray-500">
              {day}
            </div>
          ))}
        </div>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex">
            {/* <div className="flex w-8 items-center justify-end pr-2 text-right text-xs text-gray-500">
              {weekIndex * 7 + 1}
            </div> */}
            {week.map((day, dayIndex) => {
              const date = new Date(day.date);
              const dayNumber = weekIndex * 7 + dayIndex;
              return (
                <TooltipProvider key={dayIndex}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className={`m-0.5 h-8 w-8 rounded-sm ${getMoodColor(day.mood)} flex cursor-pointer items-center justify-center text-xs font-bold transition-all duration-200 ${hoveredDay === dayNumber ? "ring-2 ring-black ring-offset-1" : ""}`}
                        onMouseEnter={() => setHoveredDay(dayNumber)}
                        onMouseLeave={() => setHoveredDay(null)}
                      >
                        {hoveredDay === dayNumber
                          ? day.mood[0]
                          : date.getDate()}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{`${day.mood} - ${date.toLocaleDateString()}`}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodHeatmap;
