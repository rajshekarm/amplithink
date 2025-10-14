import { StreamTheme, useCall } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { CallLobby } from "./call-lobby";

interface Props {
  meetingName: string;
}



const CallUI = ({ meetingName }: Props) => {
    const call = useCall();
    const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");

    const handlejoin = async () => {
        if(!call) return;
        await call.join();
        setShow("call");
    }

    const handleLeave = async () => {
        if(!call) return;
        await call.leave();
        setShow("ended");
    }

    return (
    <StreamTheme className="h-full">
        {show === "lobby" && (  
            // <div className="h-full flex flex-col items-center justify-center gap-6">
            //     <h2 className="text-2xl font-semibold">Welcome to {meetingName}</h2>
            //     <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handlejoin}>Join Call</button>
            // </div>
            <CallLobby onJoin={handlejoin} />
        )}  
        {show === "call" && (
            <div className="h-full flex flex-col">
                <div className="flex-1">    
                    {/* Call UI will be rendered here by StreamVideo SDK */}
                </div>
                <div className="p-4 bg-gray-100 flex justify-center">
                    <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={handleLeave}>Leave Call</button>
                </div>
            </div>  
        )}
        {show === "ended" && (
            <div className="h-full flex flex-col items-center justify-center gap-6">
                <h2 className="text-2xl font-semibold">You have left the call</h2>
            </div>  
        )}
    </StreamTheme>
    );
  };
export default CallUI;  