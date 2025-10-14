"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { SearchFilter } from "./meeting-search-filters";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
// import { NewAgentDialog } from "./new-agent-dialog";

export const MeetingListHeader = () => {
  const [filters, setFilters] = useMeetingsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}/>
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">My Meetings</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Meeting
          </Button>
        </div>
        {/* <div className="flex items-left gap-x-2 p-1">
          <SearchFilter />
        </div> */}
      </div>
    </>
  );
};

