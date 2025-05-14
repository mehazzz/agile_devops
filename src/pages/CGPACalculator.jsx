import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState([{ subjects: [{ name: '', marks: '', credits: '' }] }]);
  const pdfRef = useRef(null);

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

  useEffect(() => {
    const saveData = async () => {
      try {
        await setDoc(doc(db, 'users', 'user1'), { semesters });
      } catch (error) {
        console.error('Error saving data:', error);
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
    <div className="min-h-screen p-8 font-sans" style={{ background: "#D3D6DA", color: "#244A65" }}>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-8" style={{ color: "#75352C" }}>GPA Calculator</h1>

        <div ref={pdfRef}>
          {semesters.map((semester, semIndex) => (
            <div
              key={semIndex}
              className="mb-10 p-8 rounded-2xl shadow"
              style={{ background: "#F5F5F5", border: "2px solid #9E5A4A" }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold" style={{ color: "#244A65" }}>
                  Semester {semIndex + 1}
                </h2>
                <button
                  onClick={() => removeSemester(semIndex)}
                  className="text-[#9E5A4A] hover:text-[#75352C] text-lg font-semibold"
                >
                  Remove Semester
                </button>
              </div>
              {semester.subjects.map((subject, subjIndex) => (
                <div key={subjIndex} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                  <input
                    type="text"
                    placeholder="Subject Name"
                    value={subject.name}
                    onChange={(e) =>
                      handleSubjectChange(semIndex, subjIndex, 'name', e.target.value)
                    }
                    className="p-4 text-lg border-2 rounded-lg focus:ring-2 focus:ring-[#244A65] bg-[#D3D6DA] text-[#244A65] border-[#244A65]"
                  />
                  <input
                    type="number"
                    placeholder="Marks"
                    value={subject.marks}
                    onChange={(e) =>
                      handleSubjectChange(semIndex, subjIndex, 'marks', e.target.value)
                    }
                    className="p-4 text-lg border-2 rounded-lg focus:ring-2 focus:ring-[#244A65] bg-[#D3D6DA] text-[#244A65] border-[#244A65]"
                  />
                  <input
                    type="number"
                    placeholder="Credits"
                    value={subject.credits}
                    onChange={(e) =>
                      handleSubjectChange(semIndex, subjIndex, 'credits', e.target.value)
                    }
                    className="p-4 text-lg border-2 rounded-lg focus:ring-2 focus:ring-[#244A65] bg-[#D3D6DA] text-[#244A65] border-[#244A65]"
                  />
                  <button
                    onClick={() => removeSubject(semIndex, subjIndex)}
                    className="text-[#9E5A4A] hover:text-[#75352C] text-lg font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => addSubject(semIndex)}
                className="text-[#244A65] hover:text-[#75352C] text-lg mt-2 font-semibold"
              >
                + Add Subject
              </button>
              <div className="mt-6 text-xl">
                <p>
                  SGPA: <strong style={{ color: "#244A65" }}>{calculateSGPA(semester.subjects)}</strong>
                </p>
                <p>
                  Total Credits:{' '}
                  <strong style={{ color: "#75352C" }}>
                    {semester.subjects.reduce((acc, curr) => acc + (parseFloat(curr.credits) || 0), 0)}
                  </strong>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-6 mb-10">
          <button
            onClick={addSemester}
            className="bg-[#244A65] text-[#D3D6DA] px-8 py-4 rounded-lg text-xl hover:bg-[#75352C] font-bold transition"
          >
            Add Semester
          </button>
          <button
            onClick={resetAll}
            className="bg-[#9E5A4A] text-[#D3D6DA] px-8 py-4 rounded-lg text-xl hover:bg-[#75352C] font-bold transition"
          >
            Reset All
          </button>
          <button
            onClick={generatePDF}
            className="bg-[#75352C] text-[#D3D6DA] px-8 py-4 rounded-lg text-xl hover:bg-[#244A65] font-bold transition"
          >
            Download PDF
          </button>
        </div>

        <div className="text-3xl font-semibold">
          CGPA: <span style={{ color: "#244A65" }}>{calculateCGPA()}</span>
        </div>
      </div>
    </div>
  );
}
