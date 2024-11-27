import React from "react";
import { useAppContext } from "../../Context/AppContext";

export const Users = () => {
  const { dashboardWidth } = useAppContext();
  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      Users
    </div>
  );
};
