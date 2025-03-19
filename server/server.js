const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./model/user");


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

const app = express();
app.use(cors());
app.use(express.json());


app.use("/auth", require("./routes/authRoutes"));
app.use("/appointments", require("./routes/appointmentRoutes"));

app.use("/invoices", require("./routes/invoiceRoutes"));
app.use("/reports", require("./routes/reportRoutes"));

app.use("/users", require("./routes/allUsersRoutes"));

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
