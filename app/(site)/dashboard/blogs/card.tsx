import DeleteConfirmation from "@/components/delete-confirmation";
import IconButton from "@/components/icon-button";
import { Chip } from "@nextui-org/react";
import { Edit, Trash2 } from "lucide-react";
import { DateFormatter } from "@internationalized/date";

const formatter = new DateFormatter("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

interface PropTypes {
  data: BlogPost;
  onEdit?: (data: BlogPost) => void;
  onRemove?: () => Promise<boolean> | void;
}

export default function BlogCard({ data, onEdit, onRemove }: PropTypes) {
  return (
    <div className="flex items-center gap-3 w-full bg-secondary p-4 rounded">
      <div className="flex-1 flex flex-col space-y-3">
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <p className="text-xl font-medium">{data.title}</p>
            {data.published_at ? (
              <Chip size="sm" color="primary">
                Published
              </Chip>
            ) : (
              <Chip size="sm" color="primary">
                Draft
              </Chip>
            )}
          </div>
          <div className="flex gap-3 items-center">
            {data.published_at ? (
              <p className="text-gray-600 text-sm">
                <span className="text-black">Published At</span>&nbsp;
                {formatter.format(new Date(data.published_at))}
              </p>
            ) : null}
            <p className="text-gray-600 text-sm">
              <span className="text-black">Edited</span>&nbsp;
              {formatter.format(new Date(data.updated_at))}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            {data.tags?.map((tag) => (
              <Chip
                key={tag}
                variant="solid"
                color="primary"
                startContent={<span className="text-xs pl-1">#</span>}
              >
                {tag}
              </Chip>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <IconButton label="Edit" onClick={() => onEdit?.(data)}>
          <Edit className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
        </IconButton>
        <DeleteConfirmation
          itemName={data.title}
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
