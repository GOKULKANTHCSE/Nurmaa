import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { CartProvider } from '@/context/CartContext';

describe('Header', () => {
  it('renders the logo and navigation links', () => {
    const { getByAltText, getByText } = render(
      <MemoryRouter>
        <CartProvider>
          <Header />
        </CartProvider>
      </MemoryRouter>
    );

    // Check for the logo
    expect(getByAltText('Nurmaa Logo')).toBeInTheDocument();

    // Check for navigation links
    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('About')).toBeInTheDocument();
    expect(getByText('Products')).toBeInTheDocument();
    expect(getByText('Testimonials')).toBeInTheDocument();
    expect(getByText('Cart')).toBeInTheDocument();
    expect(getByText('Contact')).toBeInTheDocument();
  });
});
