"use client";

import { Button } from "@/components/ui/button";
import { Video, XCircle } from "lucide-react";

interface MeetingStateViewProps {
  status: string;
  onStart?: () => void;
  onCancel?: () => void;
}

export function MeetingStateView({ status, onStart, onCancel }: MeetingStateViewProps) {
  if (status === "completed") {
    return (
      <div className="text-center py-16">
        <p className="text-xl font-semibold text-green-600">Meeting completed</p>
        <p className="text-muted-foreground mt-1">A summary or recording will appear here.</p>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="text-center py-16">
        <p className="text-xl font-semibold text-red-600">Meeting was cancelled</p>
        <p className="text-muted-foreground mt-1">No summary available.</p>
      </div>
    );
  }

  // Default = Not started yet
  return (
    <div className="flex flex-col items-center justify-center py-20 border rounded-xl bg-muted/30">
      <p className="text-xl font-semibold">Not started yet</p>
      <p className="text-muted-foreground mt-1">
        Once you start this meeting, a summary will appear here
      </p>

      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
          <XCircle className="w-4 h-4" />
          Cancel meeting
        </Button>

        <Button onClick={onStart} className="flex items-center gap-2">
          <Video className="w-4 h-4" />
          Start meeting
        </Button>
      </div>
    </div>
  );
}
