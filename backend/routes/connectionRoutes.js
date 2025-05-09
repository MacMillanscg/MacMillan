const router = require("express").Router();

const connectionController = require("../Controllers/connectionController");
const shopifyControllers = require("../Controllers/ShopifyControllers");
const connectionRoleController = require("../Controllers/ConnectionRoleController");
// const eShipperController = require("../Controllers/eShipperController");

router.post("/addConnections", connectionController.createConnection);
router.get("/:id", connectionController.getConnectionById);
router.put("/:id", connectionController.updateConnection);
router.put("/:id", connectionController.updateConnectionVersion);
router.get("/:id/api/orders", connectionController.shofipyOrders);
router.patch("/:id/addshopify", shopifyControllers.createShopifyConnection);
router.get("/:id/shopifyDetails", shopifyControllers.getShopifyDetails);
router.delete("/:id/shopifyDetails", shopifyControllers.deleteShopifyDetails);
router.delete("/:id/xmlConversion", shopifyControllers.deleteXmlConversion);
router.get("/", connectionController.getAllConnections);
router.post("/:id", connectionController.createWebhook);
router.patch("/:id/xmlconversion", shopifyControllers.addXmlConvertion);
router.get("/:id/xmlconversions", shopifyControllers.getXMLConversion);
router.post("/:id/saveTransaction", shopifyControllers.addAllOrders);
router.delete("/:id", connectionController.deleteConnectionById);
router.patch(
  "/update-fulfillment",
  shopifyControllers.updateShopifyFullfillment
);
router.get("/:id/get-fulfillment", shopifyControllers.getUnFullFillment);
router.post("/:id/api/saveOrderIds", shopifyControllers.createShopifyOrdersId);
router.post("/:id/create-fulfillment", shopifyControllers.createFulfillment);

router.post(
  "/:id/verify-eshipper",
  connectionController.verifyEShipperCredentials
);

// connection role routes
router.post("/addNewsteps/:id", connectionRoleController.addConnectionStep);
router.get(
  "/:id/connectionSteps",
  connectionRoleController.getAllConnectionsStep
);
router.delete(
  "/:id/connectionSteps/:stepId",
  connectionRoleController.deleteConnectionStep
);
router.put("/:id/:stepId", connectionRoleController.updateConnectionStep);

router.post("/:id/cloneSteps", connectionRoleController.cloneConnectionStep);

router.patch("/:id/publish", connectionController.publishVersion);
router.post("/api/export-orders", connectionController.exportOrders);

module.exports = router;
