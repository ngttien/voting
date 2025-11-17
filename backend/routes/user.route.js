// user.route.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

// GET all users
router.get("/", UserController.getAll);

// GET user by ID
router.get("/:id", UserController.getById);

// POST create new user
router.post("/", UserController.create);

// PUT update user
router.put("/:id", UserController.update);

// DELETE user
router.delete("/:id", UserController.delete);

module.exports = router;
