import { toast } from "sonner";
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
import { useInvalidateQuery } from "@/hooks/use-invalidate-query";
import { useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { createUser, updateUser } from "@/services/api/users";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IUser } from "@/schemas/users";
import { Input } from "../ui/input";

type EditUserType = Pick<IUser, "name" | "email" | "phone">;

export const CreateUserZodSchema: ZodType<EditUserType> = z.object({
  email: z.string().email("Email is not valid"),
  name: z
    .string()
    .min(3, { message: "Name must consist at least of three characters" }),
  phone: z.string().min(1, { message: "Phone is required" }),
});

export function EditUserDialog({
  user,
  onEdit,
  onCancel,
}: {
  user: IUser;
  onEdit: () => void;
  onCancel: () => void;
}) {
  const { invalidateQuery } = useInvalidateQuery();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditUserType>({
    mode: "all",
    defaultValues: user,
    resolver: zodResolver(CreateUserZodSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (userData: IUser) => updateUser(userData),
    onSuccess: async () => {
      await invalidateQuery(QUERY_KEYS.USERS);
      toast.success("User edited successfully");
      reset();
      onEdit();
      onCancel();
    },
    onError: (error) => {
      toast.error(`Failed editing user`);
    },
  });

  const onSubmit: SubmitHandler<EditUserType> = (updateUserData) => {
    mutate({ ...user, ...updateUserData });
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
    >
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
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
              {isPending ? "Editing user..." : "Edit user"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
