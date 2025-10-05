"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // shadcn util; if you don’t have it, replace with simple join.
import { primaryNav, secondaryNav } from "./nav-data";
import { ChevronLeft, Menu } from "lucide-react";
import { useSidebar } from "@/modules/dashboard/ui/components/sidebar-provider";
import { DashboardUserButton } from "./dashboard-user-button";


export default function DashboardSidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  const Item = ({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    icon: any;
    label: string;
  }) => {
    const active = pathname?.startsWith(href);
    return (
      <Link
        href={href}
        className={cn(
          "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        {!collapsed && <span className="truncate">{label}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "border-r bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40",
        collapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      <div className="flex h-14 items-center justify-between px-3">
        {!collapsed && (
          <Link href="/dashboard" className="font-semibold">
            Amplithink AI
          </Link>
        )}
        <button
          onClick={toggle}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className="px-2 pb-2">
        <div className="px-1 pb-1 text-xs font-medium uppercase text-muted-foreground">
          {!collapsed ? "Main" : " "}
        </div>
        <nav className="grid gap-1">
          {primaryNav.map(i => (
            <Item key={i.href} {...i} />
          ))}
        </nav>
      </div>

      <div className="px-2 pb-4">
        <div className="px-1 pb-1 text-xs font-medium uppercase text-muted-foreground">
          {!collapsed ? "Manage" : " "}
        </div>
        <nav className="grid gap-1">
          {secondaryNav.map(i => (
            <Item key={i.href} {...i} />
          ))}
        </nav>
      </div>


      <div className="p-2 border-t border-border/10">
        <DashboardUserButton />
      </div>
    </aside>
  );
}
