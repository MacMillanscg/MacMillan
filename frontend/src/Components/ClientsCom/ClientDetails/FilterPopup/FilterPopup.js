import React, { useState } from "react";
import { useAppContext } from "../../../Context/AppContext";
import styles from "./FilterPopup.module.css";
import { getUser } from "../../../../storageUtils/storageUtils";

export const FilterPopup = ({ closeModal, setFetchTrigger }) => {
  const [activeTab, setActiveTab] = useState(true);
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const { dashboardWidth } = useAppContext();

  let userId = getUser();
  userId = userId?._id;

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <div className={styles.tabContent}>
          {activeTab && (
            <>
              <div className={styles.tabPanel}>
                <label htmlFor="clientName">Client Name:</label>
                <div className="form-group mb-2">
                  <input
                    type="text"
                    className={`form-control ${styles.formControl}`}
                    id="name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.tabPanel}>
                <label htmlFor="clientName">Client Email:</label>
                <div className="form-group mb-2">
                  <input
                    type="text"
                    className={`form-control ${styles.formControl}`}
                    id="emailId"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.filterButton} onClick={closeModal}>
            Clear Filter
          </button>
        </div>
      </div>
    </div>
  );
};
