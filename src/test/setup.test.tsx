import React from "react";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test("testing framework is properly configured", () => {
  expect(true).toBe(true);
});

test("React Testing Library is working", () => {
  render(<div data-testid="test-element">Hello Test</div>);
  const element = screen.getByTestId("test-element");
  expect(element).toBeInTheDocument();
  expect(element).toHaveTextContent("Hello Test");
});
