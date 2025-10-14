import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  PlayCircle,
} from "lucide-react";

const MeetingStatus = ({ status }: { status: string }) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-blue-600 text-white">
          <PlayCircle className="w-3 h-3" /> Active
        </Badge>
      );
    case "upcoming":
      return (
        <Badge variant="outline" className="flex items-center gap-1 border-blue-400 text-blue-500">
          <Clock className="w-3 h-3" /> Upcoming
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" /> Processing
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="success" className="flex items-center gap-1 bg-green-500 text-white">
          <CheckCircle2 className="w-3 h-3" /> Completed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" /> Cancelled
        </Badge>
      );
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
}

export default MeetingStatus;