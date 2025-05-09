import React, { useEffect, useState } from "react";
import styles from "./Summary.module.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import {
  faEllipsisV,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { DotsModal } from "./DotsModal";
import { PrintModal } from "./PrintModal";
import { ColumnManagementModal } from "./ColumnManagementModal";
import { StatusPopup } from "./StatusPopup/StatusPopup";
import { TimeRangeFilter } from "./AllTimePopup/TimeRangeFilter ";
import { CustomPagination } from "./CustomPagination/CustomPagination";
import { url } from "../../api";
import { PDFDocument } from "pdf-lib";
import { ExportModal } from "./ExportModal/ExportModal";
import { ConfirmCancelPopUp } from "../Common/ConfirmCancelPopUp/ConfirmCancelPopUp";
import { Spinner } from "../Spinner/Spinner";
import { verifyEShipperCredentials } from "../../Redux/Actions/SummaryActions";
import { initialColumns } from "./ColumnsFields";
import { getUser } from "../../storageUtils/storageUtils";
import { useAppContext } from "../Context/AppContext";
import { useDispatch, useSelector } from "react-redux";
import { useFetchXmlData } from "./hooks/useFetchXmlData";
import { useShopifyOrderIds } from "./hooks/useShopifyOrderIds";
import { useFetchShopifyOrders } from "./hooks/useFetchShopifyOrders";
import { useFetchShipmentDetails } from "./hooks/useFetchShipmentDetails";
import { useFetchUnFulfillmentOrders } from "./hooks/useFetchUnFulfillmentOrders";
import { useFetchAllShipments } from "./hooks/useFetchAllShipments";
import { useMatchedFulfillments } from "./hooks/useMatchedFulfillments";
import { useTimeRangeFilter } from "./hooks/useTimeRangeFilter";
import { useResetFilters } from "./hooks/useResetFilters";
import { useFetchOrders } from "./hooks/useFetchOrders";

