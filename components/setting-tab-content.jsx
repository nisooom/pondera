import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Trash2 } from "lucide-react";
import { saveUserPreferences } from "@/utils/backend";

const CheckboxWrapper = ({ checked, text, onChange }) => {
  return (
    <div className="flex gap-2">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <div className="text-sm font-bold text-primary">{text}</div>
    </div>
  );
};

const handlePreferenceChange = async (key, value) => {
  await saveUserPreferences({ key,  value });
};

export const SettingTabContent = ({
  coloredHeatmap,
  setColoredHeatmap,
  allSectionsMandatory,
  setAllSectionsMandatory,
  clearJournalFunc,
}) => {
  return (
    <div className="">
      <div className="pb-2 font-bold text-primary">Themes</div>
      <div className="flex gap-2">
        <div className="h-16 w-16 basis-1/4 bg-red-300"></div>
        <div className="h-16 w-16 basis-1/4 bg-red-300"></div>
        <div className="h-16 w-16 basis-1/4 bg-red-300"></div>
        <div className="h-16 w-16 basis-1/4 bg-red-300"></div>
      </div>
      <div className="flex flex-col gap-2 pt-4">
        <CheckboxWrapper
          checked={coloredHeatmap}
          text="Coloured Heatmaps"
          onChange={() => {
            setColoredHeatmap(!coloredHeatmap);
            handlePreferenceChange("coloredHeatmap", !coloredHeatmap);
          }}
        />
        <CheckboxWrapper
          checked={allSectionsMandatory}
          text="All sections in journal mandatory"
          onChange={() => {
            setAllSectionsMandatory(!allSectionsMandatory);
            handlePreferenceChange(
              "allSectionsMandatory",
              !allSectionsMandatory,
            );
          }}
        />
        <CheckboxWrapper
          checked={true}
          text="Sell my soul to Google"
          onChange={() => alert("no >:)")}
        />
      </div>
      <div className="h-7"></div>
      <Button
        onClick={clearJournalFunc}
        className="h-5 bg-secondary text-primary hover:bg-secondary"
      >
        <Trash2 size={14} />
        <div className="text-xs font-bold">Clear journal</div>
      </Button>
    </div>
  );
};
