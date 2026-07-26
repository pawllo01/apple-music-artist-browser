import { useRef, useState } from "react";
import { Button, Checkbox, DropdownItem, Label } from "flowbite-react";
import { MdDragIndicator } from "react-icons/md";
import { useSortable } from "@dnd-kit/react/sortable";
import type { Column } from "@tanstack/react-table";
import type { SongWithChildren } from "../../../@types/song-with-children";

type SortableDropdownItemProps = {
  column: Column<SongWithChildren, unknown>;
  index: number;
  groupSongs: boolean;
};

export default function SortableDropdownItem({
  column,
  index,
  groupSongs,
}: SortableDropdownItemProps) {
  // https://dndkit.com/react/hooks/use-sortable/
  const [element, setElement] = useState<Element | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const { isDragging } = useSortable({
    id: column.id,
    index,
    element,
    handle: handleRef,
  });

  const disabled =
    !column.getCanHide() || (!groupSongs && column.id === "group");

  return (
    <DropdownItem
      ref={setElement}
      data-shadow={isDragging || undefined}
      as={Label}
      disabled={disabled}
      className="flex items-center gap-2 py-1 pe-2"
    >
      <Checkbox
        tabIndex={-1}
        disabled={disabled}
        checked={column.getIsVisible()}
        onChange={column.getToggleVisibilityHandler()}
      />

      <span className="capitalize">
        {typeof column.columnDef.header === "string"
          ? column.columnDef.header
          : column.id}
      </span>

      <Button
        tabIndex={-1}
        ref={handleRef}
        color="alternative"
        className="ms-auto h-auto cursor-grab! rounded! border-none bg-transparent! px-1 py-1.5 hover:bg-gray-200"
      >
        <MdDragIndicator size={16} />
      </Button>
    </DropdownItem>
  );
}
