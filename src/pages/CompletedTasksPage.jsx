import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { Link } from "react-router-dom";

export default function CompletedTasksPage() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const userId = "testUser"; // Replace with actual auth ID

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      const completedRef = collection(db, "tasks_completed");
      const q = query(completedRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const tasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCompletedTasks(tasks);
    };

    fetchCompletedTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          ✅ Completed Tasks
        </h1>

        {completedTasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks completed yet.</p>
        ) : (
          <ul className="space-y-4">
            {completedTasks.map((task) => (
              <li
                key={task.id}
                className="bg-white p-4 rounded-md shadow-md border-l-4 border-green-500"
              >
                <h2 className="text-lg font-bold">{task.title}</h2>
                <p className="text-gray-600">Subject: {task.subject}</p>
                <p className="text-sm text-gray-500">
                  Start: {new Date(task.start).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  End: {new Date(task.end).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">
                  Marked complete on:{" "}
                  {new Date(task.completedAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            ← Back to Calendar
          </Link>
        </div>
      </div>
    </div>
  );
}