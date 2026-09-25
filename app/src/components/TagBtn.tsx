import { Button } from "flowbite-react";

type Props = {
  tag: string;
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function TagBtn({ tag, selectedTags, setSelectedTags }: Props) {
  const isSelected = selectedTags.includes(tag);

  return (
    <Button
      pill
      size="xs"
      color="alternative"
      className={`shrink-0 border-gray-300 px-3.5 font-normal text-gray-500 shadow-xs dark:border-gray-500 dark:bg-transparent dark:text-gray-300 dark:hover:bg-gray-800 ${isSelected ? "gradient border-transparent! text-white!" : ""}`}
      onClick={() => {
        setSelectedTags((prev) =>
          prev.includes(tag) ? prev.filter((t) => t !== tag) : [tag, ...prev],
        );
      }}
    >
      {tag}
    </Button>
  );
}
