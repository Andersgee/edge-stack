import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "#src/utils/cn";

const buttonVariants = cva(
  "ring-offset-background inline-flex items-center  justify-center rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-accent-focus disabled:pointer-events-none disabled:opacity-50 ",
  {
    variants: {
      variant: {
        primary: "h-12 bg-primary-600 px-4 py-2 text-primary-200 hover:bg-primary-500 hover:text-primary-100",
        warning:
          "h-12 bg-accent-warning-600 px-4 py-2 text-accent-warning-200 hover:bg-accent-warning-500 hover:text-accent-warning-100",
        danger:
          "h-12 bg-accent-danger-600 px-4 py-2 text-accent-danger-200 hover:bg-accent-danger-500 hover:text-accent-danger-100",
        positive:
          "h-12 bg-accent-positive-600 px-4 py-2 text-accent-positive-200 hover:bg-accent-positive-500 hover:text-accent-positive-100",
        link: "h-12 bg-neutral-100 px-4 py-2 text-neutral-900 underline-offset-4 hover:underline",
        icon: "bg-neutral-100 p-3 text-neutral-800 hover:text-neutral-950",
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
    return <Comp className={cn(buttonVariants({ variant, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
