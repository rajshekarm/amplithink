import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { AgentCreateForm } from "./agent-form";
import { AgentGetOne } from "../../types";

interface EditAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void,
  initialValues: AgentGetOne
}

export const EditAgentDialog = ({
  open,
  onOpenChange,
  initialValues
}: EditAgentDialogProps) => {
  return (
    <ResponsiveDialog
      title="Edit Agent"
      description="Edit an existing agent"
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentCreateForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
};
