import React, { useState } from "react";
import styles from "./CanvasFlow.module.css"; // Import the CSS module
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  const handleAddNewStep = () => {
    setShowAddNewStep(true);
  };
  const handleCloseAddNewStep = () => {
    setShowAddNewStep(false);
  };

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };
  // console.log("showAddNewStep", showAddNewStep);

  return (
    <div className={styles.dropdownContainer}>
      <button onClick={handleToggleMenu} className={styles.dropdownToggle}>
        Step 1
        <FontAwesomeIcon icon={faChevronDown} className={styles.flowIconDown} />
      </button>
      {showAddNewStep && <AddnewSteps onclose={handleCloseAddNewStep} />}
      {showMenu && (
        <div className={styles.dropdownMenu}>
          <div className={styles.dropdownAddItem} onClick={handleAddNewStep}>
            <FontAwesomeIcon icon={faPlus} /> Add new step
          </div>
          <div className={styles.dropdownItem}>
            <FontAwesomeIcon icon={faEllipsisV} className="me-1" />{" "}
            <FontAwesomeIcon icon={faEllipsisV} className="me-2" />{" "}
            <span className={styles.flowName}>Step 1</span>
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
        </div>
      )}
    </div>
  );
};
