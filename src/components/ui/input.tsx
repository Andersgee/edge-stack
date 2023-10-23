import * as React from "react";

import { cn } from "#src/utils/cn";
import { focusVisibleStyles } from "./styles";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const inputElementStyles =
  "border-color-neutral-400 bg-color-neutral-0 text-color-neutral-1000  placeholder:text-color-neutral-500 disabled:bg-color-neutral-200 disabled:text-color-neutral-400 flex h-10 w-full rounded-md border px-3 py-6 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed outline-none";

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return <input type={type} className={cn(inputElementStyles, focusVisibleStyles, className)} ref={ref} {...props} />;
});
Input.displayName = "Input";

export { Input };
