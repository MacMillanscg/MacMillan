import React, { useState, useEffect } from "react";
import styles from "./XmlPopup.module.css";
import toast from "react-hot-toast";
import { js2xml } from "xml-js";

export const XmlPopup = ({ orders, id ,onClose}) => {
  const [directoryPath, setDirectoryPath] = useState("");
  const [directoryHandle, setDirectoryHandle] = useState(null);
  const [savedDirectories, setSavedDirectories] = useState([]);

  useEffect(() => {
    const loadSavedDirectories = () => {
      const saved = localStorage.getItem("savedDirectories");

      if (saved) {
        try {
          const parsedDirectories = JSON.parse(saved);
          if (Array.isArray(parsedDirectories)) {
            setSavedDirectories(parsedDirectories);
            const directoryForId = parsedDirectories.find((dir) => dir.id === id);
            if (directoryForId) {
              setDirectoryPath(directoryForId.name); // Set the folder name for the current id
            } else {
              setDirectoryPath(""); // Reset if no matching directory
              toast.info(`No directory found for ID: "${id}".`);
            }
          }
        } catch (error) {
          console.error("Error loading saved directories:", error);
          toast.error("Failed to restore the saved directories.");
        }
      }
    };

    loadSavedDirectories();
  }, [id]);

  const handleDownload = async () => {
    if (!orders || !Array.isArray(orders)) {
      toast.error("Invalid orders content.");
      return;
    }
  
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];
  
    // Filter orders created today
    const todaysOrders = orders.filter((order) => {
      const orderDate = new Date(order.created_at).toISOString().split("T")[0];
      return orderDate === today;
    });
  
    if (todaysOrders.length === 0) {
      toast.error("No orders for today to export.");
      return;
    }
  
    try {
      let handle = directoryHandle;
  
      // If no directory handle exists, prompt the user to select one
      if (!handle) {
        handle = await window.showDirectoryPicker();
        setDirectoryHandle(handle);
        setDirectoryPath(handle.name);
  
        // Check for duplicates by `id`
        const isDuplicate = savedDirectories.some((dir) => dir.id === id);
  
        if (isDuplicate) {
          toast.error(`This store already has a folder.`);
          return; // Do not proceed further
        }
  
        // Save the new directory
        const newDirectory = { id, name: handle.name };
        const updatedDirectories = [...savedDirectories, newDirectory];
        setSavedDirectories(updatedDirectories);
        localStorage.setItem("savedDirectories", JSON.stringify(updatedDirectories));
        toast.success(`Directory "${handle.name}" saved for ID "${id}".`);
      }
  
      // Save each order as a separate XML file
      for (let order of todaysOrders) {
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
  
      toast.success("All today's files saved successfully!");
  
      // Close the popup after successful directory selection
      if (onClose) {
        onClose();
      }
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
