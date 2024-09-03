import React from "react";
import styles from "./PrintModal.module.css";

export const PrintModal = ({ onclose }) => {
  return (
    <div className={styles.printModalOverlay}>
      <div className={styles.printModal}>
        <h3>Print</h3>
        <form>
          <label>
            <input type="checkbox" name="shippingLabel" />
            Shipping Label
          </label>

          <label>
            <input type="checkbox" name="orderDetails" />
            Order Details
          </label>
          <label>
            <input type="checkbox" name="packingSlip" />
            Packing Slip
          </label>

          <div className={styles.modalButtons}>
            <button type="button" onClick={onclose}>
              Cancel
            </button>
            <button type="submit" onClick={() => console.log("Print clicked")}>
              Print
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
