import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

import "preline/preline";

import Sidebar from "./components/Sidebar";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [location.pathname]);

  return (
    <div className="mx-auto mt-0 lg:mt-10 max-w-5xl p-8">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default App;
