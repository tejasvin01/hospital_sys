const Invoice = require("../model/invoice");

exports.createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create({ 
      patientId: req.body.patientId,
      amount: req.body.amount,
      issuedBy: req.user.id,
      description: req.body.description,
      dueDate: req.body.dueDate});
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Get All Invoices (Admin, Receptionist)
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate("patientId issuedBy", "name email");
    res.json(invoices);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Patient's Own Invoice
exports.getMyInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ patientId: req.user.id });
    res.json(invoices);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Invoice Status (Mark as Paid)
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    invoice.status = req.body.status || invoice.status;
    await invoice.save();
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};