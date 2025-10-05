"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell } from "lucide-react";

export default function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/80 px-6 py-3 backdrop-blur">
      {/* Left side: search */}
      <div className="flex items-center gap-3 w-full max-w-md">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search meetings, agents, candidates..."
          className="h-8 text-sm"
        />
      </div>

      {/* Right side: notifications or actions */}
      <div className="flex items-center gap-3">
        <Button size="icon" variant="ghost">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
