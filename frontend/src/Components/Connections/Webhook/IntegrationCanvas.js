import React, { useState, useEffect } from "react";
import styles from "./IntegrationCanvas.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faArrowDown,
  faArrowUp,
  faClock,
  faPlayCircle,
  faChevronUp,
  faChevronDown,
  faL,
  faLariSign,
  faEdit,
  faTrash,
  faSleigh,
} from "@fortawesome/free-solid-svg-icons";
import { ConnectionPopup } from "../Popups/ConnectionDetailsPopup/ConnectionPopup";
import { ClientPopup } from "../Popups/ClientPopup/ClientPopup";
import { VersionHistoryPopup } from "../Popups/VersionHistoryPopup/VersionHistoryPopup";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { url } from "../../../api";
import { RunHistory } from "./RunningTestResults/RunHistory";
import { Steps } from "./RunningTestResults/Steps";
import { OutputLogs } from "./RunningTestResults/OutputLogs";
import webhook from "../../../assets/images/webhook.png";
import Shopify from "../../../assets/images/Shopify.jpg";
import xmlimg from "../../../assets/images/xmlimg.PNG";
import { StepPopup } from "../Popups/StepPopups/StepPopup";
import { AddStepPopup } from "../Popups/AddStepPopup/AddStepPopup";
import { LogicToolsPopup } from "../Popups/LogicToolsPopup/LogicToolsPopup";
import { ActionPopup } from "../Popups/ActionPopup/ActionPopup";
import { LoopActionPopup } from "../Popups/LoopActionPopup/LoopActionPopup";
import { ConverterPopup } from "../Popups/ConverterPopup/ConverterPopup";
import { IntegrationPopup } from "../Popups/IntegrationPopup/IntegrationPopup";
import { ShopifyPopup } from "../Popups/ShopifyPopup/ShopifyPopup";
import { EShippersPopup } from "../Popups/EShippersPopup/EShippersPopup";
import { HttpPopup } from "../Popups/HttpPopup/HttpPopup";
import { WarningPopup } from "../Popups/WarningPopup/WarningPopup";
import { CanvasFlow } from "./CanvasFlows/CanvasFlow";
import { OrdersPopUp } from "../Popups/OrdersPopUp/OrdersPopUp";
import { FullfilmentPopUp } from "../Popups/FullfilmentPopup/FullfilmentPopup";
import { XmlPopup } from "../Popups/XmlPopup/XmlPopup";
import { WebhookTriggerPopup } from "../Popups/WebhookTriggerPopup/WebhookTriggerPopup";
import { fetchConnections } from "../../../Redux/Actions/ConnectionsActions";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";

