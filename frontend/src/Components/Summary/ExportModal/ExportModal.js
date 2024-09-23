import React, { useState } from "react";
import styles from "./ExportModal.module.css";
import csvImage from "../../../assets/images/csvImage.png";
import xlsImage from "../../../assets/images/xlsImage.png";
import * as XLSX from "xlsx";

export const ExportModal = ({ onClose, selectedRows, filteredClients }) => {
  const [selectedFormat, setSelectedFormat] = useState(null); // Track selected format

  const filteredData = filteredClients
    .filter((client, index) => selectedRows.includes(index))
    .map(({ label, ...rest }) => ({
      ...rest,
    }));

  // Function to convert data to CSV format and trigger download
  const handleCSVExport = () => {
    const csvRows = [];
    const headers = Object.keys(filteredData[0]); // Get headers
    csvRows.push(headers.join(",")); // Add headers row

    filteredData.forEach((row) => {
      const values = headers.map((header) => row[header]);
      csvRows.push(values.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Function to export data as XLS using the xlsx package
  const handleXLSExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "data.xlsx");
  };

  // Handle export button click
  const handleExportClick = () => {
    if (selectedFormat === "CSV") {
      handleCSVExport();
    } else if (selectedFormat === "XLS") {
      handleXLSExport();
    }
  };

  return (
    <div className={styles.exportModalOverlay}>
      <div className={styles.exportModal}>
        <h3>Export</h3>
        <div className={styles.exportOptions}>
          <div
            className={`${styles.exportOption} ${
              selectedFormat === "CSV" ? styles.selected : ""
            }`}
            onClick={() => setSelectedFormat("CSV")}
          >
            <img src={csvImage} alt="CSV" />
          </div>
          <div
            className={`${styles.exportOption} ${
              selectedFormat === "XLS" ? styles.selected : ""
            }`}
            onClick={() => setSelectedFormat("XLS")}
          >
            <img src={xlsImage} alt="XLS" />
          </div>
        </div>
        <div className={styles.exportButtons}>
          <button onClick={onClose} className={styles.cancel}>
            Cancel
          </button>
          <button
            className={`${styles.exportButton} ${
              selectedFormat ? styles.activeButton : ""
            }`}
            onClick={handleExportClick}
            disabled={!selectedFormat} // Disable button if no format is selected
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};
