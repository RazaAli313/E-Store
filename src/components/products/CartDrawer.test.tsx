import userEvent from '@testing-library/user-event';
import { expect, vi } from 'vitest';
import { axe } from 'vitest-axe';

import { render, screen } from '#/tests/utils/test-utils';
import CartDrawer from './CartDrawer';

describe('CartDrawer', () => {
  it('moves focus inside when opened', () => {
    render(<CartDrawer isOpen onClose={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Close cart' })).toHaveFocus();
  });

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CartDrawer isOpen onClose={onClose} />);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('has no accessibility violations while open', async () => {
    const { container } = render(<CartDrawer isOpen onClose={vi.fn()} />);
    expect(await axe(container, { rules: { 'color-contrast': { enabled: false } } })).toHaveNoViolations();
  });
});
