import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import './App.css';
import StudentDashboard from './pages/student/StudentDashboard';
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import StudentQRScan from "./pages/student/StudentQRScan";
import StudentSuccess from "./pages/student/StudentSuccess";
import FaceLiveness from "./pages/student/FaceLiveness";
import RegisterFace from "./pages/student/RegisterFace"
import StudentRegister from "./pages/student/StudentRegister";
import LandingPage from "./pages/LandingPage";
import SelectRole from "./pages/SelectRole";
import StudentManagement from "./pages/faculty/StudentManagement";
import StudentProfile from "./pages/faculty/StudentProfile";
import AttendanceGraph from "./pages/faculty/AttendanceGraph";
import AttendanceDay from "./pages/faculty/AttendanceDay";
import StudentSignup from "./pages/student/StudentSignup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/student" element={
          <ProtectedRoute role="STUDENT">
            <StudentDashboard />
          </ProtectedRoute>} />
        <Route path="/faculty" element={
          <ProtectedRoute role="FACULTY">
            <FacultyDashboard />
          </ProtectedRoute>} />
        <Route path="/faculty/students" element={
          <ProtectedRoute role="FACULTY">
            <StudentManagement />
          </ProtectedRoute>
        } />
        <Route path="/faculty/attendance-graph" element={
          <ProtectedRoute role="FACULTY">
            <AttendanceGraph />
          </ProtectedRoute>
        } />
        <Route path="/faculty/attendance/:date" element={
          <ProtectedRoute role="FACULTY">
            <AttendanceDay />
          </ProtectedRoute>
        } />
        <Route path="/faculty/student/:roll_no" element={
          <ProtectedRoute role="FACULTY">
            <StudentProfile />
          </ProtectedRoute>
        } />
        <Route path="/student/scan" element={
          <ProtectedRoute role="STUDENT">
            <StudentQRScan />
          </ProtectedRoute>} />
        <Route path="/student/face-scan/:sessionId" element={
          <ProtectedRoute role="STUDENT">
            <FaceLiveness />
          </ProtectedRoute>} />
        <Route path="/student/success" element={
          <ProtectedRoute role="STUDENT">
            <StudentSuccess />
          </ProtectedRoute>} />
        <Route path="/student/register-face" element={
          <ProtectedRoute role="STUDENT">
            <RegisterFace />
          </ProtectedRoute>} />
        <Route path="/student/register" element={
          <ProtectedRoute role="STUDENT">
            <StudentRegister />
          </ProtectedRoute>} />
        <Route path="/signup/student" element={
          <ProtectedRoute role="STUDENT">
            <StudentSignup />
          </ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
