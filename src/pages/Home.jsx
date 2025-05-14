import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useSubjects } from "./SubjectsContext";
import Chatbot from "./chatbot";
import {
  FiSun, FiMoon, FiLogOut, FiMenu, FiX,
  FiCalendar, FiTrendingUp, FiClock,
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
    <div className={`min-h-screen transition-all duration-300 flex ${darkMode ? 'bg-[#172834] text-[#D3D6DA]' : 'bg-[#D3D6DA] text-[#172834]'}`}>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out overflow-hidden
        ${darkMode ? 'bg-[#244A65] border-r border-[#75352C]' : 'bg-[#75352C] border-r border-[#9E5A4A] text-[#D3D6DA]'}`}
        style={{
          width: sidebarOpen ? "19rem" : "0",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          pointerEvents: sidebarOpen ? "auto" : "none"
        }}
      >
        <div className="p-8 space-y-10">
          {sidebarItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-5 cursor-pointer hover:text-[#9E5A4A] text-xl font-semibold"
            >
              <span className="text-3xl">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 transition-all duration-300" style={{ marginLeft: sidebarOpen ? "19rem" : "0" }}>
        {/* Header */}
        <header className={`flex justify-between items-center px-10 py-6 shadow-md sticky top-0 z-30 ${darkMode ? 'bg-[#244A65]' : 'bg-[#9E5A4A] text-[#D3D6DA]'}`}>
          <div className="flex items-center gap-6">
            <button onClick={toggleSidebar} className="text-3xl text-[#D3D6DA] hover:text-[#75352C]">
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
            <h1 className="text-4xl font-extrabold">{user?.displayName ? `${user.displayName}'s Dashboard` : "Your Dashboard"}</h1>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={toggleTheme} className="text-2xl hover:scale-110 transition">
              {darkMode ? <FiSun className="text-yellow-300" /> : <FiMoon className="text-[#244A65]" />}
            </button>
            <div className="relative">
              <FaUserCircle
                onClick={() => setShowProfile(!showProfile)}
                className="text-4xl cursor-pointer text-[#D3D6DA] hover:text-[#75352C]"
              />
              {showProfile && (
                <div className={`absolute right-0 mt-2 w-64 p-6 rounded-lg shadow-lg z-50 ${darkMode ? 'bg-[#172834] border border-[#244A65]' : 'bg-[#D3D6DA] border border-[#9E5A4A] text-[#172834]'}`}>
                  <p className="font-bold text-lg">{user?.displayName}</p>
                  <p className="text-base text-[#9E5A4A]">{user?.email}</p>
                  <button
                    onClick={handleLogout}
                    className="mt-4 text-lg text-[#9E5A4A] flex items-center gap-2 hover:text-[#75352C]"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-12 space-y-16">
          {/* Quote */}
          <section className="text-center italic text-2xl text-[#244A65]">
            "Push yourself, because no one else is going to do it for you."
          </section>

          {/* Subjects */}
          <section>
            <h2 className="text-3xl font-bold mb-8">Your Subjects</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/subject/${encodeURIComponent(subject)}`)}
                  className={`relative group rounded-2xl shadow-lg p-8 cursor-pointer transition
                    flex flex-col justify-center items-center h-52 w-full
                    ${darkMode
                      ? 'bg-[#172834] text-[#D3D6DA] hover:bg-[#244A65]'
                      : 'bg-[#D3D6DA] text-[#75352C] hover:bg-[#9E5A4A] border-2 border-[#9E5A4A]'}
                  `}
                >
                  <span className="block font-bold text-2xl truncate">{subject}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSubject(subject);
                    }}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#9E5A4A] hover:text-[#75352C] text-2xl"
                  >
                    <FiTrash />
                  </button>
                </div>
              ))}

              {/* Add Subject */}
              <div
                onClick={() => setShowAddSubject(true)}
                className="flex flex-col justify-center items-center rounded-2xl border-4 border-dashed cursor-pointer transition hover:scale-105
                  text-[#244A65] hover:text-[#75352C] border-[#244A65] hover:border-[#75352C] bg-transparent h-52"
              >
                <FiPlus className="text-4xl mb-2" />
                <span className="text-xl font-bold">Add Subject</span>
              </div>
            </div>
          </section>

          {/* Scratchpad */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Scratchpad</h2>
            <div className={`rounded-2xl shadow-lg p-8 ${darkMode ? 'bg-[#244A65] text-[#D3D6DA]' : 'bg-[#D3D6DA] border-2 border-[#9E5A4A] text-[#75352C]'}`}>
              <textarea
                rows="8"
                value={scratchpadText}
                onChange={(e) => setScratchpadText(e.target.value)}
                placeholder="Jot down your thoughts..."
                className="w-full bg-transparent outline-none resize-none placeholder:text-[#9E5A4A] text-xl"
              />
            </div>
          </section>
        </main>
      </div>

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-10 rounded-2xl w-[30rem] shadow-xl space-y-6 ${darkMode ? 'bg-[#172834] border-2 border-[#244A65]' : 'bg-[#D3D6DA] border-2 border-[#9E5A4A] text-[#75352C]'}`}>
            <h3 className="text-2xl font-bold">Add New Subject</h3>
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="w-full p-4 rounded-lg border-2 outline-none focus:ring-2 focus:ring-[#244A65] bg-[#D3D6DA] text-[#75352C] text-xl"
              placeholder="e.g. Data Structures"
            />
            <div className="flex justify-end gap-6">
              <button
                onClick={() => {
                  handleAddSubject();
                  setShowAddSubject(false);
                }}
                className="bg-[#244A65] hover:bg-[#75352C] text-[#D3D6DA] px-6 py-3 rounded-lg text-lg font-bold"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddSubject(false)}
                className="text-[#9E5A4A] hover:text-[#75352C] px-6 py-3 text-lg font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chatbot */}
      <div className="fixed bottom-8 right-8 z-50">
        <Chatbot />
      </div>
    </div>
  );
}

export default HomePage;
