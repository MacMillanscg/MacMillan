import React from "react";
import styles from "./ConfirmCancelPopUp.module.css";

export const ConfirmCancelPopUp = ({
  headerText,
  bodyText,
  onOk,
  onCancel,
  okButtonText,
  cancelButtonText,
  showErrorModal,
  crossBtn,
}) => {
  return (
    <div>
      <div className={styles.dialog}>
        <div className={styles.dialogHeader}>
          <h3 className={styles.warning}>{headerText}</h3>
          {showErrorModal ? (
            <span className={styles.cross} onClick={crossBtn}>
              x
            </span>
          ) : (
            ""
          )}
        </div>
        <div className={styles.dialogBody}>
          <p className={styles.continue}>{bodyText}</p>
        </div>
        <div className={styles.dialogFooter}>
          <button className={`${styles.btn} ${styles.btnOk}`} onClick={onOk}>
            {okButtonText}
          </button>
          {!showErrorModal ? (
            <button
              className={`${styles.btn} ${styles.btnCancel}`}
              onClick={onCancel}
            >
              {cancelButtonText}
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};
