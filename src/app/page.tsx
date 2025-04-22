"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { DataTable } from "@/components/data-table";

const queryClient = new QueryClient({});

export default function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <DataTable />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  );
}
