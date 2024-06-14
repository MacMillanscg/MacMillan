import React, { useState } from "react";
import styles from "./IntegrationCanvas.module.css";

export const IntegrationCanvas = () => {
  const [steps, setSteps] = useState([{ id: 1, title: "Step 1 of Rule 1" }]);
  const [isVisible, setIsVisible] = useState(true);

  const addStep = () => {
    const newStepId = steps.length + 1;
    setSteps([
      ...steps,
      { id: newStepId, title: `Step ${newStepId} of Rule 1` },
    ]);
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <div className={styles.topBar}>
        <div className="d-flex">
          <button className={styles.exitButton}>Exit</button>
          <h3 className={styles.connectionTitle}>Untitled Integration</h3>
        </div>
        <div className={styles.topBarControls}>
          <button className={styles.publishButton}>Publish</button>
          <button className={styles.cancelButton}>Cancel</button>
          <button className={styles.saveButton}>Save</button>
        </div>
      </div>

      <div className={styles.mainContainer}>
        {/* <div className={styles.leftSidePanel}>
          <div className={styles.detailsSection}>
            <h2>Connection Details</h2>
          </div>
          <div className={styles.clientsSection}>
            <h2>Clients</h2>
          </div>
          <div className={styles.versionHistorySection}>
            <h2>Version History</h2>
          </div>
        </div> */}

        <div className={styles.canvas}>
          <div className={styles.stepContainer}>
            {steps.map((step) => (
              <div className={styles.step} key={step.id}>
                {/* <p>{step.title}</p> */}
                <div className={styles.stepControls}>
                  <button className={styles.editButton}>Edit</button>
                  <button className={styles.deleteButton}>Delete</button>
                </div>
              </div>
            ))}
            <button className={styles.addStepButton} onClick={addStep}>
              +
            </button>
          </div>
        </div>
      </div>

      {isVisible && (
        <div className={styles.bottomBar}>
          <button className={styles.runButton}>Run</button>
          <button className={styles.testRunsButton}>Test Runs</button>
          <button className={styles.testConfigButton}>
            Test Configuration
          </button>
        </div>
      )}

      <button className={styles.toggleButton} onClick={toggleVisibility}>
        Hide/Show
      </button>
    </div>
  );
};
