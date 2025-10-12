"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {Edit, Loader2, Pencil, Trash, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { EditAgentDialog } from "../components/edit-agent-dialog";
import { set } from "zod";
//import { AgentForm } from "../components/agent-form";
//import { useToast } from "@/components/ui/use-toast";

interface Props {
  agentId: string;
//   open: boolean;
//   onClose: () => void;
}




export const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);



  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        // Refresh agents list
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
        toast.success("Agent deleted successfully");
        router.push("/agents"); // Redirect after delete
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  // ✏️ Update agent mutation
const updateAgent = useMutation(
  trpc.agents.update.mutationOptions({
    onSuccess: async () => {
     await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions());
      toast.success("Agent updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  })
);

  
  const editHandler = () => {
    setIsEditing(true);
    router.push(`/agents/${agentId}/edit`);
    // Open edit dialog or navigate to edit page    
   // updateAgent.mutate({ id: agentId, name: "Updated Agent Name", instructions: "Updated instructions" });
  }
  const removeHandler = (agentId: string) => {
    if (confirm("Are you sure you want to delete this agent?")) {
      removeAgent.mutate({ id: agentId });
      
    }
  }

  const { data, isLoading, isError } = useQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

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
      <EditAgentDialog
        open={isEditing}
        onOpenChange={setIsEditing}
        initialValues={data}
      />
      
      {/* Header */}
      <AgentIdViewHeader
        agentId={agentId}
        agentName={data.name}
        onEdit={() => setIsEditing(true)}
        onRemove={() => removeHandler(agentId)}
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
};
