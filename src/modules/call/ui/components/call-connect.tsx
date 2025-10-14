import {
  Call,
  CallingState,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  StreamTheme,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BanIcon, LoaderIcon, VideoIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";   
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { streamVideo } from "@/lib/stream-video";
// import { Meeting } from "@/modules/meetings/types";
import { usePathname } from "next/navigation";


import CallUI from "./call-ui";
  
interface Props {
  meetingId: string;
  meetingName: string;
  userId: string;
  userName: string;
  userImage?: string;
}

export const CallConnect = ({
  meetingId,
  meetingName,
  userId,
  userName,
  userImage,
}: Props) => {
  const trpc = useTRPC();
  const [client, setClient] = useState<StreamVideoClient>();
  const [call, setCall] = useState<Call>();

  // 🔐 get Stream token from backend
  const { mutateAsync: generateToken } = useMutation(
    trpc.meetings.generateToken.mutationOptions()
  );

  // 🔹 Initialize Stream Video client
  useEffect(() => {
    let _client: StreamVideoClient | undefined;

    const setupClient = async () => {
      

      _client = new StreamVideoClient({
        apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
        user: {
          id: userId,
          name: userName,
          image: userImage,
        },
        tokenProvider: generateToken,
      });

      setClient(_client);
    };

    setupClient();

    return () => {
      _client?.disconnectUser();
      setClient(undefined);
    };
  }, [userId, userName, userImage, generateToken]);

  // 🔹 Create a call when client is ready
  useEffect(() => {
    if (!client) return;

    // Create or join call using meetingId as callId
    const _call = client.call("default", meetingId);

    // optional: disable camera/mic until user allows
    _call.camera.disable();
    _call.microphone.disable();

    setCall(_call);

    return () => {
      if (_call.state.callingState !== CallingState.LEFT) {
        _call.leave();
        _call.endCall();
      }
      setCall(undefined);
    };
  }, [client, meetingId]);

  // 🔹 Loading state
  if (!client || !call) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  // 🔹 Render Stream call UI
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallUI meetingName={meetingName} />
      </StreamCall>
    </StreamVideo>
  );
};