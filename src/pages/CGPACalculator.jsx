import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState([
    { subjects: [{ name: '', marks: '', credits: '' }] },
  ]);
  const [saveStatus, setSaveStatus] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'users', 'user1');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSemesters(docSnap.data().semesters);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      setSaveStatus('Saving...');
      await setDoc(doc(db, 'users', 'user1'), { semesters });
      setTimeout(() => setSaveStatus('✅ Saved'), 500);
    };
    saveData();
  }, [semesters]);

  const handleSubjectChange = (semIndex, subjIndex, field, value) => {
    const updated = [...semesters];
    if (field === 'marks' || field === 'credits') {
      if (value < 0 || (field === 'marks' && value > 100)) return;
    }
    updated[semIndex].subjects[subjIndex][field] = value;
    setSemesters(updated);
  };

  const addSemester = () => {
    setSemesters([...semesters, { subjects: [{ name: '', marks: '', credits: '' }] }]);
  };

  const removeSemester = (index) => {
    const updated = semesters.filter((_, i) => i !== index);
    setSemesters(updated);
  };

  const addSubject = (semIndex) => {
    const updated = [...semesters];
    updated[semIndex].subjects.push({ name: '', marks: '', credits: '' });
    setSemesters(updated);
  };

  const removeSubject = (semIndex, subjIndex) => {
    const updated = [...semesters];
    updated[semIndex].subjects = updated[semIndex].subjects.filter((_, i) => i !== subjIndex);
    setSemesters(updated);
  };

  const calculateSGPA = (subjects) => {
    let totalGradePoints = 0;
    let totalCredits = 0;

    for (let subject of subjects) {
      const marks = parseFloat(subject.marks);
      const credits = parseFloat(subject.credits);

      if (!isNaN(marks) && !isNaN(credits)) {
        let gradePoint = 0;
        if (marks >= 90) gradePoint = 10;
        else if (marks >= 80) gradePoint = 9;
        else if (marks >= 70) gradePoint = 8;
        else if (marks >= 60) gradePoint = 7;
        else if (marks >= 50) gradePoint = 6;
        else if (marks >= 40) gradePoint = 5;
        else gradePoint = 0;

        totalGradePoints += gradePoint * credits;
        totalCredits += credits;
      }
    }

    return totalCredits ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
  };

  const calculateCGPA = () => {
    let totalSGPA = 0;
    let totalCredits = 0;

    semesters.forEach((sem) => {
      sem.subjects.forEach((subject) => {
        const marks = parseFloat(subject.marks);
        const credits = parseFloat(subject.credits);

        if (!isNaN(marks) && !isNaN(credits)) {
          let gradePoint = 0;
          if (marks >= 90) gradePoint = 10;
          else if (marks >= 80) gradePoint = 9;
          else if (marks >= 70) gradePoint = 8;
          else if (marks >= 60) gradePoint = 7;
          else if (marks >= 50) gradePoint = 6;
          else if (marks >= 40) gradePoint = 5;
          else gradePoint = 0;

          totalSGPA += gradePoint * credits;
          totalCredits += credits;
        }
      });
    });

    return totalCredits ? (totalSGPA / totalCredits).toFixed(2) : '0.00';
  };

  const resetAll = () => {
    setSemesters([{ subjects: [{ name: '', marks: '', credits: '' }] }]);
  };

  const bgColor = darkMode ? '#1e272e' : '#f0f4f8';
  const cardColor = darkMode ? '#2f3640' : '#ffffff';
  const textColor = darkMode ? '#f5f6fa' : '#2c3e50';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: bgColor, padding: '2rem', fontFamily: 'Poppins, sans-serif', color: textColor }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem' }}>📚 GPA Calculator</h1>
      <div style={{ marginBottom: '1rem' }}>{saveStatus}</div>
      <button onClick={() => setDarkMode(!darkMode)} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', backgroundColor: '#718093', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>
      {semesters.map((semester, semIndex) => (
        <div key={semIndex} style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: cardColor, borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Semester {semIndex + 1}</h2>
            <button onClick={() => removeSemester(semIndex)} style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
          </div>
          {semester.subjects.map((subject, subjIndex) => (
            <div key={subjIndex} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                placeholder="Subject Name"
                value={subject.name}
                onChange={(e) => handleSubjectChange(semIndex, subjIndex, 'name', e.target.value)}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <input
                type="number"
                placeholder="Marks"
                value={subject.marks}
                onChange={(e) => handleSubjectChange(semIndex, subjIndex, 'marks', e.target.value)}
                style={{ width: '100px', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <input
                type="number"
                placeholder="Credits"
                value={subject.credits}
                onChange={(e) => handleSubjectChange(semIndex, subjIndex, 'credits', e.target.value)}
                style={{ width: '100px', padding: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <button onClick={() => removeSubject(semIndex, subjIndex)} style={{ background: 'none', color: '#c0392b', border: 'none', cursor: 'pointer' }}>❌</button>
            </div>
          ))}
          <button onClick={() => addSubject(semIndex)} style={{ marginTop: '0.5rem', color: '#2980b9', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}>+ Add Subject</button>
          <p style={{ marginTop: '0.75rem', fontWeight: '500', fontSize: '1.1rem' }}>SGPA: <strong>{calculateSGPA(semester.subjects)}</strong></p>
          <p>Total Credits: <strong>{semester.subjects.reduce((acc, curr) => acc + (parseFloat(curr.credits) || 0), 0)}</strong></p>
        </div>
      ))}

      <button onClick={addSemester} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: '#34495e', color: 'white', fontWeight: '600', marginBottom: '1rem', cursor: 'pointer', marginRight: '1rem' }}>
        ➕ Add Semester
      </button>

      <button onClick={resetAll} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: '#e74c3c', color: 'white', fontWeight: '600', marginBottom: '1rem', cursor: 'pointer' }}>
        🔄 Reset All
      </button>

      <div style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '1rem' }}>📌 CGPA: {calculateCGPA()}</div>
    </div>
  );
}
