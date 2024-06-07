import React from "react";
import { useAppContext } from "../../Context/AppContext";

export const Logss = () => {
  const { dashboardWidth } = useAppContext();
  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      Logs
    </div>
  );
};
