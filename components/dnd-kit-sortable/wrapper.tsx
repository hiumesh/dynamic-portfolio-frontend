import React from "react";

import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function Wrapper({ children, className }: Props) {
  return (
    <div className={cn("flex w-full box-border justify-start", className)}>
      {children}
    </div>
  );
}
