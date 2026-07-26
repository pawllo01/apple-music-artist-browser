import HttpStatusLayout from "../layouts/HttpStatusLayout";

export default function NotFound() {
  return (
    <HttpStatusLayout
      statusCode={404}
      title="Something's missing."
      description="Sorry, we can't find that page."
    />
  );
}
