import { db } from "@/db";
import { agents } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";

const CreateAgentInput = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
  role: z.enum(["INTERVIEWER","COACH","RESUME","VOICE_EMOTION","RESEARCH","SCHEDULER","CUSTOM"]),
  model: z.string().min(2).max(60),
  instructions: z.string().min(10),
  temperature: z.coerce.number().min(0).max(2).default(0.7),
  isEnabled: z.boolean().default(true),
  voice: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  description: z.string().optional(),
  configJson: z.any().optional(),
});

const UpdateAgentInput = CreateAgentInput.partial().extend({
  id: z.string().min(1),
});

export const agentsRouter = createTRPCRouter({
  // Matches your screenshot: simple list
  getMany: baseProcedure.query(async () => {
    const data = await db.select().from(agents).orderBy(desc(agents.createdAt));


    await new Promise((resolve) => setTimeout(resolve, 500));

    return data;
  }),

//   // Safer list for the current user (use if you added userId)
//   listMine: protectedProcedure.query(async ({ ctx }) => {
//     const data = await db
//       .select()
//       .from(agents)
//       .where(eq(agents.userId, ctx.session.user.id))
//       .orderBy(desc(agents.createdAt));
//     return data;
//   }),

  getById: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [row] = await db.select().from(agents).where(eq(agents.id, input.id)).limit(1);
      return row ?? null;
    }),

//   create: protectedProcedure
//     .input(CreateAgentInput)
//     .mutation(async ({ ctx, input }) => {
//       const [row] = await db
//         .insert(agents)
//         .values({
//           // id is defaulted by nanoid/uuid in your schema
//           userId: ctx.session.user.id, // remove if you don’t keep per-user ownership
//           name: input.name,
//           slug: input.slug,
//           role: input.role,
//           model: input.model,
//           instructions: input.instructions,
//           temperature: String(input.temperature), // numeric column
//           isEnabled: input.isEnabled,
//           voice: input.voice,
//           avatarUrl: input.avatarUrl,
//           description: input.description,
//           configJson: input.configJson as any,
//         })
//         .returning();
//       return row;
//     }),

//   update: protectedProcedure
//     .input(UpdateAgentInput)
//     .mutation(async ({ ctx, input }) => {
//       const { id, ...rest } = input;
//       const [row] = await db
//         .update(agents)
//         .set({
//           ...(rest.name && { name: rest.name }),
//           ...(rest.slug && { slug: rest.slug }),
//           ...(rest.role && { role: rest.role }),
//           ...(rest.model && { model: rest.model }),
//           ...(rest.instructions && { instructions: rest.instructions }),
//           ...(rest.temperature !== undefined && { temperature: String(rest.temperature) }),
//           ...(rest.isEnabled !== undefined && { isEnabled: rest.isEnabled }),
//           ...(rest.voice !== undefined && { voice: rest.voice }),
//           ...(rest.avatarUrl !== undefined && { avatarUrl: rest.avatarUrl }),
//           ...(rest.description !== undefined && { description: rest.description }),
//           ...(rest.configJson !== undefined && { configJson: rest.configJson as any }),
//         })
//         .where(
//           and(
//             eq(agents.id, id),
//             eq(agents.userId, ctx.session.user.id) // remove if not per-user
//           )
//         )
//         .returning();
//       return row ?? null;
//     }),

//   delete: protectedProcedure
//     .input(z.object({ id: z.string() }))
//     .mutation(async ({ ctx, input }) => {
//       const [row] = await db
//         .delete(agents)
//         .where(and(eq(agents.id, input.id), eq(agents.userId, ctx.session.user.id)))
//         .returning();
//       return row ?? null;
//     }),
});
