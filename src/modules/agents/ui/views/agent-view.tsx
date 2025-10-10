"use client";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client"; // your hook factory
import { cn } from "@/lib/utils"; // optional if you have it

// shadcn/ui pieces (adjust imports to your setup)
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp, Plus, RefreshCw } from "lucide-react";
import LoadingState from "@/components/loading-state";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";

type SortKey = "name" | "role" | "model" | "createdAt";

export default function AgentsViewNew() {
  // Fetch agents using TRPC + React Query
  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(trpc.agents.getMany.queryOptions());

if (isLoading) return <div>Loading agents...</div>;
if (error) return <div>Error: {error.message}</div>;

console.log("Agents data:", data); // now it’s defined

return (
  <div className="p-4">
    <DataTable data={data ?? []} columns={columns} />
  </div>
);
  }