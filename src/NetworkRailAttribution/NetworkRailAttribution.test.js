import React from 'react';
import { render, screen } from '@testing-library/react';
import NetworkRailAttribution from './NetworkRailAttribution';

jest.mock('../assets/network_rail.png', () => 'test-file-stub');

describe('NetworkRailAttribution', () => {
    it('renders the component correctly', () => {
        render(<NetworkRailAttribution />);

        expect(screen.getByText('Data Provided By')).toBeInTheDocument();

        const image = screen.getByAltText('Network Rail Logo');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'test-file-stub');
        expect(image).toHaveClass('h-12 mx-auto');
    });
});