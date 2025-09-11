import React from "react";

export type Tab = "calculadora" | "historial";

interface NavbarProps {
  currentTab: Tab;
  setCurrentTab: React.Dispatch<React.SetStateAction<Tab>>;
}

const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  return (
    <nav className="bg-gray-800 p-4 flex gap-4 sticky top-0 z-50">
      <button
        onClick={() => setCurrentTab("calculadora")}
        className={`px-4 py-2 rounded ${
          currentTab === "calculadora"
            ? "bg-white text-gray-800 font-semibold"
            : "text-white hover:bg-gray-700"
        }`}
      >
        Calculadora
      </button>
      <button
        onClick={() => setCurrentTab("historial")}
        className={`px-4 py-2 rounded ${
          currentTab === "historial"
            ? "bg-white text-gray-800 font-semibold"
            : "text-white hover:bg-gray-700"
        }`}
      >
        Historial
      </button>
    </nav>
  );
};

export default Navbar;
