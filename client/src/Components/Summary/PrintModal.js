import React, { useState, useEffect, useRef } from "react";
import { PDFDocument, rgb } from "pdf-lib"; // Import pdf-lib for PDF modification
import styles from "./PrintModal.module.css";

export const PrintModal = ({ onclose, selectedRows, filteredClients , result }) => {
  const [isShippingLabelChecked, setIsShippingLabelChecked] = useState(false);

  const popupRef = useRef(null);

  // Handle clicks outside the popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        // setIsPopupVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRef]);

  // Handle checkbox state
  const handleCheckboxChange = (e) => {
    setIsShippingLabelChecked(e.target.checked);
  };

  // Function to decode base64 and return a Blob
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

  const handlePrint = async () => {
    if (isShippingLabelChecked) {
      const filteredData = filteredClients
        .filter((client, index) => selectedRows.includes(index))
        .map((client) => ({
          label: client.label,
          trackingNumber: client.trackingNumber,
        }));

      // Create a new PDF document to merge all labels
      const mergedPdfDoc = await PDFDocument.create();

      for (const client of filteredData) {
        const { label: base64Data, trackingNumber } = client;
        const blob = decodeBase64(base64Data);

        if (blob) {
          const arrayBuffer = await blob.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);

          const pages = pdfDoc.getPages();
          const [firstPage] = pages;

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
          });

          firstPage.drawText(`Tracking Number: ${trackingNumber}`, {
            x,
            y,
            size: 10,
            color: rgb(0, 0, 0),
          });

          const copiedPages = await mergedPdfDoc.copyPages(
            pdfDoc,
            pdfDoc.getPageIndices()
          );
          copiedPages.forEach((page) => mergedPdfDoc.addPage(page));
        }
      }

      const pdfBytes = await mergedPdfDoc.save();
      const mergedBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(mergedBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `merged_labels.pdf`;
      link.click();
      window.open(url);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className={styles.printModalOverlay}>
      <div className={styles.printModal}>
        <h3>Print</h3>
        <form>
          <label>
            <input
              type="checkbox"
              name="shippingLabel"
              onChange={handleCheckboxChange}
            />
            Shipping Label
          </label>

          <label>
            <input type="checkbox" name="packingSlip" />
            Packing Slip
          </label>

          <div className={styles.modalButtons}>
            <button type="button" onClick={onclose} className={styles.cancel}>
              Cancel
            </button>
            <button
              type="button"
              className={
                isShippingLabelChecked
                  ? `${styles.printButtonActive}`
                  : `${styles.printButton}`
              }
              disabled={!isShippingLabelChecked}
              onClick={handlePrint}
            >
              Print
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
