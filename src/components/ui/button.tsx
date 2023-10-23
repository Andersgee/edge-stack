import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { focusVisibleStyles } from "./styles";

const buttonVariants = cva(
  [
    "flex h-11 items-center justify-center rounded-md text-sm font-bold transition-colors disabled:pointer-events-none disabled:opacity-50",
    focusVisibleStyles,
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-color-primary-200 text-color-primary-700 hover:bg-color-primary-300 hover:text-color-primary-800 px-4 py-2",
        danger:
          "bg-color-accent-danger-100 text-color-accent-danger-700 hover:bg-color-accent-danger-200 hover:text-color-accent-danger-800 px-4 py-2",
        warning:
          "bg-color-accent-warning-100 text-color-accent-warning-700 hover:bg-color-accent-warning-200 hover:text-color-accent-warning-800 px-4 py-2",
        positive:
          "bg-color-accent-positive-200 text-color-accent-positive-700 hover:bg-color-accent-positive-300 hover:text-color-accent-positive-800 px-4 py-2",
        outline:
          "border-color-neutral-300 bg-color-neutral-50 text-color-neutral-900 hover:bg-color-neutral-200 hover:text-color-neutral-1000 border p-[10px]",
        icon: "bg-color-neutral-100 text-color-neutral-900 hover:bg-color-neutral-200 hover:text-color-neutral-1000 rounded-full p-[10px]",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={buttonVariants({ variant, className })} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
