const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidate.controller");

// Lấy danh sách ứng viên
router.get("/", candidateController.getAllCandidates);

// Thêm ứng viên
router.post("/", candidateController.addCandidate);
module.exports = router;
