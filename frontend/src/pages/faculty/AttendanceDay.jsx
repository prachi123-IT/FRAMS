import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../../api/axios";

function AttendanceDay() {

  const { date } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const year = queryParams.get("year") || "";
  const semester = queryParams.get("semester") || "";
  const branch = queryParams.get("branch") || "";

  const [data, setData] = useState({
    present: [],
    absent: []
  });

  useEffect(() => {
    fetchStudents();
  }, [date]);

  const fetchStudents = async () => {
    try {
      const res = await api.get(
        `/faculty/attendance/day/${date}/?year=${year}&semester=${semester}&branch=${branch}`
      );

      setData({
        present: res.data.present || [],
        absent: res.data.absent || []
      });

    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

 return (
  <div className="min-h-screen bg-slate-900 text-white px-4 sm:px-6 md:px-10 py-8">

    {/* Title */}
    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8">
      Attendance - {date}
    </h1>

    {/* GRID CONTAINER */}
    <div className="grid md:grid-cols-2 gap-8">

      {/* PRESENT SECTION */}
      <div className="bg-slate-800 p-5 rounded-2xl shadow-lg">
        <h2 className="text-green-400 text-lg sm:text-xl font-semibold mb-4">
          Present Students ({data.present.length})
        </h2>

        {data.present.length === 0 ? (
          <p className="text-gray-400 text-sm">No students marked present.</p>
        ) : (
          <div className="space-y-2">
            {data.present.map((s, i) => (
              <div
                key={i}
                className="bg-slate-700 px-4 py-2 rounded-lg text-sm sm:text-base"
              >
                {s.name} ({s.roll_no})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ABSENT SECTION */}
      <div className="bg-slate-800 p-5 rounded-2xl shadow-lg">
        <h2 className="text-red-400 text-lg sm:text-xl font-semibold mb-4">
          Absent Students ({data.absent.length})
        </h2>

        {data.absent.length === 0 ? (
          <p className="text-gray-400 text-sm">No students marked absent.</p>
        ) : (
          <div className="space-y-2">
            {data.absent.map((s, i) => (
              <div
                key={i}
                className="bg-slate-700 px-4 py-2 rounded-lg text-sm sm:text-base"
              >
                {s.name} ({s.roll_no})
              </div>
            ))}
          </div>
        )}
      </div>

    </div>

  </div>
);
}

export default AttendanceDay;