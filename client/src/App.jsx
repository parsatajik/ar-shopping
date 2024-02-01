import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

import "preline/preline";


const App = () => {
  const location = useLocation();

  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [location.pathname]);

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default App;
