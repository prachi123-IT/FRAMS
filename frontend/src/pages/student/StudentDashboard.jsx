import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("students/profile/");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!data) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="flex justify-between items-center px-10 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-blue-600">FRAMS</h1>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full"
          >
            👤 Profile
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-40">
              <button
                onClick={() => navigate("/student/register")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Update Profile
              </button>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      
      <div className="p-10">

        {/* Welcome Card */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold">
            Welcome, {data.name} 👋
          </h2>
          <p className="text-gray-600">Department: {data.department}</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-4 gap-6 mb-10">

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Roll No</h3>
            <p className="text-lg font-bold">{data.roll_no}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Year</h3>
            <p className="text-lg font-bold">{data.year}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Semester</h3>
            <p className="text-lg font-bold">{data.semester}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Attendance</h3>
            <p className="text-lg font-bold">{data.attendance_percentage || 0}%</p>
          </div>

        </div>

        {/* Academic Records */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
          <h3 className="text-lg font-semibold mb-4">Academic Records</h3>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Semester</th>
                <th className="p-2 text-left">CGPA</th>
                <th className="p-2 text-left">Verified</th>
              </tr>
            </thead>
            <tbody>
              {data.academics?.map((record, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{record.semester}</td>
                  <td className="p-2">{record.cgpa}</td>
                  <td className="p-2">
                    {record.verified ? "✅" : "❌"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/student/register-face")}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition"
          >
            Register Face
          </button>

          <button
            onClick={() => navigate("/student/scan")}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition"
          >
            Scan Attendance
          </button>
        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;
