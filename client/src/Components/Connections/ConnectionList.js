import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../Context/AppContext";
import { useParams } from "react-router-dom";

export const ConnectionList = () => {
  const { dashboardWidth } = useAppContext();
  const { id } = useParams();
  console.log("id", id);

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <h1>This is the page to show single connection</h1>
    </div>
  );
};
