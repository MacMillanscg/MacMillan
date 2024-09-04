export const MockData = [
  {
    orderNumber: "ORD001",
    shipmentNumber: "SHIP001",
    platform: "Amazon",
    shipmentStatus: "Delivered",
    client: "John Doe",
    trackingNumber: "TRK001",
    trackingUrl: "https://trackingurl.com/TRK001",
    downloaded: false,
    status: "Completed", // Added status
    createdDate: "2024-06-01", // Added created date
    shippedDate: "2024-08-02", // Added shipped date
  },
  {
    orderNumber: "ORD002",
    shipmentNumber: "SHIP002",
    platform: "eBay",
    shipmentStatus: "In Transit",
    client: "Jane Smith",
    trackingNumber: "TRK002",
    trackingUrl: "https://trackingurl.com/TRK002",
    downloaded: true,
    status: "In Progress",
    createdDate: "2024-08-03",
    shippedDate: "2024-08-04",
  },
  {
    orderNumber: "ORD003",
    shipmentNumber: "SHIP003",
    platform: "Shopify",
    shipmentStatus: "Pending",
    client: "Alice Johnson",
    trackingNumber: "TRK003",
    trackingUrl: "https://trackingurl.com/TRK003",
    downloaded: false,
    status: "Pending", // Added status
    createdDate: "2024-08-05", // Added created date
    shippedDate: null, // Added shipped date (null if not yet shipped)
  },
  {
    orderNumber: "ORD004",
    shipmentNumber: "SHIP004",
    platform: "eShipper",
    shipmentStatus: "Delivered",
    client: "Bob Lee",
    trackingNumber: "TRK004",
    trackingUrl: "https://trackingurl.com/TRK004",
    downloaded: true,
    status: "Completed", // Added status
    createdDate: "2024-08-06", // Added created date
    shippedDate: "2024-08-07", // Added shipped date
  },
  {
    orderNumber: "ORD005",
    shipmentNumber: "SHIP005",
    platform: "Etsy",
    shipmentStatus: "Cancelled",
    client: "Charlie Brown",
    trackingNumber: "TRK005",
    trackingUrl: "https://trackingurl.com/TRK005",
    downloaded: false,
    status: "Cancelled", // Added status
    createdDate: "2024-08-08", // Added created date
    shippedDate: null, // Added shipped date (null since it's cancelled)
  },
];
