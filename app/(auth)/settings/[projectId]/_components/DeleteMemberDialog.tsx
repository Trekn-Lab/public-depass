import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";

type RemoveMemberDialogProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  username: string;
};

export default function RemoveMemberDialog({
  open,
  onCancel,
  onConfirm,
  username
}: RemoveMemberDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to remove {username} access?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
