import { toast } from "sonner";
import { useState } from "react";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { createUser } from "@/services/api/users";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IUser } from "@/schemas/users";
import { Input } from "./ui/input";
import { useMutation } from "@tanstack/react-query";
import { useInvalidateQuery } from "@/hooks/use-invalidate-query";
import { QUERY_KEYS } from "@/constants/queryKeys";

type CreateUserType = Pick<IUser, "name" | "email" | "phone">;

export const CreateUserZodSchema: ZodType<CreateUserType> = z.object({
  email: z.string().email("Email is not valid"),
  name: z
    .string()
    .min(3, { message: "Name must consist at least of three characters" }),
  phone: z.string().min(1, { message: "Phone is required" }),
});

export function SiteHeader() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { invalidateQuery } = useInvalidateQuery();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserType>({
    mode: "all",
    resolver: zodResolver(CreateUserZodSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      await invalidateQuery(QUERY_KEYS.USERS);
      toast.success("User created successfully");
      reset();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed creating user`);
    },
  });

  const onSubmit: SubmitHandler<CreateUserType> = (data) => {
    mutate(data);
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex p-2 w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <h1 className="text-base font-medium">Users</h1>
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="ml-auto flex items-center gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Add user</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add user</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label className="text-sm font-medium mb-2">Name</Label>
                    <Input {...register("name")} />
                    {errors.name && (
                      <span className="mt-1" style={{ color: "red" }}>
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-2">Email</Label>

                    <Input {...register("email")} />
                    {errors.email && (
                      <span className="mt-1" style={{ color: "red" }}>
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium mb-1">Phone</Label>
                    <Input {...register("phone")} />
                    {errors.phone && (
                      <span className="mt-2" style={{ color: "red" }}>
                        {errors.phone.message}
                      </span>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Adding user..." : "Add user"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
