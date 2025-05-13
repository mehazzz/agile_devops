import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import FrontPage from "./pages/FrontPage";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import CalendarPage from "./pages/CalendarPage";
import CGPACalculator from "./pages/CGPACalculator";
import PomodoroTimer from "./pages/PomodoroTimer";
import { SubjectsProvider } from "./pages/SubjectsContext";
import AttendancePage from "./pages/Attendancepage";
// import CompletedTasksPage from "./pages/CompletedTasksPage";

// Wrapper for dynamic subject route
const SubjectWrapper = () => {
  const { subjectName } = useParams();
  return <AttendancePage subjectName={subjectName} />;
};

function App() {
  return (
    <SubjectsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/authpage" element={<AuthPage />} />
          <Route path="/home" element={<Home />} />
          {/* <Route path="/completed" element={<CompletedTasksPage />} /> */}
          <Route path="/calendarpage" element={<CalendarPage />} />
          <Route path="/cgpacalculator" element={<CGPACalculator />} />
          <Route path="/pomodorotimer" element={<PomodoroTimer />} />
          <Route path="/subject/:subjectName" element={<SubjectWrapper />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Router>
    </SubjectsProvider>
  );
}

export default App;
