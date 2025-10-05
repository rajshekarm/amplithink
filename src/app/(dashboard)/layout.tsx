import type { Metadata } from "next";
import { SidebarProvider } from "@/modules/dashboard/ui/components/sidebar-provider";
import DashboardSidebar from "@/modules/dashboard/ui/components/dashboard-sidebar";
import DashboardNavbar from "@/modules/dashboard/ui/components/dashboard-navbar";

export const metadata: Metadata = {
  title: "Amplithink AI · Dashboard",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar on the left */}
        <DashboardSidebar />

        {/* Main area on the right */}
        <main className="flex-1 flex flex-col bg-muted/20">
          {/* ✅ Navbar at the top */}
          <DashboardNavbar />

          {/* ✅ Page content below */}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
