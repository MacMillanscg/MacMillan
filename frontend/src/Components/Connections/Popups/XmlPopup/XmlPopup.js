import React, { useState, useEffect } from "react";
import styles from "./XmlPopup.module.css";
import toast from "react-hot-toast";

export const XmlPopup = ({ onClose, xmlContent }) => {
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (xmlContent) {
      setFileName("converted.xml"); // Default file name
    }
  }, [xmlContent]);

  const handleDownload = () => {
    try {
      if (!xmlContent || typeof xmlContent !== "string") {
        throw new Error("Invalid XML content.");
      }

      const blob = new Blob([xmlContent], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "converted.xml"; // Use fileName if set, otherwise default to "converted.xml"
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("File downloaded successfully!");
    } catch (error) {
      toast.error(`Failed to download the file: ${error.message}`);
      console.error("Download Error:", error);
    }
  };

  return (
    <div className={styles.popupContent}>
      <h4 className="fs-5 m-0 mb-3">Save Converted XML</h4>
      <input
        type="text"
        placeholder="Enter file name"
        className="form-control mb-4"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
      <button onClick={handleDownload} className="btn btn-primary">
        Save to Path
      </button>
      <button onClick={onClose} className="btn btn-secondary mt-2">
        Close
      </button>
    </div>
  );
};
