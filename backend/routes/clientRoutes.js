const router = require("express").Router();
const axios = require("axios");

const clientController = require("../Controllers/clientController");
const eShipperController = require("../Controllers/eShipperController");

// clients route
router.post("/validate-shopify", clientController.addClientVerify);
router.post("/addclients", clientController.addClient);
router.post("/addclients/:clientId", clientController.addClientIntegration);
router.get("/addclients/:clientId", clientController.getClientIntegrations);
router.get("/", clientController.getAllClients);
router.get("/:id", clientController.getUserById);
router.get("/:userId", clientController.getClients);
// router.get("/addclients/:id/log", clientController.getLogs);
router.get("/addclients/logs", clientController.getLogFile);

// router.post("/addclients/filter", clientController.filterClients);

router.put("/addclients/:id", clientController.updateClient);
router.post(
  "/addclients/editClient/:clientId",
  clientController.updateClientIntegration
);
router.delete("/addclients/:id", clientController.deleteClient);
router.delete(
  "/addclients/:clientId/integrations/:integrationId",
  clientController.deleteIntegration
);
// router.get("/addclients/get-token", eShipperController.eShipperGetToken);

router.post("/verify-eshipper", eShipperController.verifyEShipperCredentials);
router.post(
  "/addclients/:clientId/addEShipper",
  eShipperController.addEShipperRecord
);

module.exports = router;
