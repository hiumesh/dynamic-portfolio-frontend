import DeleteConfirmation from "@/components/delete-confirmation";
import IconButton from "@/components/icon-button";
import { Button } from "@/components/ui/button";
import { CarbonDragIcon } from "@/lib/icons";
import { DraggableSyntheticListeners } from "@dnd-kit/core";
import { DragHandleDots1Icon } from "@radix-ui/react-icons";
import { Edit, Icon, Trash2 } from "lucide-react";

interface PropTypes {
  data: UserEducation;
  onEdit?: (data: UserEducation) => void;
  onRemove?: () => Promise<boolean>;
  listeners?: DraggableSyntheticListeners;
}

export default function EducationCard({
  data,
  onEdit,
  onRemove,
  listeners,
}: PropTypes) {
  let content;
  if (data.type == "COLLEGE")
    content = (
      <>
        <div>
          <p className="text-md text-lg">{data.institute_name}</p>
          <p className="text-small text-default-500">
            {data.attributes?.field_of_study}
          </p>
        </div>
        <div className="flex flex-nowrap text-xs text-gray-500">
          <p>
            {data.attributes?.start_year}&nbsp;-&nbsp;
            {data.attributes?.end_year}
          </p>
          &nbsp;|&nbsp;
          <p>{data?.grade} CGPA</p>
        </div>
      </>
    );
  if (data.type == "SCHOOL")
    content = (
      <>
        <div>
          <p className="text-md">{data.institute_name}</p>
          <p className="text-small text-default-500">
            {data.attributes?.class}
          </p>
        </div>
        <div></div>
      </>
    );

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

      <div className="flex-1 flex flex-col space-y-3">{content}</div>
      <div className="flex gap-2">
        <IconButton label="Edit" onClick={() => onEdit?.(data)}>
          <Edit className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
        </IconButton>
        <DeleteConfirmation
          itemName={data.institute_name}
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
