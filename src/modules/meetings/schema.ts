import z from "zod";


export const meetingsInsertSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  userId: z.string(),
  agentId: z.string(),
});

export const meetingsUpdateSchema = meetingsInsertSchema.extend({
  id: z.string().min(1, { message: "ID is required" }),
})