import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function StudentProfile() {
  const { roll_no } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [academics, setAcademics] = useState([]);

  useEffect(() => {
    fetchStudent();
  }, [roll_no]);

  const fetchStudent = async () => {
    try {
      const res = await api.get(`/faculty/student/${roll_no}/`);
      setStudent(res.data);
      setAcademics(res.data.academics || []);
      setAttendance(res.data.attendance || []);
    } catch (err) {
      console.error(err);
    }
  };

  const verifyRecord = async (recordId) => {
    try {
      await api.post(`/faculty/verify-record/${recordId}/`);
      alert("Record Verified ✅");
      fetchStudent();
    } catch (err) {
      alert("Verification failed");
    }
  };

  const deleteStudent = async () => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await api.delete(`faculty/student/${student.roll_no}/delete/`);
      alert("Student deleted successfully");
      navigate("/faculty/students");
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (!student)
    return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 sm:px-6 md:px-10 py-6">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm sm:text-base"
      >
        ← Back
      </button>

      {/* Profile Card */}
      <div className="bg-white/10 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
          Student Profile
        </h1>

        {/* Student Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Roll No:</strong> {student.roll_no}</p>
          <p><strong>Year:</strong> {student.year}</p>
          <p><strong>Semester:</strong> {student.semester}</p>
          <p><strong>Department:</strong> {student.department}</p>
          <p><strong>Face Registered:</strong> {student.face_encoding ? "Yes" : "No"}</p>
        </div>

        <p className="mt-6 text-base sm:text-lg font-semibold">
          Overall Percentage:{" "}
          {student.cgpa ? (Number(student.cgpa) * 9.5).toFixed(2) : "0.00"}%
        </p>

        <button
          onClick={deleteStudent}
          className="mt-6 bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-sm sm:text-base"
        >
          Delete Student
        </button>
      </div>

      {/* Academic Records */}
      <div className="mt-8 bg-white/10 p-4 sm:p-6 md:p-8 rounded-2xl">

        <h2 className="text-xl sm:text-2xl font-bold mb-6">
          Academic Performance
        </h2>

        {academics.length === 0 ? (
          <p>No academic records found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-600 text-sm sm:text-base">
              <thead className="bg-slate-700">
                <tr>
                  <th className="p-3 text-left">Semester</th>
                  <th className="p-3 text-left">CGPA</th>
                  <th className="p-3 text-left">Verified</th>
                  <th className="p-3 text-left">Marksheet</th>
                </tr>
              </thead>

              <tbody>
                {academics.map((a, index) => (
                  <tr key={index} className="border-t border-gray-600 hover:bg-slate-800">
                    <td className="p-3">Semester {a.semester}</td>
                    <td className="p-3">{a.cgpa}</td>

                    <td className="p-3">
                      {a.verified ? (
                        <span className="text-green-400 font-bold">✔ Verified</span>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <span className="text-red-400 font-bold">✖ Not Verified</span>
                          <button
                            onClick={() => verifyRecord(a.id)}
                            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs sm:text-sm"
                          >
                            Verify
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      {a.marksheet ? (
                        <a
                          href={`http://127.0.0.1:8000${a.marksheet}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 underline"
                        >
                          View
                        </a>
                      ) : (
                        "No File"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Attendance Section */}
      <div className="mt-8 bg-white/10 p-4 sm:p-6 md:p-8 rounded-2xl">

        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          Attendance Records
        </h2>

        <p className="mb-4">
          <strong>Attendance:</strong> {student.attendance_percentage}%
        </p>

        {attendance.length === 0 ? (
          <p>No attendance records found</p>
        ) : (
          <div className="w-full h-72 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendance}>
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendance" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentProfile;