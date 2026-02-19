import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders EventFinder heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/EventFinder/i);
  expect(headingElement).toBeInTheDocument();
});
