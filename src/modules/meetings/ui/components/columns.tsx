"use client";

import type { meetingStatus } from "@/db/schema"; // or wherever your enum is defined
import { ColumnDef } from "@tanstack/react-table";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { CornerDownRightIcon, MoreHorizontal, VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import humanizeDuration from "humanize-duration";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  LoaderIcon,
} from "lucide-react"


import { Button } from "@/components/ui/button";
import { MeetingGetMany } from "../../types";


// ✅ Helper function
function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"],
  });
}

// ✅ Status icon mapping
const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
};

const statusColorMap: Record<
  typeof meetingStatus.enumValues[number],
  string
> = {
  upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
  processing: "bg-gray-300/20 text-gray-800 border-gray-800/5",
};
import {  ClockIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export const columns:ColumnDef<MeetingGetMany[number]>[]
 = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <GeneratedAvatar
          variant="botttsNeutral"
          seed={row.original.name}
          className="size-6"
        />
        <div className="flex flex-col">
          <span className="font-semibold capitalize text-foreground">
            {row.original.name}
          </span>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <CornerDownRightIcon className="size-3" />
            <span className="truncate max-w-[180px] capitalize">
              {row.original.name}
            </span>
          </div>
        </div>
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const Icon = statusIconMap[row.original.status]
      const color = statusColorMap[row.original.status]

      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize flex items-center gap-1 px-2 py-1 text-sm",
            color
          )}
        >
          <Icon
            className={cn(
              "size-4 text-muted-foreground",
              row.original.status === "processing" && "animate-spin"
            )}
          />
          {row.original.status}
        </Badge>
      )
    },
  },

  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="flex items-center gap-1 px-2 py-1 text-sm capitalize"
      >
        <ClockIcon className="size-4 text-blue-700" />
        {row.original.duration
          ? formatDuration(row.original.duration)
          : "No duration"}
      </Badge>
    ),
  },
]
