import { Button, Dropdown, DropdownHeader, DropdownItem } from "flowbite-react";
import { TbArrowsSort } from "react-icons/tb";

export type Sort = {
  field: "release-date" | "name" | "id";
  direction: "asc" | "desc";
};

const sortOptions: { label: string; sort: Sort }[] = [
  { label: "Newest", sort: { field: "release-date", direction: "desc" } },
  { label: "Oldest", sort: { field: "release-date", direction: "asc" } },
  { label: "A–Z", sort: { field: "name", direction: "asc" } },
  { label: "Z–A", sort: { field: "name", direction: "desc" } },
  { label: "ID: high to low", sort: { field: "id", direction: "desc" } },
  { label: "ID: low to high", sort: { field: "id", direction: "asc" } },
];

type Props = {
  sort: Sort;
  setSort: React.Dispatch<React.SetStateAction<Sort>>;
};

export default function SortVideosDropdown({ sort, setSort }: Props) {
  return (
    <Dropdown
      className="dropdown"
      dismissOnClick={false}
      renderTrigger={() => (
        <Button color="alternative" className="h-auto px-3" title="Sort by">
          <TbArrowsSort size={24} />
        </Button>
      )}
    >
      <DropdownHeader className="font-medium">Sort by</DropdownHeader>

      {sortOptions.map((option, index) => (
        <DropdownItem
          key={index}
          className={
            JSON.stringify(option.sort) === JSON.stringify(sort)
              ? "text-primary-600 dark:text-primary-400! font-medium"
              : ""
          }
          onClick={() => setSort(option.sort)}
        >
          {option.label}
        </DropdownItem>
      ))}
    </Dropdown>
  );
}
