import React, { useState, useEffect, useRef } from "react";

export default function PomodoroTimer() {
  const MAX_FOCUS_MIN = 90;
  const MAX_BREAK_MIN = 30;

  const [focusInput, setFocusInput] = useState("25");
  const [breakInput, setBreakInput] = useState("5");
  const [seconds, setSeconds] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  const intervalRef = useRef(null);

  const getValidTime = (value, max) => {
    let num = parseInt(value);
    if (isNaN(num)) return null;
    if (num > max) return max;
    if (num < 1) return 1;
    return num;
  };

  const focusDurationSec = getValidTime(focusInput, MAX_FOCUS_MIN) * 60;
  const breakDurationSec = getValidTime(breakInput, MAX_BREAK_MIN) * 60;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("timerState"));
    if (saved) {
      const { startTime, duration, isBreak: savedIsBreak, isActive: savedIsActive } = saved;
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = duration - elapsed;
      if (remaining > 0 && savedIsActive) {
        setSeconds(remaining);
        setIsBreak(savedIsBreak);
        setIsActive(true);
      } else {
        handleSessionComplete(savedIsBreak);
      }
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      localStorage.setItem(
        "timerState",
        JSON.stringify({
          startTime: Date.now(),
          duration: seconds,
          isBreak,
          isActive: true,
        })
      );
    } else {
      localStorage.removeItem("timerState");
    }
  }, [isActive, seconds, isBreak]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            handleSessionComplete(isBreak);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  const handleSessionComplete = (currentIsBreak) => {
    if (!currentIsBreak) {
      setPomodoroCount((prev) => prev + 1);
    }

    const nextIsBreak = !currentIsBreak;
    setIsBreak(nextIsBreak);
    const duration = nextIsBreak ? breakDurationSec : focusDurationSec;
    setSeconds(duration);
    setIsActive(false);
  };

  const handleFocusInput = (e) => {
    const raw = e.target.value;
    setFocusInput(raw);
    if (raw === "") return;
    const valid = getValidTime(raw, MAX_FOCUS_MIN);
    if (valid !== null) {
      if (parseInt(raw) !== valid) setFocusInput(valid.toString());
      if (!isBreak) setSeconds(valid * 60);
    }
  };

  const handleBreakInput = (e) => {
    const raw = e.target.value;
    setBreakInput(raw);
    if (raw === "") return;
    const valid = getValidTime(raw, MAX_BREAK_MIN);
    if (valid !== null) {
      if (parseInt(raw) !== valid) setBreakInput(valid.toString());
      if (isBreak) setSeconds(valid * 60);
    }
  };

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // Colors from palette:
  // #75352C, #9E5A4A, #D3D6DA, #244A65, #172834

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 px-8
        ${isBreak ? "bg-[#244A65]" : "bg-[#75352C]"} text-[#D3D6DA]`}
    >
      <h1 className="text-7xl font-extrabold mb-8 tracking-wide text-[#D3D6DA]">Pomodoro Timer</h1>
      <h2 className={`text-5xl mb-6 font-bold ${isBreak ? "text-[#D3D6DA]" : "text-[#9E5A4A]"}`}>
        {isBreak ? "Break Time" : "Focus Time"}
      </h2>
      <div className="text-[8rem] font-mono mb-10 drop-shadow-lg text-[#D3D6DA]">{formatTime(seconds)}</div>

      <div className="flex gap-10 mb-12 flex-wrap justify-center">
        <button
          onClick={() => setIsActive((prev) => !prev)}
          className="bg-[#9E5A4A] hover:bg-[#75352C] text-[#D3D6DA] px-12 py-6 rounded-2xl transition-colors text-4xl font-bold shadow-lg"
        >
          {isActive ? "Pause" : "Start"}
        </button>
        <button
          onClick={() => {
            setIsActive(false);
            const duration = isBreak
              ? getValidTime(breakInput, MAX_BREAK_MIN)
              : getValidTime(focusInput, MAX_FOCUS_MIN);
            if (duration !== null) setSeconds(duration * 60);
          }}
          className="bg-[#D3D6DA] hover:bg-[#9E5A4A] text-[#244A65] px-12 py-6 rounded-2xl transition-colors text-4xl font-bold shadow-lg border-2 border-[#244A65]"
        >
          Reset
        </button>
        <button
          onClick={() => {
            const next = !isBreak;
            setIsBreak(next);
            const duration = next
              ? getValidTime(breakInput, MAX_BREAK_MIN)
              : getValidTime(focusInput, MAX_FOCUS_MIN);
            if (duration !== null) {
              setSeconds(duration * 60);
            }
            setIsActive(false);
          }}
          className="bg-[#244A65] hover:bg-[#172834] text-[#D3D6DA] px-12 py-6 rounded-2xl transition-colors text-4xl font-bold shadow-lg"
        >
          Switch
        </button>
      </div>

      <div className="flex gap-12 mb-12 flex-wrap justify-center">
        <label className="text-[#D3D6DA] font-bold text-3xl flex items-center gap-4">
          Focus (1–90):
          <input
            type="number"
            value={focusInput}
            onChange={handleFocusInput}
            placeholder="e.g. 25"
            className="ml-4 p-4 w-32 rounded-lg border-2 border-[#D3D6DA] text-[#244A65] text-2xl font-bold bg-white bg-opacity-30"
          />
        </label>
        <label className="text-[#D3D6DA] font-bold text-3xl flex items-center gap-4">
          Break (1–30):
          <input
            type="number"
            value={breakInput}
            onChange={handleBreakInput}
            placeholder="e.g. 5"
            className="ml-4 p-4 w-32 rounded-lg border-2 border-[#D3D6DA] text-[#244A65] text-2xl font-bold bg-white bg-opacity-30"
          />
        </label>
      </div>

      <div className="text-4xl font-extrabold text-[#D3D6DA] drop-shadow-lg">
        Pomodoros Completed: {pomodoroCount}
      </div>
    </div>
  );
}
