const router = require("express").Router();

const connectionController = require("../Controllers/connectionController");
const shopifyControllers = require("../Controllers/ShopifyControllers");

router.post("/addConnections", connectionController.createConnection);
router.get("/:id", connectionController.getConnectionById);
router.put("/:id", connectionController.updateConnection);
router.put("/:id", connectionController.updateConnectionVersion);
router.get("/api/orders", connectionController.shofipyOrders);
router.patch("/:id/addshopify", shopifyControllers.createShopifyConnection);
router.get("/:id/shopifyDetails", shopifyControllers.getShopifyDetails);
router.delete("/:id/shopifyDetails", shopifyControllers.deleteShopifyDetails);
router.get("/", connectionController.getAllConnections);

module.exports = router;
