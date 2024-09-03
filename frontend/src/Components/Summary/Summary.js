import React, { useEffect, useState } from "react";
import styles from "./Summary.module.css";
import { useAppContext } from "../Context/AppContext";
import { useDispatch, useSelector } from "react-redux";
import { verifyEShipperCredentials } from "../../Redux/Actions/SummaryActions";
import axios from "axios";
import { Dropdown, DropdownButton } from "react-bootstrap"; // Import Bootstrap for Dropdown
import Pagination from "react-bootstrap/Pagination"; // Import Pagination
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { DotsModal } from "./DotsModal";
import { PrintModal } from "./PrintModal";
import { MockData } from "./MockData";
import { ColumnManagementModal } from "./ColumnManagementModal";

export const Summary = () => {
  const { dashboardWidth } = useAppContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState(MockData);
  const [base64Data, setBase64Data] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Default items per page
  const dispatch = useDispatch();
  const token = useSelector((state) => state.eshipper.token);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);

  const [isColumnManagerVisible, setIsColumnManagerVisible] = useState(false);
  const [columns, setColumns] = useState([
    { name: "Order Number", key: "orderNumber", visible: true },
    { name: "Shipment Number", key: "shipmentNumber", visible: true },
    { name: "Platform", key: "platform", visible: true },
    { name: "Shipment Status", key: "shipmentStatus", visible: true },
    { name: "Client", key: "client", visible: true },
    { name: "Tracking Number", key: "trackingNumber", visible: true },
    { name: "Tracking URL", key: "trackingUrl", visible: true },
    { name: "Labels", key: "labels", visible: true },
    { name: "Downloaded", key: "downloaded", visible: true },
  ]);

  const handleColumnManagerClick = () => {
    setIsColumnManagerVisible(!isColumnManagerVisible);
  };

  const closeColumnManager = () => {
    setIsColumnManagerVisible(false);
  };

  const handleMenuClick = () => {
    setIsModalVisible(!isMenuModalVisible);
  };

  const handlePrintClick = () => {
    setIsPrintModalVisible(!isPrintModalVisible);
    setIsModalVisible(false);
  };

  const closePrintModal = () => {
    setIsPrintModalVisible(false);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);

  const handleRowSelect = (e, rowIndex) => {
    const updatedSelection = [...selectedRows];
    if (e.target.checked) {
      updatedSelection.push(rowIndex);
    } else {
      const index = updatedSelection.indexOf(rowIndex);
      if (index > -1) {
        updatedSelection.splice(index, 1);
      }
    }
    setSelectedRows(updatedSelection);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://uu2.eshipper.com/api/v2/ship/8000000010963",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBase64Data(response.data.labelData.label[0].data);

      // Map fetched data to table format
      const mappedData = [
        {
          orderNumber: response.data.reference.code,
          shipmentNumber: response.data.order.id,
          platform: response.data.carrier.carrierName,
          shipmentStatus: response.data.carrier.serviceName,
          client: response.data.quote.carrierName,
          trackingNumber: response.data.trackingNumber,
          trackingUrl: response.data.trackingUrl,
          downloaded: false, // Initially set "Downloaded" status to false
        },
      ];

      // setData(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleEShipperClick = () => {
    dispatch(verifyEShipperCredentials("Macmillan_sandbox", "Macmillan@123"));
  };

  useEffect(() => {
    handleEShipperClick();
  }, []);

  const decodeBase64 = (base64String) => {
    try {
      const binaryString = atob(base64String);
      const binaryLen = binaryString.length;
      const bytes = new Uint8Array(binaryLen);
      for (let i = 0; i < binaryLen; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new Blob([bytes], { type: "application/pdf" });
    } catch (error) {
      console.error("Failed to decode Base64 string:", error);
      return null;
    }
  };

  const handleDownloadClick = (rowIndex) => {
    if (base64Data) {
      const blob = decodeBase64(base64Data);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "label.pdf";
      link.click();
      URL.revokeObjectURL(url);

      // Mark the row as downloaded
      const updatedData = [...data];
      updatedData[rowIndex].downloaded = true;
      setData(updatedData);
    }
  };

  const paginateData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <div className={styles.summaryHeader}>
        <h1 className={styles.title}>Transaction Summary</h1>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`form-control me-4 ${styles.searchBar}`}
          />

          <div className={`${styles.dateFilters} me-5`}>
            <div className="form-group d-flex align-items-center">
              <label>Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className={`form-control ${styles.dateInput}`}
              />
            </div>

            <div className="form-group d-flex align-items-center">
              <label>End Date:</label>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className={`form-control ${styles.dateInput}`}
              />
            </div>
          </div>
          <div className={styles.columnsManagement}>
            <button
              onClick={handleColumnManagerClick}
              className={styles.manageColumns}
            >
              Show Columns
              <FontAwesomeIcon
                icon={isColumnManagerVisible ? faChevronUp : faChevronDown}
                className="ms-1"
              />
            </button>
            {isColumnManagerVisible && (
              <ColumnManagementModal
                columns={columns}
                setColumns={setColumns}
                onClose={closeColumnManager}
              />
            )}
          </div>

          <div className={styles.statusFilter}>
            <label>Status:</label>
            <select
              value={status}
              onChange={handleStatusChange}
              className={styles.select}
            >
              <option value="">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="dotModal position-relative">
            <div className={styles.dots}>
              <FontAwesomeIcon icon={faEllipsisV} onClick={handleMenuClick} />
            </div>
            {isModalVisible && (
              <DotsModal handlePrintClick={handlePrintClick} />
            )}
            {isPrintModalVisible && <PrintModal onclose={closePrintModal} />}
          </div>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map(
                (col, index) => col.visible && <th key={index}>{col.name}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginateData(data).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => {
                  if (!col.visible) return null;

                  if (col.key === "select") {
                    return (
                      <td key={colIndex}>
                        <input
                          type="checkbox"
                          onChange={(e) => handleRowSelect(e, rowIndex)}
                        />
                      </td>
                    );
                  }

                  if (col.key === "download") {
                    return (
                      <td key={colIndex}>
                        <button
                          onClick={() => handleDownloadClick(rowIndex)}
                          className={styles.downloadButton}
                        >
                          Download
                        </button>
                      </td>
                    );
                  }

                  if (col.key === "downloaded") {
                    return <td key={colIndex}>{row[col.key] ? "✔" : ""}</td>;
                  }

                  if (col.key === "trackingUrl") {
                    return (
                      <td key={colIndex}>
                        <a href={row[col.key]} target="_blank" rel="noreferrer">
                          URL
                        </a>
                      </td>
                    );
                  }

                  return <td key={colIndex}>{row[col.key]}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.paginationContainer}>
        <Pagination>
          <Pagination.First
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(Math.ceil(data.length / itemsPerPage)).keys()].map(
            (page) => (
              <Pagination.Item
                key={page + 1}
                active={page + 1 === currentPage}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </Pagination.Item>
            )
          )}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
          />
          <Pagination.Last
            onClick={() =>
              handlePageChange(Math.ceil(data.length / itemsPerPage))
            }
            disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
          />
        </Pagination>
      </div>
    </div>
  );
};
