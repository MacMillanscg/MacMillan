import React, { useState } from "react";
import styles from "./AddStepPopup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCogs,
  faExchangeAlt,
  faL,
  faLaptopCode,
} from "@fortawesome/free-solid-svg-icons";
import { LogicToolsPopup } from "../LogicToolsPopup/LogicToolsPopup";

export const AddStepPopup = ({
  logicToolsPopup,
  openConverterPopup,
  openIntegrationPopup,
}) => {
  return (
    <div className={styles.popupContent}>
      <input
        type="text"
        placeholder="Search apps, actions, and tools"
        className={`${styles.searchInput} form-control`}
      />
      <div className={styles.options}>
        <div className={styles.option} onClick={logicToolsPopup}>
          <FontAwesomeIcon icon={faCogs} className={styles.optionIcon} />
          Logic
        </div>
        {/* {isLogicPopup && <LogicToolsPopup />} */}
        <div className={styles.option} onClick={openConverterPopup}>
          <FontAwesomeIcon icon={faExchangeAlt} className={styles.optionIcon} />
          Converter
        </div>
        <div className={styles.option} onClick={openIntegrationPopup}>
          <FontAwesomeIcon icon={faLaptopCode} className={styles.optionIcon} />
          Integrations
        </div>
      </div>
      <div className={styles.inUseSection}>
        <h3>In use</h3>
      </div>
    </div>
  );
};
