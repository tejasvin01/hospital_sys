const express = require("express");
const { createInvoice, getInvoices, getMyInvoices, updateInvoice } = require("../controllers/invoiceController");
const { protect, roleCheck } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, roleCheck("admin", "receptionist"), createInvoice);
router.get("/all", protect, roleCheck("admin", "receptionist"), getInvoices);
router.get("/my-invoices", protect, roleCheck("patient"), getMyInvoices);
router.put("/:id", protect, roleCheck("admin", "receptionist"), updateInvoice);

module.exports = router;
