import { Button } from "flowbite-react";

type ClearFilterProps = {
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function ClearFilter({
  setGlobalFilter,
  setSelectedTags,
}: ClearFilterProps) {
  return (
    <div className="my-8 text-center text-gray-500 dark:text-gray-300">
      <p>No results found.</p>

      <Button
        color="red"
        className="gradient mx-auto mt-2 rounded-full"
        onClick={() => {
          setGlobalFilter("");
          setSelectedTags([]);
        }}
      >
        Clear filters
      </Button>
    </div>
  );
}
