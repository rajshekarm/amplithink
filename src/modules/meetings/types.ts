import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from '../../trpc/routers/_app';

// Type for single agent (used in edit forms)
export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"];
export type MeetingGetMany = inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"];
