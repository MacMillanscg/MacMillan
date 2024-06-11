const router = require("express").Router();

const clientController = require("../Controllers/clientController");

// clients route
router.post("/validate-shopify", clientController.addClientVerify);
router.post("/addclients", clientController.addClient);
router.post("/addclients/:clientId", clientController.addClientIntegration);
router.get("/addclients/:clientId", clientController.getClientIntegrations);
router.get("/", clientController.getAllClients);
router.get("/:id", clientController.getUserById);
router.get("/:userId", clientController.getClients);

// router.post("/addclients/filter", clientController.filterClients);

router.put("/addclients/:id", clientController.updateClient);
router.delete("/addclients/:id", clientController.deleteClient);

module.exports = router;
