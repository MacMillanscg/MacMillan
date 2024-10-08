const router = require("express").Router();
const summaryController = require("../Controllers/summaryControllers");
const shopifyControllers = require("../Controllers/ShopifyControllers");
// const connectionController = require("../Controllers/connectionController");

router.post("/verify-eshipper", summaryController.verifyEShipperCredential);
router.get("/orders/shopifyIds", shopifyControllers.getAllShopifyOrdersIds);
// router.get("/api/orders", connectionController.shofipyOrders);

module.exports = router;
