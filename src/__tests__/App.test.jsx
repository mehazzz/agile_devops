import { render, screen } from "@testing-library/react";
import About from "../pages/About";
import { expect, describe, it } from "vitest";

describe("About Page", () => {
  it("renders About page content", () => {
    render(<About />);
    const heading = screen.getByText("About Us");
    const paragraph = screen.getByText(/track their learning progress/i);
    expect(heading).to.not.be.null;
    expect(paragraph).to.not.be.null;
  });
});
