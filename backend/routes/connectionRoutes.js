const router = require("express").Router();

const connectionController = require("../Controllers/connectionController");
const shopifyControllers = require("../Controllers/ShopifyControllers");

router.post("/addConnections", connectionController.createConnection);
router.get("/:id", connectionController.getConnectionById);
router.put("/:id", connectionController.updateConnection);
router.put("/:id", connectionController.updateConnectionVersion);
router.get("/:id/api/orders", connectionController.shofipyOrders);
router.patch("/:id/addshopify", shopifyControllers.createShopifyConnection);
router.get("/:id/shopifyDetails", shopifyControllers.getShopifyDetails);
router.delete("/:id/shopifyDetails", shopifyControllers.deleteShopifyDetails);
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
router.get("/get-fulfillment/:orderId", shopifyControllers.getFullFillment);
module.exports = router;
