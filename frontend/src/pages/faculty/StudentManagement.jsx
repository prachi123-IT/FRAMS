import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function StudentManagement() {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("");
  const [students, setStudents] = useState([]);
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [search, setSearch] = useState("");
  const location = useLocation();


  useEffect(() => {
    fetchStudents();
  }, [year, semester, department, location.pathname]);

  const fetchStudents = async () => {
    try {
      const res = await api.get("students/students/", {
        params: {
          year: year || undefined,
          semester: semester || undefined,
          department: department || undefined,
        }
      });


      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredStudents = Array.isArray(students)
    ? students.filter(student =>
      student.name.toLowerCase().includes(search.toLowerCase())
    )
    : [];

  return (
  <div className="min-h-screen bg-slate-900 text-white px-4 sm:px-6 md:px-10 py-6 sm:py-10">

    {/* FILTER SECTION */}
    <div className="
      flex flex-col sm:flex-row flex-wrap 
      gap-4 items-stretch sm:items-center 
      mb-8 
      bg-white/10 backdrop-blur-xl 
      border border-white/20 
      p-4 sm:p-6 
      rounded-2xl shadow-xl
    ">

      {/* Year */}
      <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="bg-slate-800 text-white p-3 rounded-xl border border-white/20 w-full sm:w-auto"
      >
        <option value="" hidden>Year</option>
        <option value="1">First</option>
        <option value="2">Second</option>
        <option value="3">Third</option>
        <option value="4">Fourth</option>
      </select>

      {/* Semester */}
      <select
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
        className="bg-slate-800 text-white p-3 rounded-xl border border-white/20 w-full sm:w-auto"
      >
        <option value="" hidden>Semester</option>
        {[1,2,3,4,5,6,7,8].map(num => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>

      {/* Department */}
      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="bg-slate-800 text-white p-3 rounded-xl border border-white/20 w-full sm:w-auto"
      >
        <option value="" hidden>Department</option>
        <option value="CSE">CSE</option>
        <option value="IT">IT</option>
        <option value="ECE">ECE</option>
        <option value="ME">ME</option>
      </select>

      {/* Search */}
      <input
        type="text"
        placeholder="Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="
          bg-slate-800 text-white 
          p-3 rounded-xl 
          border border-white/20 
          w-full sm:w-64
        "
      />
    </div>

    {/* STUDENT LIST */}
    <div className="space-y-4">

      {filteredStudents.length === 0 ? (
        <p className="text-gray-400 text-center">No students found</p>
      ) : (
        filteredStudents.map((student) => (
          <div
            key={student.id}
            className="
              bg-white/10 
              p-4 sm:p-6 
              rounded-xl 
              flex flex-col sm:flex-row 
              justify-between 
              items-start sm:items-center 
              gap-4
              backdrop-blur-md
              border border-white/10
            "
          >
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">
                {student.name}
              </h3>
              <p className="text-sm text-white/60">
                Roll No: {student.roll_no}
              </p>
            </div>

            <button
              onClick={() =>
                navigate(`/faculty/student/${student.roll_no}`)
              }
              className="
                bg-blue-600 
                px-4 py-2 
                rounded-lg 
                w-full sm:w-auto
                hover:bg-blue-700
                transition
              "
            >
              View Profile
            </button>
          </div>
        ))
      )}

    </div>

  </div>
);
}

export default StudentManagement;