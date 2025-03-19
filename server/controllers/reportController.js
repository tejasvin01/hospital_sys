const Report = require("../model/report");

exports.createReport = async (req, res) => {
  try {
    const report = await Report.create({
      patientId: req.body.patientId,
      doctorId: req.user.id,
      diagnosis: req.body.diagnosis,
      prescription: req.body.prescription,
      notes: req.body.notes,
      createdAt: req.body.createdAt
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("patientId doctorId", "name email");
    res.json(reports);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Get Patient's Own Reports
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ patientId: req.user.id });
    res.json(reports);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Report (Doctor Only)
exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findById( req.params.id );
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Check if the user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: "Access denied" });
    }

    report.diagnosis = req.body.diagnosis || report.diagnosis;
    report.prescription = req.body.prescription || report.prescription;
    report.notes = req.body.notes || report.notes;
    await report.save();
    res.json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPatientReports = async (req, res) => {
  try {
    const reports = await Report.findById(req.params.id );
    res.json(reports);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}