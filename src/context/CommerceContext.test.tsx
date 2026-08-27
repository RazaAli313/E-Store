import type { JSX } from 'react';

import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

import { render, screen } from '#/tests/utils/test-utils';
import type { ProductListItem } from '#/types/products/product.types';
import { useCommerce } from './CommerceContext';

const product: ProductListItem = {
  id: 1,
  title: 'Test Phone',
  price: 100,
  thumbnail: 'https://example.com/phone.jpg',
  rating: 4.5,
  category: 'smartphones',
  stock: 5,
};

const CommerceHarness = (): JSX.Element => {
  const { addToCart, removeFromCart, toggleWishlist, cartCount, subtotal, isWishlisted } = useCommerce();

  return (
    <main>
      <button type='button' onClick={() => addToCart(product)}>
        Add product
      </button>
      <button type='button' onClick={() => removeFromCart(product.id)}>
        Remove product
      </button>
      <button type='button' onClick={() => toggleWishlist(product.id)}>
        Toggle wishlist
      </button>
      <p>Count: {cartCount}</p>
      <p>Subtotal: {subtotal}</p>
      <p>Wishlisted: {isWishlisted(product.id) ? 'yes' : 'no'}</p>
    </main>
  );
};

describe('CommerceContext', () => {
  it('increments quantity and calculates the subtotal', async () => {
    const user = userEvent.setup();
    render(<CommerceHarness />);

    await user.click(screen.getByRole('button', { name: 'Add product' }));
    await user.click(screen.getByRole('button', { name: 'Add product' }));

    expect(screen.getByText('Count: 2')).toBeInTheDocument();
    expect(screen.getByText('Subtotal: 200')).toBeInTheDocument();
  });

  it('removes a product from the cart', async () => {
    const user = userEvent.setup();
    render(<CommerceHarness />);

    await user.click(screen.getByRole('button', { name: 'Add product' }));
    await user.click(screen.getByRole('button', { name: 'Remove product' }));

    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  it('toggles wishlist membership', async () => {
    const user = userEvent.setup();
    render(<CommerceHarness />);

    await user.click(screen.getByRole('button', { name: 'Toggle wishlist' }));
    expect(screen.getByText('Wishlisted: yes')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<CommerceHarness />);
    expect(await axe(container, { rules: { 'color-contrast': { enabled: false } } })).toHaveNoViolations();
  });
});
