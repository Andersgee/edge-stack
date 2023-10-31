"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "#src/components/ui/alert-dialog";
import { Button, type buttonVariants } from "#src/components/ui/button";
import { type VariantProps } from "class-variance-authority";

type Props = {
  //className?: string;
  onAction: (didConfirm: boolean) => void;
  /** Are you absolutely sure? */
  title: string;
  /** This action cannot be undone. */
  description: string;
  cancelLabel: string;
  actionLabel: string;
} & VariantProps<typeof buttonVariants> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export function ButtonWithConfirmDialog({ title, description, actionLabel, cancelLabel, onAction, ...props }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button {...props} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onAction(false)}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={() => onAction(true)}>{actionLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
