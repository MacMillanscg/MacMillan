import React, { useEffect, useState, useRef } from "react";
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
  faLaptopHouse,
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
import { getUser } from "../../storageUtils/storageUtils";
import { url } from "../../api";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { ExportModal } from "./ExportModal/ExportModal";
import { ConfirmCancelPopUp } from "../Common/ConfirmCancelPopUp/ConfirmCancelPopUp";

export const Summary = () => {
  const { dashboardWidth } = useAppContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // const [base64Data, setBase64Data] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.eshipper.token);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clients, setClients] = useState([]);
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isColumnManagerVisible, setIsColumnManagerVisible] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [timeRange, setTimeRange] = useState("allTime");
  const [showDialog, setShowDialog] = useState(false);
  const [orders, setOrders] = useState([]);
  const [shipmentData, setShipmentData] = useState([]);
  const [trackingUrl, setTrackingUrl] = useState(null);
  const [base64Data, setBase64Data] = useState(null);
  const [columns, setColumns] = useState([
    { name: "", key: "select", visible: true },
    { name: "Order Number", key: "orderNumber", visible: true },
    { name: "Platform", key: "platform", visible: true },
    { name: "Shipment Status", key: "shipmentStatus", visible: true },
    { name: "Carrier", key: "carrier", visible: true },
    { name: "Client", key: "client", visible: true },
    { name: "Customer", key: "customer", visible: true },
    { name: "Address", key: "address", visible: true },
    { name: "Tracking Number", key: "trackingNumber", visible: true },
    { name: "Tracking URL", key: "trackingUrl", visible: true },
    { name: "Created Date", key: "createdDate", visible: true },
    { name: "Shipped Date", key: "shippedDate", visible: true },
    { name: "Reference", key: "reference", visible: true },
    { name: "Reference2", key: "reference2", visible: true },
    { name: "Reference3", key: "reference3", visible: true },
    { name: "Dimentions", key: "dimentions", visible: true },
    { name: "Weight", key: "weight", visible: true },
    { name: "Labels", key: "labels", visible: true },
    { name: "Downloaded", key: "downloaded", visible: true },
  ]);

  console.log("filteredClients", filteredClients);

  let userId = getUser();
  userId = userId?._id;
  console.log(userId);

  useEffect(() => {
    const fetchAllClients = async () => {
      try {
        const response = await axios.get(`${url}/clients`);
        const updatedData = response.data;
        const userClients = updatedData.filter(
          (user) => user.userId === userId
        );

        setClients(userClients);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllClients();
  }, [userId]);
  console.log("clients", clients);

  const filterDataByTimeRange = (data) => {
    const today = new Date();

    const normalizeDate = (date) => {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    if (timeRange === "today") {
      return data.filter((item) => {
        const createdDate = new Date(item.createdDate);
        return (
          normalizeDate(createdDate).getTime() ===
          normalizeDate(today).getTime()
        );
      });
    } else if (timeRange === "thisWeek") {
      const startOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay())
      );
      return data.filter((item) => {
        const createdDate = new Date(item.createdDate);
        return normalizeDate(createdDate) >= normalizeDate(startOfWeek);
      });
    } else if (timeRange === "thisMonth") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return data.filter((item) => {
        const createdDate = new Date(item.createdDate);
        return normalizeDate(createdDate) >= normalizeDate(startOfMonth);
      });
    } else if (timeRange === "custom" && customStartDate && customEndDate) {
      return data.filter((item) => {
        const createdDate = new Date(item.createdDate);
        return (
          normalizeDate(createdDate) >= normalizeDate(customStartDate) &&
          normalizeDate(createdDate) <= normalizeDate(customEndDate)
        );
      });
    }
    return data;
  };

  const applyFilters = () => {
    let filtered = [...data];
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((item) =>
        selectedStatuses.includes(item.shipmentStatus)
      );
    }
    // Filter by time range
    filtered = filterDataByTimeRange(filtered);
    setFilteredData(filtered);
  };

  console.log("filteredData", filteredData);

  useEffect(() => {
    applyFilters();
  }, [timeRange, selectedStatuses, customStartDate, customEndDate]);

  const getUniqueStatuses = (data) => {
    const statuses = data.map((item) => item.shipmentStatus);
    return [...new Set(statuses)];
  };
  const uniqueStatuses = getUniqueStatuses(MockData);

  const handleColumnManagerClick = () => {
    setIsColumnManagerVisible(true);
  };

  const closeColumnManager = () => {
    setIsColumnManagerVisible(false);
  };

  const handleMenuClick = () => {
    setIsModalVisible(true);
  };

  const handlePrintClick = () => {
    setIsPrintModalVisible(!isPrintModalVisible);
    setIsModalVisible(false);
  };

  const closePrintModal = () => {
    setIsPrintModalVisible(false);
  };

  const handleExportClick = () => {
    setShowExportModal(true); // Open the export modal
    setIsModalVisible(false);
  };

  const handleCloseExportModal = () => {
    setShowExportModal(false); // Close the export modal
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    let newItem = [];
    if (value.length > 3) {
      newItem = data.filter((val, i) => {
        return val.customer.toLowerCase().startsWith(value.toLowerCase());
      });
      setFilteredClients(newItem);
    } else {
      setFilteredClients(data);
    }
  };

  const handleRowSelect = (e, rowIndex) => {
    console.log("reowindex", rowIndex);
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

  console.log("selectedRow", selectedRows);
  const shippmentData = [];
  console.log("dataaa", data);

  const fetchShopifyOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/connections/67053d4b8a2309ab8db347d7/api/orders`
      );
      const orders = response.data.orders;

      const ordersWithPhone = orders.map((order) => {
        const phoneNumber = order.customer?.phone || "No phone provided";
        console.log("phonenumber", phoneNumber);
        return { ...order, customerPhone: phoneNumber };
      });

      console.log("orderwith", ordersWithPhone);
      setOrders(ordersWithPhone);
      setFilteredClients(ordersWithPhone);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      fetchShopifyOrders();
    }, 3000);
  }, []);

  const fetchShipmentRecords = async (shipmentId) => {
    try {
      const shipResponse = await axios.get(
        `https://uu2.eshipper.com/api/v2/ship/${shipmentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("shipResponse", shipResponse.data);
      setShipmentData(shipResponse.data);
      console.log("code", typeof shipResponse.data.reference.code);
      setBase64Data(shipResponse.data.labelData.label[0].data);
      setTrackingUrl(shipResponse.data.trackingUrl);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("label", base64Data);
  console.log("trackingUrl", trackingUrl);

  const shipmentIds = [
    8000000011219, 8000000011224, 8000000011225, 8000000011226, 8000000011227,
  ]; // Your shipment IDs

  useEffect(() => {
    if (token) {
      shipmentIds.forEach((shipmentId) => {
        fetchShipmentRecords(shipmentId); // Pass each shipment ID one by one
      });
    }
  }, [token]);

  // const fetchData = async (shipmentId) => {
  //   setLoading(true);
  //   try {
  // Fetch data from eShipper APIs and Shopify API concurrently
  // const [shipResponse, trackResponse, shopifyResponse] = await Promise.all([
  // axios.get(`https://uu2.eshipper.com/api/v2/ship/${shipmentId}`, {
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  // }),
  // axios.get(`https://uu2.eshipper.com/api/v2/track/${shipmentId}`, {
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  // }),
  //   axios.get(
  //     `http://localhost:5000/connections/67053d4b8a2309ab8db347d7/api/orders`
  //   ),
  // ]);

  // Process the response from both APIs
  // const shipData = shipResponse.data;
  // const trackData = trackResponse.data;
  // const shopifyOrders = shopifyResponse.data.orders;

  // Filter and map Shopify order details
  // const ordersWithPhone = shopifyOrders.map((order) => {
  //   const phoneNumber = order.customer?.phone || "No phone provided";
  //   return { ...order, customerPhone: phoneNumber };
  // });

  // console.log("Shopify Orders with Phone:", shopifyOrders);

  // Process eShipper tracking statuses
  // const filteredStatuses = Object.entries(trackData.status)
  //   .filter(([key, value]) => value)
  //   .map(([key]) => key)
  //   .join(", ");

  // Map data from both eShipper and Shopify APIs
  // const mappedData = {
  // orderNumber: shipData.reference.code,
  // shipmentNumber: shipData.order.id,
  // carrier: shipData.carrier.carrierName,
  // platform: "Shopify",
  // shipmentStatus: filteredStatuses,
  // client: clients[0]?.clientName,
  // customer: trackData.orderDetails.to.attention,
  // address: trackData.orderDetails.to.address1,
  // trackingNumber: shipData.trackingNumber, // From the 'track' API
  // trackingUrl: trackData.trackingUrl,
  // createdDate: "09/06/2024",
  // shippedDate: "07/07/2024",
  // reference: shipData.reference.name,
  // reference2: shipData.reference2.name,
  // reference3: shipData.reference3.name,
  // dimentions: `${trackData.orderDetails.packages.packages[0].length} x ${trackData.orderDetails.packages.packages[0].width} x ${trackData.orderDetails.packages.packages[0].height}`,
  // weight: `${trackData.orderDetails.packages.packages[0].weight} ${trackData.orderDetails.packages.packages[0].weightUnit}`,
  // label: shipData.labelData.label[0].data,
  // downloaded: false,
  // Add Shopify-specific fields here if needed
  // shopifyOrders: ordersWithPhone,
  // };

  //     return mappedData;
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setLoading(false); // Stop loading after data is fetched
  //   }
  // };

  // console.log("allData", allData);

  // const getAllShipments = async () => {
  //   const id = "2334523452";
  //   const shipments = [];
  // Loop through each shipment ID
  // for (let id of shipmentIds) {
  // const shipmentData = await fetchData(id);
  // if (shipmentData) {
  //   shipments.push(shipmentData);
  // }
  // }
  //   console.log("All shipments:", shipments);
  //   setData(shipments);
  //   setFilteredClients(shipments);
  // };
  // console.log("ordrs", orders);
  // console.log("filterclients", filteredClients);

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

  const handleDownloadClick = async (rowIndex) => {
    const trackingNumber = 123456789012;
    if (base64Data) {
      const blob = decodeBase64(base64Data);

      const arrayBuffer = await blob.arrayBuffer();

      const pdfDoc = await PDFDocument.load(arrayBuffer);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      const x = width / 3 - 90;
      const y = height / 3.3;
      const textWidth = 180;
      const textHeight = 16;

      firstPage.drawRectangle({
        x: x - 2,
        y: y - 2,
        width: textWidth,
        height: textHeight,
        color: rgb(1, 1, 1),
        // borderColor: rgb(0, 0, 0),
      });

      firstPage.drawText(`Tracking Number: ${trackingNumber}`, {
        x,
        y,
        size: 10,
        color: rgb(0, 0, 0),
      });
      const pdfBytes = await pdfDoc.save();
      const modifiedBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(modifiedBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `label_${trackingNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
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

  const handleReset = () => {
    // setSearchTerm("");
    // setFilteredClients(data);
    setShowDialog(true);
  };

  const handleOk = () => {
    setShowDialog(false);
    setSearchTerm("");
    setFilteredClients(data);
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  const additionalData = [
    {
      orderNumber: 6296516985137,
      reference: { name: 6296516985137 },
      reference2: { name: "#1002" },
      reference3: { name: "24653" },
    },
    {
      orderNumber: 6296729157937,
      reference: { name: 6296729157937 },
      reference2: { name: "#1003" },
      reference3: { name: "24655" },
    },
  ];

  const filteredDatas = filterDataByStatus(data); // Filter data before paginating

  return (
    <div className="dashboard" style={{ width: dashboardWidth }}>
      <div className={styles.summaryHeader}>
        {showDialog && (
          <ConfirmCancelPopUp
            headerText="Warning"
            bodyText="Do you still want to continue?"
            onOk={handleOk}
            onCancel={handleCancel}
            okButtonText="Ok"
            cancelButtonText="No"
          />
        )}
        <h1 className={styles.title}>Transaction Summary</h1>

        <div className={styles.filters}>
          <div className={styles.searchField}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={`form-control me-4 ${styles.searchBar}`}
            />
          </div>
          <div className={styles.filterFields}>
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
            <button className={styles.resetBtn} onClick={handleReset}>
              Reset
            </button>

            <div className="dotModal position-relative">
              <div className={styles.dots}>
                <FontAwesomeIcon
                  icon={faEllipsisV}
                  onClick={handleMenuClick}
                  className="p-1 cursor-pointer"
                />
              </div>
              {isModalVisible && (
                <DotsModal
                  handlePrintClick={handlePrintClick}
                  handleExportClick={handleExportClick}
                  setIsModalVisible={setIsModalVisible}
                  onclose={closePrintModal}
                />
              )}
              {isPrintModalVisible && (
                <PrintModal
                  onclose={closePrintModal}
                  selectedRows={selectedRows}
                  filteredClients={filteredClients}
                />
              )}
              {showExportModal && (
                <ExportModal
                  onClose={handleCloseExportModal}
                  selectedRows={selectedRows}
                  filteredClients={filteredClients}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}></div>
        ) : (
          <table className={`${styles.table} mt-4`}>
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
              {orders &&
                orders.map((row, index) => {
                  const additional =
                    additionalData &&
                    additionalData.find(
                      (shipment) => shipment && shipment.orderNumber === row.id
                    );

                  console.log("additional", additional);

                  return (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(index)}
                          onChange={(e) => handleRowSelect(e, index)}
                        />
                      </td>
                      {/* Dynamically render the cells based on column keys */}

                      {columns.map(
                        (column) =>
                          column.visible && (
                            <td key={column.key}>
                              {column.key === "orderNumber" && row.id}
                              {column.key === "platform" && "Shopify"}
                              {column.key === "client" &&
                                clients[0]?.clientName}
                              {column.key === "customer" && (
                                <>
                                  {`${row.customer.first_name} ${row.customer.last_name}`}
                                </>
                              )}
                              {column.key === "address" && (
                                <>
                                  {`${row.customer.default_address.address1} ${row.customer.default_address.city}`}
                                </>
                              )}
                              {column.key === "createdDate" &&
                                new Date(row.created_at)
                                  .toISOString()
                                  .split("T")[0]}
                              {/* {column.key === "download" && button} */}
                              {column.key === "downloaded" && (
                                // <td>
                                <button
                                  onClick={() => handleDownloadClick(index)}
                                >
                                  Download
                                </button>
                                // </td>
                              )}
                              {column.key === "reference" &&
                                row.id === 6296516985137 &&
                                "6296516985137"}
                              {column.key === "reference2" &&
                                row.id === 6296516985137 &&
                                "#1002"}
                              {column.key === "reference3" &&
                                row.id === 6296516985137 &&
                                "24653"}
                              {column.key === "weight" &&
                                row.id === 6296516985137 &&
                                "5.000 lb"}
                              {column.key === "dimentions" &&
                                row.id === 6296516985137 &&
                                `8 x 8 x 8 in`}
                              {/* new */}
                              {column.key === "reference" &&
                                row.id === 6296729157937 &&
                                "6296729157937"}
                              {column.key === "reference2" &&
                                row.id === 6296729157937 &&
                                "#1003"}
                              {column.key === "reference3" &&
                                row.id === 6296729157937 &&
                                "24655"}
                              {column.key === "weight" &&
                                row.id === 6296729157937 &&
                                "5.000 lb"}
                              {column.key === "dimentions" &&
                                row.id === 6296729157937 &&
                                `12 x 12 x 12 in`}
                              {/* new */}
                              {column.key === "reference" &&
                                row.id === 6299445166385 &&
                                "6299445166385"}
                              {column.key === "reference2" &&
                                row.id === 6299445166385 &&
                                "#1004"}
                              {column.key === "reference3" &&
                                row.id === 6299445166385 &&
                                "24724"}
                              {column.key === "weight" &&
                                row.id === 6299445166385 &&
                                "5.000 lb"}
                              {column.key === "dimentions" &&
                                row.id === 6299445166385 &&
                                `10 x 10 x 10 in`}
                              {/* new */}
                              {column.key === "reference" &&
                                row.id === 6299447034161 &&
                                "6299447034161"}
                              {column.key === "reference2" &&
                                row.id === 6299447034161 &&
                                "#1007"}
                              {column.key === "reference3" &&
                                row.id === 6299447034161 &&
                                "24727"}
                              {column.key === "weight" &&
                                row.id === 6299447034161 &&
                                "5.000 lb"}
                              {column.key === "dimentions" &&
                                row.id === 6299447034161 &&
                                `12 x 12 x 12 in`}
                              {/* new */}
                              {column.key === "reference" &&
                                row.id === 6299446542641 &&
                                "6299446542641"}
                              {column.key === "reference2" &&
                                row.id === 6299446542641 &&
                                "#1006"}
                              {column.key === "reference3" &&
                                row.id === 6299446542641 &&
                                "24726"}
                              {column.key === "weight" &&
                                row.id === 6299446542641 &&
                                "5.000 lb"}
                              {column.key === "dimentions" &&
                                row.id === 6299446542641 &&
                                `8 x 8 x 8 in`}

                              {column.key === "shippedDate" && "10/11/2024"}
                              {/* {column.key === "shippedDate" &&
                                row.id === 6299445821745 &&
                                "s234234 "} */}
                              {column.key === "carrier" && "Canada post"}
                              {column.key === "shipmentStatus" &&
                                "Ready for shipping"}
                              {column.key === "trackingNumber" &&
                                "123456789012"}
                              {column.key === "labels" && "Label"}
                              {column.key === "trackingUrl" && (
                                <a
                                  href={trackingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  URL
                                </a>
                              )}

                              {/* new */}
                            </td>
                          )
                      )}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        )}
      </div>

      <CustomPagination
        currentPage={currentPage}
        totalItems={filteredDatas.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};
