import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FrontPage from "./pages/FrontPage";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import CalendarPage from "./pages/CalendarPage"; // ✅ Import the CalendarPage
import CGPACalculator from "./pages/CGPACalculator"; // ✅ Import the CGPACalculator
import PomodoroTimer from "./pages/PomodoroTimer"; // ✅ Import the PomodoroTimer
// import SettingsPage from "./pages/SettingsPage"; // ✅ Import the settings
import { SubjectsProvider } from "./pages/SubjectsContext";

function App() {
  return (
    <SubjectsProvider>
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/authpage" element={<AuthPage />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/CalendarPage" element={<CalendarPage />} /> {/* ✅ This fixes the blank page */}
        <Route path="/CGPACalculator" element={<CGPACalculator />} /> {/* ✅ This fixes the blank page */}
        <Route path="/PomodoroTimer" element={<PomodoroTimer />} /> {/* ✅ This fixes the blank page */}
        {/* <Route path="/settings" element={<SettingsPage />} /> ✅ This fixes the blank page */}

        {/* Add other routes as needed */}
      </Routes>
    </Router>
    </SubjectsProvider>
  );
}

export default App;
