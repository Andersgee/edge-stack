import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "#src/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center  rounded-md text-sm font-bold ring-offset-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-accent-focus disabled:pointer-events-none disabled:opacity-50 ",
  {
    variants: {
      variant: {
        primary: "h-12 bg-primary-600 px-4 py-2 text-primary-100 hover:bg-primary-500 hover:text-primary-50",
        warning:
          "h-12 bg-accent-warning-600 px-4 py-2 text-accent-warning-100 hover:bg-accent-warning-500 hover:text-accent-warning-50",
        danger:
          "h-12 bg-accent-danger-600 px-4 py-2 text-accent-danger-100 hover:bg-accent-danger-500 hover:text-accent-danger-50",
        positive:
          "h-12 bg-accent-positive-600 px-4 py-2 text-accent-positive-100 hover:bg-accent-positive-500 hover:text-accent-positive-50",
        link: "h-12 bg-neutral-100 px-4 py-2 text-neutral-900 underline-offset-4 hover:underline",
        icon: "border border-neutral-300 bg-neutral-50 p-3 text-neutral-900 hover:bg-accent-highlight-50 hover:text-neutral-950",
        outline: "bg-background hover:bg-accent hover:text-accent-foreground border border-neutral-500",
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
