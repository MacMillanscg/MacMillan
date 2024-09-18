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
  // const [shopifyId, setShopifyId] = useState(null);
  // console.log("initial", initialized);
  // console.log("fetchtrigger", fetchTrigger);
  // console.log("xmldata", xmlConversion);

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

  console.log("filteredConnection", filteredConnection?.integrations);

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
      setOrders(response.data.orders);

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

  // Call fetchShopifyIds when orders are updated
  useEffect(() => {
    if (orders && orders.length > 0) {
      fetchShopifyIds(); // Fetch Shopify IDs only if orders array is non-empty
    }
  }, [orders]); // Add orders as a dependency

  console.log("orders", orders);

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

  const shopifyId =
    orders &&
    orders.map((order, i) => {
      return order.id;
    });
  // setShopifyId(newOrders);
  // console.log("neworder", typeof newOrders);

  useEffect(() => {
    const fetchShopifyDetails = async () => {
      try {
        const response = await axios.get(
          `${url}/connections/${id}/shopifyDetails`
        );
        setShopifyDetails(response.data);
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

  useEffect(() => {
    const fetchConnection = async () => {
      try {
        const response = await axios.get(`${url}/connections/${id}`);
        setConnection(response.data);
        // console.log("response", response.data);
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
          <button className={styles.publishButton}>Publish</button>
          <button className={styles.cancelButton}>Cancel</button>
          <button className={styles.saveButton} onClick={addShopifyOrders}>
            Save
          </button>
        </div>
      </div>

      <div className={styles.mainContainer}>
        <WarningPopup
          show={showWarningModal}
          onClose={() => setShowWarningModal(false)}
          onConfirm={handleDeleteShopifyDetails}
        />
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
                <VersionHistoryPopup onClose={handleClosePopup} />
              )}
            </div>
          </div>
          <div className={styles.stepContainer}>
            <CanvasFlow />

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
                <h3>Trigger</h3>
                <p>Universal webhook - webhook</p>
              </div>
            </div>
            {/* from here the shopify started */}
            {shopifyDetails && (
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
            {xmlConversion && (
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
                <XmlPopup xmlContent={xmlContents} />
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
        className={`${styles.bottomBarWrap} ${
          showTestResults ? styles.showBtns : ""
        }`}
      >
        <div className={`${styles.bottomBar} `}>
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
