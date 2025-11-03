import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../components/Button";

describe("Button", () => {
  it("renders children and responds to click", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    expect(screen.getByText("Click me")).toBeTruthy();

    await userEvent.click(screen.getByText("Click me"));
    expect(onClick).toHaveBeenCalled();
  });
});
