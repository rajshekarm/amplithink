import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import { MeetingForm } from "./meeting-form";
import { ro } from "date-fns/locale";
import { useRouter } from "next/navigation";

interface NewMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewMeetingDialog = ({
  open,
  onOpenChange,
}: NewMeetingDialogProps) => {


  const router = useRouter();
  return (
    <ResponsiveDialog
      title="New Meeting"
      description="Create a new meeting"
      open={open}
      onOpenChange={onOpenChange}
    >
    <MeetingForm
      onSuccess={(id?: string) => {
        
        onOpenChange(false) 
        console.log("Meeting created with ID:");
        router.push(`/meetings/`);
      }}
      onCancel={() => onOpenChange(false)}
    />
    </ResponsiveDialog>
  );
};
