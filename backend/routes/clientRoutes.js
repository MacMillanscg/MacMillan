const router = require("express").Router();

const clientController = require("../Controllers/clientController");

// clients route
// router.post("/validate-shopify", clientController.addClientVerify);
router.post("/addclients", clientController.addClient);
router.get("/", clientController.getAllClients);
router.get("/:id", clientController.getUserById);

module.exports = router;
