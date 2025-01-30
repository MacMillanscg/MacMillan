import React, { useState } from "react";
import styles from "./ExportModal.module.css";
import csvImage from "../../../assets/images/csvImage.png";
import xmlImage from "../../../assets/images/xmlimg.PNG";

export const ExportModal = ({ onClose, result }) => {
  const [selectedFormat, setSelectedFormat] = useState(null); // Track selected format

  // Function to convert data to CSV format and trigger download
  const handleCSVExport = () => {
    if (!result || !Array.isArray(result) || result.length === 0) {
      console.error("Invalid or empty result data for CSV export.");
      return;
    }

    const csvRows = [];
    const headers = Object.keys(result[0]); // Get headers from the first object
    csvRows.push(headers.join(",")); // Add headers row

    result.forEach((row) => {
      const values = headers.map((header) => row[header] !== undefined ? row[header].toString() : ""); // Handle undefined values
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

  // Function to export data as XML
  const handleXMLExport = async () => {
    if (!result || !Array.isArray(result) || result.length === 0) {
      console.error("Invalid or empty result data for XML export.");
      return;
    }
  
    const escapeXML = (str) => {
      if (typeof str !== "string") return str;
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
    };
  
    result.forEach(async (item) => {
      let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<Shipments>\n';
      xmlContent += `  <Shipment>\n`;
  
      for (const key in item) {
        const value = escapeXML(item[key]?.toString() || "");
        xmlContent += `    <${key}>${value}</${key}>\n`;
      }
  
      xmlContent += `  </Shipment>\n`;
      xmlContent += `</Shipments>`;
  
      const fileName = ` Shipemet_${item.shipmentId || "shipment"}.xml`;
  
      try {
        // Request a file handle
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [
            {
              description: "XML Files",
              accept: { "application/xml": [".xml"] },
            },
          ],
        });
  
        // Create a writable stream
        const writable = await handle.createWritable();
  
        // Write the content to the file
        await writable.write(xmlContent);
  
        // Close the stream
        await writable.close();
  
        console.log(`File ${fileName} saved successfully.`);
      } catch (error) {
        console.error(`File save for ${fileName} canceled or failed.`, error);
      }
    });
  };
  
  

  // Handle export button click
  const handleExportClick = () => {
    if (selectedFormat === "CSV") {
      handleCSVExport();
    } else if (selectedFormat === "XML") {
      handleXMLExport();
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
              selectedFormat === "XML" ? styles.selected : ""
            }`}
            onClick={() => setSelectedFormat("XML")}
          >
            <img src={xmlImage} alt="XML" />
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
