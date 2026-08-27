import type { JSX } from 'react';

export default function Unauthorized(): JSX.Element {
  return (
    <main className='grid min-h-screen place-content-center bg-[#f5f6fb] px-6 text-center text-gray-900'>
      <h1 className='text-4xl font-extrabold tracking-tight'>Unauthorized</h1>
      <p className='mt-3 text-gray-500'>You need an active session to view this page.</p>
    </main>
  );
}
