import React from "react";
import styles from "../../ClientsCom.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export const IntegrationTabHeader = ({ openModal }) => {
  return (
    <div className={styles.clientHeader} style={{ border: "none" }}>
      <div className="clientLeft">
        <h3>Integration</h3>
      </div>
      <div className={styles.clientsRight}>
        <div className="form-group me-4">
          <input
            type="text"
            className={`form-control ${styles.formControl}`}
            id="exampleInputEmail"
            placeholder="Search Integrations"
          />
        </div>
        <div className={styles.selectFilterOption}>
          <select name="" id="" className={styles.selectFilter}>
            <option value="">Filter</option>
            <option value="">Integration1</option>
            <option value="">Integration2</option>
            <option value="">Integration3</option>
          </select>
        </div>
        <button
          className={`btn btn-success ${styles.addBtn} ms-4`}
          onClick={openModal}
        >
          <FontAwesomeIcon icon={faPlus} className={styles.addIcon} />
          Add Integration
        </button>
      </div>
    </div>
  );
};
