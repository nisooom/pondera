"use client";

import React, { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getStartOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const getStartOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getEndOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const processEntries = (allEntries) => {
  const data = [];
  const now = getStartOfDay(new Date());

  const startDate = getStartOfMonth(now);
  const endDate = getEndOfMonth(now);

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    const dateString = formatDate(new Date(date));
    const entry = allEntries[dateString];

    let mood = "null";
    if (entry) {
      if (entry.mood?.errorMessage) {
        mood = "error";
      } else if (entry.mood) {
        mood = entry.mood;
      }
    }

    const currentDate = new Date(date);

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    data.push({
      date: dateString,
      mood: mood,
      isCurrentWeek: currentDate >= startOfWeek && currentDate <= endOfWeek,
      isToday: formatDate(currentDate) === formatDate(now),
    });
  }

  return data;
};

const getMoodColor = (mood, hasColoredTiles, isCurrentWeek, isToday) => {
  let baseColor = "";

  if (!hasColoredTiles) {
    if (mood === "error") {
      baseColor = "bg-accent/50 border border-accent";
    } else {
      baseColor =
        mood && mood !== "null"
          ? "bg-accent"
          : "bg-none border border-secondary";
    }
  } else {
    const colors = {
      Happy: "bg-amber-400",
      Sad: "bg-blue-600",
      Angry: "bg-red-500",
      Anxious: "bg-stone-400",
      Neutral: "bg-emerald-400",
      Peaceful: "bg-lime-500",
      Frustrated: "bg-orange-600",
      error: "bg-accent border border-accent text-white",
      null: "bg-none border border-secondary",
    };
    baseColor = colors[mood] || "bg-none border border-secondary";
  }

  if (isToday) {
    return `${baseColor} ring-2 ring-primary`;
  } else if (isCurrentWeek) {
    return `${baseColor} border-2 border-primary`;
  }

  return baseColor;
};

const MoodHeatmap = ({ coloredHeatmap, allEntries }) => {
  const hasColoredTiles = coloredHeatmap;
  const [hoveredDay, setHoveredDay] = useState(null);
  const [moodData, setMoodData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState("");

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const processedData = processEntries(allEntries || {});
    setMoodData(processedData);

    const now = new Date();
    setCurrentMonth(
      now.toLocaleString("default", { month: "long", year: "numeric" }),
    );
  }, [allEntries]);

  const calculateWeeks = () => {
    const weeks = [];
    let currentWeek = [];

    if (moodData.length > 0) {
      const firstDate = new Date(moodData[0].date);
      const firstDayOfWeek = firstDate.getDay();

      for (let i = 0; i < firstDayOfWeek; i++) {
        currentWeek.push(null);
      }
    }

    moodData.forEach((day) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const weeks = calculateWeeks();

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
              if (!day) {
                return (
                  <div
                    key={dayIndex}
                    className="m-0.5 h-8 w-8 rounded-sm bg-none"
                  />
                );
              }

              const date = new Date(day.date);
              const dayNumber = weekIndex * 7 + dayIndex;

              return (
                <TooltipProvider key={dayIndex}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className={`m-0.5 h-8 w-8 rounded-sm p-2 ${getMoodColor(
                          day.mood,
                          hasColoredTiles,
                          day.isCurrentWeek,
                          day.isToday,
                        )} flex cursor-pointer items-center justify-center text-xs font-bold transition-all duration-200 ${
                          hoveredDay === dayNumber
                            ? "ring-2 ring-accent ring-offset-1"
                            : ""
                        }`}
                        onMouseEnter={() => setHoveredDay(dayNumber)}
                        onMouseLeave={() => setHoveredDay(null)}
                      >
                        {hoveredDay === dayNumber ? (
                          day.mood &&
                          day.mood !== "null" &&
                          day.mood !== "error" ? (
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
                      <p>
                        {`${day.mood}${day.isToday ? " (Today)" : ""} - ${formatDate(date)}`}
                      </p>
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
