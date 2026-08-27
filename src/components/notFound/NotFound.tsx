import type { JSX } from 'react';

import { Link } from 'react-router-dom';

import { ROUTES } from '#/constants';

const NotFound = (): JSX.Element => (
  <main className='grid min-h-screen place-content-center bg-[#f5f6fb] px-6 text-center text-gray-900'>
    <p className='text-sm font-bold uppercase tracking-[0.2em] text-indigo-600'>404</p>
    <h1 className='mt-3 text-4xl font-extrabold tracking-tight'>Page not found</h1>
    <p className='mt-3 text-gray-500'>The page you requested does not exist.</p>
    <Link
      to={ROUTES.HOME}
      className='mx-auto mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white outline-none transition hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2'
    >
      Back to products
    </Link>
  </main>
);

export default NotFound;
