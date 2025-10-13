"use client";

import { useTRPC } from "@/trpc/client";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import MeetingIdViewBody from "../components/meeting-id-view-body";


const MeetingIdView = ({ meetingId }: { meetingId: string }) => {


    const [isEditing, setIsEditing] = useState(false);
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();   
    // Fetch meeting data using meetingId
    // const { data, isLoading, error } = useQuery(
    //     trpc.meetings.getById.queryOptions({ id: meetingId })
    //   );    

    const removeHandler = (meetingId: string) => {
    if (confirm("Are you sure you want to delete this meeting?")) {
     // removeMeeting.mutate({ id: meetingId });
      
    }
  }


    
        // if (isLoading) return <div>Loading...</div>;        
        // if (error) return <div>Error: {error.message}</div>;
        // if (!data) return <div>No meeting found</div>;

  return <div>
    
    
    Hello welcome to your meeting Meeting Page: {meetingId}
    
    <MeetingIdViewHeader
            meetingId={meetingId}
            meetingName={"Sample Meeting Name"}
            onEdit={() => setIsEditing(true)}
            onRemove={() => removeHandler(meetingId)}
    />
    
    <MeetingIdViewBody meetingId={meetingId} /> 

    
    </div>;
}
export default MeetingIdView;