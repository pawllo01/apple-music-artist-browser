import { Button } from "flowbite-react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

type ExpandButtonProps = {
  title: string;
  expanded: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  children?: React.ReactNode;
};

export function ExpandButton({
  title,
  expanded,
  onClick,
  children,
}: ExpandButtonProps) {
  return (
    <Button
      color="light"
      className={`h-auto rounded-full p-1 ${children ? "w-full px-2" : ""}`}
      title={title}
      onClick={onClick}
    >
      {expanded ? (
        <MdExpandLess className="shrink-0" />
      ) : (
        <MdExpandMore className="shrink-0" />
      )}
      {children}
    </Button>
  );
}
