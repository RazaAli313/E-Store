import type { JSX } from 'react';
import { useEffect, useRef } from 'react';

import { ShoppingBag, X } from 'lucide-react';
import { toast } from 'react-toastify';

import { useCommerce } from '#/context';
import { formatPrice, getSafeImageUrl } from '#/hooks/products/helpers';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps): JSX.Element | null => {
  const { cartItems, cartCount, subtotal, removeFromCart } = useCommerce();
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !drawerRef.current) return;

      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, select, textarea')
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const checkout = () => {
    if (cartItems.length === 0) return;
    toast.success('Demo checkout started. No payment will be taken.');
  };

  return (
    <div className='fixed inset-0 z-50' role='dialog' aria-modal='true' aria-labelledby='cart-title'>
      <button
        type='button'
        tabIndex={-1}
        aria-hidden='true'
        onClick={onClose}
        className='absolute inset-0 bg-gray-950/45'
      />
      <aside
        ref={drawerRef}
        className='absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl'
      >
        <div className='flex items-center justify-between border-b border-gray-200 px-5 py-5'>
          <h2 id='cart-title' className='text-xl font-extrabold text-gray-950'>
            Your cart ({cartCount})
          </h2>
          <button
            ref={closeButtonRef}
            type='button'
            onClick={onClose}
            aria-label='Close cart'
            className='rounded-lg p-2 text-gray-500 outline-none transition hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-indigo-600'
          >
            <X className='h-5 w-5' aria-hidden='true' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto px-5'>
          {cartItems.length === 0 ? (
            <div className='grid h-full place-content-center justify-items-center px-6 text-center'>
              <span className='grid h-14 w-14 place-items-center rounded-full bg-indigo-50 text-indigo-600'>
                <ShoppingBag className='h-6 w-6' aria-hidden='true' />
              </span>
              <h3 className='mt-4 font-bold text-gray-900'>Your cart is empty</h3>
              <p className='mt-1 text-sm text-gray-500'>Open a product to add it to your cart.</p>
            </div>
          ) : (
            <ul>
              {cartItems.map(({ product, quantity }) => {
                const imageUrl = getSafeImageUrl(product.thumbnail);
                return (
                  <li key={product.id} className='flex gap-4 border-b border-gray-200 py-5'>
                    <div className='h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100'>
                      {imageUrl && <img src={imageUrl} alt='' className='h-full w-full object-cover' />}
                    </div>
                    <div className='min-w-0 flex-1'>
                      <h3 className='truncate font-bold text-gray-900'>{product.title}</h3>
                      <p className='mt-1 text-sm text-gray-500'>
                        {formatPrice(product.price)} × {quantity}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='font-extrabold text-gray-950'>{formatPrice(product.price * quantity)}</p>
                      <button
                        type='button'
                        onClick={() => removeFromCart(product.id)}
                        className='mt-2 rounded text-sm font-semibold text-red-600 outline-none hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-500'
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className='border-t border-gray-200 bg-white p-5'>
          <div className='flex items-center justify-between text-lg'>
            <span className='font-medium text-gray-700'>Subtotal</span>
            <strong className='text-gray-950'>{formatPrice(subtotal)}</strong>
          </div>
          <button
            type='button'
            onClick={checkout}
            disabled={cartItems.length === 0}
            className='mt-4 w-full rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white outline-none transition hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
          >
            Checkout
          </button>
          <p className='mt-2 text-center text-xs text-gray-500'>Demo checkout — no real payment is taken.</p>
        </div>
      </aside>
    </div>
  );
};

export default CartDrawer;
