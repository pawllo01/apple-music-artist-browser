import { Button, Dropdown, DropdownHeader } from "flowbite-react";
import { LuColumns4 } from "react-icons/lu";

import { move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import type { Table } from "@tanstack/react-table";

import type { SongWithChildren } from "../../../@types/song-with-children";
import SortableDropdownItem from "./SortableDropdownItem";

type DropdownColumnsProps = {
  table: Table<SongWithChildren>;
  setColumnOrder: React.Dispatch<React.SetStateAction<string[]>>;
  groupSongs: boolean;
};

export default function DropdownColumns({
  table,
  setColumnOrder,
  groupSongs,
}: DropdownColumnsProps) {
  return (
    <Dropdown
      dismissOnClick={false}
      className="dropdown"
      renderTrigger={() => (
        <Button color="alternative" className="h-auto px-3" title="Columns">
          <LuColumns4 size={24} />
        </Button>
      )}
    >
      <DropdownHeader className="font-medium">Columns</DropdownHeader>

      <DragDropProvider
        onDragEnd={(event) => {
          setColumnOrder((order) => move(order, event));
        }}
      >
        {table.getAllLeafColumns().map((column, index) => (
          <SortableDropdownItem
            key={column.id}
            column={column}
            index={index}
            groupSongs={groupSongs}
          />
        ))}
      </DragDropProvider>
    </Dropdown>
  );
}
