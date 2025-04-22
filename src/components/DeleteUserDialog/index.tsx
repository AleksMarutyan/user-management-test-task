import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "./../ui/alert-dialog";
import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "@/services/api/users";
import { IUser } from "@/schemas/users";

export const DeleteUserDialog = ({
  user,
  onCancel,
  onDelete,
}: {
  user: IUser;
  onCancel: () => void;
  onDelete: () => void;
}) => {
  const { mutate, isPending } = useMutation({
    mutationFn: deleteUser,
    onError: (error) => {
      toast.error(`Failed deleting user: ${error}`);
    },
    onSuccess: () => {
      toast.success(`User ${user.name} deleted successfully`);
      onDelete();
      onCancel();
    },
  });

  const handleDelete = () => {
    mutate(user.id);
  };

  return (
    <AlertDialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onCancel();
        }
      }}
    >
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{`Are you sure you want to delete user ${user.name} ?`}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleDelete}>
            {isPending ? "Deleting..." : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
