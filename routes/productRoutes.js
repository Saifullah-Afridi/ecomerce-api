const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/productControllers");
const authMiddleware = require("../middlwares/authMiddleware");

router.get(
  "/",
  authMiddleware.protected,
  // add is admin
  productControllers.getAllProducts
);
router.post(
  "/",
  authMiddleware.protected,
  // add isadmin
  productControllers.cretaeProduct
);
router.get(
  "/:id",
  authMiddleware.protected,
  authMiddleware.isAdmin,
  productControllers.getProduct
);
router.patch(
  "/:id",
  authMiddleware.protected,
  authMiddleware.isAdmin,
  productControllers.updateProduct
);
router.delete(
  "/:id",
  authMiddleware.protected,
  authMiddleware.isAdmin,
  productControllers.deleteProduct
);

module.exports = router;
