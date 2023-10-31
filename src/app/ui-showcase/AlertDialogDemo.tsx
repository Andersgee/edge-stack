"use client";

import { ButtonWithConfirmDialog } from "#src/components/ButtonWithConfirmDialog";
import { cn } from "#src/utils/cn";

type Props = {
  className?: string;
};

export function AlertDialogDemo({ className }: Props) {
  return (
    <div className={cn("", className)}>
      <ButtonWithConfirmDialog
        variant="danger"
        title="Are you absolutely sure?"
        description="This action cannot be undone."
        actionLabel="Delete my account"
        cancelLabel="Cancel"
        onAction={(didConfirm) => console.log(didConfirm)}
        //className="hover:bg-red-800"
      >
        Delete account
      </ButtonWithConfirmDialog>
    </div>
  );
}
