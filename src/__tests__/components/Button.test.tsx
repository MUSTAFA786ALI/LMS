/**
 * Tests for Button Component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from '@/src/components/ui/Button';

describe('Button Component', () => {
  it('should render with label', () => {
    render(<Button label="Test Button" onPress={jest.fn()} />);

    expect(screen.getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    render(<Button label="Click me" onPress={mockOnPress} />);

    const button = screen.getByRole('button');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalled();
  });

  it('should support different variants', () => {
    const { rerender } = render(
      <Button label="Primary" onPress={jest.fn()} variant="primary" />
    );
    expect(screen.getByText('Primary')).toBeTruthy();

    rerender(<Button label="Secondary" onPress={jest.fn()} variant="secondary" />);
    expect(screen.getByText('Secondary')).toBeTruthy();

    rerender(<Button label="Danger" onPress={jest.fn()} variant="danger" />);
    expect(screen.getByText('Danger')).toBeTruthy();
  });

  it('should support different sizes', () => {
    const { rerender } = render(
      <Button label="Small" onPress={jest.fn()} size="sm" />
    );
    expect(screen.getByText('Small')).toBeTruthy();

    rerender(<Button label="Medium" onPress={jest.fn()} size="md" />);
    expect(screen.getByText('Medium')).toBeTruthy();

    rerender(<Button label="Large" onPress={jest.fn()} size="lg" />);
    expect(screen.getByText('Large')).toBeTruthy();
  });

  it('should be disabled when isDisabled is true', () => {
    const mockOnPress = jest.fn();
    render(<Button label="Disabled" onPress={mockOnPress} isDisabled={true} />);

    const button = screen.getByRole('button');
    fireEvent.press(button);

    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should show loading state', () => {
    render(<Button label="Loading" onPress={jest.fn()} isLoading={true} />);

    // LoadingSpinner should be visible
    expect(screen.getByTestId('loading-spinner')).toBeTruthy();
  });

  it('should support full width', () => {
    const { getByTestId } = render(
      <Button label="Full Width" onPress={jest.fn()} isFullWidth={true} />
    );

    const button = getByTestId('button-container');
    expect(button.props.style).toContainEqual({ flex: 1 });
  });
});
