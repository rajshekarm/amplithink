import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { BanIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
interface Props {
  meetingId: string;
  onCancelMeeting: () => void;
  isCancelling: boolean;
}

export const UpcomingState = ({ meetingId, onCancelMeeting, isCancelling }: Props) => {
  return (
    <div className="bg-white rounded-lg px-4 py-10 flex flex-col gap-y-8 items-center justify-center border">
      <EmptyState
        image="/upcoming.svg"
        title="Not started yet"
        description="Once you start this meeting, a summary will appear here"
      />

      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full mt-4">
        {/* Cancel Button */}
        <Button
          variant="secondary"
          className="w-full lg:w-auto flex items-center justify-center gap-2"
          onClick={onCancelMeeting}
          disabled={isCancelling}
        >
          <BanIcon className="w-4 h-4" />
          {isCancelling ? "Cancelling..." : "Cancel meeting"}
        </Button>

        {/* Start Meeting Button */}
        <Button asChild className="w-full lg:w-auto flex items-center justify-center gap-2">
          <Link href={`/call/${meetingId}`}>
            <VideoIcon className="w-4 h-4" />
            Start meeting
          </Link>
        </Button>
      </div>
    </div>
  );
};
