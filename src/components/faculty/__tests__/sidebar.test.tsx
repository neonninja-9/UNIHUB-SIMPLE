import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FacultySidebar } from "../sidebar";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

const mockUsePathname = vi.mocked(require("next/navigation").usePathname);

describe("FacultySidebar", () => {
  const defaultProps = {
    isOpen: true,
    onToggle: vi.fn(),
  };

  beforeEach(() => {
    mockUsePathname.mockReturnValue("/teacher/dashboard");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the sidebar with Faculty Portal title", () => {
    render(<FacultySidebar {...defaultProps} />);
    expect(screen.getByText("Faculty Portal")).toBeTruthy();
  });

  it("renders all menu sections", () => {
    render(<FacultySidebar {...defaultProps} />);
    expect(screen.getByText("Main")).toBeTruthy();
    expect(screen.getByText("Academics")).toBeTruthy();
    expect(screen.getByText("Attendance Management")).toBeTruthy();
    expect(screen.getByText("Library & Resources")).toBeTruthy();
    expect(screen.getByText("R&D and Case Study")).toBeTruthy();
    expect(screen.getByText("Extra Sections")).toBeTruthy();
  });

  it("renders menu items with correct text", () => {
    render(<FacultySidebar {...defaultProps} />);
    expect(screen.getByText("🏠 Home")).toBeTruthy();
    expect(screen.getByText("Dashboard")).toBeTruthy();
    expect(screen.getByText("LMS (Learning Management System)")).toBeTruthy();
    expect(screen.getByText("Edit Attendance")).toBeTruthy();
    expect(screen.getByText("📅 Calendar")).toBeTruthy();
  });

  it("highlights active route", () => {
    render(<FacultySidebar {...defaultProps} />);
    const activeLink = screen.getByText("Dashboard");
    expect(activeLink.closest("a")?.className).toContain("bg-blue-600");
  });

  it("calls onToggle when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<FacultySidebar {...defaultProps} />);
    const closeButton = screen.getByRole("button");
    await user.click(closeButton);
    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
  });

  it("applies correct CSS classes for dark theme", () => {
    render(<FacultySidebar {...defaultProps} />);
    const sidebar = screen.getByRole("complementary");
    expect(sidebar.className).toContain("bg-slate-900");
  });

  it("renders with correct structure when closed", () => {
    render(<FacultySidebar {...defaultProps} isOpen={false} />);
    const sidebar = screen.getByRole("complementary");
    expect(sidebar.className).toContain("-translate-x-full");
  });

  it("renders mobile backdrop when open", () => {
    render(<FacultySidebar {...defaultProps} />);
    const backdrop = document.querySelector(".bg-black.bg-opacity-50");
    expect(backdrop).toBeTruthy();
  });

  it("does not render mobile backdrop when closed", () => {
    render(<FacultySidebar {...defaultProps} isOpen={false} />);
    const backdrop = document.querySelector(".bg-black.bg-opacity-50");
    expect(backdrop).toBeFalsy();
  });
});
