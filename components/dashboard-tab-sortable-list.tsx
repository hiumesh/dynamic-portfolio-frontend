import Sortable from "@/components/dnd-kit-sortable/sortable";
import { verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ItemProps } from "@/components/dnd-kit-sortable/item";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { DraggableSyntheticListeners } from "@dnd-kit/core";

export interface SortableListItem {
  id: number;
}

interface PropTypes {
  list: SortableListItem[];
  setList: React.Dispatch<React.SetStateAction<SortableListItem[]>>;
  onRemove: (id: number | string) => Promise<boolean>;
  onReorder: (id: number | string, newIndex: number) => Promise<boolean>;
  onEdit: (data: SortableListItem) => void;
  Card: React.ComponentType<{
    data: any;
    onEdit?: (data: any) => void;
    onRemove?: () => Promise<boolean>;
    listeners?: DraggableSyntheticListeners;
  }>;
}

export default function DashboardTabSortableList({
  list,
  setList,
  onRemove,
  onReorder,
  onEdit,
  Card,
}: PropTypes) {
  const listMap = useMemo(() => {
    return list.reduce((acc, education) => {
      acc[education.id] = education;
      return acc;
    }, {} as Record<string, SortableListItem>);
  }, [list]);

  const renderItem: ItemProps["renderItem"] = ({
    dragOverlay,
    dragging,
    sorting,
    index,
    fadeIn,
    listeners,
    ref,
    style,
    transform,
    transition,
    onRemove,
    value,
  }) => {
    return (
      <li
        className={cn(
          "bg-white border-[#efefef] border rounded-lg",
          "flex box-border translate-x-[var(--translate-x,0)] translate-y-[var(--translate-y,0)] scale-x-[var(--scale-x,1)] scale-y-[var(--scale-y,1)] origin-[0%_0%] touch-manipulation",
          fadeIn && "animate-fadeIn",
          sorting && "",
          dragOverlay && "z-[999] shadow-lg"
        )}
        style={
          {
            transition: [transition].filter(Boolean).join(", "),
            "--translate-x": transform
              ? `${Math.round(transform.x)}px`
              : undefined,
            "--translate-y": transform
              ? `${Math.round(transform.y)}px`
              : undefined,
            "--scale-x": transform?.scaleX ? `${transform.scaleX}` : undefined,
            "--scale-y": transform?.scaleY ? `${transform.scaleY}` : undefined,
            "--index": index,
          } as React.CSSProperties
        }
        ref={ref}
      >
        <div
          className={cn(
            "relative flex flex-grow items-center p-2 pr-4 outline-none box-border list-none origin-[50%_50%]",
            dragging && !dragOverlay && "z-0",
            dragOverlay && "cursor-inherit opacity-1"
          )}
          data-cypress="draggable-item"
        >
          <Card
            data={value}
            listeners={listeners}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        </div>
      </li>
    );
  };

  return (
    <div>
      <Sortable
        strategy={verticalListSortingStrategy}
        items={list.map((i) => i.id)}
        setOriginalItems={setList}
        itemsMap={listMap}
        renderItem={renderItem}
        onRemove={onRemove}
        onReorder={onReorder}
        removable={true}
      />
    </div>
  );
}
