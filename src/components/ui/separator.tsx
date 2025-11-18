import * as React from "react";
import clsx from "clsx";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={clsx(
        orientation === "horizontal"
          ? "h-px w-full bg-muted-foreground/20 my-2"
          : "w-px h-full bg-muted-foreground/20 mx-2",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = "Separator";
