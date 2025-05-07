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
          backgroundColor: ["#22c55e", "#ef4444"],
          borderRadius: 6,
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
          borderColor: "#3B82F6",
          backgroundColor: "#93c5fd55",
          tension: 0.3,
          pointRadius: 4,
          fill: true,
        },
      ],
    });
  };

  const presentDays = Object.values(attendanceData).filter((v) => v === "present").length;
  const totalDays = Object.keys(attendanceData).length;
  const percentage = totalDays === 0 ? 0 : Math.round((presentDays / totalDays) * 100);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-[#0e101c] text-gray-900 dark:text-gray-100">
      <button
        onClick={() => navigate("/")}
        className="flex items-center mb-4 text-blue-600 hover:underline"
      >
        <FiArrowLeft className="mr-2" /> Back to Dashboard
      </button>

      <h1 className="text-2xl font-semibold mb-6">
        Attendance for <span className="text-blue-500">{decodedSubject}</span>
      </h1>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Calendar Section */}
        <div className="bg-white dark:bg-[#1e2237] p-6 rounded-xl shadow-lg">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold">Calendar</h2>
          </div>
          <div className="scale-110 max-w-xl mx-auto">
            <Calendar
              onClickDay={toggleAttendance}
              value={selectedDate}
              tileContent={({ date }) =>
                isPresent(date) ? (
                  <FiCheckCircle className="text-green-500 mx-auto mt-1" />
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
                } rounded-md`;
              }}
              className="!w-full !text-sm [&>*]:text-inherit [&_button]:rounded-md [&_button]:px-2 [&_button]:py-1"
            />
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            Click on a date to toggle attendance.
          </p>

          {totalDays > 0 && (
            <div className="mt-8">
              <Line
                data={lineGraphData}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      ticks: {
                        callback: (val) => (val === 1 ? "Present" : "Absent"),
                      },
                      min: 0,
                      max: 1,
                    },
                  },
                  plugins: { legend: { display: false } },
                }}
              />
            </div>
          )}
        </div>

        {/* Summary + Bar Chart */}
        <div className="p-6 rounded-xl shadow-lg bg-white dark:bg-[#1e2237]">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <p className="mb-2">Total Days Tracked: <strong>{totalDays}</strong></p>
          <p className="mb-2 text-green-500">Present Days: <strong>{presentDays}</strong></p>
          <p className="mb-2 text-red-500">Absent Days: <strong>{totalDays - presentDays}</strong></p>
          <p className="text-blue-600 text-lg font-bold">Attendance: {percentage}%</p>

          {totalDays > 0 && (
            <div className="mt-6">
              <Bar
                data={barGraphData}
                options={{ responsive: true, plugins: { legend: { display: false } } }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;
