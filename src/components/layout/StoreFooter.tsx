import type { JSX } from 'react';

import { BadgeDollarSign, PackageCheck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ROUTES } from '#/constants';

const storePromises = [
  { icon: BadgeDollarSign, label: 'Clear pricing' },
  { icon: PackageCheck, label: 'Tracked shipping' },
  { icon: ShieldCheck, label: 'Demo checkout' },
];

const StoreFooter = (): JSX.Element => (
  <footer className='border-t border-indigo-950 bg-slate-950 text-slate-300'>
    <div className='mx-auto max-w-6xl px-4 py-8 sm:px-6'>
      <div className='flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <Link
            to={ROUTES.HOME}
            className='inline-flex items-center gap-2.5 rounded-lg text-lg font-extrabold text-white outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
          >
            <span className='grid h-8 w-8 place-items-center rounded-[9px] bg-gradient-to-br from-indigo-500 to-violet-500 text-sm'>
              D
            </span>
            Discover
          </Link>
          <p className='mt-3 max-w-sm text-sm leading-6 text-slate-400'>
            Explore products, compare prices, and keep your next find close.
          </p>
        </div>

        <ul className='flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium' aria-label='Store benefits'>
          {storePromises.map(({ icon: Icon, label }) => (
            <li key={label} className='flex items-center gap-2'>
              <Icon className='h-4 w-4 text-violet-400' aria-hidden='true' />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className='mt-7 flex flex-col gap-2 border-t border-slate-800 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between'>
        <p>© {new Date().getFullYear()} Discover. Built for learning React.</p>
        <p>No real payments are processed.</p>
      </div>
    </div>
  </footer>
);

export default StoreFooter;
