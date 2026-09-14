import { Button, ButtonGroup } from "flowbite-react";

type Option<T extends string> = {
  value: T;
  label: React.ReactNode;
};

type TabSelectorProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export default function TabSelector<T extends string>({
  options,
  value,
  onChange,
}: TabSelectorProps<T>) {
  return (
    <ButtonGroup className="mt-4 mb-0.5 w-full rounded-full max-md:grid max-md:grid-cols-3 max-md:gap-y-1 max-md:shadow-none">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Button
            key={option.value}
            color="alternative"
            className={`flex-1 gap-1 px-2 text-gray-500 first:rounded-s-full last:rounded-e-full focus:ring-0 max-sm:h-11 dark:bg-gray-700 dark:text-gray-300 ${active ? "bg-gray-500! text-white!" : ""}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        );
      })}
    </ButtonGroup>
  );
}
