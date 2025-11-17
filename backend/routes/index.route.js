const express = require("express");
const router = express.Router();

const voteRouter = require("./vote.route");
const userRouter = require("./user.route");
const candidateRouter = require("./candidate.route");

router.use("/votes", voteRouter);
router.use("/users", userRouter);
router.use("/candidates", candidateRouter);

module.exports = router;
