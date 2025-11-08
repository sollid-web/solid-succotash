import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FlipVisaCard from '../FlipVisaCard';

describe('FlipVisaCard', () => {
  it('renders the card with front side visible initially', () => {
    render(<FlipVisaCard />);
    
    // Check for front side content
    expect(screen.getByText('WOLVCAPITAL LTD')).toBeInTheDocument();
    expect(screen.getByText('Premium Banking')).toBeInTheDocument();
    expect(screen.getByText('4532 **** **** 7891')).toBeInTheDocument();
    expect(screen.getByText('Card Holder')).toBeInTheDocument();
    expect(screen.getByText('12/28')).toBeInTheDocument();
  });

  it('flips the card when clicked', () => {
    render(<FlipVisaCard />);
    
    const cardButton = screen.getByRole('button', { name: /click to flip card to back/i });
    
    // Initially shows front side
    expect(screen.getByText('WOLVCAPITAL LTD')).toBeInTheDocument();
    
    // Click to flip
    fireEvent.click(cardButton);
    
    // Check that aria-label changed to indicate back side is showing
    expect(screen.getByRole('button', { name: /click to flip card to front/i })).toBeInTheDocument();
  });

  it('toggles flip state on multiple clicks', () => {
    render(<FlipVisaCard />);
    
    const cardButton = screen.getByRole('button');
    
    // First click - flip to back
    fireEvent.click(cardButton);
    expect(screen.getByRole('button', { name: /click to flip card to front/i })).toBeInTheDocument();
    
    // Second click - flip to front
    fireEvent.click(cardButton);
    expect(screen.getByRole('button', { name: /click to flip card to back/i })).toBeInTheDocument();
    
    // Third click - flip to back again
    fireEvent.click(cardButton);
    expect(screen.getByRole('button', { name: /click to flip card to front/i })).toBeInTheDocument();
  });

  it('flips the card when Enter key is pressed', () => {
    render(<FlipVisaCard />);
    
    const cardButton = screen.getByRole('button', { name: /click to flip card to back/i });
    
    // Press Enter key
    fireEvent.keyDown(cardButton, { key: 'Enter', code: 'Enter' });
    
    // Check that card flipped
    expect(screen.getByRole('button', { name: /click to flip card to front/i })).toBeInTheDocument();
  });

  it('flips the card when Space key is pressed', () => {
    render(<FlipVisaCard />);
    
    const cardButton = screen.getByRole('button', { name: /click to flip card to back/i });
    
    // Press Space key
    fireEvent.keyDown(cardButton, { key: ' ', code: 'Space' });
    
    // Check that card flipped
    expect(screen.getByRole('button', { name: /click to flip card to front/i })).toBeInTheDocument();
  });

  it('does not flip when other keys are pressed', () => {
    render(<FlipVisaCard />);
    
    const cardButton = screen.getByRole('button', { name: /click to flip card to back/i });
    
    // Press different keys
    fireEvent.keyDown(cardButton, { key: 'a', code: 'KeyA' });
    fireEvent.keyDown(cardButton, { key: 'Escape', code: 'Escape' });
    
    // Check that card is still showing front (aria-label unchanged)
    expect(screen.getByRole('button', { name: /click to flip card to back/i })).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<FlipVisaCard />);
    
    const cardButton = screen.getByRole('button');
    
    expect(cardButton).toHaveAttribute('tabIndex', '0');
    expect(cardButton).toHaveAttribute('role', 'button');
    expect(cardButton).toHaveAttribute('aria-label');
  });

  it('renders back side content', () => {
    render(<FlipVisaCard />);
    
    // Flip to back
    const cardButton = screen.getByRole('button');
    fireEvent.click(cardButton);
    
    // Check for back side content
    expect(screen.getByText('Security Code')).toBeInTheDocument();
    expect(screen.getByText('See above')).toBeInTheDocument();
    expect(screen.getByText('For customer service:')).toBeInTheDocument();
    expect(screen.getByText('support@wolvcapital.com')).toBeInTheDocument();
    expect(screen.getByText('wolvcapital.com')).toBeInTheDocument();
  });

  it('applies cursor-pointer class for interactivity', () => {
    const { container } = render(<FlipVisaCard />);
    
    const cardContainer = container.querySelector('.cursor-pointer');
    expect(cardContainer).toBeInTheDocument();
  });
});
