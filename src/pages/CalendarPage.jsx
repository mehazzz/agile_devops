import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSubjects } from "./SubjectsContext";
import { db } from "./firebase"; // 🧩 Your Firebase setup file
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const { subjects } = useSubjects();

  const [events, setEvents] = useState([]);
  const [view, setView] = useState(Views.MONTH);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const userId = "testUser"; // Replace with real user ID in prod

  const eventsRef = collection(db, "events");

  // 🔃 Load events from Firebase
  const loadEvents = async () => {
    const q = query(eventsRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const loadedEvents = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      start: new Date(doc.data().start),
      end: new Date(doc.data().end),
    }));
    setEvents(loadedEvents);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // ➕ Add event
  const addEvent = async ({ title, subject, start, end }) => {
    const newEvent = {
      userId,
      title,
      subject,
      start: start.toISOString(),
      end: end.toISOString(),
    };
    await addDoc(eventsRef, newEvent);
    loadEvents();
  };

  // ❌ Delete event
  const deleteEvent = async (event) => {
    await deleteDoc(doc(db, "events", event.id));
    loadEvents();
  };

  // 🔁 Update event
  const updateEvent = async (event, newStart, newEnd) => {
    const eventRef = doc(db, "events", event.id);
    await updateDoc(eventRef, {
      start: newStart.toISOString(),
      end: newEnd.toISOString(),
    });
    loadEvents();
  };

  // 📅 New Event
  const handleSelectSlot = ({ start, end }) => {
    const title = prompt("Enter event title:");
    if (!title) return;

    const subject = prompt("Enter subject for this event:");
    if (!subject) return;

    addEvent({ title, subject, start, end });
  };

  const handleSelectEvent = (event) => {
    if (window.confirm(`Delete event: ${event.title}?`)) {
      deleteEvent(event);
    }
  };

  const moveEvent = ({ event, start, end }) => {
    updateEvent(event, start, end);
  };

  const resizeEvent = ({ event, start, end }) => {
    updateEvent(event, start, end);
  };

  const filteredEvents = selectedSubject
    ? events.filter((e) => e.subject === selectedSubject)
    : events;

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const timers = [];
    filteredEvents.forEach((event) => {
      const delay =
        new Date(event.start).getTime() - Date.now() - 5 * 60 * 1000;
      if (delay > 0) {
        const timer = setTimeout(() => {
          new Notification(`Reminder: ${event.title}`, {
            body: `Subject: ${event.subject}`,
          });
        }, delay);
        timers.push(timer);
      }
    });
    return () => timers.forEach(clearTimeout);
  }, [filteredEvents]);

  const getLevel = () => {
    const count = filteredEvents.length;
    if (count > 20) return "Master";
    if (count > 10) return "Pro";
    if (count > 5) return "Intermediate";
    return "Beginner";
  };

  const getWaterHeight = () => {
    const count = filteredEvents.length;
    if (count > 20) return "90%";
    if (count > 15) return "75%";
    if (count > 10) return "60%";
    if (count > 5) return "40%";
    if (count > 2) return "25%";
    return "10%";
  };

  return (
    <div className="min-h-screen relative text-gray-800 overflow-hidden">
      <div
        className="absolute bottom-0 left-0 w-full z-0 overflow-hidden"
        style={{ height: getWaterHeight() }}
      >
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-full"
          style={{ display: "block" }}
        >
          <path
            fill="#93c5fd"
            fillOpacity="0.6"
            d="M0,160L40,165.3C80,171,160,181,240,181.3C320,181,400,171,480,176C560,181,640,203,720,197.3C800,192,880,160,960,144C1040,128,1120,128,1200,128C1280,128,1360,128,1400,128L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          ></path>
          <path
            fill="#60a5fa"
            fillOpacity="0.5"
            d="M0,288L40,272C80,256,160,224,240,202.7C320,181,400,171,480,176C560,181,640,203,720,224C800,245,880,267,960,261.3C1040,256,1120,224,1200,213.3C1280,203,1360,213,1400,218.7L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="relative z-10 p-6">
        <div className="text-center text-xl font-semibold mb-4">
          Tasks Scheduled: {filteredEvents.length} | Level: {getLevel()}
        </div>

        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <label className="font-medium mr-2">Filter by Subject:</label>
            <select
              value={selectedSubject || ""}
              onChange={(e) =>
                setSelectedSubject(
                  e.target.value === "" ? null : e.target.value
                )
              }
              className="border px-3 py-1 rounded-md"
            >
              <option value="">All</option>
              {subjects.map((subject, i) => (
                <option key={i} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 sm:mt-0 flex gap-3">
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() - 1);
                setCurrentDate(newDate);
              }}
              className="bg-blue-700 text-white px-4 py-1 rounded-md hover:bg-blue-900"
            >
              Back
            </button>
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setCurrentDate(newDate);
              }}
              className="bg-blue-700 text-white px-4 py-1 rounded-md hover:bg-blue-900"
            >
              Next
            </button>
          </div>
        </div>

        <div className="bg-white bg-opacity-80 p-2 rounded-md shadow-lg">
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "80vh" }}
            selectable
            popup
            resizable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            onEventDrop={moveEvent}
            onEventResize={resizeEvent}
            view={view}
            onView={setView}
            date={currentDate}
            onNavigate={setCurrentDate}
            views={["month", "week", "day", "agenda"]}
            draggableAccessor={() => true}
            resizableAccessor={() => true}
          />
        </div>
      </div>
    </div>
  );
}
