import { Button } from "flowbite-react";

type ClearFilterProps = {
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
};

export default function ClearFilter({ setGlobalFilter }: ClearFilterProps) {
  return (
    <div className="my-8 text-center text-gray-500 dark:text-gray-400">
      <p>No results found.</p>

      <Button
        color="red"
        className="gradient mx-auto mt-2 rounded-full"
        onClick={() => setGlobalFilter("")}
      >
        Clear filter
      </Button>
    </div>
  );
}
