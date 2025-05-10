import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState([{ subjects: [{ name: '', marks: '', credits: '' }] }]);
  const [saveStatus, setSaveStatus] = useState('');
  const pdfRef = useRef(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'users', 'user1'); // hardcoded path
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.semesters) {
            setSemesters(data.semesters);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Save data whenever semesters change
  useEffect(() => {
    const saveData = async () => {
      try {
        setSaveStatus('Saving...');
        await setDoc(doc(db, 'users', 'user1'), { semesters });
        setSaveStatus('Saved');
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (error) {
        console.error('Error saving data:', error);
        setSaveStatus('Error saving data');
      }
    };
    saveData();
  }, [semesters]);

  const handleSubjectChange = (semIndex, subjIndex, field, value) => {
    const updated = [...semesters];
    updated[semIndex].subjects[subjIndex][field] = value;
    setSemesters(updated);
  };

  const addSemester = () => {
    setSemesters([...semesters, { subjects: [{ name: '', marks: '', credits: '' }] }]);
  };

  const removeSemester = (index) => {
    const updated = semesters.filter((_, i) => i !== index);
    setSemesters(updated.length ? updated : [{ subjects: [{ name: '', marks: '', credits: '' }] }]);
  };

  const addSubject = (semIndex) => {
    const updated = [...semesters];
    updated[semIndex].subjects.push({ name: '', marks: '', credits: '' });
    setSemesters(updated);
  };

  const removeSubject = (semIndex, subjIndex) => {
    const updated = [...semesters];
    updated[semIndex].subjects = updated[semIndex].subjects.filter((_, i) => i !== subjIndex);
    if (updated[semIndex].subjects.length === 0) {
      updated[semIndex].subjects.push({ name: '', marks: '', credits: '' });
    }
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
    let totalGradePoints = 0;
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

          totalGradePoints += gradePoint * credits;
          totalCredits += credits;
        }
      });
    });

    return totalCredits ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
  };

  const resetAll = () => {
    setSemesters([{ subjects: [{ name: '', marks: '', credits: '' }] }]);
  };

  const generatePDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('marksheet.pdf');
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">GPA Calculator</h1>
        <div className="mb-4 text-sm text-gray-600">{saveStatus}</div>

        <div ref={pdfRef}>
          {semesters.map((semester, semIndex) => (
            <div key={semIndex} className="mb-6 p-4 bg-white rounded shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Semester {semIndex + 1}</h2>
                <button
                  onClick={() => removeSemester(semIndex)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove Semester
                </button>
              </div>
              {semester.subjects.map((subject, subjIndex) => (
                <div key={subjIndex} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <input
                    type="text"
                    placeholder="Subject Name"
                    value={subject.name}
                    onChange={(e) =>
                      handleSubjectChange(semIndex, subjIndex, 'name', e.target.value)
                    }
                    className="p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Marks"
                    value={subject.marks}
                    onChange={(e) =>
                      handleSubjectChange(semIndex, subjIndex, 'marks', e.target.value)
                    }
                    className="p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Credits"
                    value={subject.credits}
                    onChange={(e) =>
                      handleSubjectChange(semIndex, subjIndex, 'credits', e.target.value)
                    }
                    className="p-2 border rounded"
                  />
                  <button
                    onClick={() => removeSubject(semIndex, subjIndex)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => addSubject(semIndex)}
                className="text-blue-600 hover:text-blue-800 text-sm mt-2"
              >
                + Add Subject
              </button>
              <div className="mt-4 text-sm">
                <p>
                  SGPA: <strong>{calculateSGPA(semester.subjects)}</strong>
                </p>
                <p>
                  Total Credits:{' '}
                  <strong>
                    {semester.subjects.reduce((acc, curr) => acc + (parseFloat(curr.credits) || 0), 0)}
                  </strong>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={addSemester}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Semester
          </button>
          <button
            onClick={resetAll}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reset All
          </button>
          <button
            onClick={generatePDF}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download PDF
          </button>
        </div>

        <div className="text-xl font-semibold">
          CGPA: <span className="text-blue-700">{calculateCGPA()}</span>
        </div>
      </div>
    </div>
  );
}
