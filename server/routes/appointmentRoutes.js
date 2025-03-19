const express = require("express");
const { createAppointment, getAppointments,updateAppointment } = require("../controllers/appointmentController");
const { protect, roleCheck }= require("../middleware/authMiddleware");

const router = express.Router();
router.post("/", protect,roleCheck("patient"), createAppointment);
router.get("/", protect, roleCheck("admin", "doctor", "receptionist"),getAppointments);
router.put("/:id", protect, roleCheck("admin", "doctor", "receptionist"),updateAppointment);

module.exports = router;
