import { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { FaUserGraduate } from "react-icons/fa";

function StudentRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    roll_no: "",
    department: "",
    year: "",
    semester: "",
    cgpa: ""
  });

  const [semesters, setSemesters] = useState(
    Array.from({ length: 8 }, (_, i) => ({
      semester: i + 1,
      cgpa: "",
      marksheet: null,
      existingMarksheet: null
    }))
  );

  useEffect(() => {
    api.get("students/profile/")
      .then(res => {
        if (res.data.profile_exists) {
          setForm({
            name: res.data.name || "",
            roll_no: res.data.roll_no || "",
            department: res.data.department || "",
            year: res.data.year || "",
            semester: res.data.semester || "",
          });

          
          if (res.data.academics) {
            const updated = Array.from({ length: 8 }, (_, i) => ({
              semester: i + 1,
              cgpa: "",
              marksheet: null,
              existingMarksheet: null   
            }));

            res.data.academics.forEach(record => {
              updated[record.semester - 1].cgpa = record.cgpa;
              updated[record.semester - 1].existingMarksheet = record.marksheet;
            });

            setSemesters(updated);
          }
        }
      })
      .catch(() => { });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSemesterChange = (index, field, value) => {
    const updated = [...semesters];
    updated[index][field] = value;
    setSemesters(updated);
  };


const handleSubmit = async () => {
  try {
    setLoading(true);

    const profileData = new FormData();
    Object.keys(form).forEach(key => {
      profileData.append(key, form[key]);
    });

    await api.post("students/profile/save/", profileData);

    for (let sem of semesters) {
      if (sem.cgpa || sem.marksheet) {
        const semData = new FormData();
        semData.append("year", form.year);
        semData.append("semester", sem.semester);
        semData.append("cgpa", sem.cgpa);

        if (sem.marksheet) {
          semData.append("marksheet", sem.marksheet);
        }

        await api.post("students/upload-marksheet/", semData);
      }
    }

    alert("Profile Saved Successfully 🎉");
    navigate("/student");

  } catch (err) {
    alert("Error Saving Profile");
  } finally {
    setLoading(false);
  }
};

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-900 px-4 py-8">
    
    <div className="bg-white w-full max-w-6xl p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl">
      
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-indigo-600 mb-8 flex items-center justify-center gap-3">
        <FaUserGraduate /> Student Profile Setup
      </h2>

      {/* BASIC INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <input name="name" placeholder="Full Name"
          value={form.name} onChange={handleChange}
          className="p-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none" />

        <input name="roll_no" placeholder="Roll Number"
          value={form.roll_no} onChange={handleChange}
          className="p-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none" />

        <input name="department" placeholder="Branch"
          value={form.department} onChange={handleChange}
          className="p-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none" />

        <input type="number" name="year" placeholder="Year"
          value={form.year} onChange={handleChange}
          className="p-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none" />

        <input type="number" name="semester" placeholder="Current Semester"
          value={form.semester} onChange={handleChange}
          className="p-3 border rounded-xl focus:ring-2 focus:ring-purple-400 outline-none" />

        <input type="number" step="0.01" name="cgpa"
          placeholder="Current CGPA"
          value={form.cgpa} onChange={handleChange}
          className="p-3 border rounded-xl bg-white text-gray-800 focus:ring-2 focus:ring-purple-400 outline-none" />
      </div>

      <hr className="my-8 border-gray-300" />

      {/* SEMESTERS */}
      <div className="mt-6">
        <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-purple-600 text-center">
          📘 Academic Records (Semester 1–8)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {semesters.map((sem, index) => (
            <div key={index} className="border p-4 rounded-2xl bg-gray-50 shadow-sm hover:shadow-md transition">

              <h4 className="font-bold mb-3 text-indigo-500 text-sm sm:text-base">
                🎓 Semester {sem.semester}
              </h4>

              <input
                type="number"
                step="0.01"
                placeholder="CGPA"
                value={sem.cgpa}
                onChange={(e) =>
                  handleSemesterChange(index, "cgpa", e.target.value)
                }
                className="w-full p-2 border rounded-lg mb-3 bg-white text-gray-800 focus:ring-2 focus:ring-purple-400 outline-none"
              />

              <input
                type="file"
                onChange={(e) =>
                  handleSemesterChange(index, "marksheet", e.target.files[0])
                }
                className="w-full text-sm"
              />

              {sem.existingMarksheet && (
                <p className="text-sm text-green-600 mt-2 break-words">
                  Current File:
                  <a
                    href={`http://127.0.0.1:8000${sem.existingMarksheet}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline ml-2"
                  >
                    View
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-10 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:scale-[1.02] transition-all duration-300 shadow-xl"
      >
        {loading ? "Saving..." : "Save Profile"}
      </button>

    </div>
  </div>
);
}

export default StudentRegister;