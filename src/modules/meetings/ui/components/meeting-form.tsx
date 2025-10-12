"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { meetingsInsertSchema } from "../../schema";
import { MeetingGetOne } from "../../types";
import { GeneratedAvatar } from "@/components/generated-avatar";

interface MeetingFormProps {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export const MeetingForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: MeetingFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
 
const form = useForm<z.infer<typeof meetingsInsertSchema>>({
  resolver: zodResolver(meetingsInsertSchema),
  defaultValues: initialValues ?? {
    name: "",
    title: "",
    userId: "",
    agentId: "",
  },
});


  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        console.log("Meeting created");
        onSuccess?.();
      },
      onError: (err) => {
        console.error("Failed to create meeting:", err);
      },
    })
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: async() => {
        queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.meetings.getOne.queryOptions({ id: initialValues?.id ?? "" })
        );
        if(initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id })
          );
        }
        // onSuccess?.();
      },
      onError: (err:any) => {
        console.error("Failed to update meeting:", err);
      },
    })
  );

       
  const isPending = createMeeting.isPending || updateMeeting.isPending;
  const isEdit = !!initialValues?.id;

  const onSubmit = (data: z.infer<typeof meetingsInsertSchema>) => {
    console.log("Form Data:", data);
    if (isEdit) {
      updateMeeting.mutate({ id: initialValues!.id, ...data });
    } else {
      createMeeting.mutate({...data });

    }
  };


  return (
    <Form {...form}>
      <form
       onSubmit={form.handleSubmit(
    onSubmit,
    (errors) => console.log("Validation errors:", errors)
  )}
        className="space-y-4"
      >
        <GeneratedAvatar
          seed={form.watch("name")}
          variant="botttsNeutral"
          className="border size-16"
        />

        {/* Name Field */}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter Meeting name" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Title Field */}
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="You are a helpful assistant that can answer questions and help with tasks."
                />
              </FormControl>
            </FormItem>
          )}
        />


        {/* Name Field */}
        <FormField
          name="userId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>User</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter Meeting name" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Name Field */}
        <FormField
          name="agentId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter Meeting name" />
              </FormControl>
            </FormItem>
          )}
        />


        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button
              variant="ghost"
              type="button"
              disabled={isPending}
              onClick={() => onCancel()}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isPending}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
