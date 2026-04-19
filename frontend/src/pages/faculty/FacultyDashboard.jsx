import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useState, useEffect } from "react";
import AttendanceChart from "../../components/AttendanceChart";
import { QRCodeCanvas } from 'qrcode.react';
import '../../App.css';

function FacultyDashboard() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  const [qr, setQr] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const FRONTEND_URL = "http://localhost:5173";
  const [timeLeft, setTimeLeft] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [showForm, setShowForm] = useState(false);
  const SESSION_DURATION = 100;


  useEffect(() => {
    api.get("faculty/dashboard/")
      .then(res => setStudents(res.data.students))
      .catch(err => console.error(err));
  }, []);

  const startSession = async () => {
    try {
      const res = await api.post("attendance/start/", {
        subject,
        year,
        semester
      });
      setShowForm(false);
      setSessionId(res.data.session_id);
      setSessionActive(true);
      setTimeLeft(SESSION_DURATION);
      setShowCountdown(true);
    } catch (err) {
      alert("Session already active or error");
    }
  };

  useEffect(() => {
    let interval;

    if (sessionActive && sessionId) {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`attendance/live-qr/${sessionId}/`);


          if (res.data.error) {
            alert("Session Ended ");
            setSessionActive(false);
            setQr(null);
            setShowCountdown(false);
            clearInterval(interval);
            return;
          }
          setQr(res.data.qr_token);
        }
        catch (err) {
          console.log("Session ended");
          setSessionActive(false);
          setQr(null)
          setShowCountdown(false);
          setTimeLeft(0);
          clearInterval(interval);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [sessionActive, sessionId]);
  useEffect(() => {
    let timer;

    if (sessionActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    if (timeLeft <= 10 && timeLeft > 0) {
      setShowCountdown(true);
    } else {
      setShowCountdown(false);
    }

    if (timeLeft === 0 && sessionActive) {
      setSessionActive(false);
      setQr(null);
      setShowCountdown(false);
    }

    return () => clearInterval(timer);
  }, [sessionActive, timeLeft]);

  const endSession = async () => {
    try {
      await api.post(`attendance/end/${sessionId}/`);
      setSessionActive(false);
      setQr(null);
    } catch (err) {
      alert("Failed to end session");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
  <div className="min-h-screen bg-gradient-to-br 
    from-slate-900 via-indigo-900 to-slate-800 
    text-white relative overflow-hidden">

    {/* Background glow */}
    <div className="absolute inset-0 -z-10">
      <div className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-500 opacity-20 blur-3xl rounded-full top-[-100px] left-[-100px] animate-pulse"></div>
      <div className="absolute w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-purple-500 opacity-20 blur-3xl rounded-full bottom-[-100px] right-[-100px] animate-pulse"></div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 sm:py-12 md:py-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 sm:mb-16">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r 
          from-blue-400 to-purple-400 
          bg-clip-text text-transparent">
          Faculty Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 px-5 py-2 rounded-xl 
          hover:bg-red-600 transition shadow-lg"
        >
          Logout
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">

        {/* Start Attendance */}
        <div
          onClick={() => setShowForm(true)}
          className="group cursor-pointer 
          bg-white/10 backdrop-blur-lg 
          border border-white/20
          p-6 sm:p-8 rounded-3xl
          shadow-2xl
          transition-all duration-500
          hover:-translate-y-3"
        >
          <div className="text-4xl sm:text-6xl mb-4 sm:mb-6 transition-transform duration-500 group-hover:scale-125">
            📷
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Start Attendance</h2>
          <p className="text-white/70 text-sm sm:text-base">
            Begin attendance session and generate live QR.
          </p>
        </div>

        {/* Analytics */}
        <div
          onClick={() => navigate("/faculty/attendance-graph")}
          className="group cursor-pointer 
          bg-white/10 backdrop-blur-lg 
          border border-white/20
          p-6 sm:p-8 rounded-3xl
          shadow-2xl
          transition-all duration-500
          hover:-translate-y-3"
        >
          <div className="text-4xl sm:text-6xl mb-4 sm:mb-6 transition-transform duration-500 group-hover:scale-125">
            📊
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">View Attendance Graph</h2>
          <p className="text-white/70 text-sm sm:text-base">
            Analyze attendance percentage visually.
          </p>
        </div>

        {/* Students */}
        <div
          onClick={() => navigate("/faculty/students")}
          className="group cursor-pointer 
          bg-white/10 backdrop-blur-lg 
          border border-white/20
          p-6 sm:p-8 rounded-3xl
          shadow-2xl
          transition-all duration-500
          hover:-translate-y-3"
        >
          <div className="text-4xl sm:text-6xl mb-4 sm:mb-6 transition-transform duration-500 group-hover:scale-125">
            👥
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Student List</h2>
          <p className="text-white/70 text-sm sm:text-base">
            View and manage registered students.
          </p>
        </div>

      </div>

      {/* SUBJECT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white text-black p-6 sm:p-8 rounded-2xl w-full max-w-md">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
              Start Attendance Session
            </h2>

            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full mb-4 p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full mb-4 p-3 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full mb-6 p-3 border rounded-lg"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-400 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={startSession}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE QR DISPLAY */}
      {sessionActive && qr && (
        <div className="mt-12 flex flex-col items-center 
          bg-white/10 backdrop-blur-xl 
          border border-white/20 
          p-6 sm:p-10 rounded-3xl shadow-2xl">

          <h2 className="text-xl sm:text-3xl font-bold mb-6 text-center">
            Live Attendance QR
          </h2>

          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
            <QRCodeCanvas
              value={`${FRONTEND_URL}/scan/${qr}`}
              size={window.innerWidth < 640 ? 180 : 250}
            />
          </div>

          <p className="mt-6 text-lg sm:text-xl font-semibold">
            Time Left: <span className="text-red-400">{timeLeft}s</span>
          </p>

          <button
            onClick={endSession}
            className="mt-6 bg-red-600 hover:bg-red-700 
            px-6 sm:px-8 py-2 sm:py-3 rounded-xl transition"
          >
            End Session
          </button>
        </div>
      )}

    </div>
  </div>
);
}

export default FacultyDashboard;
