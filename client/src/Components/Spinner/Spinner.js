import React from "react";
import styles from "./Spinner.module.css";

export const Spinner = ({ message, isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>{message}</p>
    </div>
  );
};
