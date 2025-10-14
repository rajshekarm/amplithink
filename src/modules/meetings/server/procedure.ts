import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { and, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { meetingsInsertSchema, meetingsUpdateSchema } from "../schema";
import { TRPCError } from "@trpc/server";
import { agentsUpdateSchema } from "@/modules/agents/schema";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { generateAvatarUri } from "@/lib/avatar";
import { streamVideo } from "@/lib/stream-video";

const CreateMeetingInput = z.object({
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

const UpdateMeetingInput = CreateMeetingInput.partial().extend({
  id: z.string().min(1),
});

export const meetingsRouter = createTRPCRouter({

    generateToken: protectedProcedure.mutation(async ({ ctx }) => {
    // 1️⃣ Register user in Stream
    await streamVideo.upsertUsers([
      {
        id: ctx.session.user.id,
        name: ctx.session.user.name,
        role: "admin",
        image:
          ctx.session.user.image ??
          generateAvatarUri({ seed: ctx.session.user.name, variant: "initials" }),
      },
    ]);

    // 2️⃣ Generate Stream token
    const expirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour
    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamVideo.generateUserToken({
      user_id: ctx.session.user.id,
      exp: expirationTime,
      validity_in_seconds: issuedAt,
    });

    // 3️⃣ Return token to client
    return token;
  }),



  // Matches your screenshot: simple list
  getMany: baseProcedure
    .input(
    z.object({
      page: z.number().default(DEFAULT_PAGE),
      pageSize: z.number().default(DEFAULT_PAGE_SIZE),
      search: z.string().nullish(),
    })
)
  .query(async ({ ctx, input }) => {
    
    const { search, page, pageSize } = input;

    // Main query: get meetings for this user with pagination
    const data = await db
      .select({
        ...getTableColumns(meetings),
      })
      .from(meetings)
      .where(
        and(
          eq(meetings.userId,  ctx.session!.user.id),
          search ? ilike(meetings.name, `%${search}%`) : undefined
        )
      )
      .orderBy(desc(meetings.createdAt), desc(meetings.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    // Count total meetings (for pagination metadata)
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(meetings)
      .where(
        and(
          eq(meetings.userId, ctx.session!.user.id),
          search ? ilike(meetings.name, `%${search}%`) : undefined
        )
      )
      .execute();

    const total = Number(totalResult[0]?.count ?? 0);
    const totalPages = Math.ceil(total / pageSize);

    return {
      items:data,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        pageSize,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }),


  
  getOne: protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input, ctx }) => {
    console.log("Fetching meeting with ID:", input);
    const [existingMeeting] = await db
      .select({
        meetingCount: sql<number>`5`, // TODO: Replace with actual COUNT
        ...getTableColumns(meetings),
      })
      .from(meetings)
      .where(
        and(
          eq(meetings.id, input.id),
          eq(meetings.userId, ctx.session.user.id) // remove if not per-user
        )
      );

    if (!existingMeeting) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Meeting not found",
      });
    }

    return existingMeeting;
    }),

  getById:  protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input, ctx }) => {
    const [existingMeeting] = await db
      .select({
        meetingCount: sql<number>`5`, // TODO: Replace with actual COUNT
        ...getTableColumns(meetings),
      })
      .from(meetings)
      .where(
        and(
          eq(meetings.id, input.id),
          eq(meetings.userId, ctx.session.user.id) // remove if not per-user
        )
      );

    if (!existingMeeting) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Meeting not found",
      });
    }

    return existingMeeting;
  }),

//Create Meeting
create: protectedProcedure
  .input(meetingsInsertSchema)
  .mutation(async ({ input, ctx }) => {
    console.log("Creating meeting with input:", input);
    const [createdMeeting] = await db
      .insert(meetings)
      .values({
        ...input,
      })
      .returning();

  
  
  
  
  const call = streamVideo.video.call("default", createdMeeting.id);

  await call.create({
  data: {
    created_by_id: ctx.session.user.id,
    custom: {
      meetingId: createdMeeting.id,
      meetingName: createdMeeting.name,
    },
  },
  settings_override: {
    transcription: {
      language: "en",
      mode: "auto-on",
      closed_caption_mode: "auto-on",
    },
    recording: {
      mode: "auto-on",
      quality: "1080p",
    },
  },
});

//fetch existing agent the newly created meeting uses
const [existingAgent] = await db
.select()
.from(agents)
.where(
  and(
    eq(agents.id, createdMeeting.agentId),
    // eq(agents.userId, ctx.session.user.id) // remove if not per-user
  )
);

if(!existingAgent){
  throw new TRPCError({
    code: "NOT_FOUND",
    message: "Associated agent not found",
  });
}

//if agent exists and we need to make this agent a normal user so we need add them to stream as well so they can join the call
await streamVideo.upsertUsers([
  { 
    id: existingAgent.id,
    name: existingAgent.name,
    role: "user",
    image: existingAgent.avatarUrl ?? generateAvatarUri({ seed: existingAgent.name, variant: "botttsNeutral" }),
  },
]); 



//later: update the meeting with agent's voice and avatar if not provided
// if (existingAgent) {
//   //update the meeting with agent's voice and avatar if not provided
//   const updatedValues: Partial<typeof meetings.$inferInsert> = {};  
//   if (!createdMeeting.voice && existingAgent.voice) {
//     updatedValues.voice = existingAgent.voice;
//   }
//   if (!createdMeeting.avatarUrl && existingAgent.avatarUrl) {
//     updatedValues.avatarUrl = existingAgent.avatarUrl;
//   }  

//   if (Object.keys(updatedValues).length > 0) {
//     await db
//       .update(meetings)
//       .set(updatedValues)
//       .where(eq(meetings.id, createdMeeting.id));
//   } 
// }




    return createdMeeting;
  }),



update : protectedProcedure
  .input(meetingsUpdateSchema)
  .mutation(async ({ ctx, input }) => {
    const [updatedMeeting] = await db
      .update(meetings)
      .set(input)
      .where(
        and(
          eq(meetings.id, input.id),
          eq(meetings.userId, ctx.session.user.id)
        )
      )
      .returning();

    return updatedMeeting;
  }),

remove: protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const [removedAgent] = await db
      .delete(agents)
      .where(
        and(
          eq(agents.id, input.id),
          eq(agents.userId, ctx.session.user.id)
        )
      )
      .returning();

    return removedAgent;
  }),

});


