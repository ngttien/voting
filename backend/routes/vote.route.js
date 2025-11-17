const express = require("express");
const router = express.Router();
const voteController = require("../controllers/vote.controller");

// Định nghĩa các API
router.get("/", voteController.getAllVotes);
router.post("/create", voteController.vote);

module.exports = router;
