import React, { useEffect } from "react";
import { js2xml } from "xml-js";
import toast from "react-hot-toast";
import fs from "fs"; // Node.js file system module
import path from "path"; // Node.js path module

export const AutoDownloader = ({ orders }) => {
  const systemBasePath = "C:\\Users\\rafiu\\Downloads\\xmlFiles\\acks"; // Base path
  console.log("directtory" , systemBasePath)

  useEffect(() => {
    const downloadFilesToPath = async () => {
      const folderName = localStorage.getItem("savedFolderName");
      if (!folderName) {
        toast.error("No folder name found. Please set it first.");
        return;
      }

      const fullPath = path.join(systemBasePath, folderName);

      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }

      if (!orders || !Array.isArray(orders) || orders.length === 0) {
        toast.error("No orders available for export.");
        return;
      }

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split("T")[0];

      // Filter orders created today
      const todaysOrders = orders.filter((order) => {
        const orderDate = new Date(order.created_at).toISOString().split("T")[0];
        return orderDate === today;
      });

      if (todaysOrders.length === 0) {
        toast.error("No orders for today to export.");
        return;
      }

      try {
        for (let order of todaysOrders) {
          const wrappedOrder = { order };
          const xmlContent = js2xml(wrappedOrder, { compact: true, spaces: 4 });
          const orderFileName = `order_${order.id || new Date().getTime()}.xml`;

          // Create the file in the specified directory
          const filePath = path.join(fullPath, orderFileName);
          fs.writeFileSync(filePath, xmlContent, "utf8");
        }

        toast.success("Today's orders saved to the specified path successfully!");
      } catch (error) {
        toast.error(`Error saving files: ${error.message}`);
      }
    };

    downloadFilesToPath();
  }, [orders]);

  return null;
};
