import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import styles from "./LogsTabHeader.module.css";

export const LogsTabHeader = () => {
  return (
    <div className={styles.clientsRight}>
      <div className="form-group me-4">
        <input
          type="text"
          className={`form-control ${styles.formControl}`}
          id="exampleInputEmail"
          placeholder="Search Log"
          // value={email}
          // onChange={(e) => setEmail(e.target.value)}
        />
        {/* <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} /> */}
      </div>
      <div className={styles.selectFilterOption}>
        <select name="" id="" className={styles.selectFilter}>
          <option value="">Filter</option>
          <option value="">Log1</option>
          <option value="">Log2</option>
          <option value="">Log3</option>
        </select>
      </div>
      <button className={`btn btn-success ${styles.addBtn} ms-4`}>
        <FontAwesomeIcon icon={faSync} className={styles.addIcon} />
        Refresh
      </button>
    </div>
  );
};
