import React, { useEffect, useState } from "react";
import styles from "./Summary.module.css";
import { useAppContext } from "../Context/AppContext";
import { useDispatch, useSelector } from "react-redux";
import { verifyEShipperCredentials } from "../../Redux/Actions/SummaryActions";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faChevronDown,
  faChevronUp,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { DotsModal } from "./DotsModal";
import { PrintModal } from "./PrintModal";
import { MockData } from "./MockData";
import { ColumnManagementModal } from "./ColumnManagementModal";
import { StatusPopup } from "./StatusPopup/StatusPopup";
import { TimeRangeFilter } from "./AllTimePopup/TimeRangeFilter ";
import { CustomPagination } from "./CustomPagination/CustomPagination";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const Summary = () => {
  const { dashboardWidth } = useAppContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [base64Data, setBase64Data] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.eshipper.token);
  const [isModalVisible, setIsModalVisible] = useState(false);
  console.log("token", token);

  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);

  const [isColumnManagerVisible, setIsColumnManagerVisible] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [timeRange, setTimeRange] = useState("allTime");
  const [columns, setColumns] = useState([
    { name: "", key: "select", visible: true },
    { name: "Order Number", key: "orderNumber", visible: true },
    { name: "Platform", key: "platform", visible: true },
    { name: "Shipment Status", key: "shipmentStatus", visible: true },
    { name: "Client", key: "client", visible: true },
    { name: "Tracking Number", key: "trackingNumber", visible: true },
    { name: "Tracking URL", key: "trackingUrl", visible: true },
    { name: "Created Date", key: "createdDate", visible: true },
    { name: "Shipped Date", key: "shippedDate", visible: true },
    { name: "Labels", key: "labels", visible: true },
    { name: "Downloaded", key: "downloaded", visible: true },
  ]);

  // Filter data by time range
  const filterDataByTimeRange = (data) => {
    const today = new Date();

    if (timeRange === "today") {
      return data.filter((item) => {
        const createdDate = new Date(item.createdDate);
        return createdDate.toDateString() === today.toDateString();
      });
    } else if (timeRange === "thisWeek") {
      const startOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay())
      );
      return data.filter((item) => {
        const createdDate = new Date(item.createdDate);
        return createdDate >= startOfWeek;
      });
    } else if (timeRange === "thisMonth") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return data.filter((item) => {
        const createdDate = new Date(item.createdDate);
        return createdDate >= startOfMonth;
      });
    } else if (timeRange === "custom" && customStartDate && customEndDate) {
      return data.filter((item) => {
        const createdDate = new Date(item.createdDate);
        return createdDate >= customStartDate && createdDate <= customEndDate;
      });
    }
    return data; // Return all data for "allTime"
  };

  const applyFilters = () => {
    let filtered = [...data];
    // Filter by status
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((item) =>
        selectedStatuses.includes(item.shipmentStatus)
      );
    }
    // Filter by time range
    filtered = filterDataByTimeRange(filtered);
    setFilteredData(filtered);
  };

  console.log("filter", filteredData);

  useEffect(() => {
    applyFilters();
  }, [timeRange, selectedStatuses, customStartDate, customEndDate]);

  const getUniqueStatuses = (data) => {
    const statuses = data.map((item) => item.shipmentStatus);
    return [...new Set(statuses)];
  };
  const uniqueStatuses = getUniqueStatuses(MockData);

  const handleColumnManagerClick = () => {
    setIsColumnManagerVisible(!isColumnManagerVisible);
  };

  const closeColumnManager = () => {
    setIsColumnManagerVisible(false);
  };

  const handleMenuClick = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handlePrintClick = () => {
    setIsPrintModalVisible(!isPrintModalVisible);
    setIsModalVisible(false);
  };

  const closePrintModal = () => {
    setIsPrintModalVisible(false);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

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
  // 11007  11006  10963   10962   10956
  const shippmentData = [];
  console.log("dataaa", shippmentData);

  const fetchData = async (shipmentId) => {
    try {
      const response = await axios.get(
        `https://uu2.eshipper.com/api/v2/ship/${shipmentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBase64Data(response.data.labelData.label[0].data);
      console.log("response", response);

      // Map fetched data to table format
      const mappedData = {
        orderNumber: response.data.reference.code,
        shipmentNumber: response.data.order.id,
        platform: response.data.carrier.carrierName,
        shipmentStatus: response.data.carrier.serviceName,
        client: response.data.quote.carrierName,
        trackingNumber: response.data.trackingNumber,
        trackingUrl: response.data.trackingUrl,
        label: response.data.labelData.label[0].data,
        downloaded: false, // Initially set "Downloaded" status to false
      };

      return mappedData;

      // setAllData(mappedData);
      // setData(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // console.log("allData", allData);

  const shipmentIds = [
    "8000000011007",
    "8000000011006",
    "8000000010963",
    "8000000010962",
    "8000000010956",
    "8000000011015",
  ];

  const getAllShipments = async () => {
    const shipments = [];

    // Loop through each shipment ID
    for (let id of shipmentIds) {
      const shipmentData = await fetchData(id);
      if (shipmentData) {
        shipments.push(shipmentData);
      }
    }

    console.log("All shipments:", shipments);
    setData(shipments);
  };

  useEffect(() => {
    setTimeout(() => {
      getAllShipments();
    }, 1000);
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

  const totalItems = data.length;

  const paginateData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const updatedSelection = checked ? data.map((_, i) => i) : [];
    setSelectedRows(updatedSelection);
  };

  const filterDataByStatus = (data) => {
    if (selectedStatuses.length === 0) {
      return data; // If no status is selected, return all data
    }
    return data.filter((item) =>
      selectedStatuses.includes(item.shipmentStatus)
    );
  };

  const filteredDatas = filterDataByStatus(data); // Filter data before paginating

  console.log("timerange", timeRange);
  console.log("data", data);

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

          <div className={`${styles.dateFilters} me-2`}>
            <TimeRangeFilter
              setTimeRange={setTimeRange}
              timeRange={timeRange}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              startDate="Start Date"
              endDate="End Date"
              setCustomStartDate={setCustomStartDate}
              setCustomEndDate={setCustomEndDate}
            />
          </div>
          <div className={styles.columnsManagement}>
            Columns:
            <button
              onClick={handleColumnManagerClick}
              className={styles.manageColumns}
            >
              Show Columns
              <FontAwesomeIcon
                icon={isColumnManagerVisible ? faChevronUp : faChevronDown}
                className="ms-2"
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
            <StatusPopup
              statuses={uniqueStatuses}
              selectedStatuses={selectedStatuses}
              setSelectedStatuses={setSelectedStatuses}
            />
          </div>
          <button className={styles.resetBtn}>Reset</button>

          <div className="dotModal position-relative">
            <div className={styles.dots}>
              <FontAwesomeIcon
                icon={faEllipsisV}
                onClick={handleMenuClick}
                className="p-1 cursor-pointer"
              />
            </div>
            {isModalVisible && (
              <DotsModal handlePrintClick={handlePrintClick} />
            )}
            {isPrintModalVisible && <PrintModal onclose={closePrintModal} />}
          </div>
        </div>
      </div>

      <table className="table mt-4">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedRows.length === filteredDatas.length}
                onChange={handleSelectAll}
              />
            </th>
            {columns.map(
              (column) =>
                column.visible && <th key={column.key}>{column.name}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {paginateData(data).map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(index)}
                  onChange={(e) => handleRowSelect(e, index)}
                />
              </td>
              {columns
                .filter((column) => column.visible)
                .map((column) => (
                  <td key={column.key}>
                    {column.key === "downloaded" ? (
                      row[column.key] ? (
                        <FontAwesomeIcon icon={faCheck} />
                      ) : (
                        <button onClick={() => handleDownloadClick(index)}>
                          Download
                        </button>
                      )
                    ) : (
                      row[column.key]
                    )}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>

      <CustomPagination
        currentPage={currentPage}
        totalItems={filteredDatas.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
