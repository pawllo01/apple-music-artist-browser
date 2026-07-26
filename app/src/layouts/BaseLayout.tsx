import { Outlet } from "react-router";
import MyHeader from "../components/MyHeader";
import MyFooter from "../components/MyFooter";

export default function BaseLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <MyHeader />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <MyFooter />
    </div>
  );
}
