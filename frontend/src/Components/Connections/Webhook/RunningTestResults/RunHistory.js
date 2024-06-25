import React from "react";
import styles from "./RunHistory.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";

export const RunHistory = ({ testHistory }) => {
  return (
    <div>
      <h3 className="fs-5">Test history</h3>
      <h4 className={`my-1 fs-6 ${styles.records}`}>
        Viewing previous records
      </h4>
      <ul className="p-0">
        {testHistory.map((test) => (
          <li key={test.id} className={styles.testList}>
            <FontAwesomeIcon icon={faPlayCircle} className={styles.icon} />{" "}
            {new Date(test.time).toLocaleString()} - {test.duration}s
          </li>
        ))}
      </ul>
    </div>
  );
};
