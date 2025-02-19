import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const MaxWidthWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={cn(className)}>
      <div className={cn("mx-auto w-full max-w-screen-lg px-2.5")}>
        {children}
      </div>
    </div>
  );
};

export default MaxWidthWrapper;
