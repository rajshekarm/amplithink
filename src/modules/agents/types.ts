import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from '../../trpc/routers/_app';

// Type for single agent (used in edit forms)
export type AgentGetOne = inferRouterOutputs<AppRouter>["agents"]["getOne"];
