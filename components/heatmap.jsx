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
  const moods = [
    "happy",
    "sad",
    "angry",
    "anxious",
    "neutral",
    "null",
    "frustrated",
    "peaceful",
  ];
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

const getMoodColor = (mood, hasColoredTiles) => {
  if (!hasColoredTiles) {
    return mood && mood !== "null"
      ? "bg-accent text-white"
      : "bg-none border border-secondary";
  }

  const colors = {
    happy: "bg-amber-500 text-white",
    sad: "bg-blue-600 text-white",
    angry: "bg-red-500 text-white",
    anxious: "bg-stone-400 text-white",
    neutral: "bg-emerald-400 text-white",
    peaceful: "bg-lime-500 text-white",
    frustrated: "bg-orange-600 text-white",
    null: "bg-none border border-secondary",
  };

  return colors[mood] || "bg-gray-300";
};

const MoodHeatmap = () => {
  const hasColoredTiles = true; // You can toggle this to false to test
  const [hoveredDay, setHoveredDay] = useState(null);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeks = [];

  for (let i = 0; i < Math.ceil(moodData.length / 7); i++) {
    weeks.push(moodData.slice(i * 7, (i + 1) * 7));
  }

  return (
    <div className="max-w-full overflow-x-auto p-0">
      <div className="flex flex-col">
        <div className="mb-2 flex">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="w-9 text-center text-xs text-gray-500">
              {day}
            </div>
          ))}
        </div>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex">
            {week.map((day, dayIndex) => {
              const date = new Date(day.date);
              const dayNumber = weekIndex * 7 + dayIndex;
              return (
                <TooltipProvider key={dayIndex}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className={`m-0.5 h-8 w-8 rounded-sm p-2 ${getMoodColor(day.mood, hasColoredTiles)} flex cursor-pointer items-center justify-center text-xs font-bold transition-all duration-200 ${hoveredDay === dayNumber ? "ring-2 ring-accent ring-offset-1" : ""}`}
                        onMouseEnter={() => setHoveredDay(dayNumber)}
                        onMouseLeave={() => setHoveredDay(null)}
                      >
                        {hoveredDay === dayNumber ? (
                          day.mood && day.mood !== "null" ? (
                            <img
                              src={`/emoticons/${day.mood}.svg`}
                              alt="emoji"
                              className="h-6 w-6"
                            />
                          ) : (
                            date.getDate()
                          )
                        ) : (
                          date.getDate()
                        )}
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
