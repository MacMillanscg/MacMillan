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

export const CanvasFlow = ({
  selectedStep,
  setSelectedStep,
  selectedStepId,
  setSelectedStepId,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showAddNewStep, setShowAddNewStep] = useState(false);
  const [connectionsSteps, setConnectionsSteps] = useState([]);
  // const [selectedStep, setSelectedStep] = useState("Rule 1");
  const { id } = useParams();

  const fetchConnections = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/connections/${id}/connectionSteps`
      );
      console.log("connection Rules", response.data.connectionRule);
      if (response.data) {
        setConnectionsSteps(response.data.connectionRule);
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
    } finally {
      // setLoading(false);
    }
  };
  console.log("selectedStep", selectedStep);
  console.log("selectedStepId", selectedStepId);

  useEffect(() => {
    fetchConnections();
  }, [showAddNewStep]);
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

  const handleStepSelect = (stepName, stepId) => {
    setSelectedStep(stepName, stepId);
    setSelectedStepId(stepId);
    setShowMenu(false);
  };

  const deleteConnectionStep = async (stepId) => {
    console.log("setrpid", stepId);
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this step?"
    );
    if (!confirmDelete) return; // exit if not confirmed

    try {
      await axios.delete(
        `http://localhost:5000/connections/${id}/connectionSteps/${stepId}`
      );
      setConnectionsSteps(
        connectionsSteps.filter((step) => step._id !== stepId)
      );
    } catch (error) {
      console.error("Error deleting step:", error);
    }
  };

  console.log("selctedstep", selectedStep);

  return (
    <div className={styles.dropdownContainer}>
      <button onClick={handleToggleMenu} className={styles.dropdownToggle}>
        {/* {selectedStep ? selectedStep : selectedStep} */}
        {selectedStep}
        <FontAwesomeIcon icon={faChevronDown} className={styles.flowIconDown} />
      </button>
      {showAddNewStep && <AddnewSteps onclose={handleCloseAddNewStep} />}
      {showMenu && (
        <div className={styles.dropdownMenu}>
          <div className={styles.dropdownAddItem} onClick={handleAddNewStep}>
            <FontAwesomeIcon icon={faPlus} /> Add new Rule
          </div>
          <div className={styles.dropdownItem}>
            <FontAwesomeIcon icon={faEllipsisV} className="me-1" />{" "}
            <FontAwesomeIcon icon={faEllipsisV} className="me-2" />{" "}
            <span
              className={styles.flowName}
              onClick={() => handleStepSelect("Rule 1")}
            >
              Rule 1
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
                  onClick={() =>
                    handleStepSelect(step.connectionName, step._id)
                  }
                >
                  <FontAwesomeIcon icon={faEllipsisV} className="me-1" />{" "}
                  <FontAwesomeIcon icon={faEllipsisV} className="me-2" />{" "}
                  <span className={styles.flowName}>{step.connectionName}</span>
                  <span className={styles.flowActions}>
                    <FontAwesomeIcon icon={faCopy} title="Copy" />
                    <FontAwesomeIcon icon={faEdit} title="Edit" />
                    <FontAwesomeIcon
                      icon={faTrash}
                      title="Delete"
                      onClick={() => deleteConnectionStep(step._id)}
                    />
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
