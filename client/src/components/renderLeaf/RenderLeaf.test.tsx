import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { RenderLeaf } from "./RenderLeaf";
import { Item } from "../../interfaces/Interfaces";

describe("RenderLeaf component", () => {
    const mockHandleSelectItem = jest.fn();

    const item: Item[] = [
        { name: "Item1", children: [] },
        { name: "Item2", children: [] },
        { name: "Item3", children: [] }
    ];

    const renderComponent = ({
        singleItem = null,
        disableBtn = false,
    }: {
        singleItem?: Item | null;
        disableBtn?: boolean;
    } = {}) => {
        return render(
            <RenderLeaf
                items={item}
                singleItem={singleItem}
                disableBtn={disableBtn}
                handleSelectItem={mockHandleSelectItem}
            />
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('render all item as buttons', () => {
        renderComponent();

        item.forEach((child) => {
            expect(screen.getByText(child.name)).toBeInTheDocument();
        });
    });

    test('disable buttons when disableBtn is true', () => {
        renderComponent({ disableBtn: true });

        item.forEach((child) => {
            expect(screen.getByText(child.name)).toBeDisabled();
        });
    });

    test('applies "selected" class to the selected item', () => {
        renderComponent({ singleItem: item[1] });

        expect(screen.getByText('Item2')).toHaveClass("selected");
        expect(screen.getByText('Item1')).toHaveClass("not-selected");
    });

    test('clicking button calls handleSelectItem with correct item', () => {
        renderComponent();

        fireEvent.click(screen.getByText('Item3'));

        expect(mockHandleSelectItem).toHaveBeenCalledTimes(1);
        expect(mockHandleSelectItem).toHaveBeenCalledWith(item[2]);
    });

});