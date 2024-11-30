import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { SolarFileIcon } from "@/lib/icons";

interface PropTypes {
  isVertical?: boolean;
  title: string;
  subTitle: string;
  actionHandler?: () => void;
}

export default function AvatarHeaderWithAction({
  isVertical = false,
  title,
  subTitle,
  actionHandler,
}: PropTypes) {
  return (
    <div
      className={cn(
        "flex gap-3 items-center",
        isVertical ? "flex-col" : "justify-between"
      )}
    >
      <div
        className={cn(
          "flex gap-3 items-center",
          isVertical && "flex-col text-center"
        )}
      >
        <div className="text-2xl p-2.5 bg-gray-100 rounded-full">
          <SolarFileIcon />
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="opacity-60 text-sm">{subTitle}</p>
        </div>
      </div>
      <Button variant="secondary" onClick={actionHandler}>
        Add New
      </Button>
    </div>
  );
}
