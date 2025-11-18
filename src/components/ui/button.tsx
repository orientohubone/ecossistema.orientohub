import * as React from "react";
import clsx from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "md", ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "transition-colors font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none",
          variant === "default" && "bg-primary-500 text-white hover:bg-primary-600",
          variant === "outline" && "bg-transparent border border-primary-500 text-primary-700 hover:bg-primary-50",
          size === "sm" && "px-3 py-1 text-sm",
          size === "md" && "px-4 py-2 text-base",
          size === "lg" && "px-6 py-3 text-lg",
          size === "icon" && "p-2 w-9 h-9 flex items-center justify-center",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
