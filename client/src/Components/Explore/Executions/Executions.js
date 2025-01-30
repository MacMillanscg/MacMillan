import React from "react";
import { useAppContext } from "../../Context/AppContext";

export const Executions = () => {
  const { dashboardWidth } = useAppContext();
  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      executions
    </div>
  );
};