export const Summary = () => {
  const { dashboardWidth } = useAppContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const token = useSelector((state) => state.eshipper.token);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [clients, setClients] = useState([]);
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isColumnManagerVisible, setIsColumnManagerVisible] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [allShipmentData, setAllShipmentData] = useState([]);
  const [connectionsData , setConnectionsData ] = useState([])

  const [columns, setColumns] = useState(initialColumns);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const dispatch = useDispatch();

  const eShipperUsername = process.env.REACT_APP_ESHIPPER_USERNAME;
  const eShipperPassword = process.env.REACT_APP_ESHIPPER_PASSWORD;

  // customs hooks
  const {allOrders, orders, loadingOrders, filteredClients, orderClientsId } = useFetchShopifyOrders(connectionsData, url);
  const { fulfillmentOrders, loading, error } = useFetchUnFulfillmentOrders(url, orders);
  const { xmlData, formattedData, shipmentsId, setShipmentsId } = useFetchXmlData();
 
  const { shipmentData, loadingShipments } = useFetchShipmentDetails(url);
  const { shipmentsResponse } = useFetchAllShipments(url); // from database shipment data
  const {matchedFulfillments} = useMatchedFulfillments(fulfillmentOrders, allShipmentData)
  const { timeRange,customStartDate,customEndDate,setTimeRange,setCustomStartDate, setCustomEndDate,} = useTimeRangeFilter()
  const {databaseOrders} = useFetchOrders(url); // all orders from database
  
  
  // console.log("databaseOrders" , databaseOrders) // from database 
  // console.log("shipmentsId" , shipmentsId) 
  // console.log("shopifyOrderId" , shopifyOrderIds)
  // console.log("shipmentData" , shipmentData)
  console.log("orders" , orders)
  let userId = getUser();
  userId = userId?._id;

  const filterDataByTimeRange = (data) => {
    const today = new Date();

    const normalizeDate = (date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // console.log("Original data:", data);

    if (timeRange === "allTime") {
      return data;
    }

    if (timeRange === "today") {
      return data.filter((item) => {
        const createdDate = new Date(item.created_at);
        const isToday =
          normalizeDate(createdDate).getTime() ===
          normalizeDate(today).getTime();
   
        return isToday;
      });
    } else if (timeRange === "thisWeek") {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      return data.filter((item) => {
        const createdDate = new Date(item.created_at);
        const isThisWeek =
          normalizeDate(createdDate) >= normalizeDate(startOfWeek);

        return isThisWeek;
      });
    } else if (timeRange === "thisMonth") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return data.filter((item) => {
        const createdDate = new Date(item.created_at);
        const isThisMonth =
          normalizeDate(createdDate) >= normalizeDate(startOfMonth);

        return isThisMonth;
      });
    } else if (timeRange === "custom" && customStartDate && customEndDate) {
      return data.filter((item) => {
        const createdDate = new Date(item.created_at);
        const isInCustomRange =
          normalizeDate(createdDate) >= normalizeDate(customStartDate) &&
          normalizeDate(createdDate) <= normalizeDate(customEndDate);
     
        return isInCustomRange;
      });
    }
    return data;
  };

  // Example usage in useEffect
  useEffect(() => {
    const filtered = filterDataByTimeRange(orders);
    console.log("Filtered data based on selected time range:", filtered);
    setFilteredData(filtered);
  }, [orders, timeRange, customStartDate, customEndDate]);

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
    setShowExportModal(false); 
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    let newItem = [];
    if (value.length > 3) {
      newItem = orders.filter((val, i) => {
        return val.customer?.first_name.toLowerCase().startsWith(value.toLowerCase());
      });
      setFilteredData(newItem);
    } else {
      setFilteredData(orders);
    }
  };

 
  useEffect(() => {
    const fetchConnections = async () => {
      setLoadingConnections(true); // Start loading
      try {
        const response = await axios.get(`${url}/summary`);
        setConnectionsData(response.data);
        setClients(response.data);
      } catch (err) {
        toast.error("Failed to fetch connections");
      } finally {
        setLoadingConnections(false); // Stop loading
      }
    };
    
    fetchConnections();
  }, []);
  // console.log("connectionsData" , connectionsData)

  console.log("formatedData" , formattedData)

  const sendToEShipper = async () => {
    if (formattedData.length === 0) return;

    const newShipmentsData = formattedData.filter(
      (dataItem) =>
        !shipmentsId.some(
          (idItem) => idItem.shopifyOrderId === dataItem.reference1
        )
    );

    console.log("newShipmentsData", newShipmentsData);

    if (newShipmentsData.length === 0) {
      console.log("All shipments are already created.");
      return; // Skip if there are no new shipments
    }

    try {
      const data = {
        extractedData: [newShipmentsData[0]], // Only send new shipments
        token,
      };

      // Send request to backend
      const response = await axios.put(`${url}/summary/create-shipment`, data);
      console.log("response shipment........" , response.data)
      const successResponse = response.data?.successResponses;
      // if(response){
      //   toast.success(response.data.message)
      // }

      setShipmentsId((prev) => [
        ...prev,
        {
          shipmentId: successResponse.shipmentId,
          shopifyOrderId: successResponse.shopifyOrderId,
        },
      ]);
      
      // Handle success and failed responses from backend
    } catch (error) {
      console.error("Error sending data to eShipper:", error);
    }
  };
  // console.log("shipmentsId" , shipmentsId)

  useEffect(() => {
    const intervalId = setInterval(() => {
      sendToEShipper();
    }, 50000);

    return () => clearInterval(intervalId);
  }, [formattedData, token, shipmentsId]);

  const cleanShipmentData = (data) => {
    return data.map((item) => {
      const { shipmentData, trackingData, shopifyOrderId, shipmentId } = item;
  
      // Iterating over all packages in the packages array
      const packages = trackingData?.orderDetails?.packages?.packages || [];
  
      // Mapping each package's details to an array of strings with necessary details
      const cleanedPackages = packages.map((pkg) => {
        const { dimensionUnit, height, length, weight, weightUnit, width } = pkg;
  
        return {
          dimensions: `${width} x ${length} x ${height} ${dimensionUnit}`,
          weight: `${weight} ${weightUnit}`,
        };
      });
  
      // Extracting necessary fields from shipmentData
      const cleanedData = {
        carrier: shipmentData?.carrier?.carrierName || "",
        shipmentId: shipmentId || "",
        trackingNumber: shipmentData?.trackingNumber || "",
        trackingUrl: shipmentData?.trackingUrl || "",
        reference: shipmentData?.reference?.name || "",
        reference2: shipmentData?.reference2?.name || "",
        reference3: shipmentData?.reference3?.name || "",
        labels: shipmentData?.labelData?.label[0]?.data || "",
        shopifyOrderId: shopifyOrderId || "",
        address: trackingData?.orderDetails?.to?.address1,
        customer: trackingData?.orderDetails?.to?.attention,
        status: trackingData?.status || "",
  
        // Adding the multiple packages information
        packages: cleanedPackages,
      };
  
      return cleanedData;
    });
  };
  // These shipment data are comming from eshipper apis not from database:
  

  useEffect(() => {
    const cleanData = cleanShipmentData(shipmentData);
    setAllShipmentData(cleanData);
  }, [shipmentData]);

  // console.log("allShipmentData", allShipmentData); // from eshipper apis

  const handleEShipperClick = () => {
    dispatch(verifyEShipperCredentials(eShipperUsername, eShipperPassword));
  };

  useEffect(() => {
    // Check if there is connection data available
    if (connectionsData && connectionsData.length > 0) {
      handleEShipperClick(); // Only proceed if there is connection data
    } else {
      console.log("No connection data available, skipping eShipper verification.");
    }
  }, [connectionsData]); // Run whenever the connection data changes

  const decodeBase64 = (base64String, fileType = "application/octet-stream") => {
    try {
      const binaryString = atob(base64String.replace(/\s/g, ""));
      const binaryLen = binaryString.length;
      const bytes = new Uint8Array(binaryLen);
      for (let i = 0; i < binaryLen; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new Blob([bytes], { type: fileType });
    } catch (error) {
      console.error("Failed to decode Base64 string:", error);
      return null;
    }
  };
  
  const handleDownloadClick = async (rowIndex, base64Data, trackingNumber) => {
    setIsDownloading(true); // Start loading
    try {
      // Validate base64 data
      if (!base64Data || typeof base64Data !== "string") {
        throw new Error("Invalid base64 data");
      }
  
      let pdfBytes;
      // Use trackingNumber or a fallback name
      if (base64Data.startsWith("JVBERi0")) {
        // Handle PDF data
        const blob = decodeBase64(base64Data, "application/pdf");
  
        if (!blob) {
          throw new Error("Failed to decode Base64 string");
        }
  
        const arrayBuffer = await blob.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
  
        // Save the unmodified PDF
        pdfBytes = await pdfDoc.save();
      } else if (base64Data.startsWith("iVBORw0KGgoAAAANSU")) {
        // Handle PNG image data and embed it in a PDF
        const blob = decodeBase64(base64Data, "image/png");
  
        if (!blob) {
          throw new Error("Failed to decode Base64 string");
        }
  
        const arrayBuffer = await blob.arrayBuffer();
        const pdfDoc = await PDFDocument.create();
        const pngImage = await pdfDoc.embedPng(new Uint8Array(arrayBuffer));
  
        const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
        page.drawImage(pngImage, {
          x: 0,
          y: 0,
          width: pngImage.width,
          height: pngImage.height,
        });
  
        pdfBytes = await pdfDoc.save();
      } else {
        throw new Error("Unsupported file type or invalid base64 data");
      }
  
      // Create a Blob and trigger download
      const modifiedBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(modifiedBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Label_${trackingNumber}.pdf`; // Use trackingNumber as filename
      link.click();
      URL.revokeObjectURL(url);
  
      // Safely update the data array
      if (Array.isArray(data) && data[rowIndex]) {
        const updatedData = [...data];
        updatedData[rowIndex] = {
          ...updatedData[rowIndex],
          downloaded: true,
        };
        setData(updatedData);
      } else {
        console.warn(`Row at index ${rowIndex} does not exist in the data array.`);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Failed to process the file. Please try again.");
    } finally {
      setIsDownloading(false); // Stop loading after the operation completes
    }
  };
  
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
  
    if (checked) {
      const allRows = [
        ...(currentOrders || []),
        ...allShipmentData.filter(
          (shipment) =>
            !currentOrders?.some((order) => order.id.toString() === shipment.shopifyOrderId)
        ),
      ];
      setSelectedRows(allRows); 
    } else {
      setSelectedRows([]); 
    }
  };
  
  const handleRowSelect = (e, rowIndex, rowData, scheduledDate) => {
    const checked = e.target.checked;
    const updatedSelection = [...selectedRows];
  
    if (checked) {
      updatedSelection.push({
        rowData,
        scheduledDate,
      });
    } else {
      // Remove the row data from the selected rows
      const indexToRemove = updatedSelection.findIndex(
        (selected) => selected.rowData === rowData
      );
      if (indexToRemove > -1) {
        updatedSelection.splice(indexToRemove, 1);
      }
    }
    setSelectedRows(updatedSelection);
  };
  
  // console.log("slectedRow" , selectedRows)

  const extractFields = (data) => {
    return data.map(item => ({
        carrier: item?.rowData?.carrier,
        shipmentId: item?.rowData?.shipmentId,
        trackingNumber: item?.rowData?.trackingNumber,
        trackingUrl: item?.rowData?.trackingUrl,
        reference: item?.rowData?.reference,
        reference2: item?.rowData?.reference2,
        reference3: item?.rowData?.reference3,
        shopifyOrderId: item?.rowData?.shopifyOrderId,
        dimensions: item?.rowData?.dimentions, // Correct spelling as "dimensions"
        weight: item?.rowData?.weight,
        attention: item?.scheduledDate?.from?.attention,
        address1: item?.scheduledDate?.from?.address1,
    }));
};

const result = extractFields(selectedRows);
// console.log("resutl" ,result);
  

  const handleReset = () => {
    setShowDialog(true);
  };

  const handleOk = () => {
    setSearchTerm("");
    setSelectedStatuses([]);
    setTimeRange("allTime");
    setCustomStartDate(null);
    setCustomEndDate(null);
    setFilteredData(orders);
    setCurrentPage(1);
    setSelectedRows([]);
    setColumns(initialColumns);
    setShowDialog(false);
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  console.log("current orders" , currentOrders)
  const shopifyOrderIds = useShopifyOrderIds(currentOrders,fulfillmentOrders, url);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle change in items per page
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page is changed
  };


  // console.log("orderClientsId" , orderClientsId)
  // console.log("shipmentsResponse" , shipmentsResponse)
  // console.log("Fulfillment Orders:" , fulfillmentOrders)
  // console.log("Matched Fulfillment:" , matchedFulfillments)
  
  // Match Fulfillment Orders with Shipment Data

// create fulfillment /
const sendFulfillmentsWithDelay = async (fulfillments, delay = 2000) => {
  for (let i = 0; i < fulfillments.length; i++) {
    const { fulfillment_order_id, tracking_info } = fulfillments[i];
    console.log(`Sending fulfillment for ID: ${fulfillment_order_id}`);

    try {
      const response = await axios.post(
        `${url}/summary/create-fulfillment`,
        {
          fulfillment_order_id,
          message: "The package was shipped this morning.",
          tracking_info,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Fulfillment created for ID:", fulfillment_order_id, response.data);
    } catch (error) {
      console.error(
        `Error creating fulfillment for ID ${fulfillment_order_id}:`,
        error.response ? error.response.data : error.message
      );
    }

    // Wait for the specified delay before sending the next request
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};

 // useEffect to trigger sending fulfillments
//  useEffect(() => {
//   if (matchedFulfillments.length > 0) {
//     sendFulfillmentsWithDelay(matchedFulfillments, 2000); // Delay of 2000ms
//   }
// }, [matchedFulfillments]);


  return (
    <div
      className={`dashboard ${styles.summaryWrap}`}
      style={{ width: dashboardWidth }}
    >
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
                // statuses={uniqueStatuses}
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
                  result={result}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tableContainer}>
            {(loadingOrders || loadingShipments || loadingConnections) && (
        <Spinner isLoading={true} message="Loading data, please wait..." />
      )}

 
        <table className={`${styles.table} mt-4`}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedRows.length === currentOrders.length + allShipmentData.length}
                  onChange={(e) => handleSelectAll(e)}
                />
              </th>
              {columns.map((col) =>
                col.visible ? <th key={col.name}>{col.name}</th> : null
              )}
            </tr>
          </thead>
          <tbody>
          {[
              // Step 1: Processed Shipments (Shipments that match an Order ID)
              ...currentOrders
                .map(order => {
                  const shipment = allShipmentData.find(
                    shipment => shipment.shopifyOrderId === order.id.toString()
                  );

                  return shipment ? shipment : order; // If shipment exists, replace order with shipment
                }),

              // Step 2: New WMS Shipments (Shipments that don't have a matching order)
              ...allShipmentData.filter(
                shipment => !currentOrders.some(order => order.id.toString() === shipment.shopifyOrderId)
              ),
            ]
              .sort((a, b) => {
                // Sorting by creation date (descending)
                const aDate = new Date(a.created_at || a.scheduledShipDate);
                const bDate = new Date(b.created_at || b.scheduledShipDate);
                return bDate - aDate;
              })
              .map((item, index) => {
                const isOrder = currentOrders.some(order => order.id === item.id);
                const order = isOrder ? item : null;

                const shipment = allShipmentData.find(shipment => shipment.shopifyOrderId === (order ? order.id.toString() : item.shopifyOrderId));
                // console.log("shipment inside loop" , shipment)  // data from eshipper apis

                const shipmentDatabaseData = shipmentsResponse.find(
                  (data) => data.shopifyOrderId === (order ? order.id.toString() : shipment?.shopifyOrderId)
                );

                // console.log("shipmentDatabaseData" , shipmentDatabaseData) //Data from database

                // const filterData = allOrders.find((order) => order.id.toString() == shipment?.shopifyOrderId);
                // console.log("filterData", filterData);

                return (
                  <tr key={index}>
                    {columns.map((col, colIndex) => {
                      if (!col.visible) return null;

                      let value = "";
                      switch (col.key) {
                        case "select":
                          value = (
                            <input
                              type="checkbox"
                              checked={selectedRows.some((selected) => selected.rowData === item)}
                              onChange={(e) =>
                                handleRowSelect(e, index, item, shipment)
                              }
                            />
                          );
                          break;
                        case "orderNumber":
                          value = order ? order.id : shipment?.shopifyOrderId;
                          break;
                        case "platform":
                          value = order ? "Shopify" : "WMS";
                          break;
                        case "shipmentStatus":
                          value = shipment ? "Ready for shipping" : "";
                          break;
                        case "carrier":
                          value = shipment?.carrier || "";
                          break;
                        case "client":
                          value = order
                            ? orderClientsId.find((client) => client.orderId === order.id)?.clientName : " "
                          break;

                        case "customer":
                          value = shipment ? shipment?.customer  : `${order?.customer?.first_name || ''} ${order?.customer?.last_name || ''}` 
                            
                          break;

                        case "address":
                          value =shipment ? shipment?.address :  (order?.customer?.default_address?.address1 || order?.shipping_address.address1)
                          break;

                        case "trackingNumber":
                          value = shipment?.trackingNumber || "";
                          break;
                        case "trackingUrl":
                          value = shipment?.trackingUrl ? (
                            <a
                              href={shipment.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Url
                            </a>
                          ) : (
                            ""
                          );
                          break;
                        case "createdDate":
                          value = order
                            ? new Date(order.created_at).toISOString().split("T")[0]
                            : "";
                          break;
                        case "shippedDate":
                          value =
                          shipmentDatabaseData?.scheduledShipDate?.split(" ")[0] || "";
                          break;
                        case "reference":
                          value = shipment?.reference || "";
                          break;
                        case "reference2":
                          value = shipment?.reference2 || "";
                          break;
                        case "reference3":
                          value = shipment?.reference3 || "";
                          break;
                            case "dimentions":
                  // If shipment has multiple packages, display all dimensions
                  if (shipment?.packages) {
                    value = shipment.packages
                      .map(pkg => (
                        <span className={styles.shipmentDimensions}>
                          {pkg.dimensions}
                          <br />
                        </span>
                      ))
                  } else {
                    value = shipment?.dimentions || "";
                  }
                  break;
                  case "weight":
                    // If shipment has multiple packages, display all weights
                    if (shipment?.packages) {
                      value = shipment.packages.map(pkg => (
                        <span key={pkg._id} className={styles.shipmentDimensions}>
                          {pkg.weight} {pkg.weightUnit}
                          <br />
                        </span>
                      ));
                    } else {
                      value = shipment?.weight || "";
                    }
                    break;
                        case "labels":
                          value = shipment ? "Label" : ""; // Placeholder
                          break;
                        case "downloaded":
                          value = shipment?.labels ? (
                            <button
                              onClick={() =>
                                handleDownloadClick(index, shipment.labels, shipment.trackingNumber)
                              }
                              disabled={isDownloading}
                            >
                              {isDownloading ? 'Downloading...' : 'Download'}
                            </button>
                          ) : (
                            ""
                          );
                          break;
                        default:
                          value = " ";
                          break;
                      }

                      return <td key={colIndex}>{value}</td>;
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>

      </div>
  
        <CustomPagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          handlePageChange={handlePageChange}
          handleItemsPerPageChange={handleItemsPerPageChange}
          totalPages={totalPages}
        />
      
    </div>
  );
};
