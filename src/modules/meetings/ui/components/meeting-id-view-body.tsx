
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MeetingStateView } from "./meeting-state-view";
import { UpcomingState } from "./upcoming-meeting";
const MeetingIdViewBody = ({ data }: { data: any }) => {
  return <div>
    
    Meeting Body Component for meeting ID: {data.id}
    <div className="flex gap-2 my-4">
        <Card className="border bg-muted/30">
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Meeting Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-y-3">
                    <div>
                    <p className="text-sm text-muted-foreground">Agent</p>
                    <p>{ data.agentId}</p>
                    </div>

                    <div>
                    <p className="text-sm text-muted-foreground">User</p>
                    <p>{data.name ?? data.userId}</p>
                    </div>

                    <div>
                    <p className="text-sm text-muted-foreground">Scheduled At</p>
                    <p>{(data.startedAt)}</p>
                    </div>

                    {data.notes && (
                    <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Notes</p>
                        <p>{data.notes}</p>
                    </div>
                    )}
            </CardContent>
        </Card>
        {data.status === "active" && (
          <MeetingStateView status={data.status} 
          // onEnd={() => endMeeting.mutate({ id: data.id })} 
          />
        )}
        {data.status === "completed" && (
          <MeetingStateView status={data.status} 
          // onRestart={() => restartMeeting.mutate({ id: data.id })} 
          />
        )}
        {data.status === "upcoming" && (
          <UpcomingState meetingId={data.id} onCancelMeeting={() => {}} isCancelling={false} />
        )}
        {data.status === "cancelled" && (
          <MeetingStateView status={data.status} 
          // onRestart={() => restartMeeting.mutate({ id: data.id })} 
          />
        )}
    </div>
    
    </div>;
}
export default MeetingIdViewBody;
