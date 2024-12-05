import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  Active,
  Announcements,
  closestCenter,
  CollisionDetection,
  DragOverlay,
  DndContext,
  DropAnimation,
  KeyboardSensor,
  KeyboardCoordinateGetter,
  Modifiers,
  MouseSensor,
  MeasuringConfiguration,
  PointerActivationConstraint,
  ScreenReaderInstructions,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
  SortingStrategy,
  rectSortingStrategy,
  AnimateLayoutChanges,
  NewIndexGetter,
} from "@dnd-kit/sortable";

// import { createRange } from "@/utils/helpers";
import { Item } from "./item";
import { List } from "./list";
import { Wrapper } from "./wrapper";

interface GetStylesArgs {
  id: UniqueIdentifier;
  index: number;
  active: Pick<Active, "id"> | null;
  isDragging: boolean;
  isSorting: boolean;
  isDragOverlay: boolean;
  overIndex: number;
}

export interface SortableProps {
  activationConstraint?: PointerActivationConstraint;
  animateLayoutChanges?: AnimateLayoutChanges;
  adjustScale?: boolean;
  collisionDetection?: CollisionDetection;
  coordinateGetter?: KeyboardCoordinateGetter;
  Container?: any; // To-do: Fix me
  dropAnimation?: DropAnimation | null;
  getNewIndex?: NewIndexGetter;
  handle?: boolean;
  itemCount?: number;
  items: UniqueIdentifier[];
  setOriginalItems: React.Dispatch<React.SetStateAction<any[]>>;
  itemsMap?: {
    [K in UniqueIdentifier]: any;
  };
  measuring?: MeasuringConfiguration;
  modifiers?: Modifiers;
  renderItem?: any;
  removable?: boolean;
  onRemove?: (id: UniqueIdentifier) => Promise<boolean>;
  onReorder?: (id: UniqueIdentifier, index: number) => Promise<boolean>;
  reorderItems?: typeof arrayMove;
  strategy?: SortingStrategy;
  useDragOverlay?: boolean;
  wrapperStyle?(args: GetStylesArgs): React.CSSProperties;
  itemStyle?(args: GetStylesArgs): React.CSSProperties;
  classNames?: {
    container?: string;
    list?: string;
  };
  isDisabled?(id: UniqueIdentifier): boolean;
}

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
};

const screenReaderInstructions: ScreenReaderInstructions = {
  draggable: `
    To pick up a sortable item, press the space bar.
    While sorting, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.
  `,
};

