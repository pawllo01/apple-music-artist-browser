import { Outlet, useOutletContext } from "react-router";
import { FooterHeightContextType } from "./BaseLayout";

export default function ErrorBoundaryLayout() {
  const context = useOutletContext<FooterHeightContextType>();
  return <Outlet context={context satisfies FooterHeightContextType} />;
}
