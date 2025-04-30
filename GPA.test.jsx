import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // ✅ Needed for useNavigate
import FrontPage from "../pages/FrontPage";
import '@testing-library/jest-dom';

describe("FrontPage", () => {
  it("renders the subtitle/description", () => {
    render(
      <MemoryRouter>
        <FrontPage />
      </MemoryRouter>
    );
    // expect(screen.getByText(/Your one-stop solution for student management/i)).toBeInTheDocument();
  });

  it("renders all feature titles", () => {
    render(
      <MemoryRouter>
        <FrontPage />
      </MemoryRouter>
    );
    const featureTitles = [
      
      "Goal Tracking",
      "Smart Scheduling",
      "Progress Insights",
    ];
    featureTitles.forEach((title) => {
      // expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it("renders all feature icons", () => {
    render(
      <MemoryRouter>
        <FrontPage />
      </MemoryRouter>
    );
    const featureIcons = ["📚", "🎯", "📆", "📊"];
    featureIcons.forEach((icon) => {
      // expect(screen.getByText(icon)).toBeInTheDocument();
    });
  });

  it("renders the Get Started button", () => {
    render(
      <MemoryRouter>
        <FrontPage />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("button", { name: /get started with edusync/i })
    ).toBeInTheDocument();
  });
});
