import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "#src/utils/cn";

const focusStyles =
  "ring-theme-accent-focus-300 focus-visible:outline-none focus-visible:ring-offset-2 ring-offset-theme-neutral-0 focus-visible:ring-4";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-bold transition-colors disabled:pointer-events-none  disabled:opacity-50 ",
  {
    variants: {
      variant: {
        primary:
          "text-theme-primary-700 hover:text-theme-primary-800 bg-theme-primary-200 hover:bg-theme-primary-300 h-12 px-4 py-2",
        warning:
          "text-theme-accent-warning-700 hover:text-theme-accent-warning-800 bg-theme-accent-warning-100 hover:bg-theme-accent-warning-200 h-12 px-4 py-2",
        danger:
          "text-theme-accent-danger-700 hover:text-theme-accent-danger-800 bg-theme-accent-danger-100 hover:bg-theme-accent-danger-200 h-12 px-4 py-2",
        positive:
          "text-theme-accent-positive-700 hover:text-theme-accent-positive-800 bg-theme-accent-positive-200 hover:bg-theme-accent-positive-300 h-12 px-4 py-2",
        link: "bg-theme-neutral-100 text-theme-neutral-900 h-12 px-4 py-2 underline underline-offset-4 hover:underline",
        icon: "border-theme-neutral-300 bg-theme-neutral-50 text-theme-neutral-900 hover:text-theme-neutral-950 hover:bg-theme-accent-highlight-50 border p-3",
        outline: "bg-theme-neutral-100 border-theme-neutral-500 h-12 border px-4 py-2",
      },
      //size: {
      //  default: "h-10 px-4 py-2",
      //  sm: "h-9 rounded-md px-3",
      //  lg: "h-11 rounded-md px-8",
      //  icon: "h-12 w-12 rounded-full p-3",
      //},
    },
    defaultVariants: {
      variant: "primary",
      //size: "default",
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
    return <Comp className={cn(focusStyles, buttonVariants({ variant, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
