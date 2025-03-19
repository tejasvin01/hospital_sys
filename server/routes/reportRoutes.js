const express = require("express");
const { createReport, getReports, getMyReports, updateReport,getPatientReports } = require("../controllers/reportController");
const { protect, roleCheck } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, roleCheck("doctor"), createReport);
router.get("/", protect, roleCheck("admin", "doctor","receptionist"), getReports);
router.get("/my-reports", protect, roleCheck("patient"), getMyReports);
router.put("/:id", protect, roleCheck("doctor"), updateReport);
router.get("/:id", protect, roleCheck("doctor"), getPatientReports);

module.exports = router;
