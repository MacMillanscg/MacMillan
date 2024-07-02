import React, { useState } from "react";
import styles from "./ActionPopup.module.css";

const actions = [
  { name: "Branch on Expression" },
  { name: "Branch on Value" },
  { name: "Select Executed Step Result" },
];

export const ActionPopup = () => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredActions, setFilteredActions] = useState(actions);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length >= 3) {
      const filtered = actions.filter((action) =>
        action.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredActions(filtered);
    } else {
      setFilteredActions(actions);
    }
  };

  return (
    <div className={styles.popupContent}>
      <input
        type="text"
        placeholder="Search components"
        className={`${styles.searchInput} form-control mb-4`}
        value={searchInput}
        onChange={handleSearchChange}
      />
      <div className={styles.actionsWrap}>
        {filteredActions.map((action, index) => (
          <div key={index} className={styles.actionDescription}>
            <h4 className="m-0 mb-2">{action.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
