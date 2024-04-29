import React, { createContext, useContext, useState } from "react";

// Create a context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  // Calculate dashboard width based on sidebar state
  const dashboardWidth = sidebarMinimized
    ? "calc(100% - 80px)"
    : "calc(100% - 238px)";

  return (
    <AppContext.Provider
      value={{ sidebarMinimized, setSidebarMinimized, dashboardWidth }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  return useContext(AppContext);
};
