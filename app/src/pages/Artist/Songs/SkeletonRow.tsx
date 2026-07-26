import { TableCell, TableRow } from "flowbite-react";
import Skeleton from "react-loading-skeleton";
import type { Column } from "@tanstack/react-table";
import type { SongWithChildren } from "../../../@types/song-with-children";

type SkeletonRowProps = {
  columns: Column<SongWithChildren, unknown>[];
};

export default function SkeletonRow({ columns }: SkeletonRowProps) {
  return (
    <TableRow className="song-table-row">
      {columns.map((column) => (
        <TableCell
          key={column.id}
          className={`song-table-cell ${column.columnDef.meta?.className}`}
        >
          {column.id === "cover" ? (
            <Skeleton
              width={48}
              height={48}
              containerClassName="block leading-none"
            />
          ) : (
            <span className="w-full">
              <Skeleton height={20} />
            </span>
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}
