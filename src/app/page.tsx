"use client";

import { useCallback, useEffect, useState } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { DataTable } from "@/components/data-table";
import { getUsers } from "@/services/api/users";

// import data from "./data.json";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getUsersData = useCallback(async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUsersData();
  }, []);

  const onCreateUser = useCallback(() => {
    getUsersData();
  }, [getUsersData]);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader onCreateUser={onCreateUser} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DataTable data={users} refetchUsers={getUsersData} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
