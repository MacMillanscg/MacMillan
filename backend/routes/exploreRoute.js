const router = require("express").Router();

const addMemberController = require("../Controllers/NewMemberController");

router.post("/add-member", addMemberController.addMember);
router.get("/members/:createdBy", addMemberController.getAllMembers);
router.get("/member/:id", addMemberController.getSingleMember);
router.delete("/member/:id", addMemberController.deleteMember);
router.put("/member/:id", addMemberController.updateMember);

module.exports = router;
