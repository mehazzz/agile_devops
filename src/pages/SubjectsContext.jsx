// src/pages/SubjectsContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const SubjectsContext = createContext();

export const useSubjects = () => useContext(SubjectsContext);

export const SubjectsProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [gpa, setGpa] = useState(null);
  const [userId, setUserId] = useState(null);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setSubjects(data.subjects || []);
          setEvents(data.events || []);
          setGpa(data.gpa || null);
        } else {
          await setDoc(userDocRef, {
            subjects: [],
            events: [],
            gpa: null,
          });
        }
      } else {
        setUserId(null);
        setSubjects([]);
        setEvents([]);
        setGpa(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateUserDoc = async (newData) => {
    if (!userId) return;
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, newData);
  };

  const addSubject = async (subject) => {
    const updated = [...subjects, subject];
    setSubjects(updated);
    await updateUserDoc({ subjects: updated });
  };

  const removeSubject = async (subjectToRemove) => {
    const updated = subjects.filter((subj) => subj !== subjectToRemove);
    setSubjects(updated);
    await updateUserDoc({ subjects: updated });
  };

  const addEvent = async (event) => {
    const updated = [...events, event];
    setEvents(updated);
    await updateUserDoc({ events: updated });
  };

  const updateGpa = async (newGpa) => {
    setGpa(newGpa);
    await updateUserDoc({ gpa: newGpa });
  };

  return (
    <SubjectsContext.Provider
      value={{
        subjects,
        addSubject,
        removeSubject,
        events,
        addEvent,
        gpa,
        updateGpa,
      }}
    >
      {children}
    </SubjectsContext.Provider>
  );
};
