import React from "react";
import styles from "./DetailsTab.module.css";

export const DetailsTabTop = () => {
  return (
    <div>
      <div className="inner-right">
        <button className={styles.cancel}>Cancel</button>
        <button className={`btn btn-success ${styles.savebtn}`}>Save</button>
      </div>
    </div>
  );
};
