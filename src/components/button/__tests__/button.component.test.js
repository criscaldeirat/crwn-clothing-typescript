import { render, screen } from "@testing-library/react";
import Button, { BUTTON_TYPE_CLASSES } from "../button.component";

describe('button tests', () => {
    test('should render base button when nothing passes', () => {
        render(<Button buttonType={BUTTON_TYPE_CLASSES.base} />);

        const buttonElement = screen.getByRole('button');
        expect (buttonElement).toHaveStyle('background-color: black');
    });

    test('should render google button when google type passes', () => {
        render(<Button buttonType={BUTTON_TYPE_CLASSES.google} />);

        const buttonGoogleElement = screen.getByRole('button');
        expect (buttonGoogleElement).toHaveStyle('background-color: #4285f4');
    });

    test('should render inverted button when inverted type passes', () => {
        render(<Button buttonType={BUTTON_TYPE_CLASSES.inverted} />);

        const buttonInvertedElement = screen.getByRole('button');
        expect (buttonInvertedElement).toHaveStyle('background-color: white')
    });

    test('should be disable if loading is true', () => {
        render(<Button isLoading={true} />);

        const buttonElement = screen.getByRole('button');
        expect(buttonElement).toBeDisabled();
    })
});
