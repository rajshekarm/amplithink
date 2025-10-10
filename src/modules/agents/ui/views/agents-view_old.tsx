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
import { ChevronDown, ChevronUp, Plus, RefreshCw, VideoIcon } from "lucide-react";
import LoadingState from "@/components/loading-state";
import { GeneratedAvatar } from "@/components/generated-avatar";

type SortKey = "name" | "role" | "model" | "createdAt";

export default function AgentsView() {
  const trpc = useTRPC();

  const query = useQuery(trpc.agents.getMany.queryOptions());
  const { data, isLoading, isFetching, error, refetch } = query;

  
  //if(isLoading) return <LoadingState title="Loading agents..." description="Fetching your agents from the database." />;
  

  const [q, setQ] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc");

  const filtered = React.useMemo(() => {
    const items = data ?? [];
    const qLower = q.trim().toLowerCase();
    const searched = qLower.length
      ? items.filter((a: any) =>
          [a.name, a.slug, a.role, a.model, a.description]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(qLower)),
        )
      : items;

    const sorted = [...searched].sort((a: any, b: any) => {
      const A = a[sortKey];
      const B = b[sortKey];
      if (A == null && B == null) return 0;
      if (A == null) return 1;
      if (B == null) return -1;
      const cmp =
        typeof A === "string" && typeof B === "string"
          ? A.localeCompare(B)
          : (A as any) > (B as any)
          ? 1
          : (A as any) < (B as any)
          ? -1
          : 0;
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [data, q, sortKey, sortDir]);

  return (
    <div className="space-y-4">
      {/* Header / controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Agents</h1>
          <p className="text-sm text-muted-foreground">
            Your interviewers and coaches. Search, sort, and manage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                  <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Hook up your CreateAgent dialog here */}
          <Button onClick={() => {/* open create dialog */}}>
            <Plus className="mr-2 h-4 w-4" />
            Create agent
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search by name, slug, model, role…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-md"
        />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setSortKey("createdAt");
              setSortDir(sortKey === "createdAt" && sortDir === "desc" ? "asc" : "desc");
            }}
          >
            Created {sortKey === "createdAt" ? (sortDir === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />) : null}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSortKey("name");
              setSortDir(sortKey === "name" && sortDir === "asc" ? "desc" : "asc");
            }}
          >
            Name {sortKey === "name" ? (sortDir === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />) : null}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSortKey("role");
              setSortDir(sortKey === "role" && sortDir === "asc" ? "desc" : "asc");
            }}
          >
            Role {sortKey === "role" ? (sortDir === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />) : null}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Content */}
      {isLoading ? (
        <AgentsSkeleton />
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Failed to load agents</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-muted-foreground">{String(error.message ?? error)}</pre>
          </CardContent>
        </Card>
      ) : (filtered?.length ?? 0) === 0 ? (
        <EmptyState onCreate={() => {/* open create dialog */}} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a: any) => (
            <Card key={a.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    <GeneratedAvatar variant="botttsNeutral"
                    seed={a.name} 
                    className="size-6"/>
                    {a.name}
                  </CardTitle>
                  <Badge variant={a.isEnabled ? "default" : "secondary"}>
                    {a.isEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                  <Badge variant="outline">
                    <VideoIcon className="text-blue-700" />
                    {a.type === "interviewer" ? "Interviewer" : "Coach"}
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  <span className="mr-2">/{a.slug}</span> · <span className="ml-2">{a.model}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{a.role}</Badge>
                  {a.voice ? <Badge variant="outline">Voice: {a.voice}</Badge> : null}
                  {typeof a.temperature !== "undefined" ? (
                    <Badge variant="outline">Temp: {String(a.temperature)}</Badge>
                  ) : null}
                </div>
                {a.description ? (
                  <p className="line-clamp-3 text-sm text-muted-foreground">{a.description}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No description</p>
                )}
                {/* Action row */}
                <div className="pt-2 flex items-center gap-2">
                  <Button size="sm" onClick={() => {/* navigate to details page */}}>
                    Open
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {/* open edit dialog */}}>
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- UI bits ---------- */

function AgentsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-16 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No agents yet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Create your first interviewer/coach agent to start a practice session.
        </p>
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" /> Create agent
        </Button>
      </CardContent>
    </Card>
  );
}