import React, { useState, useEffect } from "react";
import styles from "./Steps.module.css";

import { JSONTree } from "react-json-tree";

const theme = {
  base00: "#ffffff",
  base01: "#f5f5f5",
  base02: "#e0e0e0",
  base03: "#d5d5d5",
  base04: "#aaaaaa",
  base05: "#333333",
  base06: "#000000",
  base07: "#333333",
  base08: "#d73a49",
  base09: "#d73a49",
  base0A: "#d73a49",
  base0B: "#6f42c1",
  base0C: "#005cc5",
  base0D: "#005cc5",
  base0E: "#6f42c1",
  base0F: "#d73a49",
};

export const Steps = ({ steps, orders, shopifyDetails }) => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };
  return (
    <div className={styles.steps}>
      <div className="d-flex justify-content-between">
        <h4 className="fs-5 m-0 mb-3">Steps</h4>
        <div className={styles.toggleContainer} onClick={handleToggle}>
          <span className={styles.logsSpan}>Logs</span>
          <div
            className={`${styles.toggleButton} ${
              isToggled ? styles.toggled : ""
            }`}
          >
            <div className={styles.toggleCircle}></div>
          </div>
        </div>
      </div>
      <div className={styles.shopifyWrapper}>
        <ul className="p-0">
          <li className={`${styles.items} py-3`}>
            <div className={styles.stepName}>
              <img src={steps[0].webImg} alt="" className={styles.webImg} />
              {steps[0].name}
            </div>
            <div className={styles.stepTime}>{steps[0].time}</div>
          </li>
          {shopifyDetails && (
            <li className={`${styles.items} py-3`}>
              <div className={styles.stepName}>
                <img src={steps[1].webImg} alt="" className={styles.webImg} />
                {steps[1].name}
              </div>
              <div className={styles.stepTime}>{steps[1].time}</div>
            </li>
          )}
        </ul>
        <div className="shopify">
          <div style={{ margin: "20px" }}>
            {shopifyDetails && (
              <JSONTree data={orders} theme={theme} invertTheme={false} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
