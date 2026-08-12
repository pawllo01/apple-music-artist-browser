import { Button } from "flowbite-react";

type ResetButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
};

export default function ResetButton({ onClick, children }: ResetButtonProps) {
  return (
    <div className="my-2">
      <Button
        color="red"
        size="sm"
        className="w-full border-s-0!"
        onClick={onClick}
      >
        {children}
      </Button>
    </div>
  );
}
