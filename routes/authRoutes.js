const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const authContollers = require("../middlwares/authMiddleware");

router.get("/", authContollers.protected, userControllers.getAllUser);
router.post("/register", userControllers.register);
router.post("/login", userControllers.logIn);
router.get("/logout", authContollers.protected, userControllers.logout);
router.get("/:id", userControllers.getUser);
router.patch("/:id", authContollers.protected, userControllers.updateUser);
router.delete("/:id", authContollers.protected, userControllers.deleteUser);
router.patch(
  "/block-user/:id",
  authContollers.protected,
  authContollers.isAdmin,
  authContollers.blockUser
);
router.patch(
  "/unblock-user/:id",
  authContollers.protected,
  authContollers.isAdmin,
  authContollers.UnBlockUser
);
module.exports = router;
