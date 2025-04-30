import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Optional for calendar navigation

export default function PomodoroTimer() {
  const [seconds, setSeconds] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  });
  const [newTask, setNewTask] = useState("");
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [autoMode, setAutoMode] = useState(
    JSON.parse(localStorage.getItem("autoMode")) || false
  );

  const intervalRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("autoMode", JSON.stringify(autoMode));
  }, [autoMode]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 1) {
            clearInterval(intervalRef.current);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  const handleSessionComplete = () => {
    if (!isBreak) setPomodoroCount((count) => count + 1);
    const nextIsBreak = !isBreak;
    setIsBreak(nextIsBreak);
    setSeconds(nextIsBreak ? 300 : 1500);
    setIsActive(autoMode);
  };

  const toggleStart = () => setIsActive(!isActive);
  const resetTimer = () => {
    setSeconds(isBreak ? 300 : 1500);
    setIsActive(false);
  };
  const switchMode = () => {
    const nextIsBreak = !isBreak;
    setIsBreak(nextIsBreak);
    setSeconds(nextIsBreak ? 300 : 1500);
    setIsActive(false);
  };

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, newTask.trim()]);
      setNewTask("");
    }
  };

  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-200 via-indigo-100 to-blue-200 flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-white/80 p-6 border-r border-gray-300 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">Task List</h2>
        <div className="space-y-2">
          {tasks.map((task, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-white rounded-lg px-3 py-2 shadow"
            >
              <span className="text-gray-800">{task}</span>
              <button
                onClick={() => deleteTask(i)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a task..."
            className="w-full text-sm px-3 py-2 rounded-l-lg border border-gray-300 focus:outline-none"
          />
          <button
            onClick={addTask}
            className="bg-indigo-600 text-white px-3 py-2 rounded-r-lg hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Main Timer Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-8">Pomodoro Timer</h1>
        <div className="text-7xl font-bold text-gray-800 mb-6">{formatTime(seconds)}</div>
        <div className="flex gap-4 flex-wrap justify-center mb-6">
          <button
            onClick={toggleStart}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition"
          >
            {isActive ? "Pause" : "Start"}
          </button>
          <button
            onClick={resetTimer}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-medium transition"
          >
            Reset
          </button>
          <button
            onClick={switchMode}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium transition"
          >
            Switch to {isBreak ? "Work" : "Break"}
          </button>
        </div>

        <div className="flex justify-between items-center gap-6 text-gray-700 mb-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={autoMode}
              onChange={(e) => setAutoMode(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 focus:ring-indigo-500"
            />
            <span className="text-lg">Auto Mode</span>
          </label>
          <p className="text-lg font-semibold">Pomodoros Completed: {pomodoroCount}</p>
        </div>

        <Link to="/calendar" className="text-indigo-600 hover:underline text-sm mt-2">
          View Calendar
        </Link>
      </div>

      {/* Mini Timer Badge */}
      <div className="fixed bottom-6 right-6 bg-black text-white text-sm px-4 py-2 rounded-full shadow-lg opacity-90 font-mono">
        {formatTime(seconds)} {isBreak ? "(Break)" : "(Work)"}
      </div>
    </div>
  );
}
