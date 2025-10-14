"use client";

import Link from "next/link";
import { Ghost, LogInIcon } from "lucide-react";
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
 
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { generateAvatarUri } from "@/lib/avatar";

interface Props {
  onJoin: () => void;
}

export const CallLobby = ({ onJoin }: Props) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const cameraState = useCameraState();
  const micState = useMicrophoneState();

  const { hasBrowserPermission: hasCameraPermission } = cameraState;
  const { hasBrowserPermission: hasMicPermission } = micState;

  const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;

  const { data } = authClient.useSession();
  const user = data?.user;
  const avatar =
    user?.image ??
    generateAvatarUri({ seed: user?.name || "User", variant: "botttsNeutral" });

const DisabledVideoPreview = () => {
  return (
    <DefaultVideoPlaceholder
        participant={
            {
                name: user?.name || "Guest",
                image: data?.user.image?? generateAvatarUri({seed: user?.name || "User", variant: "initials"}),
            } as StreamVideoParticipant
        }
    />)
}

const AllowBrowserPermissions = ()=> {
    return (
        <p className="text-sm">
            Please grant your browser a permission to access your camera and microphone
        </p>
    )
}
  return (
    <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
          {/* Header */}
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg font-medium">Ready to join?</h6>
            <p className="text-sm text-muted-foreground">
              Set up your camera and mic before joining
            </p>
          </div>

          {/* Video Preview */}
          <div className=" bg-muted rounded-lg overflow-hidden">

              <VideoPreview
              DisabledVideoPreview={
                hasBrowserMediaPermission? DisabledVideoPreview
                                            : AllowBrowserPermissions
              }/>
          </div>

          {/* Controls */} 
            <div className="flex items-center justify-center gap-x-2 mt-2">
                <ToggleAudioPreviewButton />
                <ToggleVideoPreviewButton />
            </div>
            
            <div className="flex gap-x-2 justify-between w-full">
                {/* cancel button */}
                <Button asChild variant="ghost">
                    <Link href="/meetings" className="text-sm text-muted-foreground">
                    Cancel
                    </Link>
                </Button>

                {/* Join Button */}
                <Button
                onClick={onJoin}
                size="lg"
                className="flex items-center gap-2 text-white"
                >
                <LogInIcon className="size-4" />
                Join Call
                </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
