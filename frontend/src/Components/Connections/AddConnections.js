import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../Context/AppContext";

export const AddConnections = () => {
  const { dashboardWidth } = useAppContext();

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <h1>This is the page to add new connections.</h1>
    </div>
  );
};
