import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useForm, SubmitHandler } from "react-hook-form";
import { createUser } from "@/services/api/users";
import { Label } from "@/components/ui/label";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IUser } from "@/schemas/users";
import { Input } from "./ui/input";
import { useState } from "react";

type CreateUserType = Pick<IUser, "name" | "email" | "phone">;

export const CreateUserZodSchema: ZodType<CreateUserType> = z.object({
  email: z.string().email("Email is not valid"),
  name: z
    .string()
    .min(3, { message: "Name must consist at least of three characters" }),
  phone: z.string().min(1, { message: "Phone is required" }),
});

// TODO: onCreateUser should refetch the data for users
export function SiteHeader({ onCreateUser }: { onCreateUser?: () => void }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserType>({
    mode: "all",
    resolver: zodResolver(CreateUserZodSchema),
  });

  const onSubmit: SubmitHandler<CreateUserType> = async (data) => {
    try {
      await createUser(data);

      if (onCreateUser) {
        onCreateUser();
      }

      reset();

      setDialogOpen(false);
    } catch (error) {
      // TODO show toast
      console.error("Error creating user:", error);
    }
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <h1 className="text-base font-medium">Users dashboard</h1>
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
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
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
                  <Button type="submit">Create User</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
