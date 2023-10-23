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
          "bg-theme-primary-200 px-4 py-2 text-theme-primary-700 hover:bg-theme-primary-300 hover:text-theme-primary-800",
        danger:
          "bg-theme-accent-danger-100 px-4 py-2 text-theme-accent-danger-700 hover:bg-theme-accent-danger-200 hover:text-theme-accent-danger-800",
        warning:
          "bg-theme-accent-warning-100 px-4 py-2 text-theme-accent-warning-700 hover:bg-theme-accent-warning-200 hover:text-theme-accent-warning-800",
        positive:
          "bg-theme-accent-positive-200 px-4 py-2 text-theme-accent-positive-700 hover:bg-theme-accent-positive-300 hover:text-theme-accent-positive-800",
        outline:
          "border border-theme-neutral-300 bg-theme-neutral-50 p-[10px] text-theme-neutral-900 hover:bg-theme-neutral-200 hover:text-theme-neutral-1000",
        icon: "rounded-full bg-theme-neutral-100 p-[10px] text-theme-neutral-900 hover:bg-theme-neutral-200 hover:text-theme-neutral-1000",
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
