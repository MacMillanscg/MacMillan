import React, { useState, useEffect } from "react";
import styles from "./Steps.module.css";

export const Steps = ({ steps }) => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };
  console.log("tol", isToggled);
  return (
    <div className={styles.steps}>
      <div className="d-flex justify-content-between">
        <h4 className="fs-5 m-0 mb-3">Steps</h4>
        <div className={styles.toggleContainer} onClick={handleToggle}>
          <div
            className={`${styles.toggleButton} ${
              isToggled ? styles.toggled : ""
            }`}
          >
            <div className={styles.toggleCircle}></div>
          </div>
        </div>
      </div>
      <ul className="p-0">
        {steps.map((step) => (
          <li key={step.id} className="py-3">
            <div className={styles.stepName}>
              <img src={step.webImg} alt="" className={styles.webImg} />
              {step.name}
            </div>
            <div className={styles.stepTime}>{step.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
