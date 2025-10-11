"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {Loader2, Pencil, Trash, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
//import { AgentForm } from "../components/agent-form";
//import { useToast } from "@/components/ui/use-toast";

interface Props {
  agentId: string;
//   open: boolean;
//   onClose: () => void;
}

export const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();
  
  //const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, isError } = useQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

//   const updateMutation = trpc.agents.update.useMutation({
//     onSuccess: () => {
//       toast({ title: "Agent updated successfully" });
//       setIsEditing(false);
//     },
//   });

//   const deleteMutation = trpc.agents.remove.useMutation({
//     onSuccess: () => {
//       toast({ title: "Agent deleted" });
//       onClose();
//     },
//   });

   if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-destructive text-center mt-4">Failed to load agent.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <AgentIdViewHeader
        agentId={agentId}
        agentName={data.name}
        onEdit={() => console.log("Edit clicked for agent:", agentId)}
        onRemove={() => console.log("Delete clicked for agent:", agentId)}
      />

      {/* Agent Info Card */}
      <div className="bg-white rounded-lg border px-4 py-6 flex flex-col gap-y-5">
        {/* Avatar and Name */}
        <div className="flex items-center gap-x-3">
          <GeneratedAvatar
            variant="botttsNeutral"
            seed={data.name}
            className="size-10"
          />
          <h2 className="text-2xl font-medium">{data.name}</h2>
        </div>

        {/* Meeting Count */}
        <Badge
          variant="outline"
          className="flex items-center gap-x-2 [&>svg]:size-4 w-fit"
        >
          <VideoIcon className="text-blue-700" />
          {data.meetingCount}{" "}
          {data.meetingCount === 1 ? "meeting" : "meetings"}
        </Badge>

        {/* Instructions */}
        <div className="flex flex-col gap-y-4">
          <p className="text-lg font-medium">Instructions</p>
          <p className="text-neutral-800">{data.instructions}</p>
        </div>
      </div>
    </div>
  );
//       <Dialog open={open} onOpenChange={onClose}>
//         <DialogContent className="sm:max-w-3xl">
//           <DialogHeader>     
//             <DialogTitle>Agent Details</DialogTitle>
//           </DialogHeader>
//           <div className="mt-4">
//             {agent ? (
//               isEditing ? (
//                 <AgentForm
//                   initialValues={agent}
//                   onSuccess={() => { setIsEditing(false); onClose(); }}
//                   onCancel={() => setIsEditing(false)}
//                 />   
//               ) : (
//                 <div>
//                   <p>
//                     <strong>Name:</strong> {agent.name}  
//                   </p>
//                   <div className="mt-4 flex space-x-2">
//                     <Button
//                       variant="outline"
//                       onClick={() => setIsEditing(true)}
//                       disabled={updateMutation.isPending || deleteMutation.isPending}
//                     >
//                       {updateMutation.isPending ? (
//                         <Loader2 className="animate-spin h-4 w-4" />
//                       ) : (<Pencil className="h-4 w-4" />)}
//                       Edit
//                     </Button>    
//                     <Button
//                       variant="destructive"
//                       onClick={() => deleteMutation.mutate({ id: agent.id })}        
//                       disabled={updateMutation.isPending || deleteMutation.isPending}
//                     >
//                       {deleteMutation.isPending ? (
//                         <Loader2 className="animate-spin h-4 w-4" />
//                       ) : (
//                         <Trash className="h-4 w-4" />        
//                       )}
//                       Delete
//                     </Button>
//                   </div>
//                 </div>
//               )
//           </div>
//         </DialogContent>
//       </Dialog>
        
      
};
