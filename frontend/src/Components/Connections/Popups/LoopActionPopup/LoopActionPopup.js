import React, { useState } from "react";
import styles from "./LoopActionPopup.module.css";

const loopActions = [
  {
    name: "Break Loop",
    description:
      "Breaks out of the current Loop, causing execution to resume after the containing Loop.",
  },
  {
    name: "Loop N Times",
    description:
      "Loops over the steps in the loop N times, or until a loop break occurs.",
  },
  {
    name: "Loop Over Items",
    description:
      "Loops over items, applies each step in sequence, and returns a new collection of the results. Items must be an Array or Object.",
  },
];

export const LoopActionPopup = () => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredActions, setFilteredActions] = useState(loopActions);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length >= 3) {
      const filtered = loopActions.filter((action) =>
        action.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredActions(filtered);
    } else {
      setFilteredActions(loopActions);
    }
  };

  return (
    <div className={styles.popupContent}>
      <input
        type="text"
        placeholder="Search Actions"
        className={`${styles.searchInput} form-control mb-4`}
        value={searchInput}
        onChange={handleSearchChange}
      />
      <div className={styles.loopOptionsWrap}>
        {filteredActions.map((action, index) => (
          <div key={index} className={styles.actionDescription}>
            <h4 className="m-0 mb-2">{action.name}</h4>
            <p className={styles.logicDescription}>{action.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
