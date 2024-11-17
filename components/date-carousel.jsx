import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { format, subDays, isSameDay } from "date-fns";

export default function DateCarousel({ onSelectDate }) {
  const [showThirtyDays, setShowThirtyDays] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const days = useMemo(() => {
    const today = new Date();
    const result = [];
    const numberOfDays = showThirtyDays ? 30 : 7;

    result.push(today);
    for (let i = 1; i < numberOfDays; i++) {
      result.push(subDays(today, i));
    }

    return result;
  }, [showThirtyDays]);

  const isToday = (date) => isSameDay(date, new Date());
  const isSelected = (date) => isSameDay(date, selectedDate);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onSelectDate(date);
  };

  return (
    <div className="w-full max-w-xl select-none bg-background p-2">
      <Carousel className="w-full touch-pan-x">
        <CarouselContent className="-ml-1">
          {days.map((date, index) => (
            <CarouselItem key={index} className="basis-1/7 pl-1">
              <div
                onClick={() => handleDateClick(date)}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:scale-100 active:scale-90",
                  "select-none outline-none",
                )}
              >
                <Card
                  className={cn(
                    "rounded-lg border transition-colors",
                    isToday(date) && "border border-primary bg-primary/10",
                    isSelected(date) && !isToday(date) && "bg-secondary",
                  )}
                >
                  <CardContent className="flex flex-col items-center justify-center p-2">
                    <div
                      className={cn(
                        "text-xs uppercase",
                        isSelected(date)
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {format(date, "EEE")}
                    </div>
                    <div
                      className={cn(
                        "mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-base font-semibold",
                        isToday(date) && "bg-primary text-primary-foreground",
                        isSelected(date) &&
                          !isToday(date) &&
                          "bg-secondary-foreground text-secondary",
                      )}
                    >
                      {format(date, "d")}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-2 flex justify-center gap-1.5">
        <Button
          variant={!showThirtyDays ? "secondary" : "outline"}
          onClick={() => setShowThirtyDays(false)}
          className="h-7 select-none rounded-full px-3 text-xs"
          size="sm"
        >
          last 7 days
        </Button>
        <Button
          variant={showThirtyDays ? "secondary" : "outline"}
          onClick={() => setShowThirtyDays(true)}
          className="h-7 select-none rounded-full px-3 text-xs"
          size="sm"
        >
          last 30 days
        </Button>
      </div>
    </div>
  );
}
