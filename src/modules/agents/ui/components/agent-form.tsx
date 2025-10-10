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
import { agentsInsertSchema } from "../../schemas";
import { AgentGetOne } from "../../types";
import { GeneratedAvatar } from "@/components/generated-avatar";

interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
}

export const AgentCreateForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: initialValues ?? {
      name: "",
      instructions: "",
      
    },
  });

  const isEdit = !!initialValues?.id;

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.agents.getMany.queryOptions());
        onSuccess?.();
      },
      onError: (err) => {
        console.error("Failed to create agent:", err);
      },
    })
  );

  const updateAgent = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.agents.getMany.queryOptions());
        queryClient.invalidateQueries(
          trpc.agents.getOne.queryOptions({ id: initialValues?.id ?? "" })
        );
        onSuccess?.();
      },
      onError: (err:any) => {
        console.error("Failed to update agent:", err);
      },
    })
  );

  const onSubmit = (data: z.infer<typeof agentsInsertSchema>) => {
    // if (isEdit) {
    //   updateAgent.mutate({ id: initialValues!.id, ...data });
    // } else {
      createAgent.mutate(data);
    //}
  };

  const isPending = createAgent.isPending || updateAgent.isPending;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
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
                <Input {...field} placeholder="Enter agent name" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Instructions Field */}
        <FormField
          name="instructions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="You are a helpful assistant that can answer questions and help with tasks."
                />
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
