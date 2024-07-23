import React, { useState, useEffect } from "react";
import styles from "./XmlPopup.module.css";
import toast from "react-hot-toast";

export const XmlPopup = ({ onClose, xmlContent }) => {
  const [fileName, setFileName] = useState("");
  const [directoryPath, setDirectoryPath] = useState("");
  const [savedFileName, setSavedFileName] = useState("");

  useEffect(() => {
    if (xmlContent) {
      setFileName("converted.xml"); // Default file name
    }
  }, [xmlContent]);

  const handleDownload = async () => {
    if (!xmlContent || typeof xmlContent !== "string") {
      const toastId = toast.error("Invalid XML content.");
      setTimeout(() => toast.dismiss(toastId), 4000); // Dismiss after 4 seconds
      console.error("Invalid XML content.");
      return;
    }

    try {
      // Prompt the user to select a directory
      const directoryHandle = await window.showDirectoryPicker();
      const fileHandle = await directoryHandle.getFileHandle(
        fileName || "converted.xml",
        { create: true }
      );
      const writable = await fileHandle.createWritable();
      await writable.write(xmlContent);
      await writable.close();

      // Set the directory path and saved file name
      setDirectoryPath(directoryHandle.name); // Note: This will only give the directory name, not the full path
      setSavedFileName(fileName);

      const toastId = toast.success("File saved successfully!");
      setTimeout(() => toast.dismiss(toastId), 4000); // Dismiss after 4 seconds
    } catch (error) {
      // Handle user cancellation gracefully
      if (error.name === "AbortError") {
        const toastId = toast.error("File save cancelled.");
        setTimeout(() => toast.dismiss(toastId), 4000); // Dismiss after 4 seconds
      } else {
        const toastId = toast.error(
          `Failed to save the file: ${error.message}`
        );
        setTimeout(() => toast.dismiss(toastId), 4000); // Dismiss after 4 seconds
        console.error("Save Error:", error);
      }
    }
  };

  return (
    <div className={styles.popupContent}>
      <button
        onClick={handleDownload}
        className={`btn btn-primary ${styles.exportBtn}`}
      >
        Choose path
      </button>
      <button className={styles.noFile}>
        {directoryPath ? `${directoryPath}` : "No file chosen"}
      </button>
    </div>
  );
};
