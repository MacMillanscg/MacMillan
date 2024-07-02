import React, { useState } from "react";
import styles from "./ConverterPopup.module.css";
import toast from "react-hot-toast";

const conversionActions = [
  {
    name: "JSON to XML",
    description: "Convert JSON to XML.",
    action: "convertJsonToXml",
  },
  {
    name: "JSON to CSV",
    description: "Convert JSON to CSV.",
    action: "convertJsonToCsv",
  },
];

export const ConverterPopup = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convertedContent, setConvertedContent] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filteredActions, setFilteredActions] = useState(conversionActions);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length >= 3) {
      const filtered = conversionActions.filter((action) =>
        action.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredActions(filtered);
    } else {
      setFilteredActions(conversionActions);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        // Assuming JSON file
        try {
          const jsonContent = JSON.parse(fileContent);
          setConvertedContent(JSON.stringify(jsonContent, null, 2)); // Pretty print JSON
        } catch (error) {
          console.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  const convertJsonToXml = (json) => {
    let xml = '<?xml version="1.0" encoding="UTF-8" ?>\n';
    xml += jsonToXml(json);
    return xml;
  };

  const jsonToXml = (obj, indent = "") => {
    let xml = "";
    for (let key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key].forEach((item) => {
          xml += `${indent}<${key}>\n`;
          xml += jsonToXml(item, indent + "  ");
          xml += `${indent}</${key}>\n`;
        });
      } else if (typeof obj[key] === "object") {
        xml += `${indent}<${key}>\n`;
        xml += jsonToXml(obj[key], indent + "  ");
        xml += `${indent}</${key}>\n`;
      } else {
        xml += `${indent}<${key}>${obj[key]}</${key}>\n`;
      }
    }
    return xml;
  };

  const convertJsonToCsv = (json) => {
    const array = Array.isArray(json) ? json : [json];
    const keys = Object.keys(array[0]);
    const csvContent = [
      keys.join(","), // header row
      ...array.map((row) =>
        keys.map((key) => JSON.stringify(row[key], replacer)).join(",")
      ),
    ].join("\n");
    return csvContent;
  };

  const replacer = (key, value) => (value === null ? "" : value);

  const handleActionClick = (action) => {
    if (!selectedFile) {
      toast.error(" Please select a file first.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      try {
        const jsonContent = JSON.parse(fileContent);
        let result;
        if (action === "convertJsonToXml") {
          result = convertJsonToXml(jsonContent);
        } else if (action === "convertJsonToCsv") {
          result = convertJsonToCsv(jsonContent);
        }
        setConvertedContent(result);
      } catch (error) {
        console.error("Invalid JSON file");
      }
    };
    reader.readAsText(selectedFile);
  };

  const downloadFile = () => {
    const blob = new Blob([convertedContent], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "converted_file.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.popupContent}>
      <input
        type="text"
        placeholder="Search Actions"
        className={`${styles.searchInput} form-control mb-4`}
        value={searchInput}
        onChange={handleSearchChange}
      />
      <input
        type="file"
        onChange={handleFileChange}
        className="form-control mb-4"
      />
      <div className={styles.loopOptionsWrap}>
        {filteredActions.map((action, index) => (
          <div
            key={index}
            className={styles.actionDescription}
            onClick={() => handleActionClick(action.action)}
          >
            <h4 className={`m-0 mb-2`}>{action.name}</h4>
            <p className={styles.logicDescription}>{action.description}</p>
          </div>
        ))}
      </div>
      {convertedContent && (
        <div>
          {/* <pre className={styles.convertedContent}>{convertedContent}</pre> */}
          <button onClick={downloadFile} className="btn btn-primary mt-4">
            Download Converted File
          </button>
        </div>
      )}
    </div>
  );
};
