import { useRouteError } from "react-router";
import HttpStatusLayout from "../layouts/HttpStatusLayout";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <HttpStatusLayout
      statusCode={500}
      title="Something went wrong."
      description="An unexpected error occurred. Please try again."
    >
      {import.meta.env.DEV && (
        <pre className="mb-4 overflow-auto rounded-lg bg-gray-100 p-4 text-start text-sm text-red-600 dark:bg-gray-800 dark:text-red-400">
          {error instanceof Error && error.stack}
        </pre>
      )}
    </HttpStatusLayout>
  );
}
