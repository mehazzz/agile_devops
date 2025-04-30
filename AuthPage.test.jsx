import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PomodoroTimer from "../pages/PomodoroTimer";
import '@testing-library/jest-dom';


describe("PomodoroTimer", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <PomodoroTimer />
      </MemoryRouter>
    );
  });

  it("renders the title", () => {
    expect(screen.getByText("Pomodoro Timer")).toBeInTheDocument();
  });

  it("renders the timer display", () => {
    // Initial 25 minutes = 1500 seconds => 25:00
    expect(screen.getAllByText(/25:00/)[0]).toBeInTheDocument();
  });

  it("renders Start button", () => {
    expect(screen.getByText("Start")).toBeInTheDocument();
  });

  it("renders Reset button", () => {
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("renders Switch to Break button", () => {
    expect(screen.getByText("Switch to Break")).toBeInTheDocument();
  });

  it("renders input field and Add button", () => {
    expect(screen.getByPlaceholderText("Add a task...")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("renders Auto Mode toggle", () => {
    expect(screen.getByText("Auto Mode")).toBeInTheDocument();
  });

  it("renders completed pomodoro count", () => {
    expect(screen.getByText("Pomodoros Completed: 0")).toBeInTheDocument();
  });

  it("renders View Calendar link", () => {
    const link = screen.getByRole("link", { name: "View Calendar" });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("href")).toBe("/calendar");
  });

  it("renders bottom timer badge", () => {
    expect(screen.getAllByText(/25:00/)[1]).toBeInTheDocument();
  });
});
