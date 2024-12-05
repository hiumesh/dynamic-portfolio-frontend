import DeleteConfirmation from "@/components/delete-confirmation";
import IconButton from "@/components/icon-button";
import { Button } from "@/components/ui/button";
import { CarbonDragIcon } from "@/lib/icons";
import { DraggableSyntheticListeners } from "@dnd-kit/core";
import { DragHandleDots1Icon } from "@radix-ui/react-icons";
import { Edit, Icon, Trash2 } from "lucide-react";

interface PropTypes {
  data: UserWorkExperience;
  onEdit?: (data: UserWorkExperience) => void;
  onRemove?: () => Promise<boolean>;
  listeners?: DraggableSyntheticListeners;
}

export default function ExperienceCard({
  data,
  onEdit,
  onRemove,
  listeners,
}: PropTypes) {
  return (
    <div className="flex items-center gap-3 w-full">
      <Button
        {...listeners}
        variant="ghost"
        size="icon"
        className="text-lg cursor-grab"
      >
        <CarbonDragIcon />
      </Button>

      <div className="flex-1 flex flex-col space-y-3">
        <div>
          <p className="text-md text-lg">{data.company_name}</p>
          <p className="text-small text-default-500">{data.job_title}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <IconButton label="Edit" onClick={() => onEdit?.(data)}>
          <Edit className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
        </IconButton>
        <DeleteConfirmation
          itemName={data.company_name}
          onDelete={onRemove}
          button={
            <IconButton label="Remove">
              <Trash2 className="h-5 w-5 text-red-500 hover:text-red-700" />
            </IconButton>
          }
        />
      </div>
    </div>
  );
}
