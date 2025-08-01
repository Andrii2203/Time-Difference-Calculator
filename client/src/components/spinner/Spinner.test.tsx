import React from "react";
import { render } from "@testing-library/react";
import Spinner from "./Spinner";

describe("Spinner Component", () => {
    test("renders spinner container and spinner div", () => {
        const { container } = render(<Spinner />);

        const spinnerContainer = container.querySelector(".spinner-container");
        const spinnerDiv = container.querySelector(".spinner");

        expect(spinnerContainer).toBeInTheDocument();
        expect(spinnerDiv).toBeInTheDocument();
    })

});