import type { JSX, ReactNode } from 'react';
import { useCallback, useState } from 'react';

import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ROUTES } from '#/constants';
import { useCommerce } from '#/context';
import CartDrawer from './CartDrawer';

interface StoreHeaderProps {
  children?: ReactNode;
}

const StoreHeader = ({ children }: StoreHeaderProps): JSX.Element => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCommerce();
  const openCart = () => setIsCartOpen(true);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  return (
    <>
      <div className='bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1.5 text-center text-xs font-medium tracking-wide text-white'>
        Find something worth keeping.
      </div>
      <header className='sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm'>
        <div className='mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6'>
          <Link
            to={ROUTES.HOME}
            className='flex items-center gap-2.5 rounded-lg text-lg font-extrabold text-gray-900 outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2'
          >
            <span className='grid h-8 w-8 place-items-center rounded-[9px] bg-gradient-to-br from-indigo-600 to-violet-600 text-sm text-white'>
              D
            </span>
            Discover
          </Link>
          {children}
          <button
            type='button'
            onClick={openCart}
            aria-label={`Open cart with ${cartCount} item${cartCount === 1 ? '' : 's'}`}
            className='relative ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gray-200 bg-white text-gray-700 outline-none transition hover:border-indigo-300 hover:text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2'
          >
            <ShoppingCart className='h-5 w-5' aria-hidden='true' />
            {cartCount > 0 && (
              <span className='absolute -right-2 -top-2 grid min-h-5 min-w-5 place-items-center rounded-full bg-indigo-600 px-1 text-[11px] font-bold text-white'>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default StoreHeader;
