"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DeleteUserDialog } from "./DeleteUserDialog";
import { DataStateHandler } from "./DataStateHandler";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { EditUserDialog } from "./EditUserDialog";
import { Button } from "@/components/ui/button";
import { getUsers } from "@/services/api/users";
import { IUser } from "@/schemas/users";
import { Skeleton } from "./ui/skeleton";

export function DataTable() {
  const {
    data: users,
    refetch: refetchUsers,
    isError,
    isLoading,
  } = useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: getUsers,
  });

  const [selectedDialogAndUser, setSelectedDialogAndUser] = useState<{
    user: IUser;
    dialog: "delete" | "edit";
  } | null>(null);

  const columns: ColumnDef<IUser>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          return <span>{row?.original.name}</span>;
        },
        enableHiding: false,
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => {
          return <span>{row?.original.email}</span>;
        },
        enableHiding: false,
      },
      {
        header: "Phone",
        accessorKey: "phone",
        cell: ({ row }) => {
          return <span>{row?.original.phone}</span>;
        },
        enableHiding: false,
      },
      {
        header: "Actions",
        accessorKey: "id",
        cell: ({ row }) => {
          const onActionClick = (type: "edit" | "delete") =>
            setSelectedDialogAndUser({ user: row.original, dialog: type });

          return (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onActionClick("edit")}>
                Edit
              </Button>
              <Button onClick={() => onActionClick("delete")}>Delete</Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: users || [],
    columns,
    state: {
      pagination: {
        pageIndex: 0,
        pageSize: 100,
      },
    },
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="overflow-hidden rounded-lg border m-4">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8">
            <DataStateHandler
              data={users}
              isError={isError}
              isLoading={isLoading}
              ErrorComponent={() => (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Failed loading data.
                  </TableCell>
                </TableRow>
              )}
              LoadingComponent={() =>
                Array(5)
                  .fill(null)
                  .map((_, index) => (
                    <TableRow key={`loading-row-${index}`}>
                      <TableCell>
                        <Skeleton className="h-6 w-[250px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[100px]" />
                      </TableCell>
                    </TableRow>
                  ))
              }
              NoDataComponent={() => (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            >
              <SortableContext
                items={table.getRowModel().rows.map((row) => row.id)}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </SortableContext>
            </DataStateHandler>
          </TableBody>
        </Table>
      </div>
      {selectedDialogAndUser?.dialog === "delete" && (
        <DeleteUserDialog
          onDelete={refetchUsers}
          user={selectedDialogAndUser.user}
          onCancel={() => setSelectedDialogAndUser(null)}
        />
      )}
      {selectedDialogAndUser?.dialog === "edit" && (
        <EditUserDialog
          onEdit={refetchUsers}
          user={selectedDialogAndUser.user}
          onCancel={() => setSelectedDialogAndUser(null)}
        />
      )}
    </>
  );
}
