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

export const IntegrationCanvas = () => {
  const [steps, setSteps] = useState([{ id: 1, title: "Step 1 of Rule 1" }]);
  const [isVisible, setIsVisible] = useState(true);
  const [connectionPopup, setConnectionPopup] = useState(false);
  const [clientPopup, setClientPopup] = useState(false);
  const [versionPopup, setVersionPopup] = useState(false);
  const { id } = useParams();
  const [connection, setConnection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTestResults, setShowTestResults] = useState(false);
  const [testHistory, setTestHistory] = useState([]);

  const [stepsData] = useState([
    { id: 1, name: "Trigger", webImg: webhook, time: null },
    { id: 2, name: "Deserialize XML", webImg: xmlimg, time: null },
    { id: 3, name: "List Products", webImg: Shopify, time: null },
  ]);

  const [stepsRun, setStepsRun] = useState(stepsData);

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
  console.log("connectionData", connection);

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
    const newStepId = steps.length + 1;
    setSteps([
      ...steps,
      { id: newStepId, title: `Step ${newStepId} of Rule 1` },
    ]);
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

  console.log("steprun", stepsRun);

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
            <button className={styles.addStepButton} onClick={addStep}>
              +
            </button>
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
