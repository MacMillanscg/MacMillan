const router = require("express").Router();
const summaryController = require("../Controllers/summaryControllers");
const shopifyControllers = require("../Controllers/ShopifyControllers");

router.post("/verify-eshipper", summaryController.verifyEShipperCredential);
router.get("/orders/shopifyIds", shopifyControllers.getAllShopifyOrdersIds);

module.exports = router;
