const router = require("express").Router();

const clientController = require("../Controllers/clientController");

// clients route
router.post("/validate-shopify", clientController.addClientVerify);
router.post("/addclients", clientController.addClient);
router.post("/addclients/:clientId", clientController.addClientIntegration);
router.get("/addclients/:clientId", clientController.getClientIntegrations);
router.get("/", clientController.getAllClients);
router.get("/:id", clientController.getUserById);

module.exports = router;
