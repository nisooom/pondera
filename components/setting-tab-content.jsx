import React from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Trash2, Check } from "lucide-react"; // Ensure Check is imported
import { saveUserPreferences } from "@/utils/backend";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"; // Import your carousel components

const CheckboxWrapper = ({ checked, text, onChange }) => {
  return (
    <div className="flex gap-2">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <div className="text-sm font-bold text-foreground">{text}</div>
    </div>
  );
};

const handlePreferenceChange = async (key, value) => {
  await saveUserPreferences({ key, value });
};

export const SettingTabContent = ({
  coloredHeatmap,
  setColoredHeatmap,
  allSectionsMandatory,
  setAllSectionsMandatory,
  clearJournalFunc,
  activeTheme, // Ensure activeTheme is passed as a prop
  setActiveTheme, // Ensure setActiveTheme is passed as a prop
}) => {
  const handleThemeChange = (theme) => {
    document.body.setAttribute("data-theme", theme);
    handlePreferenceChange("theme", theme);
    setActiveTheme(theme);
  };

  const themes = [
    {
      name: "purple",
      colors: ["bg-[#E8E6F0]", "bg-[#524B6B]", "bg-[#9D91D2]", "bg-[#6355A4]"],
    },
    {
      name: "pink",
      colors: ["bg-white", "bg-gray-600", "bg-pink-200", "bg-pink-400"],
    },
    {
      name: "cyan",
      colors: ["bg-white", "bg-green-800", "bg-green-200", "bg-green-300"],
    },
    {
      name: "blue",
      colors: ["bg-white", "bg-blue-600", "bg-blue-400", "bg-sky-400"],
    },
  ];

  return (
    <div>
      <div className="pb-2 font-bold text-primary">Themes</div>
      <Carousel className="flex max-w-80 gap-0 overflow-x-auto">
        <CarouselContent className="ml-1 flex gap-2 p-2">
          {themes.map((theme) => (
            <CarouselItem
              key={theme.name}
              className="flex-shrink-0 basis-auto pl-0" // Set width to one-third of the container
            >
              <div
                onClick={() => handleThemeChange(theme.name)}
                className={`relative aspect-square h-24 cursor-pointer overflow-hidden border transition-all duration-300 ${activeTheme === theme.name ? "bg-opacity-50 ring-2 ring-primary" : ""}`}
                aria-label={`Select ${theme.name} theme`}
              >
                <div className="grid grid-cols-2 gap-1">
                  {theme.colors.map((color, i) => (
                    <div
                      key={i}
                      className={`h-12 w-full rounded-sm ${color}`}
                    />
                  ))}
                </div>
                {activeTheme === theme.name && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="flex flex-col gap-2 pt-4">
        <CheckboxWrapper
          checked={coloredHeatmap}
          text="Coloured Heatmaps"
          onChange={() => {
            const newValue = !coloredHeatmap;
            setColoredHeatmap(newValue);
            handlePreferenceChange("coloredHeatmap", newValue);
          }}
        />
        <CheckboxWrapper
          checked={allSectionsMandatory}
          text="All sections in journal mandatory"
          onChange={() => {
            const newValue = !allSectionsMandatory;
            setAllSectionsMandatory(newValue);
            handlePreferenceChange("allSectionsMandatory", newValue);
          }}
        />
        <CheckboxWrapper
          checked={false} // Changed to false since this is a placeholder
          text="Sell my soul to Google"
          onChange={() => alert("no >:)")}
        />
      </div>
      <div className="h-7"></div>
      <Button
        onClick={clearJournalFunc}
        className="h-5 rounded-sm bg-secondary p-3 text-foreground"
      >
        <Trash2 size={14} />
        <div className="text-xs font-bold text-foreground">Clear journal</div>
      </Button>
    </div>
  );
};
