// src/server/api/trpc/init.ts
import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
// import superjson from "superjson"; // uncomment if you want rich serialization

/** Build your per-request context (db, session, headers, etc.) */
export async function createTRPCContext(opts: CreateNextContextOptions) {
  const { req, res } = opts;

  // Example wiring (pseudo):
  // const session = await getServerAuthSession(req, res);
  const session = null;

  // Example: attach db or request-scoped services
  // const db = makeDbClient({ traceId: req.headers["x-request-id"] as string | undefined });

  return {
    session,
    // db,
    req,
    res,
  };
}

// Strongly-type ctx across all procedures
const t = initTRPC
  .context<Awaited<ReturnType<typeof createTRPCContext>>>()
  .create({
    // transformer: superjson, // enable if you need Date/Map, etc.
    // errorFormatter({ shape, error }) {
    //   // Optionally surface zod issues, custom codes, etc.
    //   return {
    //     ...shape,
    //     // data: { ...shape.data, zodError: error.cause instanceof ZodError ? error.cause.flatten() : null },
    //   };
    // },
  });

/** Router & procedure helpers */
export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

// /** Authenticated gate */
// export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
//   if (!ctx.session?.user?.id) {
//     throw new TRPCError({ code: "UNAUTHORIZED" });
//   }
//   return next({
//     ctx: {
//       ...ctx,
//       session: ctx.session, // ensure session is present in downstream ctx type
//     },
//   });
// });
