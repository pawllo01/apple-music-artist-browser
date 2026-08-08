import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { itemIcons } from "../../@other/icons";
import type { Type } from "../../@types/item-types";
import LoadingSpinner from "../../components/LoadingSpinner";

type AsyncStateProps = {
  type: Type;
  isLoading: boolean;
  error: Error | null;
  itemsLength: number;
  children: React.ReactNode;
};

export default function AsyncState({
  type,
  isLoading,
  error,
  itemsLength,
  children,
}: AsyncStateProps) {
  if (isLoading) return <LoadingSpinner />;

  if (error)
    return (
      <Alert color="failure" icon={HiInformationCircle} className="mt-4">
        {error.message}
      </Alert>
    );

  if (itemsLength === 0) {
    const Icon = itemIcons[type];

    return (
      <div className="flex flex-col items-center py-16">
        <Icon className="text-4xl text-gray-400" />

        <h3 className="mt-4 text-lg font-semibold">No {type} yet</h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          This artist doesn't have any {type} available.
        </p>
      </div>
    );
  }

  return children;
}
