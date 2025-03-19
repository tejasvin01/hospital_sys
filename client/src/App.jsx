import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "tailwindcss";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import ReceptionistDashboard from "./pages/ReceptionstDashboard.jsx";
import PatientDashboard from "./pages/PatientDashboard";
import PrivateRoute from "./components/PrivateRoute.jsx";
import PatientAppointment from "./appointment/PatientAppointment.jsx";
import AdminAppointment from "./appointment/AdminAppointment.jsx";
import CreateInvoice from "./invoice/CreateInvoice.jsx";
import PatientInvoice from "./invoice/PatientInvoice.jsx";
import PatientReport from "./report/PatientReport.jsx";
import AdminReport from "./report/AdminReport.jsx";
import DoctorReport from "./report/DoctorReport.jsx";
import GetInvoice from "./invoice/GetInvoice.jsx";
import AllUsers from "./components/AllUsers.jsx";
import EditReport from "./report/EditReport.jsx";
import "./App.css";
import WelcomePage from "./pages/WelcomePage.jsx";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-dashboard" element={<PrivateRoute element={<AdminDashboard />} role="admin" />} />
          <Route path="/doctor-dashboard" element={<PrivateRoute element={<DoctorDashboard />} role="doctor" />} />
          <Route path="/receptionist-dashboard" element={<PrivateRoute element={<ReceptionistDashboard />} role="receptionist" />} />
          <Route path="/patient-dashboard" element={<PrivateRoute element={<PatientDashboard />} role="patient" />} />
          <Route path="/patient-appointment" element={<PrivateRoute element={<PatientAppointment />} role="patient" />} />
          <Route path="/appointment" element={<PrivateRoute element={<AdminAppointment />} role={["admin", "doctor","receptionist"]} />} />
          <Route path="/invoice" element={<PrivateRoute element={<CreateInvoice />} role={["admin","receptionist"]} />} />
          <Route path="/my-invoice" element={<PrivateRoute element={<PatientInvoice />} role="patient" />} />
          <Route path="/my-report" element={<PrivateRoute element={<PatientReport />} role="patient" />} />
          <Route path="/report" element={<PrivateRoute element={<AdminReport />} role={["admin", "doctor","receptionist"]} />} />
          <Route path="/createreport" element={<PrivateRoute element={<DoctorReport />} role="doctor" />} />
          <Route path="/invoice/all" element={<PrivateRoute element={<GetInvoice />} role={["admin", "doctor","receptionist"]} />} />
          <Route path="/allusers" element={<PrivateRoute element={<AllUsers />} role="admin" />} />
          <Route path="/reports/:reportId" element={<PrivateRoute element={<EditReport />} role="doctor" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;