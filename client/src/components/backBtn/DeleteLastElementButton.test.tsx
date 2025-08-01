import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DeleteLastElementButton } from "./DeleteLastElementButton";
import { Item } from "../../interfaces/Interfaces";

test("renders DeleteLastElementButton and handles click", () => {
  const mockSetParents = jest.fn();
  const mockSetSingleItem = jest.fn();

  render(
    <DeleteLastElementButton
      setParents={mockSetParents}
      setSingleItem={mockSetSingleItem}
    />
  );

  const button = screen.getByText(/back/i);
  fireEvent.click(button);

  expect(typeof mockSetParents.mock.calls[0][0]).toBe('function');

  const prevState = [1, 2, 3];
  const updateState = mockSetParents.mock.calls[0][0](prevState);
  expect(updateState).toEqual([1, 2]);

  expect(mockSetSingleItem).toHaveBeenCalledWith(null);

});