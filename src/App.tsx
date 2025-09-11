import React, { useState } from "react";
import Navbar, { Tab } from "./Navbar";
import ImcForm from "./ImcForm";
import Historial from "./Historial";

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>("calculadora");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <main className="flex-1 p-4 bg-gray-100">
        {currentTab === "calculadora" && <ImcForm />}
        {currentTab === "historial" && <Historial />}
      </main>
    </div>
  );
};

export default App;
