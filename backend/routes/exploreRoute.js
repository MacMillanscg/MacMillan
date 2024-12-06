const router = require("express").Router();

const addMemberController = require("../Controllers/NewMemberController");

router.post("/add-member", addMemberController.addMember);
router.get("/members", addMemberController.getAllMembers);

module.exports = router;
