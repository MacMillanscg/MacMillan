import React from "react";
import { useAppContext } from "../../Context/AppContext";

export const ExploreConnections = () => {
  const { dashboardWidth } = useAppContext();
  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      Connections
    </div>
  );
};
