import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

function AttendancePage() {
  const { subjectName } = useParams();
  const decodedSubject = decodeURIComponent(subjectName);
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  const [barGraphData, setBarGraphData] = useState({});
  const [lineGraphData, setLineGraphData] = useState({});

  // Color palette
  const primaryBrown = "#75352C";
  const accentBrown = "#9E5A4A";
  const lightGray = "#D3D6DA";
  const primaryBlue = "#244A65";
  const darkBlue = "#172834";

  const formatDate = (date) => new Date(date).toISOString().split("T")[0];

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "attendance", "record");
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        const subjectData = data[decodedSubject] || {};
        setAttendanceData(subjectData);
        generateGraphs(subjectData);
      }
    };
    fetchData();
  }, [decodedSubject]);

  const toggleAttendance = async (date) => {
    const formatted = formatDate(date);
    const current = attendanceData[formatted];
    const newStatus = current === "present" ? "absent" : "present";

    const updated = { ...attendanceData, [formatted]: newStatus };
    setAttendanceData(updated);
    generateGraphs(updated);

    const docRef = doc(db, "attendance", "record");
    try {
      await updateDoc(docRef, {
        [`${decodedSubject}.${formatted}`]: newStatus,
      });
    } catch {
      await setDoc(
        docRef,
        {
          [decodedSubject]: {
            [formatted]: newStatus,
          },
        },
        { merge: true }
      );
    }
  };

  const isPresent = (date) => {
    const formatted = formatDate(date);
    return attendanceData[formatted] === "present";
  };

  const generateGraphs = (data) => {
    const present = Object.values(data).filter((v) => v === "present").length;
    const total = Object.keys(data).length;
    const absent = total - present;

    setBarGraphData({
      labels: ["Present", "Absent"],
      datasets: [
        {
          label: "Days",
          data: [present, absent],
          backgroundColor: [primaryBlue, accentBrown],
          borderRadius: 8,
        },
      ],
    });

    const sortedDates = Object.keys(data).sort();
    setLineGraphData({
      labels: sortedDates,
      datasets: [
        {
          label: "Attendance",
          data: sortedDates.map((d) => (data[d] === "present" ? 1 : 0)),
          borderColor: primaryBrown,
          backgroundColor: `${primaryBrown}33`, // semi-transparent
          tension: 0.3,
          pointRadius: 6,
          fill: true,
        },
      ],
    });
  };

  const presentDays = Object.values(attendanceData).filter((v) => v === "present").length;
  const totalDays = Object.keys(attendanceData).length;
  const percentage = totalDays === 0 ? 0 : Math.round((presentDays / totalDays) * 100);

  return (
    <div
      className="min-h-screen p-8"
      style={{ background: lightGray, color: darkBlue }}
    >
      <button
        onClick={() => navigate("/")}
        className="flex items-center mb-6 text-xl text-[#244A65] hover:text-[#9E5A4A] font-bold"
        style={{ background: "none", border: "none" }}
      >
        <FiArrowLeft className="mr-3 text-2xl" /> Back to Dashboard
      </button>

      <h1 className="text-3xl font-extrabold mb-10" style={{ color: primaryBrown }}>
        Attendance for <span style={{ color: primaryBlue }}>{decodedSubject}</span>
      </h1>

      <div className="grid lg:grid-cols-2 gap-14">
        {/* Calendar Section */}
        <div
          className="p-8 rounded-2xl shadow-lg"
          style={{ background: "#fff", border: `2px solid ${primaryBlue}` }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold" style={{ color: accentBrown }}>Calendar</h2>
          </div>
          <div className="scale-110 max-w-xl mx-auto">
            <Calendar
              onClickDay={toggleAttendance}
              value={selectedDate}
              tileContent={({ date }) =>
                isPresent(date) ? (
                  <FiCheckCircle className="text-green-600 mx-auto mt-1" />
                ) : null
              }
              tileClassName={({ date }) => {
                const formatted = formatDate(date);
                const status = attendanceData[formatted];
                return `${
                  status === "present"
                    ? "bg-green-100 text-green-700"
                    : status === "absent"
                    ? "bg-red-100 text-red-700"
                    : ""
                } rounded-md text-lg font-semibold`;
              }}
              className="!w-full !text-lg [&>*]:text-inherit [&_button]:rounded-md [&_button]:px-3 [&_button]:py-2"
            />
          </div>
          <p className="mt-6 text-lg text-[#244A65] text-center font-medium">
            Click on a date to toggle attendance.
          </p>

          {totalDays > 0 && (
            <div className="mt-10">
              <Line
                data={lineGraphData}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      ticks: {
                        callback: (val) => (val === 1 ? "Present" : "Absent"),
                        font: { size: 16 },
                        color: primaryBlue,
                      },
                      min: 0,
                      max: 1,
                      grid: { color: "#D3D6DA" },
                    },
                    x: {
                      ticks: { font: { size: 14 }, color: accentBrown },
                      grid: { color: "#D3D6DA" },
                    },
                  },
                  plugins: {
                    legend: { display: false },
                  },
                }}
                height={200}
              />
            </div>
          )}
        </div>

        {/* Summary + Bar Chart */}
        <div
          className="p-8 rounded-2xl shadow-lg"
          style={{ background: "#fff", border: `2px solid ${accentBrown}` }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: primaryBlue }}>Summary</h2>
          <p className="mb-3 text-lg">Total Days Tracked: <strong>{totalDays}</strong></p>
          <p className="mb-3 text-lg" style={{ color: "#22c55e" }}>Present Days: <strong>{presentDays}</strong></p>
          <p className="mb-3 text-lg" style={{ color: "#ef4444" }}>Absent Days: <strong>{totalDays - presentDays}</strong></p>
          <p className="text-2xl font-bold" style={{ color: accentBrown }}>Attendance: {percentage}%</p>

          {totalDays > 0 && (
            <div className="mt-10">
              <Bar
                data={barGraphData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: {
                      ticks: { font: { size: 16 }, color: primaryBlue },
                      grid: { color: "#D3D6DA" },
                    },
                    y: {
                      ticks: { font: { size: 16 }, color: accentBrown },
                      grid: { color: "#D3D6DA" },
                    },
                  },
                }}
                height={200}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;
