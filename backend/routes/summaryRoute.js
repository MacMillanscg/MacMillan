const router = require("express").Router();
const summaryController = require("../Controllers/summaryControllers");
const shopifyControllers = require("../Controllers/ShopifyControllers");
// const connectionController = require("../Controllers/connectionController");

router.post("/verify-eshipper", summaryController.verifyEShipperCredential);
router.get("/orders/shopifyIds", shopifyControllers.getAllShopifyOrdersIds);
router.get("/convert-xml", summaryController.convertXmlFilesToJson);
router.put("/create-shipment", summaryController.sendDataToEShipper);
router.get("/getShipments", summaryController.getShipmentDetails);
router.get("/getShipmentsId", summaryController.getAllShipmentIds);
// router.get("/api/orders", summaryController.shopifyOrders);

module.exports = router;
