import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Breadcrumb from "./Breadcrumb";
import { Item } from "../../interfaces/Interfaces";

describe("Breadcrumbs component", () => {
  const mockSetParents = jest.fn();
  const mockSetSingleItem = jest.fn();

  const parents: Item[] = [
    { name: "Parent1", children: [] },
    { name: "Parent2", children: [] },
  ];

  const singleItem: Item = { name: "SingleItem", children: [] };

  // Функція для рендеру з дефолтними параметрами, можна підміняти пропси
  const renderComponent = (props = {}) => {
    return render(
      <Breadcrumb
        timeIsRuning={false}
        parents={parents}
        setParents={mockSetParents}
        singleItem={null}
        setSingleItem={mockSetSingleItem}
        {...props}
      />
    );
  };

  beforeEach(() => {
    mockSetParents.mockClear();
    mockSetSingleItem.mockClear();
  });

  test("renders parents correctly", () => {
    renderComponent();

    expect(screen.getByText("Parent1")).toBeInTheDocument();
    expect(screen.getByText("Parent2")).toBeInTheDocument();
  });

  test("adds singleItem if not in parents", () => {
    renderComponent({ singleItem });

    expect(screen.getByText("SingleItem")).toBeInTheDocument();
  });

  test("does not add singleItem if already in parents", () => {
    renderComponent({ parents: [...parents, singleItem], singleItem });

    const matches = screen.getAllByText("SingleItem");
    expect(matches.length).toBe(1);
  });

  test("click on first breadcrumb blocked if timeIsRuning is false", () => {
    renderComponent();

    const firstBreadcrumb = screen.getByText("Parent1");
    fireEvent.click(firstBreadcrumb);

    expect(mockSetParents).not.toHaveBeenCalled();
    expect(mockSetSingleItem).not.toHaveBeenCalled();
  });

  test("click on breadcrumb calls setParents and setSingleItem correctly", () => {
    renderComponent({ timeIsRuning: true });

    const secondBreadcrumb = screen.getByText("Parent2");
    fireEvent.click(secondBreadcrumb);

    expect(mockSetParents).toHaveBeenCalledTimes(1);
    expect(mockSetSingleItem).toHaveBeenCalledWith(null);

    const prevState = [...parents, { name: "Extra" } as Item];
    const updateFn = mockSetParents.mock.calls[0][0];
    const newState = updateFn(prevState);

    expect(newState).toEqual(parents.slice(0, 2));
  });
});
