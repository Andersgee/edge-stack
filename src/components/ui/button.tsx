import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "#src/utils/cn";

const buttonVariants = cva(
  "ring-offset-background inline-flex items-center  justify-center rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-accent-focus disabled:pointer-events-none disabled:opacity-50 ",
  {
    variants: {
      variant: {
        default: "h-12 bg-primary-600 px-4 py-2 text-primary-200 hover:bg-primary-500 hover:text-primary-100",
        destructive:
          "h-12 bg-accent-danger-600 px-4 py-2 text-accent-danger-200 hover:bg-accent-danger-500 hover:text-accent-danger-100",
        outline: "border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 border px-4 py-2",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 h-12 px-4 py-2",
        ghost: "hover:bg-accent hover:text-accent-foreground h-12 px-4 py-2",
        link: "text-primary h-12 px-4 py-2 underline-offset-4 hover:underline",
        icon: "text-primary bg-neutral-200 p-3 hover:bg-neutral-100",
      },
      //size: {
      //  default: "h-10 px-4 py-2",
      //  sm: "h-9 rounded-md px-3",
      //  lg: "h-11 rounded-md px-8",
      //  icon: "h-12 w-12 rounded-full p-3",
      //},
    },
    defaultVariants: {
      variant: "default",
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
