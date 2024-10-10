import React, { useState, useEffect } from "react";
import styles from "./CanvasFlow.module.css"; // Import the CSS module
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  faCopy,
  faEdit,
  faTrash,
  faPlus,
  faChevronDown,
  faTh,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { AddnewSteps } from "./AddnewSteps/AddnewSteps";

export const CanvasFlow = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showAddNewStep, setShowAddNewStep] = useState(false);
  const [connectionsSteps, setConnectionsSteps] = useState([]);
  const [selectedStep, setSelectedStep] = useState(null);
  const { id } = useParams();

  const fetchConnections = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/connections/${id}/connectionSteps`
      );
      const filteredSteps = response.data.filter(
        (step) => step.connectionId === id // Replace 'specificRole' with the actual role
      );
      setConnectionsSteps(filteredSteps);
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      // setLoading(false);
    }
  };
  console.log("selectedStep", selectedStep);

  useEffect(() => {
    fetchConnections();
  }, []);
  console.log("connectionsStep", connectionsSteps);

  const handleAddNewStep = () => {
    setShowAddNewStep(true);
  };
  const handleCloseAddNewStep = () => {
    setShowAddNewStep(false);
  };

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleStepSelect = (stepName) => {
    setSelectedStep(stepName);
    setShowMenu(false);
  };

  console.log("selctedstep", selectedStep);

  return (
    <div className={styles.dropdownContainer}>
      <button onClick={handleToggleMenu} className={styles.dropdownToggle}>
        {selectedStep ? selectedStep.connectionName : "Role 1"}
        {/* {selectedStep} */}
        <FontAwesomeIcon icon={faChevronDown} className={styles.flowIconDown} />
      </button>
      {showAddNewStep && <AddnewSteps onclose={handleCloseAddNewStep} />}
      {showMenu && (
        <div className={styles.dropdownMenu}>
          <div className={styles.dropdownAddItem} onClick={handleAddNewStep}>
            <FontAwesomeIcon icon={faPlus} /> Add new Role
          </div>
          <div className={styles.dropdownItem}>
            <FontAwesomeIcon icon={faEllipsisV} className="me-1" />{" "}
            <FontAwesomeIcon icon={faEllipsisV} className="me-2" />{" "}
            <span
              className={styles.flowName}
              onClick={() => handleStepSelect("Step 1")}
            >
              Role 1
            </span>
            <span className={styles.flowActions}>
              <FontAwesomeIcon icon={faCopy} title="Copy" />
              <FontAwesomeIcon icon={faEdit} title="Edit" />
              <FontAwesomeIcon icon={faTrash} title="Delete" />
            </span>
          </div>
          <div className={styles.dropdownItem}>
            <FontAwesomeIcon icon={faEllipsisV} className="me-1" />{" "}
            <FontAwesomeIcon icon={faEllipsisV} className="me-2" />{" "}
            <span className={styles.flowName}>Get Orders</span>
            <span className={styles.flowActions}>
              <FontAwesomeIcon icon={faCopy} title="Copy" />
              <FontAwesomeIcon icon={faEdit} title="Edit" />
              <FontAwesomeIcon icon={faTrash} title="Delete" />
            </span>
          </div>

          {/* New div to display connectionSteps */}
          <div className={styles.connectionStepsContainer}>
            {connectionsSteps &&
              connectionsSteps.map((step, index) => (
                <div
                  key={index}
                  className={styles.dropdownItem}
                  onClick={() => handleStepSelect(step)}
                >
                  <FontAwesomeIcon icon={faEllipsisV} className="me-1" />{" "}
                  <FontAwesomeIcon icon={faEllipsisV} className="me-2" />{" "}
                  <span className={styles.flowName}>{step.connectionName}</span>
                  <span className={styles.flowActions}>
                    <FontAwesomeIcon icon={faCopy} title="Copy" />
                    <FontAwesomeIcon icon={faEdit} title="Edit" />
                    <FontAwesomeIcon icon={faTrash} title="Delete" />
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