export default function Sortable({
  activationConstraint,
  animateLayoutChanges,
  adjustScale = false,
  Container = List,
  collisionDetection = closestCenter,
  coordinateGetter = sortableKeyboardCoordinates,
  dropAnimation = dropAnimationConfig,
  getNewIndex,
  handle = false,
  // itemCount = 16,
  itemsMap,
  items,
  setOriginalItems,
  isDisabled = () => false,
  measuring,
  modifiers,
  removable,
  onRemove,
  onReorder,
  renderItem,
  reorderItems = arrayMove,
  strategy = rectSortingStrategy,
  classNames,
  useDragOverlay = true,
  itemStyle = () => ({}),
  wrapperStyle = () => ({}),
}: SortableProps) {
  // const [items, setItems] = useState<UniqueIdentifier[]>(
  //   () =>
  //     initialItems ??
  //     createRange<UniqueIdentifier>(itemCount, (index) => index + 1)
  // );
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint,
    }),
    useSensor(TouchSensor, {
      activationConstraint,
    }),
    useSensor(KeyboardSensor, {
      // Disable smooth scrolling in Cypress automated tests
      scrollBehavior: "Cypress" in window ? "auto" : undefined,
      coordinateGetter,
    })
  );
  const isFirstAnnouncement = useRef(true);
  const getIndex = (id: UniqueIdentifier) => items.indexOf(id);
  const getPosition = (id: UniqueIdentifier) => getIndex(id) + 1;
  const activeIndex = activeId ? getIndex(activeId) : -1;
  const handleRemove = useCallback(
    async (id: UniqueIdentifier) => {
      // const original = items;
      // const filtered = items.filter((item) => item !== id);
      try {
        await onRemove?.(id);
        // setItems(filtered);
        // if (onRemove) {
        //   const isSuccess = await onRemove(id);
        //   if (!isSuccess) {
        //     setItems(original);
        //   } else {
        //     setItems(filtered);
        //   }

        //   return isSuccess;
        // }
        // setItems(filtered);
        return true;
      } catch (error) {
        // setItems(original);
        return false;
      }
    },
    [onRemove]
  );
  const announcements: Announcements = {
    onDragStart({ active: { id } }) {
      return `Picked up sortable item ${String(
        id
      )}. Sortable item ${id} is in position ${getPosition(id)} of ${
        items.length
      }`;
    },
    onDragOver({ active, over }) {
      // In this specific use-case, the picked up item's `id` is always the same as the first `over` id.
      // The first `onDragOver` event therefore doesn't need to be announced, because it is called
      // immediately after the `onDragStart` announcement and is redundant.
      if (isFirstAnnouncement.current === true) {
        isFirstAnnouncement.current = false;
        return;
      }

      if (over) {
        return `Sortable item ${
          active.id
        } was moved into position ${getPosition(over.id)} of ${items.length}`;
      }

      return;
    },
    onDragEnd({ active, over }) {
      if (over) {
        return `Sortable item ${
          active.id
        } was dropped at position ${getPosition(over.id)} of ${items.length}`;
      }

      return;
    },
    onDragCancel({ active: { id } }) {
      return `Sorting was cancelled. Sortable item ${id} was dropped and returned to position ${getPosition(
        id
      )} of ${items.length}.`;
    },
  };

  useEffect(() => {
    if (!activeId) {
      isFirstAnnouncement.current = true;
    }
  }, [activeId]);

  return (
    <DndContext
      accessibility={{
        announcements,
        screenReaderInstructions,
      }}
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={({ active }) => {
        if (!active) {
          return;
        }

        setActiveId(active.id);
      }}
      onDragEnd={async ({ active, over }) => {
        setActiveId(null);
        if (over) {
          const overIndex = getIndex(over.id);
          try {
            if (activeIndex !== overIndex) {
              setOriginalItems((items) =>
                reorderItems(items, activeIndex, overIndex)
              );
              const isSuccess = await onReorder?.(
                active.id,
                items.length - overIndex
              );
              if (!isSuccess) {
                setOriginalItems((items) =>
                  reorderItems(items, overIndex, activeIndex)
                );
              }
            }
          } catch (e) {
            setOriginalItems((items) =>
              reorderItems(items, overIndex, activeIndex)
            );
          }
        }
      }}
      onDragCancel={() => setActiveId(null)}
      measuring={measuring}
      modifiers={modifiers}
    >
      <Wrapper className={classNames?.container}>
        <SortableContext items={items} strategy={strategy}>
          <Container className={classNames?.list}>
            {items.map((value, index) => (
              <SortableItem
                key={value}
                id={value}
                value={itemsMap ? itemsMap[value] || value : value}
                handle={handle}
                index={index}
                style={itemStyle}
                wrapperStyle={wrapperStyle}
                disabled={isDisabled(value)}
                renderItem={renderItem}
                onRemove={removable ? () => handleRemove?.(value) : undefined}
                animateLayoutChanges={animateLayoutChanges}
                useDragOverlay={useDragOverlay}
                getNewIndex={getNewIndex}
              />
            ))}
          </Container>
        </SortableContext>
      </Wrapper>
      {useDragOverlay
        ? createPortal(
            <DragOverlay
              adjustScale={adjustScale}
              dropAnimation={dropAnimation}
            >
              {activeId ? (
                <Item
                  value={
                    itemsMap ? itemsMap[items[activeIndex]] : items[activeIndex]
                  }
                  handle={handle}
                  renderItem={renderItem}
                  onRemove={
                    removable ? () => handleRemove?.(activeId) : undefined
                  }
                  wrapperStyle={wrapperStyle({
                    id: items[activeIndex],
                    index: activeIndex,
                    active: { id: activeId },
                    isSorting: activeId !== null,
                    isDragging: true,
                    overIndex: -1,
                    isDragOverlay: true,
                  })}
                  style={itemStyle({
                    id: items[activeIndex],
                    index: activeIndex,
                    active: { id: activeId },
                    isSorting: activeId !== null,
                    isDragging: true,
                    overIndex: -1,
                    isDragOverlay: true,
                  })}
                  dragOverlay
                />
              ) : null}
            </DragOverlay>,
            document.body
          )
        : null}
    </DndContext>
  );
}

interface SortableItemProps {
  animateLayoutChanges?: AnimateLayoutChanges;
  disabled?: boolean;
  getNewIndex?: NewIndexGetter;
  id: UniqueIdentifier;
  index: number;
  value: any;
  handle: boolean;
  useDragOverlay?: boolean;
  onRemove?: () => Promise<boolean>;
  style: SortableProps["itemStyle"];
  wrapperStyle: SortableProps["wrapperStyle"];
  renderItem?(args: any): React.ReactElement;
}

export function SortableItem({
  disabled,
  animateLayoutChanges,
  getNewIndex,
  handle,
  id,
  index,
  value,
  onRemove,
  style,
  renderItem,
  useDragOverlay,
  wrapperStyle,
}: SortableItemProps) {
  const {
    active,
    attributes,
    isDragging,
    isSorting,
    listeners,
    overIndex,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
    disabled,
    getNewIndex,
  });

  return (
    <Item
      ref={setNodeRef}
      value={value || id}
      disabled={disabled}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      handleProps={
        handle
          ? {
              ref: setActivatorNodeRef,
            }
          : undefined
      }
      renderItem={renderItem}
      index={index}
      style={style?.({
        id,
        index,
        active,
        isDragging,
        isSorting,
        overIndex,
        isDragOverlay: !useDragOverlay && isDragging,
      })}
      wrapperStyle={wrapperStyle?.({
        id,
        index,
        active,
        isDragging,
        isSorting,
        overIndex,
        isDragOverlay: !useDragOverlay && isDragging,
      })}
      onRemove={onRemove}
      transform={transform}
      transition={transition}
      listeners={listeners}
      data-index={index}
      data-id={id}
      dragOverlay={!useDragOverlay && isDragging}
      {...attributes}
    />
  );
}
