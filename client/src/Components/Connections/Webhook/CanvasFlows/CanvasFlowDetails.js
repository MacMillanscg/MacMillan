import React from "react";
import Shopify from "../../../../assets/images/Shopify.jpg";
import styles from "../IntegrationCanvas.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export const CanvasFlowDetails = ({ selectedStep, selectedStepId, filteredConnection }) => {
  // Log data for debugging
  console.log("Selected Step:", selectedStep);
  console.log("Selected Step ID:", selectedStepId);
  
  const selectedConnectionRule = filteredConnection?.connectionRule.find(rule => rule._id === selectedStepId);
  
  console.log("Filtered Connection:", selectedConnectionRule);

  const shopifyDetails = selectedConnectionRule ? selectedConnectionRule.shopifyDetails : null;

  return (
    <div>

      {/* Display the Shopify details if they exist */}
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
    </div>
  );
};
