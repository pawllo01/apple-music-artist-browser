import { Outlet } from "react-router";
import { useResizeObserver } from "use-resize-observer";

import MyFooter from "../components/MyFooter";
import MyHeader from "../components/MyHeader";

export type FooterHeightContextType = {
  height: number;
};

export default function BaseLayout() {
  const { ref, height = 0 } = useResizeObserver<HTMLDivElement>();

  return (
    <div className="flex min-h-dvh flex-col">
      <MyHeader />
      <main className="flex flex-1 flex-col">
        <Outlet context={{ height } satisfies FooterHeightContextType} />
      </main>
      <div ref={ref}>
        <MyFooter />
      </div>
    </div>
  );
}
