import { Badge } from "flowbite-react";

type Props = {
  title: string;
  count: number;
  className?: string;
};

export default function GroupTitle({ title, count, className = "" }: Props) {
  return (
    <h3
      className={`flex items-center gap-x-1.5 border-b border-b-gray-300 pb-1 dark:border-b-gray-500 ${className}`}
    >
      <span className="text-2xl leading-none font-bold">{title}</span>
      <Badge
        size="sm"
        color="alternative"
        className="bg-gray-200 dark:bg-gray-600"
      >
        {count}
      </Badge>
    </h3>
  );
}
