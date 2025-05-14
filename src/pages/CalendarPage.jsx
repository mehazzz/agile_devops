import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSubjects } from "./SubjectsContext";
import { db } from "./firebase";
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

  const userId = "testUser"; // Replace with real user ID
  const eventsRef = collection(db, "events");

  const loadEvents = async () => {
    const q = query(eventsRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const loadedEvents = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      start: new Date(doc.data().start),
      end: new Date(doc.data().end),
      completed: doc.data().completed || false,
    }));
    setEvents(loadedEvents);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const addEvent = async ({ title, subject, start, end }) => {
    const newEvent = {
      userId,
      title,
      subject,
      start: start.toISOString(),
      end: end.toISOString(),
      completed: false,
    };
    await addDoc(eventsRef, newEvent);
    loadEvents();
  };

  const deleteEvent = async (event) => {
    await deleteDoc(doc(db, "events", event.id));
    loadEvents();
  };

  const updateEvent = async (event, newStart, newEnd) => {
    const eventRef = doc(db, "events", event.id);
    await updateDoc(eventRef, {
      start: newStart.toISOString(),
      end: newEnd.toISOString(),
    });
    loadEvents();
  };

  const completeEvent = async (event) => {
    await updateDoc(doc(db, "events", event.id), { completed: true });
    loadEvents();
    alert(`Task "${event.title}" marked as complete!`);
  };

  const handleSelectSlot = ({ start, end }) => {
    const title = prompt("Enter event title:");
    if (!title) return;

    const subject = prompt("Enter subject for this event:");
    if (!subject) return;

    addEvent({ title, subject, start, end });
  };

  const handleSelectEvent = (event) => {
    if (!event.completed && window.confirm(`Mark "${event.title}" as done?`)) {
      completeEvent(event);
    } else if (event.completed) {
      alert("This task is already completed.");
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
      const delay = new Date(event.start).getTime() - Date.now() - 5 * 60 * 1000;
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

  const CustomAgendaEvent = ({ event }) => (
    <div className="flex justify-between items-center">
      <div>
        <strong>{event.title}</strong> - {event.subject}
        {event.completed && <span className="text-green-500"> (Completed)</span>}
      </div>
      <div className="flex gap-2">
        {!event.completed && (
          <button
            onClick={() => completeEvent(event)}
            className="px-2 py-1 bg-[#244A65] text-[#D3D6DA] rounded hover:bg-[#172834] text-sm"
          >
            Done
          </button>
        )}
        <button
          onClick={() => deleteEvent(event)}
          className="px-2 py-1 bg-[#9E5A4A] text-[#D3D6DA] rounded hover:bg-[#75352C] text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );

  // Use brown for event bars, with white text and brown border
  const eventPropGetter = (event, start, end, isSelected) => ({
    style: {
      backgroundColor: "#9E5A4A",
      color: "#fff",
      border: "1.5px solid #75352C",
      borderRadius: "6px",
      fontWeight: "bold",
      opacity: event.completed ? 0.5 : 1,
      boxShadow: isSelected ? "0 0 0 2px #75352C" : undefined,
      transition: "box-shadow 0.2s",
    }
  });

  return (
    <div className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: "#D3D6DA", color: "#244A65" }}
    >
      {/* Dark Blue Water Background */}
      <div
        className="absolute bottom-0 left-0 w-full z-0 overflow-hidden pointer-events-none"
        style={{
          height: getWaterHeight(),
          opacity: 0.65, // semi-opaque
        }}
      >
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
          <path
            fill="#172834"
            fillOpacity="0.85"
            d="M0,160L40,165.3C80,171,160,181,240,181.3C320,181,400,171,480,176C560,181,640,203,720,197.3C800,192,880,160,960,144C1040,128,1120,128,1200,128C1280,128,1360,128,1400,128L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          />
          <path
            fill="#172834"
            fillOpacity="0.45"
            d="M0,288L40,272C80,256,160,224,240,202.7C320,181,400,171,480,176C560,181,640,203,720,224C800,245,880,267,960,261.3C1040,256,1120,224,1200,213.3C1280,203,1360,213,1400,218.7L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
          />
        </svg>
      </div>

      <div className="relative z-10 p-6">
        <div className="text-center text-xl font-semibold mb-4" style={{ color: "#75352C" }}>
          Tasks Scheduled: {filteredEvents.length} | Level: {getLevel()}
        </div>

        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <label className="font-medium mr-2" style={{ color: "#244A65" }}>Filter by Subject:</label>
            <select
              value={selectedSubject || ""}
              onChange={(e) =>
                setSelectedSubject(e.target.value === "" ? null : e.target.value)
              }
              className="border px-3 py-1 rounded-md bg-[#D3D6DA] text-[#244A65] border-[#244A65] focus:ring-2 focus:ring-[#244A65]"
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
              className="bg-[#244A65] text-[#D3D6DA] px-4 py-1 rounded-md hover:bg-[#75352C] transition"
            >
              Back
            </button>
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setMonth(newDate.getMonth() + 1);
                setCurrentDate(newDate);
              }}
              className="bg-[#244A65] text-[#D3D6DA] px-4 py-1 rounded-md hover:bg-[#75352C] transition"
            >
              Next
            </button>
          </div>
        </div>

        <div className="bg-[#F5F5F5] bg-opacity-90 p-2 rounded-md shadow-lg border border-[#9E5A4A]">
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "80vh", color: "#244A65", backgroundColor: "#F5F5F5" }}
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
            eventPropGetter={eventPropGetter}
            components={{
              agenda: {
                event: CustomAgendaEvent,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
