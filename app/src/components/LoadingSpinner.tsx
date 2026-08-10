import { Spinner } from "flowbite-react";

type Props = {
  className?: string;
};

export default function LoadingSpinner({ className = "" }: Props) {
  return (
    <div className={className}>
      <Spinner aria-label="Loading..." color="failure" size="lg" />
    </div>
  );
}
