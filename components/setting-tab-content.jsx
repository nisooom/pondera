import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Trash2 } from "lucide-react"

const CheckboxWrapper = ({ checked, text, onChange }) => {
  return (
    <div className="flex gap-2">
      <Checkbox checked={checked} onCheckedChange={onChange} />
      <div className="text-sm text-primary font-bold">{text}</div>
    </div>
  )
}


export const SettingTabContent = ({
  coloredHeatmap, setColoredHeatmap,
  allSectionsMandatory, setAllSectionsMandatory,
  clearJournalFunc,
}) => {
  return (
    <div className="">
      <div className="pb-2 font-bold text-primary">Themes</div>
      <div className="flex gap-2">
        <div className="basis-1/4 w-16 h-16 bg-red-300"></div>
        <div className="basis-1/4 w-16 h-16 bg-red-300"></div>
        <div className="basis-1/4 w-16 h-16 bg-red-300"></div>
        <div className="basis-1/4 w-16 h-16 bg-red-300"></div>
      </div>
      <div className="flex flex-col pt-4 gap-2">
        <CheckboxWrapper
          checked={coloredHeatmap}
          text="Coloured Heatmaps"
          onChange={() => setColoredHeatmap(!coloredHeatmap)}
        />
        <CheckboxWrapper
          checked={allSectionsMandatory}
          text="All sections in journal mandatory"
          onChange={() => setAllSectionsMandatory(!allSectionsMandatory)}
        />
        <CheckboxWrapper
          checked={true}
          text="Sell my soul to Google"
          onChange={() => alert('no >:)')}
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
  )
}
