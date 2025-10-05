"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CreditCard as CreditCardIcon, LogOut as LogOutIcon, ChevronDown as ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client"; // ← Better Auth client (change below if using NextAuth)

export const DashboardUserButton = () => {
  const router = useRouter();

  // TODO: replace with your real user data hook
  const isPending = false;
  const data = {
    user: {
      name: "Rajshekar Mudhigonda",
      email: "raj@amplithink.ai",
      image: "https://avatars.githubusercontent.com/u/1?v=4",
    },
  };

  async function onLogout() {
    try {
      await authClient.signOut();         // ← Better Auth
      // await signOut({ callbackUrl: "/signin" }); // ← If using NextAuth instead
      router.replace("/sign-in");
      router.refresh();
    } catch (e) {
      console.error("logout failed", e);
    }
  }

  if (isPending || !data?.user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-lg border border-border/10 p-3 hover:bg-muted/40 transition">
        <div className="flex items-center gap-3 overflow-hidden">
          <Avatar className="h-8 w-8">
            <AvatarImage src={data.user.image} alt={data.user.name} />
            <AvatarFallback>{data.user.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left text-xs truncate">
            <span className="font-medium truncate">{data.user.name}</span>
            <span className="text-muted-foreground truncate">{data.user.email}</span>
          </div>
        </div>
        <ChevronDownIcon className="size-4 shrink-0 opacity-70" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="right" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="font-medium truncate">{data.user.name}</span>
            <span className="text-sm font-normal text-muted-foreground truncate">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Billing (link) */}
        <DropdownMenuItem asChild className="cursor-pointer flex items-center justify-between">
          <Link href="/dashboard/billing" className="flex w-full items-center justify-between">
            <span>Billing</span>
            <CreditCardIcon className="size-4" />
          </Link>
        </DropdownMenuItem>

        {/* Settings (optional) */}
        {/* <DropdownMenuItem asChild className="cursor-pointer flex items-center justify-between">
          <Link href="/dashboard/settings" className="flex w-full items-center justify-between">
            <span>Settings</span>
            <Settings className="size-4" />
          </Link>
        </DropdownMenuItem> */}

        <DropdownMenuSeparator />

        {/* Logout (button) */}
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer flex items-center justify-between text-red-500 focus:text-red-600"
        >
          <span>Logout</span>
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
