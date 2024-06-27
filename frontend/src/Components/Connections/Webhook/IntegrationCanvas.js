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
} from "@fortawesome/free-solid-svg-icons";
import { ConnectionPopup } from "../Popups/ConnectionDetailsPopup/ConnectionPopup";
import { ClientPopup } from "../Popups/ClientPopup/ClientPopup";
import { VersionHistoryPopup } from "../Popups/VersionHistoryPopup/VersionHistoryPopup";
import axios from "axios";
import { useParams } from "react-router-dom";
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
    { id: 2, name: "Deserialize XML", webImg: xmlimg, time: null },
    { id: 3, name: "List Products", webImg: Shopify, time: null },
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

  useEffect(() => {
    const fetchConnection = async () => {
      try {
        const response = await axios.get(`${url}/connections/${id}`);
        setConnection(response.data);
        console.log("response", response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching connection:", error);
        setLoading(false);
      }
    };

    fetchConnection();
  }, [id]);

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

  const addStep = () => {
    // const newStepId = steps.length + 1;
    // setSteps([
    //   ...steps,
    //   { id: newStepId, title: `Step ${newStepId} of Rule 1` },
    // ]);
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

  return (
    <div>
      <div className={styles.topBar}>
        <div className="d-flex">
          <button className={styles.exitButton}>Exit</button>
          <h3 className={styles.connectionTitle}>
            {connection?.connectionName}
          </h3>
        </div>
        <div className={styles.topBarControls}>
          <button className={styles.publishButton}>Publish</button>
          <button className={styles.cancelButton}>Cancel</button>
          <button className={styles.saveButton}>Save</button>
        </div>
      </div>

      <div className={styles.mainContainer}>
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
            <div className={styles.webhook}>
              <div className={styles.imageContainer}>
                <img src={webhook} alt="webhook" />
                <FontAwesomeIcon
                  icon={faArrowDown}
                  className={styles.imgIcon}
                />
              </div>

              <div className={styles.imageContent}>
                <h3>Trigger</h3>
                <p>Universal webhook - webhook</p>
              </div>
            </div>
            <div className={styles.xmlimg}>
              <div className={styles.imageContainer}>
                <img src={xmlimg} alt="xmlimage" />
                <FontAwesomeIcon
                  icon={faArrowDown}
                  className={styles.imgIcon}
                />
              </div>
              <div className={styles.imageContent}>
                <h3>Deseraliaze XML</h3>
                <p>Change Data formate Dese</p>
              </div>
            </div>
            <div className={styles.shopify}>
              <div className={styles.imageContainer}>
                <img src={Shopify} alt="shopify" />
                <FontAwesomeIcon
                  icon={faArrowDown}
                  className={styles.imgIcon}
                />
              </div>
              <div className={styles.imageContent}>
                <h3>List Products</h3>
                <p>Shopify List-Products</p>
              </div>
            </div>
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
                heading="Converter"
                onClose={closeConverterPopup}
                onBack={backPopup}
              >
                <ConverterPopup />
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
                <ShopifyPopup />
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
                <EShippersPopup />
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
        </div>
      </div>

      <div className={`${showTestResults ? styles.showBtns : ""}`}>
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
        <div className={styles.testResultsSection}>
          <RunHistory testHistory={testHistory} />
        </div>
        <div className={styles.testResultsSection}>
          <Steps steps={stepsRun} />
        </div>
        <div className={styles.testResultsSection}>
          <OutputLogs data={connection} />
        </div>
      </div>
    </div>
  );
};
