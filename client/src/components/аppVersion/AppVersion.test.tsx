import { render, screen, waitFor, act } from '@testing-library/react';
import AppVersion from './AppVersion';

beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
        text: jest.fn().mockResolvedValue('v1.0.0'),
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

test("renders app version", async () => {
    await act(async () => {
        render(<AppVersion />);
    });

    await waitFor(() => {
        expect(screen.getByText(/v1.0.0/)).toBeInTheDocument();
    });
});