export const IntegrationCanvas = () => {
  const [steps, setSteps] = useState([{ id: 1, title: "Step 1 of Rule 1" }]);
  const [connectionPopup, setConnectionPopup] = useState(false);
  const [clientPopup, setClientPopup] = useState(false);
  const [versionPopup, setVersionPopup] = useState(false);
  const { id } = useParams();
  const [connection, setConnection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTestResults, setShowTestResults] = useState(false);
  const [testHistory, setTestHistory] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [stepsData] = useState([
    { id: 1, name: "Trigger", webImg: webhook, time: null },
    // { id: 2, name: "Deserialize XML", webImg: xmlimg, time: null },
    { id: 2, name: "Get Orders", webImg: Shopify, time: null },
  ]);
  const [stepsRun, setStepsRun] = useState(stepsData);
  const [isLogicPopup, setIsLogicPopup] = useState(false);
  const [isActionPopup, setIsActionPopup] = useState(false);
  const [isLoopPopup, setIsLoopPopup] = useState(false);
  const [isConverterPopup, setIsConverterPopup] = useState(false);
  const [isIntegratioPopup, setIsIntegrationPopup] = useState(false);
  const [isShopifyPopUp, setIsShopifyPopup] = useState(false);
  const [isEShipperPopup, setIsEShipperPopup] = useState(false);
  const [isHttpPopup, setIsHttpPopup] = useState(false);
  const [isOrderPopup, setIsOrderPopup] = useState(false);
  const [isFullfilmentPopup, setIsFullfilmentPopup] = useState(false);
  const [orders, setOrders] = useState([]);
  // const [error, setError] = useState(null);
  const [shopifyDetails, setShopifyDetails] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [fetchTriggerXml, setFetchTriggerXml] = useState(false);
  const [initialized, setInitialized] = useState(
    JSON.parse(localStorage.getItem("shopifyInitialized")) || false
  );
  const [selectedIntegration, setSelectedIntegration] = useState([]);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [isXmlPopup, setIsXmlPopup] = useState(false);
  const [xmlContents, setXmlContents] = useState("");
  const [isWebhookTriggerPopup, setIsWebhookTriggerPopup] = useState(false);
  const [xmlConversion, setXmlConversion] = useState([]);
  const [filteredConnection, setFilteredConnection] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [integrationId, setIntegrationId] = useState(null);
  const [shopifyOrderIds, setShopifyOrderIds] = useState([]);
  const [fullfillmentId, setFullfillmentId] = useState(["223417687559"]);
  const [selectedStep, setSelectedStep] = useState("Rule 1");
  const [selectedStepId, setSelectedStepId] = useState(null);
  const [newRules, setNewRules] = useState(false);
  const [scheduleIds, setScheduleIds] = useState([]);
  const [connectionsPublish, setConnectionsPublish] = useState([]);
  const [showXmlWarning, setShowXmlWarning] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const dispatch = useDispatch();
  const { connections, error } = useSelector((state) => state.connections);
  console.log("idddd", id);

  useEffect(() => {
    const newConnection = connections.find(
      (connection) => connection._id === id
    );
    setFilteredConnection(newConnection);
    setClientId(newConnection?.client.clientId);
    setIntegrationId(
      newConnection?.integrations.map((integration) => integration._id)
    );
  }, [id, connections]);

  console.log("filteredConnection", filteredConnection);

  useEffect(() => {
    if (connections.length === 0) {
      dispatch(fetchConnections());
    }
  }, [dispatch, connections]);

  console.log("connecitns", connections);

  const fetchShopifyOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/connections/${id}/api/orders`
      );
      const orders = response.data.orders;

      const ordersWithPhone = orders.map((order) => {
        const phoneNumber = order.customer?.phone || "No phone provided";
        console.log("phonenumber", phoneNumber);
        return { ...order, customerPhone: phoneNumber };
      });

      setOrders(ordersWithPhone);

      localStorage.setItem("shopifyInitialized", JSON.stringify(true));
      localStorage.setItem("shopify", JSON.stringify(true));
      closeShopifyPopup();

      // setInitialized(true);
      setFetchTrigger(!fetchTrigger);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchShopifyIds = async () => {
    try {
      const orderIds = orders.map((order) => order.id); // Extract order IDs
      if (orderIds) {
        setShopifyOrderIds(orderIds);
      }
      console.log("orderIDs:", orderIds);

      if (orderIds.length > 0) {
        await axios.post(
          `http://localhost:5000/connections/${id}/api/saveOrderIds`,
          { orderIds }
        );
      }
    } catch (error) {
      console.error("Error while saving order IDs:", error);
    }
  };
  // console.log("shopifyOrderIds", shopifyOrderIds[0]);

  // Call fetchShopifyIds when orders are updated
  useEffect(() => {
    if (orders && orders.length > 0) {
      fetchShopifyIds();
    }
  }, [orders]);

  console.log("orders", orders);

  console.log("fullfillmentid", fullfillmentId);
  const orderid = shopifyOrderIds[0];
  console.log(orderid);

  // To get id from from those unfullfill orders use this function
  const getUnFulfillmentOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/connections/${id}/get-fulfillment`
      );
      if (response) {
        // setFullfillmentId(response.data.fulfillmentOrderIds);
        console.log("fulfillmentOrderIds", response.data.fulfillmentOrderIds);
      }
    } catch (error) {
      console.log(
        "Error fetching fulfillment orders:",
        error.response ? error.response.data : error.message
      );
    }
  };
  useEffect(() => {
    getUnFulfillmentOrders();
  }, [orders]);

  const sigleFilfullId = fullfillmentId[0];
  console.log("sdfasdfs", sigleFilfullId);

  const sendFulfillmentsWithDelay = async (fulfillmentIds, delay = 2000) => {
    for (let i = 0; i < fulfillmentIds.length; i++) {
      const fulfillment_order_id = fulfillmentIds[i];
      console.log(`Sending fulfillment for ID: ${fulfillment_order_id}`);

      try {
        const response = await axios.post(
          `http://localhost:5000/connections/${id}/create-fulfillment`,
          {
            fulfillment_order_id: fulfillment_order_id, // Send the fulfillment order ID
            message: "The package was shipped this morning.",
            tracking_info: {
              number: "1Z001985YW997441234111",
              url: "https://www.ups.com/WebTracking?loc=en_US&requester=ST&trackNums=1Z001985YW997441234111",
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(
          "Fulfillment created for ID:",
          fulfillment_order_id,
          response.data
        );
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

  useEffect(() => {
    if (fullfillmentId.length > 0) {
      sendFulfillmentsWithDelay(fullfillmentId, 2000); // Delay of 2000ms (2 seconds) between requests
    }
  }, [fullfillmentId]); // Runs when fullfillmentId array is updated

  useEffect(() => {
    // if (initialized) {
    fetchShopifyOrders();
    // }
  }, []);

  const handleButtonClick = () => {
    if (!initialized) {
      fetchShopifyOrders();
    }
  };

  useEffect(() => {
    const fetchShopifyDetails = async () => {
      try {
        const response = await axios.get(
          `${url}/connections/${id}/shopifyDetails`
        );
        setShopifyDetails(response.data);
        setHasUnsavedChanges(true);
      } catch (error) {
        console.error("Error fetching Shopify details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopifyDetails();
  }, [id, fetchTrigger]);
  // console.log("shopifyDetails", shopifyDetails);
  // console.log("ordrs", orders);

  // Use useEffect to handle state updates when selectedStep or selectedStepId changes
  useEffect(() => {
    if (selectedStep !== "Rule 1" && selectedStepId !== id) {
      setNewRules(true);
      console.log("new step");
    } else {
      // setNewRules(false);
      console.log("Rule 1 step");
    }
  }, [selectedStep, selectedStepId, id]); // This effect runs only when selectedStep, selectedStepId, or id changes

  const addShopifyOrders = async () => {
    try {
      const transactionResponse = await axios.post(
        `${url}/connections/${id}/saveTransaction`,
        {
          clientId,
          integrationId,
          type: "order",
          // data: shopifyId,
        }
      );
      console.log("trasnaction", transactionResponse);
    } catch (error) {
      console.log("Error in shopify orders ", error);
    }
  };

  useEffect(() => {
    const fetchConversionDetails = async () => {
      try {
        const response = await axios.get(
          `${url}/connections/${id}/xmlconversions`
        );
        // console.log("xmlreso", response);
        setXmlConversion(response.data.conversionsXML);
        setHasUnsavedChanges(true);
      } catch (error) {
        console.error("Error fetching Shopify details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversionDetails();
  }, [id, fetchTriggerXml]);

  useEffect(() => {
    const fetchShopifyDetails = async () => {
      try {
        const response = await axios.get(`${url}/connections/${id}`);
        setSelectedIntegration(response.data);
      } catch (error) {
        console.error("Error fetching Shopify details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopifyDetails();
  }, [id, fetchTrigger]);

  const handleDeleteShopifyDetails = async () => {
    try {
      await axios.delete(`${url}/connections/${id}/shopifyDetails`);
      setFetchTrigger(!fetchTrigger); // Re-fetch the details to reflect the deletion
      setShowWarningModal(false);
      localStorage.removeItem("shopifyInitialized");
      setInitialized(false);
    } catch (error) {
      console.error("Error deleting Shopify details:", error);
    }
  };

  const handleDeleteXmlConversion = async () => {
    try {
      const response = await axios.delete(
        `${url}/connections/${id}/xmlConversion`
      );
      if (response.status === 200) {
        setXmlConversion(null);
        setShowXmlWarning(false);
        toast.success("XML Conversion deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting XML Conversion:", error);
      toast.error("Failed to delete XML Conversion. Please try again.");
    }
  };

  useEffect(() => {
    const fetchConnection = async () => {
      try {
        const response = await axios.get(`${url}/connections/${id}`);
        setConnection(response.data);
        console.log("response", response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching connection:", error);
        setLoading(false);
      }
    };

    fetchConnection();
  }, [id]);

  const openTriggerPopup = () => {
    setIsWebhookTriggerPopup(true);
  };

  const closeWebhookTriggerPopup = () => {
    setIsWebhookTriggerPopup(false);
  };

  const logicToolsPopup = () => {
    setIsLogicPopup(true);
    closeStepPopup();
  };

  const openActionPopup = () => {
    setIsActionPopup(true);
    closeLoginPopup();
  };

  const openStepPopup = () => {
    setIsPopupOpen(true);
  };

  const openLoopPopup = () => {
    setIsLoopPopup(true);
    closeLoginPopup();
  };

  const openConverterPopup = () => {
    setIsConverterPopup(true);
    setIsPopupOpen(false);
  };
  const openIntegrationPopup = () => {
    setIsIntegrationPopup(true);
    closeStepPopup();
  };

  const openShopifyPopup = () => {
    setIsShopifyPopup(true);
    closeIntegrationPopup();
  };
  const openEShipperPopup = () => {
    setIsEShipperPopup(true);
    closeIntegrationPopup();
  };
  const openHttpPopup = () => {
    setIsHttpPopup(true);
    closeIntegrationPopup();
  };

  const openOrderPopup = () => {
    setIsOrderPopup(true);
  };

  const openFullfilmentPopup = () => {
    setIsFullfilmentPopup(true);
    setIsIntegrationPopup(false);
  };

  const openXmlPopup = (xmlContent) => {
    // console.log("Converted XML:", xmlContent);
    setXmlContents(xmlContent);
    setIsXmlPopup(true);
    closeConverterPopup();
  };
  // console.log("xmlContents:", xmlContents);

  const closeXmlPopup = () => {
    setIsXmlPopup(false);
  };

  const closeFullfilmentPopup = () => {
    setIsFullfilmentPopup(false);
  };

  const closeOrderPopup = () => {
    setIsOrderPopup(false);
  };
  const closeHttpPopup = () => {
    setIsHttpPopup(false);
  };

  const closeStepPopup = () => {
    setIsPopupOpen(false);
  };
  const closeLoginPopup = () => {
    setIsLogicPopup(false);
  };
  const closeActionPopup = () => {
    setIsActionPopup(false);
  };
  const closeLoopPopup = () => {
    setIsLoopPopup(false);
    closeActionPopup();
  };
  const closeConverterPopup = () => {
    setIsConverterPopup(false);
  };
  const closeIntegrationPopup = () => {
    setIsIntegrationPopup(false);
  };
  const closeShopifyPopup = () => {
    setIsShopifyPopup(false);
  };

  const closeEShipperPopup = () => {
    setIsEShipperPopup(false);
  };

  const openConnectionPopup = () => {
    setConnectionPopup(true);
  };
  const openClientPopup = () => {
    setClientPopup(true);
  };

  const openVersionPopup = () => {
    setVersionPopup(true);
  };

  const handleClosePopup = () => {
    setConnectionPopup(false);
    setClientPopup(false);
    setVersionPopup(false);
  };

  const toggleVisibility = () => {
    setShowTestResults(!showTestResults);
  };

  const handleRunClick = () => {
    setShowTestResults(true);
    const startTime = Date.now();
    // setIsExpanded(true);

    // Simulating test run with a timeout
    setTimeout(() => {
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(1); // duration in seconds

      setTestHistory([
        ...testHistory,
        {
          id: testHistory.length + 1,
          time: new Date().toISOString(),
          duration,
        },
      ]);
    }, 2000); // Simulate a test run of 2 seconds

    // setSteps([]);

    stepsData.forEach((step, index) => {
      setTimeout(() => {
        setStepsRun((prevSteps) => {
          const newSteps = [...prevSteps];
          newSteps[index] = {
            ...newSteps[index],
            time: `${Math.floor(Math.random() * 200)}ms`,
          };
          return newSteps;
        });
      }, (index + 1) * 500); // Delay each step by 500ms
    });
  };

  const backPopup = () => {
    closeLoginPopup();
    closeConverterPopup();
    closeIntegrationPopup();
    openStepPopup();
  };

  const clearShopifySession = () => {
    localStorage.removeItem("shopifyInitialized");
    setInitialized(false);
  };

  console.log("idsWithScheduleOption", scheduleIds);
  // this is used to show the schedule instead of trigger title
  const isSelected = scheduleIds.includes(selectedStepId);
  console.log("isSelected", isSelected);

  console.log("selectedRULE", selectedStep);

  const handlePublish = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/connections/${id}/publish`
      );
      console.log("publish response", response);

      if (response.status === 200) {
        toast.success(`New version published successfully!`);
      }
    } catch (error) {
      console.error("Error publishing version:", error);
      toast.error("Failed to publish version. Please try again.");
    }
  };

  const handleSaveData = () => {
    if (hasUnsavedChanges) {
      setHasUnsavedChanges(false); // Mark the data as saved
      toast.success("The data saved successfully");
    }
  };

  return (
    <div>
      <div className={styles.topBar}>
        <div className="d-flex">
          <Link
            to="/connections"
            className={styles.exitButton}
            onClick={clearShopifySession}
          >
            Exit
          </Link>
          <h3 className={styles.connectionTitle}>
            {connection?.connectionName}
          </h3>
        </div>
        <div className={styles.topBarControls}>
          <button className={styles.publishButton} onClick={handlePublish}>
            Publish
          </button>
          <button className={styles.cancelButton}>Cancel</button>
          <button className={styles.saveButton} onClick={handleSaveData}>
            Save
          </button>
        </div>
      </div>

      <div className={styles.mainContainer}>
        {showWarningModal && (
          <WarningPopup
            show={showWarningModal}
            onClose={() => setShowWarningModal(false)}
            onConfirm={handleDeleteShopifyDetails}
          />
        )}
        {showXmlWarning && (
          <WarningPopup
            onClose={() => setShowXmlWarning(false)}
            onConfirm={handleDeleteXmlConversion}
          />
        )}

        <div className={styles.canvas}>
          <div className={styles.leftIcon}>
            <div className={styles.iconsWrap}>
              <FontAwesomeIcon
                icon={faCog}
                className={styles.icons}
                onClick={openConnectionPopup}
              />
              <FontAwesomeIcon
                icon={faPlayCircle}
                className={styles.icons}
                onClick={openClientPopup}
              />
              <FontAwesomeIcon
                icon={faClock}
                className={`${styles.icons} mb-0`}
                onClick={openVersionPopup}
              />
              {connectionPopup && (
                <ConnectionPopup onClose={handleClosePopup} />
              )}
              {clientPopup && <ClientPopup onClose={handleClosePopup} />}
              {versionPopup && (
                <VersionHistoryPopup
                  onClose={handleClosePopup}
                  filteredConnection={filteredConnection}
                />
              )}
            </div>
          </div>
          <div className={styles.stepContainer}>
            <CanvasFlow
              selectedStep={selectedStep}
              setSelectedStep={setSelectedStep}
              selectedStepId={selectedStepId}
              setSelectedStepId={setSelectedStepId}
              scheduleIds={scheduleIds}
              setScheduleIds={setScheduleIds}
            />

            <div className={styles.webhook} onClick={openTriggerPopup}>
              <div className={styles.imageContainer}>
                <div className={styles.imgWrapper}>
                  <img src={webhook} alt="webhook" />
                </div>
                <div className={styles.iconHoverWrap}>
                  <span className={styles.iconBorder}></span>
                  <FontAwesomeIcon
                    icon={faArrowDown}
                    className={styles.imgIcon}
                  />
                  {shopifyDetails && (
                    <button
                      className={styles.addOnHover}
                      onClick={openStepPopup}
                    >
                      +
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.imageContent}>
                <h3> {isSelected ? "Schedule" : "Trigger"}</h3>
                <p>{!isSelected ? "Universal webhook - webhook" : ""} </p>
              </div>
            </div>
            {/* from here the shopify started */}
            {shopifyDetails &&
              (selectedStep === "Rule 1" ||
                filteredConnection?.newRulesId.includes(selectedStepId)) && (
                <div className={styles.webhook}>
                  <div className={styles.imageContainer}>
                    <div className={styles.editDeleteWrap}>
                      <div
                        className={`${styles.imgWrapper} ${styles.shopifyImgHover}`}
                      >
                        <img src={Shopify} alt="Shopify" />
                      </div>
                      <div className={styles.iconsWrapper}>
                        <FontAwesomeIcon
                          icon={faTrash}
                          className={styles.editDeleteIcon}
                          onClick={() => setShowWarningModal(true)}
                        />
                        <FontAwesomeIcon
                          icon={faEdit}
                          className={styles.editDeleteIcon}
                        />
                      </div>
                    </div>

                    <div className={styles.iconHoverWrap}>
                      <span className={styles.iconBorder}></span>
                      <FontAwesomeIcon
                        icon={faArrowDown}
                        className={styles.imgIcon}
                      />
                    </div>
                  </div>

                  <div className={styles.imageContent}>
                    <h3>{shopifyDetails.shopifyTitle}</h3>
                    <p>{shopifyDetails.shopifyDetails}</p>
                  </div>
                </div>
              )}
            {xmlConversion && selectedStep === "Rule 1" && (
              <div className={styles.webhook}>
                <div className={styles.imageContainer}>
                  <div className={styles.editDeleteWrap}>
                    <div
                      className={`${styles.imgWrapper} ${styles.shopifyImgHover}`}
                    >
                      <img src={xmlimg} alt="xmlimg" />
                    </div>
                    <div className={styles.iconsWrapper}>
                      <FontAwesomeIcon
                        icon={faTrash}
                        className={styles.editDeleteIcon}
                        onClick={() => setShowXmlWarning(true)}
                      />
                      <FontAwesomeIcon
                        icon={faEdit}
                        className={styles.editDeleteIcon}
                      />
                    </div>
                  </div>

                  <div className={styles.iconHoverWrap}>
                    <span className={styles.iconBorder}></span>
                    <FontAwesomeIcon
                      icon={faArrowDown}
                      className={styles.imgIcon}
                    />
                  </div>
                </div>

                <div className={styles.imageContent}>
                  <h3>{xmlConversion?.name}</h3>
                  <p>{xmlConversion?.description}</p>
                </div>
              </div>
            )}
            {/* ending shopify here */}
            <button className={styles.addStepButton} onClick={openStepPopup}>
              +
            </button>
            {isPopupOpen && (
              <StepPopup
                heading="Add a step"
                onClose={closeStepPopup}
                isPopupOpen={isPopupOpen}
              >
                <AddStepPopup
                  onClose={closeStepPopup}
                  logicToolsPopup={logicToolsPopup}
                  openConverterPopup={openConverterPopup}
                  openIntegrationPopup={openIntegrationPopup}
                />
              </StepPopup>
            )}
            {isLogicPopup && (
              <StepPopup
                back="Back"
                heading="Logic Tools"
                onClose={closeLoginPopup}
                onBack={backPopup}
              >
                <LogicToolsPopup
                  onOpenActionPopup={openActionPopup}
                  openLoopPopup={openLoopPopup}
                />
              </StepPopup>
            )}
            {isActionPopup && (
              <StepPopup
                back="Back"
                heading="Actions"
                onClose={closeActionPopup}
                onBack={() => {
                  setIsLogicPopup(true);
                  setIsActionPopup(false);
                }}
              >
                <ActionPopup />
              </StepPopup>
            )}
            {isLoopPopup && (
              <StepPopup
                back="Back"
                heading="Actions"
                onClose={closeLoopPopup}
                onBack={() => {
                  setIsLogicPopup(true);
                  setIsLoopPopup(false);
                }}
              >
                <LoopActionPopup />
              </StepPopup>
            )}
            {isConverterPopup && (
              <StepPopup
                back="Back"
                heading="Actions"
                onClose={closeConverterPopup}
                onBack={backPopup}
              >
                <ConverterPopup
                  openXmlPopup={openXmlPopup}
                  orders={orders}
                  setFetchTriggerXml={setFetchTriggerXml}
                  fetchTriggerXml={fetchTriggerXml}
                />
              </StepPopup>
            )}
            {isXmlPopup && (
              <StepPopup
                back="Back"
                heading="JSON to XML"
                onClose={closeXmlPopup}
                onBack={() => {
                  setIsXmlPopup(false);
                  setIsConverterPopup(true);
                }}
              >
                <XmlPopup orders={orders} />
              </StepPopup>
            )}
            {isIntegratioPopup && (
              <StepPopup
                back="Back"
                heading="Integrations"
                onClose={closeIntegrationPopup}
                onBack={backPopup}
              >
                <IntegrationPopup
                  openShopifyPopup={openShopifyPopup}
                  openEShipperPopup={openEShipperPopup}
                  openHttpPopup={openHttpPopup}
                  openOrdersPopup={openOrderPopup}
                  newRules={newRules}
                  selectedStepId={selectedStepId}
                />
              </StepPopup>
            )}
            {isOrderPopup && (
              <StepPopup
                back="Back"
                heading="Shopify"
                onClose={closeOrderPopup}
                onBack={() => {
                  setIsOrderPopup(false);
                  setIsIntegrationPopup(true);
                }}
              >
                <OrdersPopUp
                  openShopifyPopup={openShopifyPopup}
                  closeOrderPopup={closeOrderPopup}
                  openFullfilmentPopup={openFullfilmentPopup}
                />
              </StepPopup>
            )}
            {isFullfilmentPopup && (
              <StepPopup
                back="Back"
                heading="Fullfillment"
                onClose={closeFullfilmentPopup}
                onBack={() => {
                  setIsOrderPopup(true);
                  setIsFullfilmentPopup(false);
                }}
              >
                <FullfilmentPopUp
                  closeOrderPopup={closeOrderPopup}
                  onClose={closeFullfilmentPopup}
                />
              </StepPopup>
            )}
            {isShopifyPopUp && (
              <StepPopup
                back="Back"
                heading="Actions"
                onClose={closeShopifyPopup}
                onBack={() => {
                  setIsShopifyPopup(false);
                  setIsIntegrationPopup(true);
                }}
              >
                <ShopifyPopup fetchShopifyOrders={handleButtonClick} />
              </StepPopup>
            )}
            {isEShipperPopup && (
              <StepPopup
                back="Back"
                heading="Actions"
                onClose={closeEShipperPopup}
                onBack={() => {
                  setIsEShipperPopup(false);
                  setIsIntegrationPopup(true);
                }}
              >
                <EShippersPopup onClose={closeEShipperPopup} />
              </StepPopup>
            )}
            {isHttpPopup && (
              <StepPopup
                back="Back"
                heading="Actions"
                onClose={closeHttpPopup}
                onBack={() => {
                  setIsHttpPopup(false);
                  setIsIntegrationPopup(true);
                }}
              >
                <HttpPopup />
              </StepPopup>
            )}
          </div>
          {isWebhookTriggerPopup && (
            <WebhookTriggerPopup
              onClose={closeWebhookTriggerPopup}
              // onBack={backPopup}
            />
          )}
        </div>
      </div>

      <div
        className={`${styles.bottomBar} ${
          showTestResults ? styles.showBtns : ""
        }`}
      >
        {/* <div className={`${styles.bottomBar} `}> */}
        <div>
          <button className={styles.runButton} onClick={handleRunClick}>
            Run
          </button>
          <button className={styles.testRunsButton}>Test Runs</button>
          <button className={styles.testConfigButton}>
            Test Configuration
          </button>
        </div>

        <button className={styles.toggleButton} onClick={toggleVisibility}>
          {showTestResults ? (
            <FontAwesomeIcon icon={faChevronDown} className={styles.icon} />
          ) : (
            <FontAwesomeIcon icon={faChevronUp} className={styles.icon} />
          )}
        </button>
        {/* </div> */}
      </div>
      <div
        className={`${styles.testResultsContainer} ${
          showTestResults ? styles.show : ""
        }`}
      >
        <div
          className={`${styles.testResultsSection} ${styles.testHistorySection}`}
        >
          <RunHistory testHistory={testHistory} />
        </div>
        <div className={`${styles.testResultsSection} ${styles.testSteps}`}>
          <Steps
            steps={stepsRun}
            orders={orders}
            shopifyDetails={shopifyDetails}
            laoding={loading}
          />
        </div>
        <div className={`${styles.testResultsSection} ${styles.testOutLogs}`}>
          <OutputLogs
            data={connection}
            selectedIntegration={selectedIntegration}
            orders={orders}
            shopifyDetails={shopifyDetails}
          />
        </div>
      </div>
    </div>
  );
};
