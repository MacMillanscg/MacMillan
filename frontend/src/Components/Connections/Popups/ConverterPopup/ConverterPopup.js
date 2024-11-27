import React, { useState } from "react";
import styles from "./ConverterPopup.module.css";
import toast from "react-hot-toast";
import { js2xml } from "xml-js";
import axios from "axios";
import { url } from "../../../../api";
import { useParams } from "react-router-dom";

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

export const ConverterPopup = ({
  onClose,
  openXmlPopup,
  orders,
  setFetchTriggerXml,
  fetchTriggerXml,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredActions, setFilteredActions] = useState(conversionActions);
  const [selectedJsonData, setSelectedJsonData] = useState(null);
  console.log("JSONDATA", selectedJsonData);
  const { id } = useParams();
  console.log("id", id);

  console.log("orders in json", orders);

  const handleActionClick = async (action, actions) => {
    setSelectedJsonData(actions);
    console.log("actionsss", actions);
    if (action === "convertJsonToXml") {
      console.log("aciton");
      try {
        console.log("Orders JSON:", orders);

        if (!Array.isArray(orders) || orders.length === 0) {
          throw new Error("Invalid JSON data.");
        }

        // Wrap orders in an object to ensure valid XML structure
        const wrappedOrders = { orders: { order: orders } };

        const xmlContent = js2xml(wrappedOrders, { compact: true, spaces: 4 });
        openXmlPopup(xmlContent);
        const response = await axios.patch(
          `${url}/connections/${id}/xmlconversion`,
          actions
        );
        setFetchTriggerXml(!fetchTriggerXml);
        console.log("response", response.data);
      } catch (error) {
        console.error("Conversion Error:", error);
        toast.error(`Failed to convert JSON to XML: ${error.message}`);
      }
    } else {
      toast("This action is not yet implemented");
    }
  };

  return (
    <div className={styles.popupContent}>
      <input
        type="text"
        placeholder="Search Actions"
        className={`${styles.searchInput} form-control mb-4`}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      {/* <input type="file" className="form-control mb-4" /> */}
      <div className={styles.popupContent}>
        <button
          // onClick={handleDownload}
          className={`btn btn-primary ${styles.exportBtn}`}
        >
          Choose path
        </button>
        <button className={styles.noFile}>No path chosen</button>
      </div>
      <div className={styles.loopOptionsWrap}>
        {filteredActions.map((action, index) => (
          <div
            key={index}
            className={styles.actionDescription}
            onClick={() => handleActionClick(action.action, action)}
          >
            <h4 className={`m-0 mb-2`}>{action.name}</h4>
            <p className={styles.logicDescription}>{action.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
