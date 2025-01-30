import React from "react";
import styles from "./DeployedInstances.module.css";
import { useAppContext } from "../Context/AppContext";

export const DeployedInstances = () => {
  const { dashboardWidth } = useAppContext();
  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      DeployedInstances is in progress....
    </div>
  );
};
