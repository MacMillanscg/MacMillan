import React from "react";
import { useAppContext } from "../Context/AppContext";

export const Explore = () => {
  const { dashboardWidth } = useAppContext();

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <h1>Explore</h1>
    </div>
  );
};
