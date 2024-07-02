import React, { useState } from "react";
import styles from "./IntegrationPopup.module.css";

const integrationOptions = [
  { name: "Shopify", action: "openShopifyPopup" },
  { name: "eShippers", action: "openEShipperPopup" },
  { name: "HTTP Request", action: "openHttpPopup" },
];

export const IntegrationPopup = ({
  openShopifyPopup,
  openEShipperPopup,
  openHttpPopup,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(integrationOptions);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length >= 3) {
      const filtered = integrationOptions.filter((option) =>
        option.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(integrationOptions);
    }
  };

  const handleOptionClick = (action) => {
    if (action === "openShopifyPopup") openShopifyPopup();
    if (action === "openEShipperPopup") openEShipperPopup();
    if (action === "openHttpPopup") openHttpPopup();
  };

  return (
    <div className={styles.popupContent}>
      <input
        type="text"
        placeholder="Search integration"
        className={`${styles.searchInput} form-control mb-4`}
        value={searchInput}
        onChange={handleSearchChange}
      />
      <div className={styles.loopOptionsWrap}>
        {filteredOptions.map((option, index) => (
          <div
            key={index}
            className={styles.actionDescription}
            onClick={() => handleOptionClick(option.action)}
          >
            <h4 className="m-0 mb-2">{option.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
