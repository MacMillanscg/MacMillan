import React from "react";
import styles from "./DetailsTab.module.css";

export const DetailsTabTop = ({ handleSave, handleCancel, onhandleCancel }) => {
  return (
    <div>
      <div className="inner-right">
        <button className={styles.cancel} onClick={onhandleCancel}>
          Cancel
        </button>
        <button
          className={`btn btn-success ${styles.savebtn}`}
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};
