import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import FrontPage from "./pages/FrontPage";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import CalendarPage from "./pages/CalendarPage";
import CGPACalculator from "./pages/CGPACalculator";
import PomodoroTimer from "./pages/PomodoroTimer";
// import SettingsPage from "./pages/SettingsPage";
import { SubjectsProvider } from "./pages/SubjectsContext";

import AttendancePage from "./pages/Attendancepage";







// For dynamic subject attendance route:
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
          <Route path="/Home" element={<Home />} />
          <Route path="/CalendarPage" element={<CalendarPage />} />
          <Route path="/CGPACalculator" element={<CGPACalculator />} />
          <Route path="/PomodoroTimer" element={<PomodoroTimer />} />
          {/* <Route path="/settings" element={<SettingsPage />} /> */}
          <Route path="/subject/:subjectName" element={<AttendancePage />} />


       
         
        </Routes>
      </Router>
    </SubjectsProvider>
  );
}

export default App;
