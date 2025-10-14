

"use client";

import { Loader2Icon, LoaderIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";
import { CallConnect } from "@/modules/call/ui/components/call-connect";

interface Props {
  meetingId: string;
  meetingName: string;
}

export const CallProvider = ({ meetingId, meetingName }: Props) => {
  const { data: session, isPending } = authClient.useSession();

  console.log("CallProvider rendering with meetingId:", meetingId);

  // 🔹 Show loading while fetching user session
  if (isPending || !session) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  const user = session.user;

  // 🔹 If user has no image, generate a default avatar
  const avatar =
    user.image ??
    generateAvatarUri({
      seed: user.name || user.id,
      variant: "botttsNeutral",
    });

  return (
    <div className="h-screen w-full bg-background">
      <CallConnect
        meetingId={meetingId}
        meetingName={meetingName}
        userId={user.id}
        userName={user.name}
        userImage={avatar}
      />
    </div>
  );
};
export default CallProvider;