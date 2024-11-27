import React, { useState, useEffect } from "react";
import styles from "./XmlPopup.module.css";
import toast from "react-hot-toast";
import { js2xml } from "xml-js"; // Same XML conversion as in OutputLogs

export const XmlPopup = ({ onClose, orders }) => {
  const [fileName, setFileName] = useState("all_orders.xml");
  const [directoryPath, setDirectoryPath] = useState("");

  // Set default file name based on orders
  useEffect(() => {
    if (orders && Array.isArray(orders)) {
      setFileName("all_orders.xml"); // Default file name
    }
  }, [orders]);

  const handleDownload = async () => {
    if (!orders || !Array.isArray(orders)) {
      toast.error("Invalid orders content.");
      return;
    }

    try {
      // Prompt the user to select a directory for saving files
      const directoryHandle = await window.showDirectoryPicker();

      // Loop through each order in the `orders` array
      for (let order of orders) {
        // Generate the XML content for each individual order
        const xmlContent = js2xml({ order }, { compact: true, spaces: 4 });

        // Create a file name using the order ID or any unique field
        const orderFileName = `order_${order.id}.xml`; // Change this to the field you want to use

        // Create a new file in the selected directory for each order
        const fileHandle = await directoryHandle.getFileHandle(orderFileName, {
          create: true,
        });

        const writable = await fileHandle.createWritable();
        await writable.write(xmlContent); // Write XML content for this order
        await writable.close();
      }

      // Update the UI with the directory name
      setDirectoryPath(directoryHandle.name);
      toast.success("All files saved successfully!");
    } catch (error) {
      if (error.name === "AbortError") {
        toast.error("File save cancelled.");
      } else {
        toast.error(`Failed to save files: ${error.message}`);
      }
    }
  };

  return (
    <div className={styles.popupContent}>
      <button
        onClick={handleDownload}
        className={`btn btn-primary ${styles.exportBtn}`}
      >
        Choose Path
      </button>
      <button className={styles.noFile}>
        {directoryPath ? `${directoryPath}` : "No path chosen"}
      </button>
    </div>
  );
};
