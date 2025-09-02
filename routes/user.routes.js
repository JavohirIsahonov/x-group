const express = require("express");
const {
  createUser,
  getAllUsers,
  getUser,
  updateUserChecked,
  deleteUser,
} = require("../controllers/user.controller");

const authAdmin = require("../middleware/authAdmin");

const router = express.Router();

// Public
router.post("/", createUser);
router.get("/", getAllUsers);

// Admin protected
router.get("/:id", authAdmin, getUser);
router.put("/:id", authAdmin, updateUserChecked);
router.delete("/:id", authAdmin, deleteUser);

module.exports = router;
