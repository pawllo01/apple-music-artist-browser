import { Spinner } from "flowbite-react";

export default function LoadingSpinner() {
  return (
    <div className="mt-4 text-center">
      <Spinner aria-label="Loading..." color="failure" size="lg" />
    </div>
  );
}
