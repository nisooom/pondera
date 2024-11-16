
import { Button } from "./ui/button";
import { PenTool } from "lucide-react";


export const HomeTabContent = ({
  curEntry, setCurEntry,
  allEntries, setAllEntries,
  errorMessage, setErrorMessage,
  successMessage, setSuccessMessage
}) => {
  return (
    <>
      <div className="pb-2 font-bold">
        {curEntry ? "You have written something" : "You haven't written anything yet"}
      </div>
      <Button className="h-6 rounded-md bg-accent text-xs" size="sm">
        <PenTool size={16} />
        {curEntry ? "Start editing" : "Start writing"}
      </Button>
    </>
  );
}
