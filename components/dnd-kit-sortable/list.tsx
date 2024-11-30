import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface Props {
  children: React.ReactNode;
  columns?: number;
  horizontal?: boolean;
  className?: string;
}

export const List = forwardRef<HTMLUListElement, Props>(
  ({ children, columns = 1, horizontal, className }: Props, ref) => {
    return (
      <ul
        ref={ref}
        className={cn(
          `grid grid-cols-[var(--columns)] w-full auto-rows-max box-border gap-2 rounded-md min-h-[200px] transition-colors duration-350`,
          horizontal && "w-full grid-flow-col",
          className
        )}
        style={
          {
            "--columns": columns,
          } as React.CSSProperties
        }
      >
        {children}
      </ul>
    );
  }
);

List.displayName = "List";
