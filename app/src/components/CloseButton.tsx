import { Button } from "flowbite-react";
import { IoCloseOutline } from "react-icons/io5";

type CloseButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  title?: string;
};

export default function CloseButton({ onClick, title }: CloseButtonProps) {
  return (
    <Button
      color="light"
      className="h-auto border-0 bg-transparent p-1 dark:bg-transparent"
      title={title}
      onClick={onClick}
    >
      <IoCloseOutline size={24} className="text-gray-400" />
    </Button>
  );
}
