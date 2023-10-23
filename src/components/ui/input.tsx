import * as React from "react";

import { cn } from "#src/utils/cn";
import { focusVisibleStyles } from "./styles";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full  rounded-md border border-theme-neutral-400 bg-theme-neutral-0 px-3 py-6 text-sm text-theme-neutral-1000 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-theme-neutral-500 disabled:cursor-not-allowed disabled:bg-theme-neutral-200 disabled:text-theme-neutral-400",
        focusVisibleStyles,
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
