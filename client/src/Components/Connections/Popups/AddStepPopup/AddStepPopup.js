import React, { useState } from "react";
import styles from "./AddStepPopup.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCogs,
  faExchangeAlt,
  faLaptopCode,
} from "@fortawesome/free-solid-svg-icons";
// import { LogicToolsPopup } from "../LogicToolsPopup/LogicToolsPopup"; // Uncomment if needed

const options = [
  { name: "Logic", icon: faCogs, action: "logicToolsPopup" },
  { name: "Converter", icon: faExchangeAlt, action: "openConverterPopup" },
  { name: "Integrations", icon: faLaptopCode, action: "openIntegrationPopup" },
];

export const AddStepPopup = ({
  logicToolsPopup,
  openConverterPopup,
  openIntegrationPopup,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length >= 3) {
      const filtered = options.filter((option) =>
        option.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  };

  return (
    <div className={styles.popupContent}>
      <input
        type="text"
        placeholder="Search apps, actions, and tools"
        className={`${styles.searchInput} form-control`}
        value={searchInput}
        onChange={handleSearchChange}
      />
      <div className={styles.options}>
        {filteredOptions.map((option, index) => (
          <div
            key={index}
            className={styles.option}
            onClick={() => {
              if (option.action === "logicToolsPopup") logicToolsPopup();
              if (option.action === "openConverterPopup") openConverterPopup();
              if (option.action === "openIntegrationPopup")
                openIntegrationPopup();
            }}
          >
            <FontAwesomeIcon icon={option.icon} className={styles.optionIcon} />
            {option.name}
          </div>
        ))}
      </div>
    </div>
  );
};
