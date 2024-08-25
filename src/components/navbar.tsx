import ThemeSwitcher from "./theme-switcher";
import { Beaker } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Beaker className="h-8 w-8 text-blue-500 mr-2" />
            <span className="font-semibold text-xl text-gray-800 dark:text-white">
              BFHL Challenge
            </span>
          </div>
          <div className="flex items-center">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
