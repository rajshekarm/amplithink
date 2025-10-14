"use client";

import { Loader2Icon, LoaderIcon } from "lucide-react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { CallConnect } from "@/modules/call/ui/components/call-connect";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import CallProvider from "../components/call-provider";

interface Props {
  meetingId: string;
}

export const CallView = ({ meetingId }: Props) => {
  const trpc = useTRPC();
    
  // 🔹 get meeting details
  const { data } = useQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  // 🔹 get logged-in user
  const { data: session, isPending } = authClient.useSession();


  if (!session || isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center text-white bg-background">
        Meeting not found.
      </div>
    );
  }

  // destructure meeting details
  const { id: meetingIdValue, name: meetingName } = data;

  // destructure user details
  const user = session.user;
  return (
  <div className="h-screen w-full">
    <CallProvider meetingId={meetingIdValue} meetingName={meetingName} />
  </div>
);


}
