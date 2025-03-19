const Appointment = require("../model/appointment");

exports.createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  const appointments = await Appointment.find().populate("patientId");
  res.json(appointments);
};

// exports.updateAppointment = async (req, res) => {
//   try {
//     const { id, ...updateData } = req.body;
//     const appointment = await Appointment.findById(id);
//     if (!appointment) {
//       return res.status(404).json({ error: "Appointment not found" });
//     }
//     Object.assign(appointment, updateData);
//     await appointment.save();
//     res.json(appointment);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };


exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (req.body.status) {
      appointment.status = req.body.status;
    }
    await appointment.save();
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};