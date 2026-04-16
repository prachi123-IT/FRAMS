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
    <div className="min-h-screen bg-slate-900 text-white p-10">

      <h1 className="text-2xl mb-6">
        Attendance - {date}
      </h1>

      <h2 className="text-green-400 text-xl mt-4">Present Students</h2>
      {data.present.map((s, i) => (
        <div key={i}>{s.name} ({s.roll_no})</div>
      ))}

      <h2 className="text-red-400 text-xl mt-6">Absent Students</h2>
      {data.absent.map((s, i) => (
        <div key={i}>{s.name} ({s.roll_no})</div>
      ))}

    </div>
  );
}

export default AttendanceDay;