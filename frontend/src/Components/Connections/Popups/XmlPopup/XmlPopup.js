import React, { useState, useEffect } from "react";
import styles from "./XmlPopup.module.css";
import toast from "react-hot-toast";
import { js2xml } from "xml-js"; // XML conversion library

export const XmlPopup = ({ orders }) => {
  const [directoryPath, setDirectoryPath] = useState("");
  const [directoryHandle, setDirectoryHandle] = useState(null);

  // Load the previously saved directory handle from localStorage on component mount
  useEffect(() => {
    const loadSavedDirectory = async () => {
      const savedDirectory = localStorage.getItem("savedDirectoryHandle");

      if (savedDirectory) {
        try {
          const parsedDirectory = JSON.parse(savedDirectory);
          if (parsedDirectory) {
            setDirectoryPath(parsedDirectory.name); // Restore saved directory name
            toast.success(
              `Resumed previous directory: ${parsedDirectory.name}`
            );
          }
        } catch (error) {
          console.error("Error restoring directory handle:", error);
          toast.error("Failed to restore the saved directory.");
        }
      }
    };

    loadSavedDirectory();
  }, []);

  const handleDownload = async () => {
    if (!orders || !Array.isArray(orders)) {
      toast.error("Invalid orders content.");
      return;
    }

    try {
      let handle = directoryHandle;

      // If no directory handle exists, prompt the user to select one
      if (!handle) {
        handle = await window.showDirectoryPicker();
        setDirectoryHandle(handle);
        setDirectoryPath(handle.name);

        // Save the directory handle reference in localStorage
        const serializedHandle = JSON.stringify({ name: handle.name });
        localStorage.setItem("savedDirectoryHandle", serializedHandle);
        toast.success(`Directory saved for future use: ${handle.name}`);
      }

      // Save each order as a separate XML file
      for (let order of orders) {
        // Convert the order to XML
        const xmlContent = js2xml({ order }, { compact: true, spaces: 4 });

        // Generate a file name for the order
        const orderFileName = `order_${order.id || new Date().getTime()}.xml`;

        // Create and write to the file in the selected directory
        const fileHandle = await handle.getFileHandle(orderFileName, {
          create: true,
        });

        const writable = await fileHandle.createWritable();
        await writable.write(xmlContent); // Write XML content
        await writable.close();
      }

      toast.success("All files saved successfully!");
    } catch (error) {
      if (error.name === "AbortError") {
        toast.error("File save cancelled.");
      } else if (error.name === "SecurityError") {
        toast.error("You need to enable file system access.");
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
        {directoryPath ? `Saved to: ${directoryPath}` : "No path chosen"}
      </button>
    </div>
  );
};
