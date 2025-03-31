import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const MaxWidthWrapper = ({
  outerClassName,
  className,
  children,
}: {
  outerClassName?: string;
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div className={outerClassName}>
      <div className={cn("mx-auto w-full max-w-screen-lg px-2.5", className)}>
        {children}
      </div>
    </div>
  );
};

export default MaxWidthWrapper;
