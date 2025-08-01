import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CurrentCategory from "./CurrentCategory";
import { Item } from "../../interfaces/Interfaces";

describe("CurrentCategory component", () => {
  const mockSetParents = jest.fn();
  const mockSetButtonsLoad = jest.fn();
  const mockSetSingleItem = jest.fn();

  const parents: Item[] = [
    { name: "Parent1", children: [] },
    { name: "Parent2", children: [] },
  ];

  const renderComponent = (props = {}) => {
    return render(
      <CurrentCategory
        timeIsRuning={false}
        parents={parents}
        setParents={mockSetParents}
        setButtonsLoad={mockSetButtonsLoad}
        setSingleItem={mockSetSingleItem}
        {...props}
      />
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('render current parent name', () => {
    renderComponent();

    expect(screen.getByText(/Current: Parent1/i)).toBeInTheDocument();
  });

  test('click does nothing when timeIsRuning is false', () => {
    renderComponent();

    const currentText = screen.getByText(/Current: Parent1/i);
    fireEvent.click(currentText);

    expect(mockSetParents).not.toHaveBeenCalled();
    expect(mockSetButtonsLoad).not.toHaveBeenCalled();
    expect(mockSetSingleItem).not.toHaveBeenCalled();
  });

  test('click calls setters and resets state when timeIsRuning is true', () => {
    renderComponent({ timeIsRuning: true });

    const currentText = screen.getByText(/Current: Parent1/i);
    fireEvent.click(currentText);

    expect(mockSetParents).toHaveBeenCalledWith([]);
    expect(mockSetButtonsLoad).toHaveBeenCalledWith(false);
    expect(mockSetSingleItem).toHaveBeenCalledWith(null);
  });
});