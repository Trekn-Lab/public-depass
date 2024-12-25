import { cn } from "@/lib/utils";
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", startIcon, endIcon, ...props }, ref) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;

    return (
      <div className="w-full relative">
        {StartIcon && (
          <div className="absolute left-1.5 top-1/2 transform -translate-y-1/2">
            {StartIcon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            "p-3 text-base leading-6 h-12",
            className
          )}
          {...props}
        />
        {EndIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {EndIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
