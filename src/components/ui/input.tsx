import * as React from "react";

import { cn } from "#src/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const focusStyles =
  "ring-theme-accent-focus-300 focus-visible:outline-none focus-visible:ring-offset-2 ring-offset-theme-neutral-0 focus-visible:ring-4";

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "border-theme-neutral-400 bg-theme-neutral-0 placeholder:text-theme-neutral-500  disabled:bg-theme-neutral-200 disabled:text-theme-neutral-400 text-theme-neutral-1000 flex h-10 w-full rounded-md border px-3 py-6 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed",
        focusStyles,
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
