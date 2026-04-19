import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

function AttendanceGraph() {

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const [year, setYear] = useState(queryParams.get("year") || "");
  const [semester, setSemester] = useState(queryParams.get("semester") || "");
  const [branch, setBranch] = useState(queryParams.get("branch") || "");
  const [data, setData] = useState([]);


  useEffect(() => {
    fetchGraph();


    navigate(
      `?year=${year}&semester=${semester}&branch=${branch}`,
      { replace: true }
    );

  }, [year, semester, branch]);

  const fetchGraph = async () => {
    try {
      const res = await api.get(
        `faculty/attendance/graph/?year=${year}&semester=${semester}&branch=${branch}`
      );
      setData(res.data.graph);
    } catch (error) {
      console.error("Error fetching graph:", error);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white px-4 sm:px-6 md:px-10 py-8">

    {/* HEADER */}
    <div className="mb-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Attendance Analytics
      </h1>
      <p className="text-white/70 mt-2 text-sm sm:text-base">
        Track student attendance day-wise
      </p>
    </div>

    {/* FILTERS */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

      <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="p-3 rounded-lg text-black w-full"
      >
        <option value="">Year</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>

      <select
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
        className="p-3 rounded-lg text-black w-full"
      >
        <option value="">Semester</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
      </select>

      <select
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
        className="p-3 rounded-lg text-black w-full"
      >
        <option value="">Branch</option>
        <option value="CSE">CSE</option>
        <option value="IT">IT</option>
      </select>

    </div>

    {/* GRAPH CARD */}
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl">

      {data.length === 0 ? (
        <p className="text-center text-white/60 py-10">
          No attendance data available
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>

            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="day" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />

            <Bar
              dataKey="present"
              fill="#22c55e"
              radius={[8, 8, 0, 0]}
              cursor="pointer"
              onClick={(barData) => {
                if (barData?.payload?.date) {
                  navigate(
                    `/faculty/attendance/${barData.payload.date}?year=${year}&semester=${semester}&branch=${branch}`
                  );
                }
              }}
            />

          </BarChart>
        </ResponsiveContainer>
      )}

    </div>

  </div>
);
}

export default AttendanceGraph;