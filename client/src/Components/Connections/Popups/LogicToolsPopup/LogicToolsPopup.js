import React, { useState } from "react";
import styles from "./LogicToolsPopup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCodeBranch,
  faSync,
  faBed,
  faChevronRight,
  faBan,
} from "@fortawesome/free-solid-svg-icons";

const logicOptions = [
  {
    name: "Branch",
    icon: faCodeBranch,
    actions: 3,
    onClick: "onOpenActionPopup",
  },
  { name: "Loop", icon: faSync, actions: 3, onClick: "openLoopPopup" },
  { name: "Sleep", icon: faBed, actions: 1 },
  { name: "Stop Execution", icon: faBan, actions: 1 },
];

export const LogicToolsPopup = ({ onOpenActionPopup, openLoopPopup }) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(logicOptions);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length >= 3) {
      const filtered = logicOptions.filter((option) =>
        option.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(logicOptions);
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

      {filteredOptions.map((option, index) => (
        <div
          key={index}
          className={styles.logicOption}
          onClick={() => {
            if (option.onClick === "onOpenActionPopup") onOpenActionPopup();
            if (option.onClick === "openLoopPopup") openLoopPopup();
          }}
        >
          <div className={styles.optionIcon}>
            <FontAwesomeIcon icon={option.icon} className={styles.faIcon} />{" "}
            {option.name}
          </div>
          <div className={styles.actions}>
            {option.actions} Action{option.actions > 1 ? "s" : ""}
            <FontAwesomeIcon
              icon={faChevronRight}
              className={styles.rightIcon}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
