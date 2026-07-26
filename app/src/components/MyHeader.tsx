import { Button, DarkThemeToggle, Navbar } from "flowbite-react";
import { GrCircleQuestion } from "react-icons/gr";
import { Link, NavLink } from "react-router";

import ChangeCountryModal from "./ChangeCountryModal";

export default function MyHeader() {
  return (
    <header className="gradient z-10 pt-1.5">
      <Navbar fluid className="shadow-md">
        {/* logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="h-9" />
          <span className="text-2xl font-semibold">Artist Browser</span>
        </NavLink>

        <div className="flex gap-2">
          {/* faq */}
          <Button
            as={Link}
            to="/faq"
            color="light"
            className="aspect-square border-0 bg-transparent p-0 text-gray-500 dark:bg-transparent dark:text-gray-400"
            title="FAQ page"
          >
            <GrCircleQuestion size={24} />
          </Button>

          {/* theme */}
          <DarkThemeToggle title="Toggle dark mode" />

          {/* country */}
          <ChangeCountryModal />
        </div>
      </Navbar>
    </header>
  );
}
