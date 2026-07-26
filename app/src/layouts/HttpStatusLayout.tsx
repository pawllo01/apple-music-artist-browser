import { Link } from "react-router";

type HttpStatusLayoutProps = {
  statusCode: number;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export default function HttpStatusLayout({
  statusCode,
  title,
  description,
  children,
}: HttpStatusLayoutProps) {
  return (
    <section className="flex flex-1 items-center justify-center bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl min-w-0 px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto text-center">
          <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-red-500 lg:text-9xl">
            {statusCode}
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
            {title}
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            {description}
          </p>
          {children}
          <Link
            to="/"
            replace
            className="gradient my-4 inline-flex rounded-full px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-4 focus:ring-red-300 focus:outline-none dark:focus:ring-red-900"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
