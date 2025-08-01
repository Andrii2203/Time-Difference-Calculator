import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SourcePage from "./SourcePage";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderComponent = () => {
  render(
    <BrowserRouter>
      <SourcePage />
    </BrowserRouter>
  );
};

describe("SourcePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("рендерить заголовок, текст, кнопку та AppVersion", () => {
    renderComponent();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("How to use");
    expect(screen.getByText("This is simple guide on how to use this application")).toBeInTheDocument();
    expect(screen.getByText("Welcome to Sourse page!")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /login/i });
    expect(button).toBeInTheDocument();

  });

  test("натискання кнопки викликає navigate з правильним шляхом", () => {
    renderComponent();

    const button = screen.getByRole("button", { name: /login/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/Time-Difference-Calculator/login", { replace: true });
  });
});
