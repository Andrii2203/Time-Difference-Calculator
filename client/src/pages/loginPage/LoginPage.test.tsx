import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./LoginPage";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});


const mockOnLoginSuccess = jest.fn();

const renderComponent = () => {
  render(
    <BrowserRouter>
      <LoginPage onLoginSuccess={mockOnLoginSuccess} />
    </BrowserRouter>
  );
};

beforeEach(() => {
  jest.clearAllMocks();

  Object.defineProperty(window, "localStorage", {
    value: {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    },
    writable: true,
  });

  global.fetch = jest.fn();5
});

describe("LoginPage component", () => {
    test("renders inputs and buttons", () => {
        renderComponent();

        expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByText("Login", { selector: "button" } )).toBeInTheDocument();
        expect(screen.getByText("How to use...")).toBeInTheDocument();
    });

    test("allows typing into inputs", () => {
        renderComponent();

        const usernameInput = screen.getByPlaceholderText("Username");
        const passwordInput = screen.getByPlaceholderText("Password");

        fireEvent.change(usernameInput, { target: { value: "user1" } });
        fireEvent.change(passwordInput, { target: { value: "pass1" } });

        expect(usernameInput).toHaveValue("user1");
        expect(passwordInput).toHaveValue("pass1");
    });

    test("successful login calls onLoginSuccess and navigates", async () => {
    (fetch as jest.Mock)
        .mockResolvedValueOnce({
        text: async () => "v1.0.0",
        })
        .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ accessToken: "token123" }),
        });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "admin" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "1234" } });

    fireEvent.click(screen.getByText("Login", { selector: "button" }));

    await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith("accessToken", "token123");
        expect(mockOnLoginSuccess).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/Time-Difference-Calculator", { replace: true });
    });
    });

    test("failed login shows error message", async () => {
    (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ text: async () => "v1.0.0" })
        .mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: "Invalid credentials" }),
        });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "wrong" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByText("Login", { selector: "button" }));

    const errorMessage = await screen.findByRole("alert");
    expect(errorMessage).toHaveTextContent("Invalid credentials");
    });

    test('clicking "How to use..." navigates to source page', () => {
        renderComponent();

        fireEvent.click(screen.getByText("How to use..."));

        expect(mockNavigate).toHaveBeenCalledWith("/Time-Difference-Calculator/sourse", { replace: true });
    });
});
