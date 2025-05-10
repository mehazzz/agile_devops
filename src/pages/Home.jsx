// ... all previous imports
import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useSubjects } from "./SubjectsContext";
import Chatbot from "./chatbot";
import {
  FiSun, FiMoon, FiLogOut, FiMenu, FiX,
  FiSettings, FiCalendar, FiTrendingUp, FiClock,
  FiTrash, FiPlus
} from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

function HomePage() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newSubject, setNewSubject] = useState("");
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [scratchpadText, setScratchpadText] = useState(() => localStorage.getItem("scratchpad") || "");

  const { subjects, addSubject, removeSubject } = useSubjects();
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) setUser(currentUser);
    else navigate("/AuthPage");
  }, [auth, navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("scratchpad", scratchpadText);
  }, [scratchpadText]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/AuthPage");
  };

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      addSubject(newSubject.trim());
      setNewSubject("");
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleTheme = () => setDarkMode(!darkMode);

  const sidebarItems = [
    { label: "Calendar", icon: <FiCalendar />, path: "/CalendarPage" },
    { label: "CGPA", icon: <FiTrendingUp />, path: "/CGPACalculator" },
    { label: "Pomodoro", icon: <FiClock />, path: "/PomodoroTimer" },
  ];

  return (
    <div className={`min-h-screen transition-all duration-300 flex ${darkMode ? 'bg-[#0e101c] text-gray-200' : 'bg-gray-100 text-gray-900'}`}>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out overflow-hidden
        ${darkMode ? 'bg-[#1e2237] border-r border-blue-800' : 'bg-white border-r border-gray-300'}`}
        style={{
          width: sidebarOpen ? "15rem" : "0",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          pointerEvents: sidebarOpen ? "auto" : "none"
        }}
      >
        <div className="p-5 space-y-6">
          {sidebarItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-3 cursor-pointer hover:text-blue-500 text-base font-medium"
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 transition-all duration-300" style={{ marginLeft: sidebarOpen ? "15rem" : "0" }}>
        {/* Header */}
        <header className={`flex justify-between items-center px-6 py-4 shadow-md sticky top-0 z-30 ${darkMode ? 'bg-[#1a1c2e]' : 'bg-white'}`}>
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="text-2xl text-blue-500 hover:text-blue-700">
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
            <h1 className="text-2xl font-bold">{user?.displayName ? `${user.displayName}'s Dashboard` : "Your Dashboard"}</h1>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="text-xl hover:scale-110 transition">
              {darkMode ? <FiSun className="text-yellow-300" /> : <FiMoon className="text-blue-600" />}
            </button>

            <div className="relative">
              <FaUserCircle
                onClick={() => setShowProfile(!showProfile)}
                className="text-3xl cursor-pointer text-blue-400 hover:text-blue-600"
              />
              {showProfile && (
                <div className={`absolute right-0 mt-2 w-52 p-4 rounded-lg shadow-lg z-50 ${darkMode ? 'bg-[#272a3f] border border-blue-900' : 'bg-white border border-gray-300'}`}>
                  <p className="font-medium text-sm">{user?.displayName}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                  <button
                    onClick={handleLogout}
                    className="mt-3 text-sm text-red-500 flex items-center gap-2 hover:text-red-700"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8 space-y-10">
          {/* Quote */}
          <section className="text-center italic text-lg text-blue-400">
            "Push yourself, because no one else is going to do it for you."
          </section>

          {/* Subjects */}
          <section>
            <h2 className="text-2xl font-semibold mb-5">Your Subjects</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/subject/${encodeURIComponent(subject)}`)}
                  className={`relative group rounded-xl shadow-lg p-4 cursor-pointer transition
                    flex flex-col justify-center items-center h-40 w-full
                    ${darkMode ? 'bg-[#2b2d44] text-blue-100 hover:bg-[#343754]' : 'bg-white text-blue-900 hover:bg-blue-50 border border-gray-200'}`}
                >
                  <span className="block font-semibold text-lg truncate">{subject}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSubject(subject);
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                  >
                    <FiTrash />
                  </button>
                </div>
              ))}

              {/* Add Subject */}
              <div
                onClick={() => setShowAddSubject(true)}
                className="flex flex-col justify-center items-center rounded-xl border-2 border-dashed cursor-pointer transition hover:scale-105
                  text-blue-500 hover:text-blue-600 border-blue-400 hover:border-blue-600 bg-transparent h-40"
              >
                <FiPlus className="text-2xl mb-1" />
                <span className="text-sm font-medium">Add Subject</span>
              </div>
            </div>
          </section>

          {/* Scratchpad */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Scratchpad</h2>
            <div className={`rounded-xl shadow-lg p-4 ${darkMode ? 'bg-[#2e314d] text-blue-100' : 'bg-white border border-gray-200 text-blue-900'}`}>
              <textarea
                rows="6"
                value={scratchpadText}
                onChange={(e) => setScratchpadText(e.target.value)}
                placeholder="Jot down your thoughts..."
                className="w-full bg-transparent outline-none resize-none placeholder:text-gray-400"
              />
            </div>
          </section>
        </main>
      </div>

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-2xl w-96 shadow-xl space-y-4 ${darkMode ? 'bg-[#1f1f2e] border border-blue-900' : 'bg-white border border-gray-300'}`}>
            <h3 className="text-lg font-semibold">Add New Subject</h3>
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="w-full p-2 rounded-md border outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Data Structures"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  handleAddSubject();
                  setShowAddSubject(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddSubject(false)}
                className="text-gray-400 hover:text-gray-600 px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot */}
      <div className="fixed bottom-4 right-4 z-50">
        <Chatbot />
      </div>
    </div>
  );
}

export default HomePage;
